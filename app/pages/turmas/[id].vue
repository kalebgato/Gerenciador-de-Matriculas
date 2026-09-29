<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p @click="goDashboard">Dashboard</p>
        <p class="active" @click="goTurmas">Turmas</p>
        <p @click="goAlunos">Alunos</p>
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
          <div class="card-header">
            <h2>{{ turma.nome }}</h2>
            <div class="card-actions">
              <button v-if="!editando" class="edit-button" @click="entrarModoEdicao">
                Editar
              </button>
              <button
                v-if="!editando"
                class="delete-button"
                :disabled="excluindo"
                @click="excluirTurma"
              >
                {{ excluindo ? "Excluindo..." : "Excluir turma" }}
              </button>
            </div>
          </div>

          <p v-if="mensagemExclusao" class="message error">
            {{ mensagemExclusao }}
          </p>

          <template v-if="!editando">
            <p>{{ turma.dia }} - {{ turma.horario }}</p>
            <p><strong>Professor:</strong> {{ turma.professor }}</p>
          </template>

          <form v-else class="edit-form" @submit.prevent="salvarEdicao">
            <label for="editTitulo">Nome da turma</label>
            <input id="editTitulo" v-model="editTitulo" class="edit-input" type="text" required />

            <label for="editProfessor">Professor</label>
            <input id="editProfessor" v-model="editProfessor" class="edit-input" type="text" />

            <label for="editDias">Dias da semana</label>
            <input id="editDias" v-model="editDias" class="edit-input" type="text" placeholder="Ex: Segunda,Quarta" />

            <label for="editHorario">Horário</label>
            <input id="editHorario" v-model="editHorario" class="edit-input" type="text" placeholder="Ex: 14:00-16:00" />

            <p v-if="mensagemEdicao" :class="['message', erroEdicao ? 'error' : 'success']">
              {{ mensagemEdicao }}
            </p>

            <div class="edit-buttons">
              <button type="submit" class="save-button" :disabled="salvando">
                {{ salvando ? "Salvando..." : "Salvar" }}
              </button>
              <button type="button" class="cancel-button" @click="cancelarEdicao">
                Cancelar
              </button>
            </div>
          </form>
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

const { data: rawTeams, pending, refresh: refreshTeams } = await useFetch<any>("/api/teams");
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

useHead({ title: computed(() => (turma.value ? `Turma - ${turma.value.nome}` : "Turma")) });

const editando = ref(false);
const editTitulo = ref("");
const editProfessor = ref("");
const editDias = ref("");
const editHorario = ref("");

const salvando = ref(false);
const mensagemEdicao = ref("");
const erroEdicao = ref(false);

function entrarModoEdicao() {
  const idParam = String(route.params.id);
  const targetTeam = teams.value.find((t) => String(t.id) === idParam);
  if (!targetTeam) return;

  editTitulo.value = targetTeam.title || "";
  editProfessor.value = targetTeam.team_leader_id || "";
  editDias.value = targetTeam.days_of_week || "";
  editHorario.value = targetTeam.horary || "";
  mensagemEdicao.value = "";
  editando.value = true;
}

function cancelarEdicao() {
  editando.value = false;
  mensagemEdicao.value = "";
}

function extrairMensagemErro(err: any, padrao: string) {
  return (
    err?.data?.message ||
    err?.data?.statusMessage ||
    err?.response?._data?.message ||
    err?.response?._data?.statusMessage ||
    padrao
  );
}

async function salvarEdicao() {
  const idParam = String(route.params.id);
  mensagemEdicao.value = "";
  erroEdicao.value = false;
  salvando.value = true;

  try {
    await api.put(`/api/teams/${idParam}`, {
      title: editTitulo.value.trim(),
      team_leader_id: editProfessor.value.trim() || undefined,
      days_of_week: editDias.value.trim() || undefined,
      horary: editHorario.value.trim() || undefined,
    });

    await refreshTeams();
    editando.value = false;
  } catch (err: any) {
    erroEdicao.value = true;
    mensagemEdicao.value = extrairMensagemErro(err, "Não foi possível salvar as alterações.");
  } finally {
    salvando.value = false;
  }
}

const excluindo = ref(false);
const mensagemExclusao = ref("");

async function excluirTurma() {
  if (!turma.value) return;

  const confirmado = confirm(
    `Excluir a turma "${turma.value.nome}"? Essa ação não pode ser desfeita.`
  );
  if (!confirmado) return;

  const idParam = String(route.params.id);
  mensagemExclusao.value = "";
  excluindo.value = true;

  try {
    await api.delete(`/api/teams/${idParam}`);
    navigateTo("/turmas");
  } catch (err: any) {
    const bruto = extrairMensagemErro(err, "Não foi possível excluir a turma.");
    if (/foreign key|enrollments_team_id_fkey/i.test(bruto)) {
      mensagemExclusao.value =
        "Não é possível excluir esta turma porque existem alunos matriculados nela. Cancele as matrículas primeiro (na tela de Matrículas).";
    } else {
      mensagemExclusao.value = bruto;
    }
  } finally {
    excluindo.value = false;
  }
}

function voltar() {
  navigateTo("/turmas");
}

function goDashboard() {
  navigateTo("/dashboard");
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
}

.card-header h2 {
  margin-bottom: 0;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.delete-button {
  background: #ffffff;
  color: #888888;
  border: 2px solid #ccc;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.delete-button:hover:not(:disabled) {
  background: #c62828;
  color: #ffffff;
  border-color: #c62828;
}

.delete-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.edit-button {
  background: #ffffff;
  color: #c62828;
  border: 2px solid #c62828;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  transition: background 0.15s, color 0.15s;
}

.edit-button:hover {
  background: #c62828;
  color: #ffffff;
}

.edit-form {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.edit-form label {
  margin-bottom: 5px;
  font-weight: 700;
  color: #333;
  font-size: 14px;
}

.edit-input {
  padding: 9px 11px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 14px;
  font-size: 14px;
  font-family: inherit;
}

.edit-input:focus {
  outline: none;
  border-color: #c62828;
}

.edit-buttons {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.save-button {
  background: #c62828;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.15s;
}

.save-button:hover:not(:disabled) {
  background: #a91f1f;
}

.save-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-button {
  background: #ffffff;
  color: #555;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
}

.cancel-button:hover {
  background: #f4f4f4;
}

.message {
  padding: 10px;
  border-radius: 8px;
  margin: 0 0 10px;
  font-weight: 600;
  font-size: 14px;
}

.success {
  background: #dff5e9;
  color: #218838;
}

.error {
  background: #fde2e2;
  color: #c62828;
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