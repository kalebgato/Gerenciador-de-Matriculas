<template>
  <div class="page">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p @click="goDashboard">Dashboard</p>
        <p class="active">Matrículas</p>
        <p @click="goTurmas">Turmas</p>
        <p @click="logout">Logout</p>
      </nav>
    </aside>

    <main class="main">
      <button class="back" @click="voltar">
        ← Voltar para Matrículas
      </button>

      <div class="card">
        <h1>Nova matrícula</h1>

        <form @submit.prevent="criarMatricula">
          <label for="aluno">Aluno</label>

          <select
            id="aluno"
            v-model="studentId"
            class="select"
            name="aluno"
            required
          >
            <option value="">Selecione um aluno</option>

            <option
              v-for="aluno in alunos"
              :key="aluno.id"
              :value="aluno.id"
            >
              {{ aluno.name || aluno.nome }}
            </option>
          </select>

          <label for="turma">Turma</label>

          <select
            id="turma"
            v-model="classId"
            class="select"
            name="turma"
            required
          >
            <option value="">Selecione uma turma</option>

            <option
              v-for="turma in turmas"
              :key="turma.id"
              :value="turma.id"
            >
              {{ turma.name || turma.nome }}
              {{ turma.schedule ? ` - ${turma.schedule}` : "" }}
            </option>
          </select>

          <p
            v-if="mensagem"
            :class="['message', sucesso ? 'success' : 'error']"
          >
            {{ mensagem }}
          </p>

          <button
            type="submit"
            class="submit"
            :disabled="loading"
          >
            {{ loading ? "Matriculando..." : "Matricular aluno" }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

interface Student {
  id: string
  name?: string
  nome?: string
}

interface Team {
  id: string
  name?: string
  nome?: string
  schedule?: string
}

interface Course {
  id: string
  name?: string
  teams?: Team[]
}

interface Enrollment {
  id?: string
  studentId: string
  teamId?: string
  classId?: string
  startDate?: string
  active?: boolean
  team?: Team
}

const { $api } = useNuxtApp()

const alunos = ref<Student[]>([])
const turmas = ref<Team[]>([])

const studentId = ref("")
const classId = ref("")

const loading = ref(false)
const mensagem = ref("")
const sucesso = ref(false)

async function carregarDados() {
  const [studentsResponse, coursesResponse] = await Promise.all([
    $api("/api/students"),
    $api("/api/courses")
  ])

  alunos.value = Array.isArray(studentsResponse)
    ? studentsResponse
    : studentsResponse.data || studentsResponse.students || []

  const cursos: Course[] = Array.isArray(coursesResponse)
    ? coursesResponse
    : coursesResponse.data || coursesResponse.courses || []

  turmas.value = cursos.flatMap(curso => curso.teams || [])
}

async function criarMatricula() {
  mensagem.value = ""
  sucesso.value = false

  if (!studentId.value) {
    mensagem.value = "Selecione um aluno."
    return
  }

  if (!classId.value) {
    mensagem.value = "Selecione uma turma."
    return
  }

  const alunoSelecionado = alunos.value.find(
    aluno => String(aluno.id) === String(studentId.value)
  )

  const turmaSelecionada = turmas.value.find(
    turma => String(turma.id) === String(classId.value)
  )

  if (!alunoSelecionado) {
    mensagem.value = "Aluno inválido."
    return
  }

  if (!turmaSelecionada) {
    mensagem.value = "Turma inválida."
    return
  }

  loading.value = true

  try {
    await $api<Enrollment>("/api/enrollments", {
      method: "POST",
      body: {
        studentId: studentId.value,
        classId: classId.value
      }
    })

    sucesso.value = true
    mensagem.value = "Matrícula criada com sucesso."

    setTimeout(() => {
      navigateTo("/matriculas")
    }, 700)
  } catch (err: any) {
    if (err?.data?.message) {
      mensagem.value = err.data.message
    } else if (err?.data?.statusMessage) {
      mensagem.value = err.data.statusMessage
    } else if (err?.response?._data?.message) {
      mensagem.value = err.response._data.message
    } else if (err?.response?._data?.statusMessage) {
      mensagem.value = err.response._data.statusMessage
    } else {
      mensagem.value = "Não foi possível criar a matrícula."
    }
  } finally {
    loading.value = false
  }
}

function voltar() {
  navigateTo("/matriculas")
}

function goDashboard() {
  navigateTo("/dashboard")
}

function goTurmas() {
  navigateTo("/turmas")
}

function logout() {
  localStorage.removeItem("auth")
  navigateTo("/login")
}

await carregarDados()
</script>

<style>
.page {
  display: flex;
  min-height: 100vh;
  background: #f4f4f4;
}

.sidebar {
  width: 200px;
  padding: 20px;
  background: #f5f5f5;
}

.logo {
  margin-bottom: 30px;
}

.sidebar nav p {
  cursor: pointer;
  margin: 20px 0;
}

.sidebar nav .active {
  color: #d32f2f;
  font-weight: bold;
}

.main {
  flex: 1;
  padding: 30px;
}

.back {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: 700px;
}

.card h1 {
  color: #c62828;
  margin-bottom: 25px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 7px;
  font-weight: bold;
  color: #333;
}

.select {
  padding: 11px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  background: white;
}

.submit {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  padding: 10px;
  border-radius: 8px;
  margin: 0 0 10px;
}

.success {
  background: #dff5e9;
  color: #218838;
}

.error {
  background: #fde2e2;
  color: #c62828;
}
</style>