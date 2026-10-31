<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p class="active">Dashboard</p>
        <p @click="goTurmas">Turmas</p>
        <p @click="goAlunos">Alunos</p>
        <p @click="goMatriculas">Matrículas</p>
        <AuthLogoutAction as="p">Logout</AuthLogoutAction>
      </nav>
    </aside>

    <main class="main">
      <header class="topbar">
        <h1>Dashboard</h1>
        <AuthLogoutAction class="logout-btn" text="Sair" loading-text="Saindo..." />
      </header>

      <section class="cards">
        <div class="card blue">
          <p>Total de Alunos</p>
          <h2>{{ totalAlunos }}</h2>
        </div>

        <div class="card green">
          <p>Pagos</p>
          <h2>{{ totalPagos }}</h2>
        </div>

        <div class="card red">
          <p>Pendentes</p>
          <h2>{{ totalPendentes }}</h2>
        </div>

        <div class="card orange">
          <p>% Inadimplência</p>
          <h2>{{ taxaInadimplencia }}%</h2>
        </div>
      </section>

      <section class="quick-links">
        <div class="quick-card" @click="goTurmas">
          <Icon name="lucide:book-open" class="quick-icon" />
          <h3>Turmas</h3>
          <p>Gerencie turmas, horários e professores</p>
          <span class="quick-stat">{{ totalTurmas }} turmas</span>
        </div>

        <div class="quick-card" @click="goAlunos">
          <Icon name="lucide:graduation-cap" class="quick-icon" />
          <h3>Alunos</h3>
          <p>Cadastre, edite e ative/desative alunos</p>
          <span class="quick-stat">{{ totalAlunos }} alunos</span>
        </div>

        <div class="quick-card" @click="goMatriculas">
          <Icon name="lucide:clipboard-list" class="quick-icon" />
          <h3>Matrículas</h3>
          <p>Vincule alunos às turmas e acompanhe status</p>
          <span class="quick-stat">{{ totalMatriculas }} matrículas</span>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

useHead({ title: "Dashboard" });

interface Student {
  id: string;
  name?: string;
  nome?: string;
  email?: string;
}

interface LateCharge {
  id: string;
  student_id?: string;
  studentId?: string;
  alunoId?: string;
  amount?: number;
  enrollment?: {
    student?: { id?: string };
  };
}

interface Enrollment {
  id: string;
  student_id?: string;
  studentId?: string;
  alunoId?: string;
  team_id?: string;
  teamId?: string;
  turmaId?: string;
  team?: {
    title?: string;
    name?: string;
  };
}

const api = useApiClient();

const { data: rawStudents } = await useFetch<any>("/api/students");
const { data: rawLateCharges } = await useFetch<any>("/api/billing/late");
const { data: rawTeams } = await useFetch<any>("/api/teams");

function normalizeArray(res: any): any[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.students)) return res.students;
  if (Array.isArray(res.lateCharges)) return res.lateCharges;
  if (Array.isArray(res.teams)) return res.teams;
  if (Array.isArray(res.enrollments)) return res.enrollments;
  if (Array.isArray(res.inscricoes)) return res.inscricoes;
  return [];
}

const students = computed<Student[]>(() => normalizeArray(rawStudents.value));
const lateCharges = computed<LateCharge[]>(() => normalizeArray(rawLateCharges.value));

const enrollmentsResults = await Promise.all(
  normalizeArray(rawStudents.value).map((s: any) =>
    api.get<any>(`/api/enrollments/student/${s.id}`).catch(() => [])
  )
);
const enrollmentsFlat = ref<any[]>(enrollmentsResults.flat());
const enrollments = computed<Enrollment[]>(() => normalizeArray(enrollmentsFlat.value));

const lateStudentIds = computed(() => {
  const ids = new Set<string>();
  for (const item of lateCharges.value) {
    const sId = item.enrollment?.student?.id || item.student_id || item.studentId || item.alunoId;
    if (sId) ids.add(String(sId));
  }
  return ids;
});

const totalAlunos = computed(() => students.value.length);
const totalPendentes = computed(() => lateStudentIds.value.size);
const totalPagos = computed(() => Math.max(0, totalAlunos.value - totalPendentes.value));
const totalTurmas = computed(() => normalizeArray(rawTeams.value).length);
const totalMatriculas = computed(() => enrollments.value.length);

const taxaInadimplencia = computed(() => {
  if (!totalAlunos.value) return 0;
  return Math.round((totalPendentes.value / totalAlunos.value) * 100);
});

function logout() {
  localStorage.removeItem("auth");
  navigateTo("/login");
}

function goTurmas() {
  navigateTo("/turmas");
}

function goAlunos() {
  navigateTo("/alunos");
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

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.topbar h1 {
  font-size: 30px;
  font-weight: 800;
  color: #222;
}

.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.card {
  padding: 22px;
  border-radius: 14px;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card p {
  font-size: 14px;
  font-weight: 600;
  opacity: 0.9;
  margin: 0 0 6px 0;
}

.card h2 {
  font-size: 30px;
  font-weight: 800;
  margin: 0;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.quick-card {
  background: white;
  padding: 26px;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border-left: 5px solid #c62828;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.quick-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(198, 40, 40, 0.15);
}

.quick-icon {
  width: 30px;
  height: 30px;
  color: #c62828;
  display: block;
  margin-bottom: 12px;
}

.quick-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin: 0 0 6px 0;
}

.quick-card p {
  color: #666;
  font-size: 14px;
  margin: 0 0 14px 0;
}

.quick-stat {
  display: inline-block;
  background: #fdecea;
  color: #c62828;
  font-weight: 700;
  font-size: 13px;
  padding: 5px 12px;
  border-radius: 20px;
}

.table-section {
  background: white;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.table-section h3 {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin: 0 0 16px 0;
}

.table {
  width: 100%;
  border-collapse: collapse;
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
  text-align: left;
  font-size: 15px;
  font-weight: 500;
  color: #333;
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

.btn {
  background: #c62828;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.15s;
}

.btn:hover {
  background: #a91f1f;
}

.logout-btn {
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

.logout-btn:hover {
  background: #c62828;
  color: #ffffff;
}

.empty-state {
  text-align: center;
  color: #888;
  padding: 20px;
}

/* --- Responsividade mobile --- */

@media (max-width: 900px) {
  .quick-links {
    grid-template-columns: 1fr;
  }

  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
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

  .topbar h1 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .cards {
    grid-template-columns: 1fr;
  }

  .main {
    padding: 16px;
  }

  .card h2 {
    font-size: 26px;
  }
}
</style>