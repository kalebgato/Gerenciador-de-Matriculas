<template>
  <div class="dashboard">

    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p @click="goDashboard">Dashboard</p>
        <p class="active">Turmas</p>
        <p @click="logout">Logout</p>
      </nav>
    </aside>

    <main class="main">

      <header class="topbar">
        <h1>Turmas</h1>
        <button class="back" @click="goDashboard">Voltar</button>
      </header>

      <select v-model="filtroProfessor" class="select">
        <option value="">Todos professores</option>
        <option 
          v-for="prof in professores" 
          :key="prof"
          :value="prof"
        >
          {{ prof }}
        </option>
      </select>

      <section class="cards">
        <div
          class="turma-card"
          v-for="turma in turmasFiltradas"
          :key="turma.id"
          @click="selecionarTurma(turma)"
        >
          <h3>{{ turma.nome }}</h3>
          <p>{{ turma.dia }} - {{ turma.horario }}</p>
          <p><strong>Professor:</strong> {{ turma.professor }}</p>
          <p><strong>{{ turma.alunos.length }} alunos</strong></p>
        </div>
      </section>

    </main>

    <div v-if="turmaSelecionada" class="overlay">
      <div class="panel">

        <h2>{{ turmaSelecionada.nome }}</h2>
        <p>{{ turmaSelecionada.dia }} - {{ turmaSelecionada.horario }}</p>
        <p><strong>Professor:</strong> {{ turmaSelecionada.professor }}</p>

        <hr />

        <h3>Alunos</h3>

        <div
          v-for="aluno in turmaSelecionada.alunos"
          :key="aluno.id"
          class="aluno"
        >
          <span>{{ aluno.nome }}</span>

          <span
            :class="['status', aluno.status === 'Pago' ? 'pago' : 'pendente']"
          >
            {{ aluno.status }}
          </span>
        </div>

        <button 
          class="enter"
          :disabled="loading"
          @click="entrarTurma"
        >
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>

        <button class="close" @click="fecharPainel">
          Fechar
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { onBeforeRouteLeave } from "vue-router"

interface Student {
  id: string
  name?: string
  nome?: string
  email?: string
}

interface Team {
  id: string
  name?: string
  nome?: string
  teacher?: string
  professor?: string
  day?: string
  dia?: string
  schedule?: string
  horario?: string
}

interface Enrollment {
  id: string
  teamId?: string
  turmaId?: string
  studentId?: string
  alunoId?: string
}

interface LateCharge {
  id: string
  studentId?: string
  alunoId?: string
}

interface AlunoProcessado {
  id: string
  nome: string
  status: string
}

interface TurmaProcessada {
  id: string
  nome: string
  professor: string
  dia: string
  horario: string
  alunos: AlunoProcessado[]
}

const filtroProfessor = ref("")
const turmaSelecionada = ref<TurmaProcessada | null>(null)
const loading = ref(false)

const { data: rawTeams } = await useFetch<any>('/api/teams')
const { data: rawEnrollmentsAlt1 } = await useFetch<any>('/api/inscricoes')
const { data: rawEnrollmentsAlt2 } = await useFetch<any>('/api/inscrições')
const { data: rawStudents } = await useFetch<any>('/api/students')
const { data: rawLateCharges } = await useFetch<any>('/api/faturamento/atrasado')

function normalizeArray(res: any): any[] {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (Array.isArray(res.data)) return res.data
  if (Array.isArray(res.teams)) return res.teams
  if (Array.isArray(res.turmas)) return res.turmas
  if (Array.isArray(res.students)) return res.students
  if (Array.isArray(res.enrollments)) return res.enrollments
  if (Array.isArray(res.inscricoes)) return res.inscricoes
  if (Array.isArray(res.lateCharges)) return res.lateCharges
  return []
}

const teams = computed<Team[]>(() => normalizeArray(rawTeams.value))
const students = computed<Student[]>(() => normalizeArray(rawStudents.value))
const lateCharges = computed<LateCharge[]>(() => normalizeArray(rawLateCharges.value))
const enrollments = computed<Enrollment[]>(() => {
  const e1 = normalizeArray(rawEnrollmentsAlt1.value)
  return e1.length > 0 ? e1 : normalizeArray(rawEnrollmentsAlt2.value)
})

const studentMap = computed(() => {
  const map = new Map<string, Student>()
  for (const student of students.value) {
    map.set(String(student.id), student)
  }
  return map
})

const lateStudentIds = computed(() => {
  const ids = new Set<string>()
  for (const item of lateCharges.value) {
    const sId = item.studentId || item.alunoId
    if (sId) ids.add(String(sId))
  }
  return ids
})

const turmas = computed<TurmaProcessada[]>(() => {
  return teams.value.map(team => {
    const teamIdStr = String(team.id)

    const teamEnrollments = enrollments.value.filter(e => {
      const tId = e.teamId || e.turmaId
      return String(tId) === teamIdStr
    })

    const alunos = teamEnrollments
      .map(e => {
        const sId = e.studentId || e.alunoId
        if (!sId) return null

        const student = studentMap.value.get(String(sId))
        if (!student) return null

        return {
          id: String(student.id),
          nome: student.name || student.nome || 'Sem Nome',
          status: lateStudentIds.value.has(String(student.id)) ? 'Pendente' : 'Pago'
        }
      })
      .filter((aluno): aluno is AlunoProcessado => aluno !== null)

    return {
      id: teamIdStr,
      nome: team.name || team.nome || 'Turma sem nome',
      professor: team.professor || team.teacher || 'Não informado',
      dia: team.dia || team.day || 'Geral',
      horario: team.horario || team.schedule || 'A definir',
      alunos
    }
  })
})

const professores = computed(() => {
  const set = new Set(turmas.value.map(t => t.professor))
  return Array.from(set).filter(p => p !== 'Não informado')
})

const turmasFiltradas = computed(() => {
  if (!filtroProfessor.value) return turmas.value
  return turmas.value.filter(t => t.professor === filtroProfessor.value)
})

function selecionarTurma(turma: TurmaProcessada) {
  turmaSelecionada.value = turma
  loading.value = false
}

function fecharPainel() {
  turmaSelecionada.value = null
}

function entrarTurma() {
  if (!turmaSelecionada.value || loading.value) return

  loading.value = true
  const id = turmaSelecionada.value.id
  turmaSelecionada.value = null

  navigateTo(`/turmas/${id}`)
}

onBeforeRouteLeave(() => {
  turmaSelecionada.value = null
})

function logout() {
  localStorage.removeItem("auth")
  navigateTo("/login")
}

function goDashboard() {
  navigateTo("/dashboard")
}
</script>

<style>
.dashboard {
  display: flex;
}

.sidebar {
  width: 200px;
  padding: 20px;
  background: #f5f5f5;
}

.main {
  flex: 1;
  padding: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.turma-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.turma-card:hover {
  transform: scale(1.02);
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: flex-end;
}

.panel {
  width: 350px;
  background: white;
  padding: 20px;
}

.aluno {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.status {
  padding: 5px 10px;
  border-radius: 8px;
  color: white;
}

.pago {
  background: #34c38f;
}

.pendente {
  background: #f46a6a;
}

.enter {
  width: 100%;
  margin-top: 20px;
  background: #d32f2f;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}

.enter:disabled {
  opacity: 0.7;
}

.close {
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
}
</style>