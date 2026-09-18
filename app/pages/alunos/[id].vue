<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p class="active" @click="voltar">Dashboard</p>
        <p @click="goTurmas">Turmas</p>
        <p @click="goMatriculas">Matrículas</p>
        <AuthLogoutAction as="p">Logout</AuthLogoutAction>
      </nav>
    </aside>

    <main class="main">
      <header class="topbar">
        <h1>Detalhes do Aluno</h1>
        <button class="back" @click="voltar">Voltar</button>
      </header>

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
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

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

interface EnrollmentItem {
  id: string;
  team_id?: string;
  student_id?: string;
  team?: Team;
}

interface LateCharge {
  id: string;
  amount?: number;
  valor?: number;
  student_id?: string;
  studentId?: string;
  alunoId?: string;
  enrollment?: {
    student?: { id?: string };
  };
}

const route = useRoute();
const api = useApiClient();
const idParam = String(route.params.id);

const { data: rawStudent, pending, error: errStudent } = await useFetch<any>(`/api/students/${idParam}`);
const { data: rawEnrollments } = await useFetch<any>(`/api/enrollments/student/${idParam}`);
const { data: rawLateCharges } = await useFetch<any>("/api/billing/late");

function normalizeArray(res: any): any[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.enrollments)) return res.enrollments;
  if (Array.isArray(res.lateCharges)) return res.lateCharges;
  return [];
}

const turmasMatriculadas = computed(() => {
  return normalizeArray(rawEnrollments.value).map((e: EnrollmentItem) => {
    const t = e.team || ({} as Team);
    return {
      id: t.id ? String(t.id) : String(e.id),
      nome: t.title || t.name || t.nome || "Turma não identificada",
      professor: t.team_leader_id || t.professor || t.teacher || "Não informado",
      dia: t.days_of_week || t.dia || t.day || "Horário",
      horario: t.horary || t.horario || t.schedule || "A definir",
    };
  });
});

const pendencias = computed(() => {
  return normalizeArray(rawLateCharges.value).filter((lc: LateCharge) => {
    const sId = lc.enrollment?.student?.id || lc.student_id || lc.studentId || lc.alunoId;
    return String(sId) === idParam;
  });
});

const cobrancas = computed(() => {
  if (pendencias.value.length > 0) {
    return pendencias.value.map((p: LateCharge) => ({
      id: String(p.id),
      valor: p.amount || p.valor ? `R$ ${p.amount || p.valor}` : "Valor não informado",
      status: "Pendente",
    }));
  }
  return [{ id: "REG-OK", valor: "R$ 0,00", status: "Pago" }];
});

const aluno = computed(() => {
  const student = rawStudent.value;
  if (errStudent.value || !student) return null;

  return {
    id: String(student.id),
    nome: student.name || student.nome || "Sem Nome",
    email: student.email || "-",
    telefone: student.phone || student.telefone || "-",
    isPendente: pendencias.value.length > 0,
    turmas: turmasMatriculadas.value,
    cobrancas: cobrancas.value,
  };
});

function voltar() {
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
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #222;
}

.card h3 {
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 700;
  color: #222;
}

.card p {
  margin: 6px 0;
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
  border-bottom: 1px solid #f4f4f4;
  color: #333;
  font-size: 15px;
  font-weight: 500;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  margin-left: 6px;
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