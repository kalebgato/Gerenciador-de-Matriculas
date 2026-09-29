<template>
  <div class="page">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p @click="goDashboard">Dashboard</p>
        <p @click="goTurmas">Turmas</p>
        <p class="active">Alunos</p>
        <p @click="goMatriculas">Matrículas</p>
        <p @click="logout">Logout</p>
      </nav>
    </aside>

    <main class="main">
      <header class="topbar">
        <h1>Alunos</h1>
        <button class="new-button" @click="novoAluno">Novo aluno</button>
      </header>

      <div class="filters">
        <input
          v-model="busca"
          class="select"
          type="text"
          placeholder="Buscar por nome, email ou telefone..."
        />

        <select v-model="filtroStatus" class="select">
          <option value="todos">Todos os status</option>
          <option value="ativo">Somente ativos</option>
          <option value="inativo">Somente inativos</option>
        </select>
      </div>

      <div v-if="pending" class="card loading">
        <p>Carregando alunos...</p>
      </div>

      <div v-else class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="aluno in alunosFiltrados" :key="aluno.id">
              <td>{{ aluno.nome }}</td>
              <td>{{ aluno.email }}</td>
              <td>{{ aluno.telefone }}</td>
              <td>
                <span :class="['status', aluno.ativo ? 'ativo' : 'inativo']">
                  {{ aluno.ativo ? "Ativo" : "Inativo" }}
                </span>
              </td>
              <td class="acoes">
                <button class="edit-button" @click="editarAluno(aluno.id)">
                  Editar
                </button>
                <button
                  class="toggle-button"
                  :class="aluno.ativo ? 'toggle-danger' : 'toggle-ok'"
                  :disabled="alterandoId === aluno.id"
                  @click="alternarStatus(aluno)"
                >
                  {{ alterandoId === aluno.id ? "..." : (aluno.ativo ? "Desativar" : "Ativar") }}
                </button>
              </td>
            </tr>

            <tr v-if="alunosFiltrados.length === 0">
              <td colspan="5" class="empty-state">
                Nenhum aluno encontrado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

useHead({ title: "Alunos" })

interface Student {
  id: string
  name?: string
  nome?: string
  email?: string
  phone?: string
  active?: boolean
}

const api = useApiClient()

const alunos = ref<Student[]>([])
const pending = ref(true)

const busca = ref("")
const filtroStatus = ref("todos")

const alterandoId = ref<string | null>(null)

async function carregarAlunos() {
  pending.value = true

  try {
    const response: any = await api.get("/api/students")
    alunos.value = Array.isArray(response)
      ? response
      : response?.data || response?.students || []
  } catch {
    alunos.value = []
  } finally {
    pending.value = false
  }
}

const alunosNormalizados = computed(() => {
  return alunos.value.map(a => ({
    id: String(a.id),
    nome: a.name || a.nome || "Sem Nome",
    email: a.email || "-",
    telefone: a.phone || "-",
    ativo: a.active !== false,
  }))
})

const alunosFiltrados = computed(() => {
  const termo = busca.value.toLowerCase()

  return alunosNormalizados.value.filter(aluno => {
    const buscaOk =
      !termo ||
      aluno.nome.toLowerCase().includes(termo) ||
      aluno.email.toLowerCase().includes(termo) ||
      aluno.telefone.toLowerCase().includes(termo)

    const statusOk =
      filtroStatus.value === "todos" ||
      (filtroStatus.value === "ativo" && aluno.ativo) ||
      (filtroStatus.value === "inativo" && !aluno.ativo)

    return buscaOk && statusOk
  })
})

async function alternarStatus(aluno: { id: string; ativo: boolean }) {
  alterandoId.value = aluno.id

  try {
    await api.put(`/api/students/${aluno.id}`, { active: !aluno.ativo })

    const alvo = alunos.value.find(a => String(a.id) === aluno.id)
    if (alvo) {
      alvo.active = !aluno.ativo
    }
  } catch {
    // se falhar, a lista mantém o último estado confirmado pelo servidor
  } finally {
    alterandoId.value = null
  }
}

function editarAluno(id: string) {
  navigateTo(`/alunos/${id}`)
}

function novoAluno() {
  navigateTo("/alunos/novo")
}

function goDashboard() {
  navigateTo("/dashboard")
}

function goTurmas() {
  navigateTo("/turmas")
}

function goMatriculas() {
  navigateTo("/matriculas")
}

function logout() {
  localStorage.removeItem("auth")
  navigateTo("/login")
}

await carregarAlunos()
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  min-height: 100vh;
  background: #f7f7f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.page > * {
  width: auto;
  max-width: none;
}

.sidebar {
  width: 230px;
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

.sidebar nav p {
  margin: 4px 0;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  color: #444;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.15s, color 0.15s;
}

.sidebar nav p:hover {
  background: #fdecea;
  color: #c62828;
}

.sidebar nav .active {
  background: #c62828;
  color: #ffffff !important;
  font-weight: 700;
}

.main {
  flex: 1;
  padding: 32px 40px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.topbar h1 {
  font-size: 30px;
  font-weight: 800;
  color: #222;
}

.new-button {
  background: #c62828;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  transition: background 0.15s;
}

.new-button:hover {
  background: #a91f1f;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.select {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  min-width: 220px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  font-family: inherit;
}

.select:focus {
  outline: none;
  border-color: #c62828;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border-left: 5px solid #c62828;
  overflow-x: auto;
}

.loading {
  color: #666;
  font-style: italic;
}

.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.table th:nth-child(1),
.table td:nth-child(1) {
  width: 26%;
}

.table th:nth-child(2),
.table td:nth-child(2) {
  width: 28%;
}

.table th:nth-child(3),
.table td:nth-child(3) {
  width: 16%;
}

.table th:nth-child(4),
.table td:nth-child(4) {
  width: 10%;
}

.table th:nth-child(5),
.table td:nth-child(5) {
  width: 20%;
  overflow: visible;
  white-space: normal;
  text-overflow: unset;
}

.table th {
  padding: 12px 10px;
  text-align: left;
  font-size: 13px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #f0f0f0;
}

.table td {
  padding: 14px 10px;
  border-bottom: 1px solid #f4f4f4;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.table tr {
  height: 56px;
}

.acoes {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 6px;
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.ativo {
  background: #2e7d32;
}

.inativo {
  background: #888888;
}

.edit-button {
  background: #ffffff;
  color: #c62828;
  border: 2px solid #c62828;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}

.edit-button:hover {
  background: #c62828;
  color: #ffffff;
}

.toggle-button {
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  color: white;
  white-space: nowrap;
  transition: opacity 0.15s;
}

.toggle-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-danger {
  background: #c62828;
}

.toggle-ok {
  background: #2e7d32;
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