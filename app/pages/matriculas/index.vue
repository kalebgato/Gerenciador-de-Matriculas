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
      <header class="topbar">
        <h1>Matrículas</h1>

        <button class="new-button" @click="novaMatricula">
          Nova matrícula
        </button>
      </header>

      <section class="filters">
        <select
          v-model="filtroAluno"
          class="select"
          name="aluno"
          aria-label="Filtrar por aluno"
        >
          <option value="">Todos os alunos</option>

          <option
            v-for="aluno in alunos"
            :key="aluno.id"
            :value="aluno.id"
          >
            {{ aluno.name || aluno.nome }}
          </option>
        </select>

        <select
          v-model="filtroTurma"
          class="select"
          name="turma"
          aria-label="Filtrar por turma"
        >
          <option value="">Todas as turmas</option>

          <option
            v-for="turma in turmas"
            :key="turma.id"
            :value="turma.id"
          >
            {{ turma.name || turma.nome }}
          </option>
        </select>
      </section>

      <div v-if="pending" class="card">
        <p>Carregando matrículas...</p>
      </div>

      <section v-else class="card">
        <p v-if="erroApi" class="warning">
          Algumas informações não puderam ser atualizadas pelo servidor.
        </p>

        <table class="table">
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Turma</th>
              <th>Horário</th>
              <th>ID da matrícula</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="matricula in matriculasFiltradas"
              :key="chaveMatricula(matricula)"
            >
              <td>{{ nomeAluno(matricula) }}</td>
              <td>{{ nomeTurma(matricula) }}</td>
              <td>{{ horarioTurma(matricula) }}</td>
              <td>{{ matricula.id || "Não informado" }}</td>
            </tr>

            <tr v-if="matriculasFiltradas.length === 0">
              <td colspan="4" class="empty-state">
                Nenhuma matrícula encontrada.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

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
  teamId: string
  startDate?: string
  active?: boolean
  team?: Team
}

const { $api } = useNuxtApp()

const alunos = ref<Student[]>([])
const turmas = ref<Team[]>([])
const matriculas = ref<Enrollment[]>([])

const filtroAluno = ref("")
const filtroTurma = ref("")

const pending = ref(true)
const erroApi = ref(false)

async function carregarAlunos() {
  try {
    const response: any = await $api("/api/students")

    alunos.value = Array.isArray(response)
      ? response
      : response?.data || response?.students || []
  } catch {
    alunos.value = []
    erroApi.value = true
  }
}

async function carregarTurmas() {
  try {
    const response: any = await $api("/api/courses")

    const cursos: Course[] = Array.isArray(response)
      ? response
      : response?.data || response?.courses || []

    turmas.value = cursos.flatMap(curso => curso.teams || [])
  } catch {
    turmas.value = []
    erroApi.value = true
  }
}

async function carregarMatriculas() {
  try {
    const resultados = await Promise.all(
      alunos.value.map(async aluno => {
        try {
          const response: any = await $api(
            `/api/enrollments/student/${encodeURIComponent(aluno.id)}`
          )

          const lista: Enrollment[] = Array.isArray(response)
            ? response
            : response?.data || response?.enrollments || []

          return lista
        } catch {
          erroApi.value = true
          return []
        }
      })
    )

    matriculas.value = resultados.flat()
  } catch {
    erroApi.value = true
    matriculas.value = []
  }
}

async function carregarDados() {
  pending.value = true
  erroApi.value = false

  try {
    await Promise.all([
      carregarAlunos(),
      carregarTurmas()
    ])

    await carregarMatriculas()
  } catch {
    erroApi.value = true
  } finally {
    pending.value = false
  }
}

const matriculasUnicas = computed(() => {
  const mapa = new Map<string, Enrollment>()

  for (const matricula of matriculas.value) {
    const chave = `${matricula.studentId}-${matricula.teamId}`

    if (!mapa.has(chave)) {
      mapa.set(chave, matricula)
    }
  }

  return Array.from(mapa.values())
})

const matriculasFiltradas = computed(() => {
  return matriculasUnicas.value.filter(matricula => {
    const alunoOk =
      !filtroAluno.value ||
      String(matricula.studentId) === String(filtroAluno.value)

    const turmaOk =
      !filtroTurma.value ||
      String(matricula.teamId) === String(filtroTurma.value)

    return alunoOk && turmaOk
  })
})

function chaveMatricula(matricula: Enrollment) {
  return `${matricula.studentId}-${matricula.teamId}`
}

function nomeAluno(matricula: Enrollment) {
  const aluno = alunos.value.find(
    item => String(item.id) === String(matricula.studentId)
  )

  return aluno?.name || aluno?.nome || "Aluno não encontrado"
}

function nomeTurma(matricula: Enrollment) {
  if (matricula.team?.name || matricula.team?.nome) {
    return matricula.team.name || matricula.team.nome
  }

  const turma = turmas.value.find(
    item => String(item.id) === String(matricula.teamId)
  )

  return turma?.name || turma?.nome || "Turma não encontrada"
}

function horarioTurma(matricula: Enrollment) {
  if (matricula.team?.schedule) {
    return matricula.team.schedule
  }

  const turma = turmas.value.find(
    item => String(item.id) === String(matricula.teamId)
  )

  return turma?.schedule || "Horário não informado"
}

function novaMatricula() {
  navigateTo("/matriculas/nova")
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

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.topbar h1 {
  color: #c62828;
}

.new-button {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
}

.new-button:hover {
  background: #b71c1c;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  min-width: 220px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.warning {
  background: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background: #eee;
  padding: 12px;
  text-align: left;
  color: #333;
}

.table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  color: #333;
}

.empty-state {
  text-align: center;
  color: #888;
  padding: 25px;
}

@media (max-width: 800px) {
  .page {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .main {
    padding: 20px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .filters {
    flex-direction: column;
  }

  .select {
    width: 100%;
  }
}
</style>
