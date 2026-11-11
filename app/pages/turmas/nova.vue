<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p @click="goDashboard">Dashboard</p>
        <p class="active">Turmas</p>
        <p @click="goAlunos">Alunos</p>
        <p @click="goMatriculas">Matrículas</p>
        <p @click="goInadimplentes">Inadimplentes</p>
        <AuthLogoutAction as="p">Logout</AuthLogoutAction>
      </nav>
    </aside>

    <main class="main">
      <button class="back" @click="voltar">
        ← Voltar para Turmas
      </button>

      <div class="card">
        <h1>Nova turma</h1>

        <form @submit.prevent="criarTurma">
          <label for="titulo">Nome da turma</label>
          <input
            id="titulo"
            v-model="titulo"
            class="select"
            type="text"
            placeholder="Ex: Turma de Tecido D"
            required
          />

          <label for="curso">Curso</label>
          <select id="curso" v-model="cursoId" class="select" required>
            <option value="">Selecione um curso</option>
            <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
              {{ curso.title || curso.name }}
            </option>
          </select>

          <label for="professor">Professor</label>
          <input
            id="professor"
            v-model="professor"
            class="select"
            type="text"
            placeholder="Nome do professor"
          />

          <label for="dias">Dias da semana</label>
          <input
            id="dias"
            v-model="dias"
            class="select"
            type="text"
            placeholder="Ex: Segunda,Quarta"
          />

          <label for="horario">Horário</label>
          <input
            id="horario"
            v-model="horario"
            class="select"
            type="text"
            placeholder="Ex: 14:00-16:00"
          />

          <label for="preco">Valor mensal (R$)</label>
          <input
            id="preco"
            v-model="preco"
            class="select"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            required
          />

          <p v-if="mensagem" :class="['message', sucesso ? 'success' : 'error']">
            {{ mensagem }}
          </p>

          <button type="submit" class="submit" :disabled="loading">
            {{ loading ? "Criando..." : "Criar turma" }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

useHead({ title: "Nova Turma" })

interface Course {
  id: string
  title?: string
  name?: string
}

const api = useApiClient()

const cursos = ref<Course[]>([])

const titulo = ref("")
const cursoId = ref("")
const professor = ref("")
const dias = ref("")
const horario = ref("")
const preco = ref("")

const loading = ref(false)
const mensagem = ref("")
const sucesso = ref(false)

async function carregarCursos() {
  const response: any = await api.get("/api/courses")
  cursos.value = Array.isArray(response)
    ? response
    : response?.data || response?.courses || []
}

function extrairMensagemErro(err: any, padrao: string) {
  return (
    err?.data?.message ||
    err?.data?.statusMessage ||
    err?.response?._data?.message ||
    err?.response?._data?.statusMessage ||
    padrao
  )
}

async function criarTurma() {
  mensagem.value = ""
  sucesso.value = false

  if (!titulo.value.trim() || !cursoId.value || preco.value === "") {
    mensagem.value = "Preencha nome da turma, curso e valor mensal."
    return
  }

  loading.value = true

  try {
    await api.post("/api/teams", {
      course_id: cursoId.value,
      title: titulo.value.trim(),
      team_leader_id: professor.value.trim() || undefined,
      days_of_week: dias.value.trim() || undefined,
      horary: horario.value.trim() || undefined,
      price: Number(preco.value),
    })

    sucesso.value = true
    mensagem.value = "Turma criada com sucesso."

    setTimeout(() => {
      navigateTo("/turmas")
    }, 700)
  } catch (err: any) {
    mensagem.value = extrairMensagemErro(err, "Não foi possível criar a turma.")
  } finally {
    loading.value = false
  }
}

function voltar() {
  navigateTo("/turmas")
}

function goInadimplentes() {
  navigateTo("/inadimplentes")
}

function goDashboard() {
  navigateTo("/dashboard")
}

function goAlunos() {
  navigateTo("/alunos")
}

function goMatriculas() {
  navigateTo("/matriculas")
}

await carregarCursos()
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  min-height: 100vh;
  background: #f7f7f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.dashboard > * {
  width: auto;
  max-width: none;
}

.sidebar {
  width: 230px;
  flex-shrink: 0;
  background: #ffffff;
  padding: 24px 16px;
  border-right: 1px solid #eee;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);
}

.logo {
  color: #c62828;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-bottom: 28px;
  font-size: 24px;
}

.sidebar nav p,
.sidebar nav :deep(p) {
  margin: 4px 0;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  color: #444;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.15s, color 0.15s;
}

.sidebar nav p:hover,
.sidebar nav :deep(p:hover) {
  background: #fdecea;
  color: #c62828;
}

.sidebar .active {
  background: #c62828;
  color: #ffffff !important;
  font-weight: 700;
}

.main {
  flex: 1;
  padding: 32px 40px;
  min-width: 0;
}

.back {
  background: #ffffff;
  color: #c62828;
  border: 2px solid #c62828;
  padding: 8px 18px;
  border-radius: 8px;
  margin-bottom: 24px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  transition: background 0.15s, color 0.15s;
}

.back:hover {
  background: #c62828;
  color: #ffffff;
}

.card {
  box-sizing: border-box;
  background: white;
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border-left: 5px solid #c62828;
  max-width: 700px;
}

.card h1 {
  color: #222;
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 25px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 7px;
  font-weight: 700;
  color: #333;
  font-size: 15px;
}

.select {
  box-sizing: border-box;
  width: 100%;
  padding: 11px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  background: white;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  font-family: inherit;
}

select.select {
  cursor: pointer;
}

.select:focus {
  outline: none;
  border-color: #c62828;
}

.submit {
  background: #c62828;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: 700;
  font-size: 15px;
  transition: background 0.15s;
}

.submit:hover:not(:disabled) {
  background: #a91f1f;
}

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  padding: 10px;
  border-radius: 8px;
  margin: 0 0 10px;
  font-weight: 600;
}

.success {
  background: #dff5e9;
  color: #218838;
}

.error {
  background: #fde2e2;
  color: #c62828;
}

@media (max-width: 800px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    box-shadow: none;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding: 16px;
  }

  .logo {
    margin-bottom: 12px;
    font-size: 20px;
  }

  .sidebar nav {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .sidebar nav p,
  .sidebar nav :deep(p) {
    margin: 0;
    font-size: 14px;
    padding: 8px 12px;
  }

  .main {
    padding: 20px;
  }

  .card {
    max-width: 100%;
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .main {
    padding: 14px;
  }

  .card {
    padding: 18px;
  }

  .card h1 {
    font-size: 22px;
  }
}
</style>