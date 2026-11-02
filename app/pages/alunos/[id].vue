<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p @click="goDashboard">Dashboard</p>
        <p @click="goTurmas">Turmas</p>
        <p class="active" @click="goAlunos">Alunos</p>
        <p @click="goMatriculas">Matrículas</p>
        <p @click="goInadimplentes">Inadimplentes</p>
        <AuthLogoutAction as="p">Logout</AuthLogoutAction>
      </nav>
    </aside>

    <main class="main">
      <header class="topbar">
        <h1>Detalhes do Aluno</h1>
        <button class="back" @click="goAlunos">Voltar</button>
      </header>

      <div v-if="pending" class="card loading">
        <p>Carregando informações do aluno...</p>
      </div>

      <div v-else-if="aluno" class="content">
        <div class="card">
          <div class="card-header">
            <h2>{{ aluno.nome }}</h2>
            <div class="card-actions">
              <span :class="['status', aluno.ativo ? 'pago' : 'inativo']">
                {{ aluno.ativo ? "Cadastro Ativo" : "Cadastro Inativo" }}
              </span>
              <button v-if="!editando" class="edit-button" @click="entrarModoEdicao">
                Editar
              </button>
            </div>
          </div>

          <template v-if="!editando">
            <p><strong>Email:</strong> {{ aluno.email }}</p>
            <p><strong>Telefone:</strong> {{ aluno.telefone }}</p>
            <p>
              <strong>Status Financeiro Geral:</strong>
              <span :class="['status', aluno.isPendente ? 'pendente' : 'pago']">
                {{ aluno.isPendente ? 'Pendente' : 'Em Dia' }}
              </span>
            </p>

            <button
              class="toggle-button"
              :class="aluno.ativo ? 'toggle-danger' : 'toggle-ok'"
              :disabled="alterandoStatus"
              @click="alternarStatus"
            >
              {{ alterandoStatus ? "Atualizando..." : (aluno.ativo ? "Desativar aluno" : "Ativar aluno") }}
            </button>
          </template>

          <form v-else class="edit-form" @submit.prevent="salvarEdicao">
            <label for="editNome">Nome completo</label>
            <input id="editNome" v-model="editNome" class="edit-input" type="text" required />

            <label for="editEmail">Email</label>
            <input id="editEmail" v-model="editEmail" class="edit-input" type="email" />

            <label for="editTelefone">Telefone</label>
            <input
              id="editTelefone"
              v-model="editTelefone"
              class="edit-input"
              type="text"
              placeholder="(00) 00000-0000"
              maxlength="15"
              @input="editTelefone = formatarTelefone(editTelefone)"
            />

            <label for="editDn">Data de nascimento</label>
            <input id="editDn" v-model="editDn" class="edit-input" type="date" />

            <label for="editResponsavelNome">Nome do responsável</label>
            <input id="editResponsavelNome" v-model="editResponsavelNome" class="edit-input" type="text" />

            <label for="editResponsavelTelefone">Telefone do responsável</label>
            <input
              id="editResponsavelTelefone"
              v-model="editResponsavelTelefone"
              class="edit-input"
              type="text"
              placeholder="(00) 00000-0000"
              maxlength="15"
              @input="editResponsavelTelefone = formatarTelefone(editResponsavelTelefone)"
            />

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

        <div class="card table-card">
          <h3>Turmas Matriculadas</h3>

          <div class="table-wrap">
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
        </div>

        <div class="card table-card">
          <h3>Histórico Financeiro e Cobranças</h3>

          <p v-if="feedbackPagamento" :class="['message', feedbackPagamentoErro ? 'error' : 'success']">
            {{ feedbackPagamento }}
          </p>

          <div class="table-wrap">
            <table class="table table-wide">
              <thead>
                <tr>
                  <th>Referência</th>
                  <th>Turma</th>
                  <th>Vencimento</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cobranca in aluno.cobrancas" :key="cobranca.id">
                  <td>{{ cobranca.referencia }}</td>
                  <td>{{ cobranca.turma }}</td>
                  <td>{{ cobranca.vencimento }}</td>
                  <td>{{ cobranca.valor }}</td>
                  <td>
                    <span class="status pendente">
                      {{ cobranca.diasAtraso > 0 ? `Atrasada (${cobranca.diasAtraso}d)` : "Pendente" }}
                    </span>
                  </td>
                  <td>
                    <button class="pay-button" @click="abrirPagamento(cobranca)">
                      Registrar pagamento
                    </button>
                  </td>
                </tr>
                <tr v-if="aluno.cobrancas.length === 0">
                  <td colspan="6" class="empty-state">Nenhuma cobrança em atraso encontrada.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="hint">
            Esta lista mostra apenas cobranças em atraso. O sistema ainda não disponibiliza o histórico de pagamentos já realizados.
          </p>
        </div>
      </div>

      <div v-else class="card">
        <h2>Aluno não encontrado</h2>
        <p>Não foi possível carregar os dados. Verifique a conexão com o banco ou o ID do aluno.</p>
      </div>
    </main>

    <div v-if="cobrancaSelecionada" class="overlay" @click.self="fecharPagamento">
      <div class="panel" role="dialog" aria-modal="true" aria-labelledby="pagamento-titulo">
        <h2 id="pagamento-titulo">Registrar pagamento</h2>
        <p>
          <strong>{{ cobrancaSelecionada.turma }}</strong> — referência {{ cobrancaSelecionada.referencia }}
        </p>
        <p>Valor da cobrança: <strong>{{ cobrancaSelecionada.valor }}</strong></p>

        <form class="pay-form" @submit.prevent="confirmarPagamento">
          <label for="pagValor">Valor pago (R$)</label>
          <input
            id="pagValor"
            v-model="pagValor"
            class="edit-input"
            type="number"
            min="0.01"
            step="0.01"
            required
          />

          <label for="pagMetodo">Forma de pagamento</label>
          <select id="pagMetodo" v-model="pagMetodo" class="edit-input">
            <option v-for="m in metodosPagamento" :key="m.valor" :value="m.valor">
              {{ m.rotulo }}
            </option>
          </select>

          <p v-if="pagamentoParcial" class="message warning">
            Pagamento parcial: a cobrança continuará em aberto com o valor integral, porque o sistema ainda não exibe o saldo restante.
          </p>

          <p v-if="erroPagamento" class="message error">{{ erroPagamento }}</p>

          <div class="edit-buttons">
            <button type="submit" class="save-button" :disabled="registrandoPagamento">
              {{ registrandoPagamento ? "Registrando..." : "Confirmar pagamento" }}
            </button>
            <button type="button" class="cancel-button" @click="fecharPagamento">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";

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
  due_date?: string;
  month?: number;
  year?: number;
  student_id?: string;
  studentId?: string;
  alunoId?: string;
  enrollment?: {
    student?: { id?: string };
    team?: Team;
  };
}

const route = useRoute();
const api = useApiClient();
const idParam = String(route.params.id);

const { data: rawStudent, pending, error: errStudent, refresh: refreshStudent } = await useFetch<any>(`/api/students/${idParam}`);
const { data: rawEnrollments } = await useFetch<any>(`/api/enrollments/student/${idParam}`);
const { data: rawLateCharges, refresh: refreshLateCharges } = await useFetch<any>("/api/billing/late");

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

function formatarData(data: any): string {
  if (!data) return "—";
  const d = new Date(data);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function diasEmAtraso(vencimento: any): number {
  if (!vencimento) return 0;
  const d = new Date(vencimento);
  if (isNaN(d.getTime())) return 0;
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  return diff > 0 ? diff : 0;
}

const cobrancas = computed(() => {
  return pendencias.value.map((p: LateCharge) => {
    const valorNumero = Number(p.amount ?? p.valor ?? 0);
    const team = p.enrollment?.team;
    const mes = p.month ? String(p.month).padStart(2, "0") : "--";

    return {
      id: String(p.id),
      referencia: `${mes}/${p.year ?? "----"}`,
      turma: team?.title || team?.name || team?.nome || "Turma não identificada",
      vencimento: formatarData(p.due_date),
      diasAtraso: diasEmAtraso(p.due_date),
      valorNumero,
      valor: valorNumero > 0 ? formatarMoeda(valorNumero) : "Valor não informado",
    };
  });
});

type Cobranca = (typeof cobrancas.value)[number];

const aluno = computed(() => {
  const student = rawStudent.value;
  if (errStudent.value || !student) return null;

  return {
    id: String(student.id),
    nome: student.name || student.nome || "Sem Nome",
    email: student.email || "-",
    telefone: student.phone || student.telefone || "-",
    ativo: student.active !== false,
    isPendente: pendencias.value.length > 0,
    turmas: turmasMatriculadas.value,
    cobrancas: cobrancas.value,
  };
});

const editando = ref(false);
const editNome = ref("");
const editEmail = ref("");
const editTelefone = ref("");
const editDn = ref("");
const editResponsavelNome = ref("");
const editResponsavelTelefone = ref("");

const salvando = ref(false);
const mensagemEdicao = ref("");
const erroEdicao = ref(false);

const alterandoStatus = ref(false);

// --- Registro de pagamento ---
const metodosPagamento = [
  { valor: "PIX", rotulo: "PIX" },
  { valor: "BOLETO", rotulo: "Boleto" },
  { valor: "CREDIT_CARD", rotulo: "Cartão de crédito" },
  { valor: "DEBIT_CARD", rotulo: "Cartão de débito" },
];

const cobrancaSelecionada = ref<Cobranca | null>(null);
const pagValor = ref("");
const pagMetodo = ref("PIX");
const registrandoPagamento = ref(false);
const erroPagamento = ref("");
const feedbackPagamento = ref("");
const feedbackPagamentoErro = ref(false);

const pagamentoParcial = computed(() => {
  if (!cobrancaSelecionada.value) return false;
  const pago = Number(pagValor.value);
  return pago > 0 && pago < cobrancaSelecionada.value.valorNumero;
});

function abrirPagamento(cobranca: Cobranca) {
  cobrancaSelecionada.value = cobranca;
  pagValor.value = cobranca.valorNumero > 0 ? String(cobranca.valorNumero) : "";
  pagMetodo.value = "PIX";
  erroPagamento.value = "";
}

function fecharPagamento() {
  if (registrandoPagamento.value) return;
  cobrancaSelecionada.value = null;
  erroPagamento.value = "";
}

async function confirmarPagamento() {
  if (!cobrancaSelecionada.value) return;

  const valorPago = Number(pagValor.value);
  if (!(valorPago > 0)) {
    erroPagamento.value = "Informe um valor maior que zero.";
    return;
  }

  registrandoPagamento.value = true;
  erroPagamento.value = "";

  try {
    await api.post("/api/billing", {
      action: "pay",
      charge_id: cobrancaSelecionada.value.id,
      amount: valorPago,
      method: pagMetodo.value,
    });

    const referencia = cobrancaSelecionada.value.referencia;
    cobrancaSelecionada.value = null;
    await refreshLateCharges();

    feedbackPagamentoErro.value = false;
    feedbackPagamento.value = `Pagamento da cobrança ${referencia} registrado com sucesso.`;
  } catch (err: any) {
    erroPagamento.value = extrairMensagemErro(err, "Não foi possível registrar o pagamento.");
  } finally {
    registrandoPagamento.value = false;
  }
}

function formatarTelefone(valor: string): string {
  const digits = valor.replace(/\D/g, "").slice(0, 11);
  let out = "";
  if (digits.length > 0) out = "(" + digits.slice(0, 2);
  if (digits.length >= 2) out += ") ";
  if (digits.length > 2) {
    const rest = digits.slice(2);
    if (rest.length <= 4) {
      out += rest;
    } else if (rest.length <= 8) {
      out += rest.slice(0, rest.length - 4) + "-" + rest.slice(-4);
    } else {
      out += rest.slice(0, 5) + "-" + rest.slice(5);
    }
  }
  return out;
}

function formatarDataParaInput(dn: any): string {
  if (!dn) return "";
  const data = new Date(dn);
  if (isNaN(data.getTime())) return "";
  return data.toISOString().slice(0, 10);
}

function entrarModoEdicao() {
  const student = rawStudent.value || {};
  editNome.value = student.name || "";
  editEmail.value = student.email || "";
  editTelefone.value = student.phone || "";
  editDn.value = formatarDataParaInput(student.dn);
  editResponsavelNome.value = student.responsable_name || "";
  editResponsavelTelefone.value = student.responsable_phone || "";
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
  mensagemEdicao.value = "";
  erroEdicao.value = false;
  salvando.value = true;

  try {
    await api.put(`/api/students/${idParam}`, {
      name: editNome.value.trim(),
      email: editEmail.value.trim() || undefined,
      phone: editTelefone.value.trim() || undefined,
      dn: editDn.value ? new Date(editDn.value).toISOString() : undefined,
      responsable_name: editResponsavelNome.value.trim() || undefined,
      responsable_phone: editResponsavelTelefone.value.trim() || undefined,
    });

    await refreshStudent();
    editando.value = false;
  } catch (err: any) {
    erroEdicao.value = true;
    mensagemEdicao.value = extrairMensagemErro(err, "Não foi possível salvar as alterações.");
  } finally {
    salvando.value = false;
  }
}

async function alternarStatus() {
  if (!aluno.value) return;

  alterandoStatus.value = true;

  try {
    await api.put(`/api/students/${idParam}`, {
      active: !aluno.value.ativo,
    });

    await refreshStudent();
  } catch {
    // silencioso: o status exibido reflete o último estado confirmado pelo servidor
  } finally {
    alterandoStatus.value = false;
  }
}

useHead({ title: computed(() => (aluno.value ? aluno.value.nome : "Detalhes do Aluno")) });

function goInadimplentes() {
  navigateTo("/inadimplentes");
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
  box-sizing: border-box;
  background: white;
  padding: 24px;
  border-radius: 14px;
  margin-bottom: 20px;
  width: 100%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border-left: 5px solid #c62828;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.card-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.card h2 {
  margin-bottom: 0;
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

.toggle-button {
  margin-top: 14px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  color: white;
  transition: opacity 0.15s;
}

.toggle-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-danger {
  background: #c62828;
}

.toggle-ok {
  background: #2e7d32;
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
  box-sizing: border-box;
  width: 100%;
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
  flex-wrap: wrap;
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

.table-wrap {
  overflow-x: auto;
}

.table {
  width: 100%;
  min-width: 420px;
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
  white-space: nowrap;
}

.table td {
  padding: 14px 10px;
  border-bottom: 1px solid #f4f4f4;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
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

.inativo {
  background: #888888;
}

.empty-state {
  text-align: center;
  color: #888;
  padding: 20px;
  white-space: normal;
}

.table-wide {
  min-width: 680px;
}

.hint {
  margin-top: 12px;
  font-size: 13px;
  color: #888;
}

.pay-button {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  white-space: nowrap;
  transition: background 0.15s;
}

.pay-button:hover {
  background: #256628;
}

.message.warning {
  background: #fff3cd;
  color: #856404;
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

.pay-form {
  display: flex;
  flex-direction: column;
  margin-top: 14px;
}

.pay-form label {
  margin-bottom: 5px;
  font-weight: 700;
  color: #333;
  font-size: 14px;
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
  .main {
    padding: 14px;
  }

  .card {
    padding: 18px;
  }

  .edit-buttons {
    flex-direction: column;
  }

  .save-button,
  .cancel-button {
    width: 100%;
  }
}
</style>