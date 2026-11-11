<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p @click="goDashboard">Dashboard</p>
        <p @click="goTurmas">Turmas</p>
        <p @click="goAlunos">Alunos</p>
        <p class="active">Matrículas</p>
        <p @click="goInadimplentes">Inadimplentes</p>
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
            {{ turma.title || turma.name || turma.nome }}
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

        <p v-if="feedbackMsg" :class="['feedback', feedbackErro ? 'feedback-error' : 'feedback-success']">
          {{ feedbackMsg }}
        </p>

        <table class="table">
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Turma</th>
              <th>Horário</th>
              <th>Ações</th>
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
              <td class="acoes-cell">
                <div class="acoes-wrap">
                  <button
                    v-if="matricula.id"
                    class="charge-button"
                    @click="abrirGerarCobrancas(matricula)"
                  >
                    Gerar cobranças
                  </button>
                  <button
                    v-if="matricula.id"
                    class="cancel-button"
                    :disabled="cancelandoIds.has(matricula.id)"
                    @click="cancelarMatricula(matricula)"
                  >
                    {{ cancelandoIds.has(matricula.id) ? "Cancelando..." : "Cancelar matrícula" }}
                  </button>
                </div>
              </td>
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

    <div v-if="matriculaCobranca" class="overlay" @click.self="fecharGerarCobrancas">
      <div class="panel" role="dialog" aria-modal="true" aria-labelledby="cobrancas-titulo">
        <h2 id="cobrancas-titulo">Gerar cobranças do ano</h2>
        <p>
          <strong>{{ nomeAluno(matriculaCobranca) }}</strong> — {{ nomeTurma(matriculaCobranca) }}
        </p>

        <form class="modal-form" @submit.prevent="confirmarGerarCobrancas">
          <label for="genAno">Ano</label>
          <input
            id="genAno"
            v-model="genAno"
            class="select"
            type="number"
            min="2000"
            max="2100"
            step="1"
            required
          />

          <label for="genValor">Valor mensal (R$)</label>
          <input
            id="genValor"
            v-model="genValor"
            class="select"
            type="number"
            min="0.01"
            step="0.01"
            required
          />

          <p class="modal-info">
            Serão criadas 12 cobranças (janeiro a dezembro), todas com vencimento no dia 10.
          </p>

          <p v-if="mesesJaVencidos > 0" class="warning">
            {{ mesesJaVencidos }} dos 12 meses de {{ genAno }} já venceram e aparecerão como atrasados assim que forem geradas.
          </p>

          <p v-if="erroGeracao" class="feedback feedback-error">{{ erroGeracao }}</p>

          <div class="modal-buttons">
            <button type="submit" class="new-button" :disabled="gerandoCobrancas">
              {{ gerandoCobrancas ? "Gerando..." : "Gerar cobranças" }}
            </button>
            <button type="button" class="modal-cancel" @click="fecharGerarCobrancas">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"

useHead({ title: "Matrículas" })

interface Student {
  id: string
  name?: string
  nome?: string
}

interface Team {
  id: string
  title?: string
  name?: string
  nome?: string
  team_leader_id?: string
  horary?: string
  schedule?: string
  days_of_week?: string
  price?: number | string
}

interface Course {
  id: string
  name?: string
  teams?: Team[]
}

interface Enrollment {
  id?: string
  student_id?: string
  studentId?: string
  team_id?: string
  teamId?: string
  startDate?: string
  active?: boolean
  team?: Team
}

const api = useApiClient()

const alunos = ref<Student[]>([])
const turmas = ref<Team[]>([])
const matriculas = ref<Enrollment[]>([])

const filtroAluno = ref("")
const filtroTurma = ref("")

const pending = ref(true)
const erroApi = ref(false)

const cancelandoIds = ref(new Set<string>())
const feedbackMsg = ref("")
const feedbackErro = ref(false)

async function carregarAlunos() {
  try {
    const response: any = await api.get("/api/students")

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
    const response: any = await api.get("/api/courses")

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
          const response: any = await api.get(
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

function idAluno(matricula: Enrollment) {
  return matricula.student_id || matricula.studentId
}

function idTurma(matricula: Enrollment) {
  return matricula.team_id || matricula.teamId
}

const matriculasUnicas = computed(() => {
  const mapa = new Map<string, Enrollment>()

  for (const matricula of matriculas.value) {
    const chave = `${idAluno(matricula)}-${idTurma(matricula)}`

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
      String(idAluno(matricula)) === String(filtroAluno.value)

    const turmaOk =
      !filtroTurma.value ||
      String(idTurma(matricula)) === String(filtroTurma.value)

    return alunoOk && turmaOk
  })
})

function chaveMatricula(matricula: Enrollment) {
  return `${idAluno(matricula)}-${idTurma(matricula)}`
}

function nomeAluno(matricula: Enrollment) {
  const aluno = alunos.value.find(
    item => String(item.id) === String(idAluno(matricula))
  )

  return aluno?.name || aluno?.nome || "Aluno não encontrado"
}

function nomeTurma(matricula: Enrollment) {
  if (matricula.team?.title || matricula.team?.name || matricula.team?.nome) {
    return matricula.team.title || matricula.team.name || matricula.team.nome
  }

  const turma = turmas.value.find(
    item => String(item.id) === String(idTurma(matricula))
  )

  return turma?.title || turma?.name || turma?.nome || "Turma não encontrada"
}

function horarioTurma(matricula: Enrollment) {
  if (matricula.team?.horary || matricula.team?.schedule) {
    return matricula.team.horary || matricula.team.schedule
  }

  const turma = turmas.value.find(
    item => String(item.id) === String(idTurma(matricula))
  )

  return turma?.horary || turma?.schedule || "Horário não informado"
}

async function cancelarMatricula(matricula: Enrollment) {
  const id = matricula.id
  if (!id) return

  const confirmado = confirm(
    `Cancelar a matrícula de ${nomeAluno(matricula)} em ${nomeTurma(matricula)}? Essa ação não pode ser desfeita.`
  )
  if (!confirmado) return

  feedbackMsg.value = ""
  feedbackErro.value = false

  const novoSet = new Set(cancelandoIds.value)
  novoSet.add(id)
  cancelandoIds.value = novoSet

  try {
    await api.delete(`/api/enrollments/${id}`)

    matriculas.value = matriculas.value.filter(m => m.id !== id)

    feedbackErro.value = false
    feedbackMsg.value = "Matrícula cancelada com sucesso."
  } catch (err: any) {
    feedbackErro.value = true
    feedbackMsg.value =
      err?.data?.statusMessage ||
      err?.data?.message ||
      err?.response?._data?.statusMessage ||
      err?.response?._data?.message ||
      "Não foi possível cancelar a matrícula."
  } finally {
    const restante = new Set(cancelandoIds.value)
    restante.delete(id)
    cancelandoIds.value = restante
  }
}

// --- Geração de cobranças do ano ---
const matriculaCobranca = ref<Enrollment | null>(null)
const genAno = ref(String(new Date().getFullYear()))
const genValor = ref("")
const gerandoCobrancas = ref(false)
const erroGeracao = ref("")

const mesesJaVencidos = computed(() => {
  const ano = Number(genAno.value)
  if (!ano) return 0

  const agora = new Date()
  let total = 0

  for (let mes = 0; mes < 12; mes++) {
    if (new Date(ano, mes, 10) < agora) total++
  }

  return total
})

function precoDaTurma(matricula: Enrollment) {
  const turma = turmas.value.find(
    item => String(item.id) === String(idTurma(matricula))
  )
  const preco = Number(turma?.price ?? matricula.team?.price ?? 0)

  return preco > 0 ? String(preco) : ""
}

function abrirGerarCobrancas(matricula: Enrollment) {
  matriculaCobranca.value = matricula
  genAno.value = String(new Date().getFullYear())
  genValor.value = precoDaTurma(matricula)
  erroGeracao.value = ""
}

function fecharGerarCobrancas() {
  if (gerandoCobrancas.value) return
  matriculaCobranca.value = null
  erroGeracao.value = ""
}

async function confirmarGerarCobrancas() {
  const matricula = matriculaCobranca.value
  if (!matricula?.id) return

  const ano = Number(genAno.value)
  const valor = Number(genValor.value)

  if (!Number.isInteger(ano) || ano < 2000) {
    erroGeracao.value = "Informe um ano válido."
    return
  }

  if (!(valor > 0)) {
    erroGeracao.value = "Informe um valor mensal maior que zero."
    return
  }

  gerandoCobrancas.value = true
  erroGeracao.value = ""

  try {
    await api.post("/api/billing", {
      action: "generate",
      enrollmentId: matricula.id,
      year: ano,
      amount: valor,
    })

    const resumo = `${nomeAluno(matricula)} em ${nomeTurma(matricula)}`
    matriculaCobranca.value = null

    feedbackErro.value = false
    feedbackMsg.value = `Cobranças de ${ano} geradas para ${resumo}.`
  } catch (err: any) {
    erroGeracao.value =
      err?.data?.statusMessage ||
      err?.data?.message ||
      err?.response?._data?.statusMessage ||
      err?.response?._data?.message ||
      "Não foi possível gerar as cobranças."
  } finally {
    gerandoCobrancas.value = false
  }
}

function novaMatricula() {
  navigateTo("/matriculas/nova")
}

function goInadimplentes() {
  navigateTo("/inadimplentes")
}

function goDashboard() {
  navigateTo("/dashboard")
}

function goTurmas() {
  navigateTo("/turmas")
}

function goAlunos() {
  navigateTo("/alunos")
}

function logout() {
  localStorage.removeItem("auth")
  navigateTo("/login")
}

// Carrega só no navegador: no servidor a requisição volta vazia (sem a sessão do
// usuário) e isso causava conflito de hidratação, deixando uma linha da tabela torta.
onMounted(carregarDados)
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
  min-width: 0;
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
  cursor: pointer;
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

.warning {
  background: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-weight: 600;
}

.feedback {
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-weight: 600;
}

.feedback-success {
  background: #dff5e9;
  color: #218838;
}

.feedback-error {
  background: #fde2e2;
  color: #c62828;
}

.cancel-button {
  background: #ffffff;
  color: #c62828;
  border: 2px solid #c62828;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}

.cancel-button:hover:not(:disabled) {
  background: #c62828;
  color: #ffffff;
}

.cancel-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.table th:nth-child(1),
.table td:nth-child(1) {
  width: 20%;
}

.table th:nth-child(2),
.table td:nth-child(2) {
  width: 22%;
}

.table th:nth-child(3),
.table td:nth-child(3) {
  width: 18%;
}

.table th:nth-child(4),
.table td:nth-child(4) {
  width: 40%;
}

.table td.acoes-cell {
  overflow: visible;
  white-space: normal;
  text-overflow: unset;
}

.acoes-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.charge-button {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 7px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
  transition: background 0.15s;
}

.charge-button:hover {
  background: #256628;
}

.table td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  vertical-align: middle;
}

.table tr {
  height: 56px;
}

.empty-state {
  text-align: center;
  color: #888;
  padding: 25px;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  z-index: 50;
}

.panel {
  box-sizing: border-box;
  width: 100%;
  max-width: 420px;
  max-height: 100%;
  overflow-y: auto;
  background: #ffffff;
  padding: 24px;
  border-radius: 14px;
  border-top: 5px solid #c62828;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.panel h2 {
  color: #c62828;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.panel p {
  margin: 4px 0;
  color: #555;
  font-size: 15px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  margin-top: 14px;
}

.modal-form label {
  margin-bottom: 6px;
  font-weight: 700;
  color: #333;
  font-size: 14px;
}

.modal-form .select {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin-bottom: 14px;
}

.modal-info {
  font-size: 13px;
  color: #777;
  margin-bottom: 10px;
}

.modal-form .warning {
  margin-bottom: 12px;
  font-size: 14px;
  color: #856404;
}

.modal-form .feedback-error {
  margin-bottom: 12px;
  color: #c62828;
}

.modal-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.modal-buttons .new-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.modal-cancel {
  background: #ffffff;
  color: #555;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
}

.modal-cancel:hover {
  background: #f4f4f4;
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

  .sidebar nav p {
    margin: 0;
    font-size: 14px;
    padding: 8px 12px;
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
    min-width: 0;
  }

  .table th,
  .table td {
    font-size: 13px;
    padding: 10px 6px;
  }
}

@media (max-width: 480px) {
  .main {
    padding: 14px;
  }

  .topbar h1 {
    font-size: 24px;
  }

  .new-button {
    width: 100%;
  }

  .cancel-button {
    font-size: 11px;
    padding: 5px 10px;
  }
}
</style>