<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p @click="goDashboard">Dashboard</p>
        <p class="active" @click="goTurmas">Turmas</p>
        <p @click="goMatriculas">Matrículas</p>
        <AuthLogoutAction as="p">Logout</AuthLogoutAction>
      </nav>
    </aside>

    <main class="main">
      <header class="topbar">
        <h1>Gestão da Turma</h1>
        <button class="back" @click="voltar">Voltar</button>
      </header>

      <div v-if="pending" class="card loading">
        <p>Carregando dados da turma...</p>
      </div>

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
                  <span :class="['status', aluno.status === 'Pago' ? 'pago' : 'pendente']">
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

interface Student {
  id: string;
  name?: string;
  nome?: string;
  email?: string;
  phone?: string;
  telefone?: string;
}

interface Team {
  id: string;
  title?: string;
  name?: string;
  nome?: string;
  team_leader_id?: string;
  teacher?: string;
  professor?: string;
  days_of_week?: string;
  day?: string;
  dia?: string;
  horary?: string;
  schedule?: string;
  horario?: string;
}

interface Enrollment {
  id: string;
  team_id?: string;
  teamId?: string;
  turmaId?: string;
  student_id?: string;
  studentId?: string;
  alunoId?: string;
}

interface LateCharge {
  id: string;
  student_id?: string;
  studentId?: string;
  alunoId?: string;
  enrollment?: {
    student?: { id?: string };
  };
}

const route = useRoute();
const api = useApiClient();

const { data: rawTeams, pending } = await useFetch<any>("/api/teams");
const { data: rawStudents } = await useFetch<any>("/api/students");
const { data: rawLateCharges } = await useFetch<any>("/api/billing/late");

function normalizeArray(res: any): any[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.teams)) return res.teams;
  if (Array.isArray(res.turmas)) return res.turmas;
  if (Array.isArray(res.students)) return res.students;
  if (Array.isArray(res.enrollments)) return res.enrollments;
  if (Array.isArray(res.inscricoes)) return res.inscricoes;
  if (Array.isArray(res.lateCharges)) return res.lateCharges;
  return [];
}

const teams = computed<Team[]>(() => normalizeArray(rawTeams.value));
const students = computed<Student[]>(() => normalizeArray(rawStudents.value));
const lateCharges = computed<LateCharge[]>(() => normalizeArray(rawLateCharges.value));

const enrollmentsResults = await Promise.all(
  normalizeArray(rawStudents.value).map((s: any) =>
    api.get<any>(`/api/enrollments/student/${s.id}`).catch(() => [])
  )
);
const enrollmentsFlat = ref<any[]>(enrollmentsResults.flat());
const enrollments = computed<Enrollment[]>(() => normalizeArray(enrollmentsFlat.value));

const studentMap = computed(() => {
  const map = new Map<string, Student>();
  for (const student of students.value) {
    map.set(String(student.id), student);
  }
  return map;
});

const lateStudentIds = computed(() => {
  const ids = new Set<string>();
  for (const item of lateCharges.value) {
    const sId = item.enrollment?.student?.id || item.student_id || item.studentId || item.alunoId;
    if (sId) ids.add(String(sId));
  }
  return ids;
});

const turma = computed(() => {
  const idParam = String(route.params.id);

  const targetTeam = teams.value.find((t) => String(t.id) === idParam);
  if (!targetTeam) return null;

  const teamEnrollments = enrollments.value.filter((e) => {
    const tId = e.team_id || e.teamId || e.turmaId;
    return String(tId) === idParam;
  });

  const alunos = teamEnrollments
    .map((e) => {
      const sId = e.student_id || e.studentId || e.alunoId;
      if (!sId) return null;

      const student = studentMap.value.get(String(sId));
      if (!student) return null;

      return {
        id: String(student.id),
        nome: student.name || student.nome || "Sem Nome",
        email: student.email || "-",
        telefone: student.telefone || student.phone || "-",
        status: lateStudentIds.value.has(String(student.id)) ? "Pendente" : "Pago",
      };
    })
    .filter((a): a is { id: string; nome: string; email: string; telefone: string; status: string } => a !== null);

  return {
    id: String(targetTeam.id),
    nome: targetTeam.title || targetTeam.name || targetTeam.nome || "Turma sem nome",
    professor: targetTeam.team_leader_id || targetTeam.professor || targetTeam.teacher || "Não informado",
    dia: targetTeam.days_of_week || targetTeam.dia || targetTeam.day || "Horário",
    horario: targetTeam.horary || targetTeam.horario || targetTeam.schedule || "A definir",
    alunos,
  };
});

function voltar() {
  navigateTo("/turmas");
}

function goDashboard() {
  navigateTo("/dashboard");
}

function goTurmas() {
  navigateTo("/turmas");
}

function goMatriculas() {
  navigateTo("/matriculas");
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f7f7f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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

.back {
  background: #ffffff;
  color: #c62828;
  border: 2px solid #c62828;
  padding: 8px 18px;
  border-radius: 8px;
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
  background: white;
  padding: 24px;
  border-radius: 14px;
  margin-bottom: 20px;
  width: 100%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border-left: 5px solid #c62828;
}

.card h2 {
  margin-bottom: 6px;
  font-size: 20px;
  font-weight: 700;
  color: #222;
}

.card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin-bottom: 12px;
}

.card p {
  margin: 4px 0;
  color: #555;
  font-size: 15px;
  font-weight: 500;
}

.loading {
  color: #666;
  font-style: italic;
  border-left: 5px solid #ddd;
}

.table {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;
  table-layout: fixed;
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
  word-break: break-word;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.pago {
  background: #2e7d32;
}

.pendente {
  background: #c62828;
}

.empty-state {
  text-align: center;
  color: #888;
  padding: 20px;
}
</style>