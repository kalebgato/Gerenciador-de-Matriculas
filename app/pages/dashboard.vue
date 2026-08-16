<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p class="active">Dashboard</p>
        <p @click="goTurmas">Turmas</p>
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

      <section class="table-section">
        <h3>Alunos</h3>

        <table class="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Turma</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="aluno in alunosProcessados" :key="aluno.id">
              <td>{{ aluno.nome }}</td>
              <td>{{ aluno.turma }}</td>

              <td>
                <span :class="['status', aluno.status === 'Pago' ? 'pago' : 'pendente']">
                  {{ aluno.status }}
                </span>
              </td>

              <td>
                <button class="btn" @click="verDetalhes(aluno.id)">Ver detalhes</button>
              </td>
            </tr>
            <tr v-if="alunosProcessados.length === 0">
              <td colspan="4" class="empty-state">Nenhum aluno encontrado.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Student {
  id: string;
  name?: string;
  nome?: string;
  email?: string;
}

interface LateCharge {
  id: string;
  studentId?: string;
  alunoId?: string;
  amount?: number;
}

interface Enrollment {
  id: string;
  studentId?: string;
  alunoId?: string;
  teamId?: string;
  turmaId?: string;
  team?: {
    name?: string;
  };
}

const { data: rawStudents } = await useLazyFetch<any>("/api/students", { server: false });
const { data: rawLateCharges } = await useLazyFetch<any>("/api/faturamento/atrasado", { server: false });
const { data: rawEnrollmentsAlt1 } = await useLazyFetch<any>("/api/inscricoes", { server: false });
const { data: rawEnrollmentsAlt2 } = await useLazyFetch<any>("/api/inscrições", { server: false });

function normalizeArray(res: any): any[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.students)) return res.students;
  if (Array.isArray(res.lateCharges)) return res.lateCharges;
  if (Array.isArray(res.enrollments)) return res.enrollments;
  if (Array.isArray(res.inscricoes)) return res.inscricoes;
  return [];
}

const students = computed<Student[]>(() => normalizeArray(rawStudents.value));
const lateCharges = computed<LateCharge[]>(() => normalizeArray(rawLateCharges.value));
const enrollments = computed<Enrollment[]>(() => {
  const e1 = normalizeArray(rawEnrollmentsAlt1.value);
  return e1.length > 0 ? e1 : normalizeArray(rawEnrollmentsAlt2.value);
});

const totalAlunos = computed(() => students.value.length);
const totalPendentes = computed(() => lateCharges.value.length);
const totalPagos = computed(() => Math.max(0, totalAlunos.value - totalPendentes.value));

const taxaInadimplencia = computed(() => {
  if (!totalAlunos.value) return 0;
  return Math.round((totalPendentes.value / totalAlunos.value) * 100);
});

const lateStudentIds = computed(() => {
  const ids = new Set<string>();
  for (const item of lateCharges.value) {
    const sId = item.studentId || item.alunoId;
    if (sId) ids.add(String(sId));
  }
  return ids;
});

const enrollmentMap = computed(() => {
  const map = new Map<string, string>();
  for (const item of enrollments.value) {
    const sId = item.studentId || item.alunoId;
    if (sId && item.team?.name) {
      map.set(String(sId), item.team.name);
    }
  }
  return map;
});

const alunosProcessados = computed(() => {
  return students.value.map((student) => {
    const sId = String(student.id);
    const isPendente = lateStudentIds.value.has(sId);
    const turmaNome = enrollmentMap.value.get(sId) || "Sem Turma";

    return {
      id: sId,
      nome: student.name || student.nome || "Sem Nome",
      turma: turmaNome,
      status: isPendente ? "Pendente" : "Pago",
    };
  });
});

function logout() {
  localStorage.removeItem("auth");
  navigateTo("/login");
}

function goTurmas() {
  navigateTo("/turmas");
}

function verDetalhes(id: string) {
  navigateTo(`/alunos/${id}`);
}
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  background: #f4f4f4;
}

.sidebar {
  width: 220px;
  background: white;
  padding: 20px;
  border-right: 1px solid #eee;
}

.logo {
  color: #c62828;
  margin-bottom: 20px;
}

.sidebar p {
  margin: 10px 0;
  cursor: pointer;
}

.sidebar .active {
  color: #c62828;
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
}

.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.card {
  padding: 20px;
  border-radius: 12px;
  color: white;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 10px;
  text-align: left;
}

.status {
  padding: 5px 10px;
  border-radius: 8px;
  color: white;
  font-size: 12px;
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
.btn {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  color: #888;
  padding: 20px;
}
</style>
>>>>>>> refs/remotes/origin/develop
