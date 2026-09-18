<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p @click="goDashboard">Dashboard</p>
        <p class="active">Turmas</p>
        <p @click="goMatriculas">Matrículas</p>
        <AuthLogoutAction as="p">Logout</AuthLogoutAction>
      </nav>
    </aside>

    <main class="main">
      <header class="topbar">
        <h1>Turmas</h1>
        <button class="back" @click="goDashboard">Voltar</button>
      </header>

      <select v-model="filtroProfessor" class="select">
        <option value="">Todos professores</option>
        <option v-for="prof in professores" :key="prof" :value="prof">
          {{ prof }}
        </option>
      </select>

      <section class="cards">
        <div class="turma-card" v-for="turma in turmasFiltradas" :key="turma.id" @click="selecionarTurma(turma)">
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

        <div v-for="aluno in turmaSelecionada.alunos" :key="aluno.id" class="aluno">
          <span>{{ aluno.nome }}</span>
          <span :class="['status', aluno.status === 'Pago' ? 'pago' : 'pendente']">
            {{ aluno.status }}
          </span>
        </div>

        <button class="enter" :disabled="loading" @click="entrarTurma">
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>

        <button class="close" @click="fecharPainel">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

interface Student {
  id: string;
  name?: string;
  nome?: string;
  email?: string;
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
  studentId?: string;
  alunoId?: string;
}

interface AlunoProcessado {
  id: string;
  nome: string;
  status: string;
}

interface TurmaProcessada {
  id: string;
  nome: string;
  professor: string;
  dia: string;
  horario: string;
  alunos: AlunoProcessado[];
}

const filtroProfessor = ref("");
const turmaSelecionada = ref<TurmaProcessada | null>(null);
const loading = ref(false);

const api = useApiClient();

const { data: rawTeams } = await useFetch<any>("/api/teams");
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
    const sId = item.enrollment?.student?.id || item.studentId || item.alunoId;
    if (sId) ids.add(String(sId));
  }
  return ids;
});

const turmas = computed<TurmaProcessada[]>(() => {
  return teams.value.map((team) => {
    const teamIdStr = String(team.id);

    const teamEnrollments = enrollments.value.filter((e) => {
      const tId = e.team_id || e.teamId || e.turmaId;
      return String(tId) === teamIdStr;
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
          status: lateStudentIds.value.has(String(student.id)) ? "Pendente" : "Pago",
        };
      })
      .filter((aluno): aluno is AlunoProcessado => aluno !== null);

    return {
      id: teamIdStr,
      nome: team.title || team.name || team.nome || "Turma sem nome",
      professor: team.team_leader_id || team.professor || team.teacher || "Não informado",
      dia: team.days_of_week || team.dia || team.day || "Horário",
      horario: team.horary || team.horario || team.schedule || "A definir",
      alunos,
    };
  });
});

const professores = computed(() => {
  const set = new Set(turmas.value.map((t) => t.professor));
  return Array.from(set).filter((p) => p !== "Não informado");
});

const turmasFiltradas = computed(() => {
  if (!filtroProfessor.value) return turmas.value;
  return turmas.value.filter((t) => t.professor === filtroProfessor.value);
});

function selecionarTurma(turma: TurmaProcessada) {
  turmaSelecionada.value = turma;
  loading.value = false;
}

function fecharPainel() {
  turmaSelecionada.value = null;
}

function entrarTurma() {
  if (!turmaSelecionada.value || loading.value) return;

  loading.value = true;
  const id = turmaSelecionada.value.id;
  turmaSelecionada.value = null;

  navigateTo(`/turmas/${id}`);
}

onBeforeRouteLeave(() => {
  turmaSelecionada.value = null;
});

function logout() {
  localStorage.removeItem("auth");
  navigateTo("/login");
}

function goDashboard() {
  navigateTo("/dashboard");
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

.select {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 24px;
  background: #ffffff;
  color: #333;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.select:focus {
  outline: none;
  border-color: #c62828;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.turma-card {
  background: #ffffff;
  padding: 22px;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 5px solid #c62828;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.turma-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(198, 40, 40, 0.15);
}

.turma-card h3 {
  color: #222;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
}

.turma-card p {
  color: #555;
  margin: 4px 0;
  font-size: 15px;
  font-weight: 500;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: flex-end;
  z-index: 50;
}

.panel {
  width: 380px;
  background: #ffffff;
  padding: 28px;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.15);
}

.panel h2 {
  color: #c62828;
  margin-bottom: 4px;
}

.panel hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 16px 0;
}

.aluno {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  padding: 8px 0;
  border-bottom: 1px solid #f4f4f4;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.pago {
  background: #2e7d32;
}

.pendente {
  background: #c62828;
}

.enter {
  width: 100%;
  margin-top: 24px;
  background: #c62828;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.15s;
}

.enter:hover {
  background: #a91f1f;
}

.enter:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.close {
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  color: #444;
  transition: background 0.15s;
}

.close:hover {
  background: #f4f4f4;
}
</style>