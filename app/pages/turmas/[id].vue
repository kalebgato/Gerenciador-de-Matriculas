<template>
  <div class="page">

    <h1 class="title">Gestão da Turma</h1>

    <button class="back" @click="voltar">← Voltar</button>

    <!-- Estado de Loading -->
    <div v-if="pending" class="card loading">
      <p>Carregando dados da turma...</p>
    </div>

    <!-- Conteúdo Principal -->
    <div v-else-if="turma">

      <div class="card">
        <h2>{{ turma.nome }}</h2>
        <p>{{ turma.dia }} - {{ turma.horario }}</p>
        <p><strong>Professor:</strong> {{ turma.professor }}</p>
      </div>

      <div class="card">
        <h3>Alunos Matriculados</h3>

        <table class="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="aluno in turma.alunos" :key="aluno.id">
              <td>{{ aluno.nome }}</td>
              <td>{{ aluno.email }}</td>
              <td>{{ aluno.telefone }}</td>
              <td>
                <span
                  :class="['status', aluno.status === 'Pago' ? 'pago' : 'pendente']"
                >
                  {{ aluno.status }}
                </span>
              </td>
            </tr>
            <tr v-if="turma.alunos.length === 0">
              <td colspan="4" class="empty-state">Nenhum aluno matriculado nesta turma.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div v-else class="card">
      <h2>Turma não encontrada</h2>
      <p>Verifique se o ID informado na URL está correto ou se a API de turmas está acessível.</p>
    </div>

  </div>
</template>

<<<<<<< HEAD
<script setup lang='ts'>
import { useRoute } from "vue-router";
import { computed } from "vue";
=======
<script setup lang="ts">
import { useRoute } from "vue-router"
import { computed } from "vue"
>>>>>>> refs/remotes/origin/develop

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
}

interface LateCharge {
  id: string
  studentId?: string
  alunoId?: string
}

const route = useRoute()

const { data: rawTeams, pending } = await useLazyFetch<any>('/api/teams', { server: false })
const { data: rawEnrollmentsAlt1 } = await useLazyFetch<any>('/api/inscricoes', { server: false })
const { data: rawEnrollmentsAlt2 } = await useLazyFetch<any>('/api/inscrições', { server: false })
const { data: rawStudents } = await useLazyFetch<any>('/api/students', { server: false })
const { data: rawLateCharges } = await useLazyFetch<any>('/api/faturamento/atrasado', { server: false })

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

const turma = computed(() => {
  const idParam = String(route.params.id)

  const targetTeam = teams.value.find(t => String(t.id) === idParam)
  if (!targetTeam) return null

  const teamEnrollments = enrollments.value.filter(e => {
    const tId = e.teamId || e.turmaId
    return String(tId) === idParam
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
        email: student.email || '-',
        telefone: student.telefone || student.phone || '-',
        status: lateStudentIds.value.has(String(student.id)) ? 'Pendente' : 'Pago'
      }
    })
    .filter((a): a is { id: string; nome: string; email: string; telefone: string; status: string } => a !== null)

  return {
    id: String(targetTeam.id),
    nome: targetTeam.name || targetTeam.nome || 'Turma sem nome',
    professor: targetTeam.professor || targetTeam.teacher || 'Não informado',
    dia: targetTeam.dia || targetTeam.day || 'Geral',
    horario: targetTeam.horario || targetTeam.schedule || 'A definir',
    alunos
  }
})

function voltar() {
  navigateTo("/turmas")
}
</script>

<style scoped>
<<<<<<< HEAD
/* TÍTULO */
=======
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

>>>>>>> refs/remotes/origin/develop
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
  margin-bottom: 5px;
}

.card p {
  margin: 4px 0;
  color: #555;
}

.loading {
  color: #666;
  font-style: italic;
}

.table {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;
  table-layout: fixed;
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
  word-break: break-word;
}

.status {
  padding: 6px 12px;
  border-radius: 999px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
}

.pago {
  background: #34c38f;
}

.pendente {
  background: #f46a6a;
}
<<<<<<< HEAD
</style>
=======

.empty-state {
  text-align: center;
  color: #888;
  padding: 20px;
}
</style>
>>>>>>> refs/remotes/origin/develop
