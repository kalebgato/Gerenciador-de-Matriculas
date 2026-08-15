<template>
  <div class="page">
    <h1 class="title">Detalhes do Aluno</h1>

    <button class="back" @click="voltar">← Voltar para Dashboard</button>

    <div v-if="pending" class="card loading">
      <p>Carregando informações do aluno...</p>
    </div>

    <div v-else-if="aluno" class="content">

      <div class="card">
        <h2>{{ aluno.nome }}</h2>
        <p><strong>Email:</strong> {{ aluno.email }}</p>
        <p><strong>Telefone:</strong> {{ aluno.telefone }}</p>
        <p>
          <strong>Status Financeiro Geral:</strong>
          <span :class="['status', aluno.isPendente ? 'pendente' : 'pago']">
            {{ aluno.isPendente ? 'Pendente' : 'Em Dia' }}
          </span>
        </p>
      </div>

      <div class="card">
        <h3>Turmas Matriculadas</h3>

        <table class="table">
          <thead>
            <tr>
              <th>Turma</th>
              <th>Professor</th>
              <th>Horário</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="turma in aluno.turmas" :key="turma.id">
              <td>{{ turma.nome }}</td>
              <td>{{ turma.professor }}</td>
              <td>{{ turma.dia }} - {{ turma.horario }}</td>
            </tr>
            <tr v-if="aluno.turmas.length === 0">
              <td colspan="3" class="empty-state">Nenhuma turma vinculada a este aluno.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <h3>Histórico Financeiro e Cobranças</h3>

        <table class="table">
          <thead>
            <tr>
              <th>ID da Cobrança</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cobranca in aluno.cobrancas" :key="cobranca.id">
              <td>{{ cobranca.id }}</td>
              <td>{{ cobranca.valor }}</td>
              <td>
                <span :class="['status', cobranca.status === 'Pendente' ? 'pendente' : 'pago']">
                  {{ cobranca.status }}
                </span>
              </td>
            </tr>
            <tr v-if="aluno.cobrancas.length === 0">
              <td colspan="3" class="empty-state">Nenhum registro financeiro encontrado.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div v-else class="card">
      <h2>Aluno não encontrado</h2>
      <p>Não foi possível carregar os dados. Verifique a conexão com o banco ou o ID do aluno.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { computed } from "vue"

interface Student {
  id: string
  name?: string
  nome?: string
  email?: string
  phone?: string
  telefone?: string
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
  team?: Team
}

interface LateCharge {
  id: string
  studentId?: string
  alunoId?: string
  amount?: number
  valor?: number
}

const route = useRoute()

const { data: rawStudents, pending, error: errStudents } = await useLazyFetch<any>('/api/students', { server: false })
const { data: rawTeams } = await useLazyFetch<any>('/api/teams', { server: false })
const { data: rawEnrollmentsAlt1 } = await useLazyFetch<any>('/api/inscricoes', { server: false })
const { data: rawEnrollmentsAlt2 } = await useLazyFetch<any>('/api/inscrições', { server: false })
const { data: rawLateCharges } = await useLazyFetch<any>('/api/faturamento/atrasado', { server: false })

function normalizeArray(res: any): any[] {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (Array.isArray(res.data)) return res.data
  if (Array.isArray(res.students)) return res.students
  if (Array.isArray(res.teams)) return res.teams
  if (Array.isArray(res.enrollments)) return res.enrollments
  if (Array.isArray(res.inscricoes)) return res.inscricoes
  if (Array.isArray(res.lateCharges)) return res.lateCharges
  return []
}

const students = computed<Student[]>(() => errStudents.value ? [] : normalizeArray(rawStudents.value))
const teams = computed<Team[]>(() => normalizeArray(rawTeams.value))
const lateCharges = computed<LateCharge[]>(() => normalizeArray(rawLateCharges.value))
const enrollments = computed<Enrollment[]>(() => {
  const e1 = normalizeArray(rawEnrollmentsAlt1.value)
  return e1.length > 0 ? e1 : normalizeArray(rawEnrollmentsAlt2.value)
})

const teamMap = computed(() => {
  const map = new Map<string, Team>()
  for (const t of teams.value) {
    map.set(String(t.id), t)
  }
  return map
})

const aluno = computed(() => {
  const idParam = String(route.params.id)
  const student = students.value.find(s => String(s.id) === idParam)

  if (!student) return null

  const studentEnrollments = enrollments.value.filter(e => {
    const sId = e.studentId || e.alunoId
    return String(sId) === idParam
  })

  const turmasMatriculadas = studentEnrollments.map(e => {
    const tId = e.teamId || e.turmaId
    const targetTeam = e.team || (tId ? teamMap.value.get(String(tId)) : null)

    return {
      id: targetTeam ? String(targetTeam.id) : String(Math.random()),
      nome: targetTeam?.name || targetTeam?.nome || 'Turma não identificada',
      professor: targetTeam?.professor || targetTeam?.teacher || 'Não informado',
      dia: targetTeam?.dia || targetTeam?.day || 'Geral',
      horario: targetTeam?.horario || targetTeam?.schedule || 'A definir'
    }
  })

  const pendencias = lateCharges.value.filter(lc => {
    const sId = lc.studentId || lc.alunoId
    return String(sId) === idParam
  })

  const cobrancas = pendencias.length > 0
    ? pendencias.map(p => ({
        id: String(p.id),
        valor: (p.amount || p.valor) ? `R$ ${p.amount || p.valor}` : 'Valor não informado',
        status: 'Pendente'
      }))
    : [{ id: 'REG-OK', valor: 'R$ 0,00', status: 'Pago' }]

  return {
    id: String(student.id),
    nome: student.name || student.nome || 'Sem Nome',
    email: student.email || '-',
    telefone: student.telefone || student.phone || '-',
    isPendente: pendencias.length > 0,
    turmas: turmasMatriculadas,
    cobrancas
  }
})

function voltar() {
  navigateTo("/dashboard")
}
</script>

<style>
.page {
  padding: 30px;
  background: #f4f4f4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page > * {
  width: 100%;
  max-width: 1100px;
}

.title {
  font-size: 28px;
  margin-bottom: 10px;
  color: #c62828;
}

.back {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;
  width: fit-content;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.card h2 {
  margin-bottom: 10px;
}

.card h3 {
  margin-bottom: 15px;
  color: #333;
}

.card p {
  margin: 6px 0;
  color: #555;
}

.loading {
  color: #666;
  font-style: italic;
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

.status {
  padding: 4px 10px;
  border-radius: 8px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
  margin-left: 6px;
}

.pago {
  background: #34c38f;
}

.pendente {
  background: #f46a6a;
}

.empty-state {
  text-align: center;
  color: #888;
  padding: 20px;
}
</style>