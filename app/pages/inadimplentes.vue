<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p @click="goDashboard">Dashboard</p>
        <p @click="goTurmas">Turmas</p>
        <p @click="goAlunos">Alunos</p>
        <p @click="goMatriculas">Matrículas</p>
        <p class="active">Inadimplentes</p>
        <AuthLogoutAction as="p">Logout</AuthLogoutAction>
      </nav>
    </aside>

    <main class="main">
      <header class="topbar">
        <h1>Inadimplentes</h1>
        <button class="back" @click="goDashboard">Voltar</button>
      </header>

      <section class="summary">
        <div class="summary-card">
          <p>Total em atraso</p>
          <h2>{{ formatarMoeda(totalGeral) }}</h2>
        </div>

        <div class="summary-card">
          <p>Alunos inadimplentes</p>
          <h2>{{ grupos.length }}</h2>
        </div>

        <div class="summary-card">
          <p>Cobranças em atraso</p>
          <h2>{{ totalCobrancas }}</h2>
        </div>
      </section>

      <div class="filters">
        <input
          v-model="busca"
          class="search"
          type="text"
          placeholder="Buscar aluno pelo nome..."
          aria-label="Buscar aluno pelo nome"
        />

        <select v-model="ordenacao" class="select" aria-label="Ordenar inadimplentes">
          <option value="valor">Maior valor devido</option>
          <option value="atraso">Maior atraso</option>
          <option value="nome">Nome (A-Z)</option>
        </select>
      </div>

      <div v-if="pending" class="card loading">
        <p>Carregando cobranças em atraso...</p>
      </div>

      <div v-else-if="erro" class="card">
        <p class="error-text">Não foi possível carregar as cobranças em atraso. Tente novamente em instantes.</p>
        <button class="retry-button" @click="carregar">Tentar de novo</button>
      </div>

      <div v-else class="card">
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Turma(s)</th>
                <th>Cobranças</th>
                <th>Total devido</th>
                <th>Mais antiga</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="grupo in gruposFiltrados" :key="grupo.id">
                <td>{{ grupo.nome }}</td>
                <td>{{ grupo.turmas }}</td>
                <td>{{ grupo.quantidade }}</td>
                <td>{{ formatarMoeda(grupo.total) }}</td>
                <td>
                  {{ grupo.maisAntiga }}
                  <span class="status pendente">{{ grupo.diasAtraso }}d</span>
                </td>
                <td>
                  <button class="view-button" @click="verAluno(grupo.id)">
                    Ver e registrar pagamento
                  </button>
                </td>
              </tr>

              <tr v-if="gruposFiltrados.length === 0">
                <td colspan="6" class="empty-state">
                  {{ grupos.length === 0 ? "Nenhuma cobrança em atraso no momento." : "Nenhum aluno encontrado para essa busca." }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

useHead({ title: "Inadimplentes" });

interface LateCharge {
  id: string;
  amount?: number | string;
  due_date?: string;
  month?: number;
  year?: number;
  enrollment?: {
    student?: { id?: string; name?: string; nome?: string };
    team?: { title?: string; name?: string; nome?: string };
  };
}

interface Grupo {
  id: string;
  nome: string;
  turmas: string;
  quantidade: number;
  total: number;
  maisAntiga: string;
  diasAtraso: number;
}

const api = useApiClient();

const cobrancas = ref<LateCharge[]>([]);
const pending = ref(true);
const erro = ref(false);

const busca = ref("");
const ordenacao = ref("valor");

async function carregar() {
  pending.value = true;
  erro.value = false;

  try {
    const response: any = await api.get("/api/billing/late");
    cobrancas.value = Array.isArray(response)
      ? response
      : response?.data || response?.lateCharges || [];
  } catch {
    cobrancas.value = [];
    erro.value = true;
  } finally {
    pending.value = false;
  }
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

function normalizarTexto(valor: string): string {
  return valor
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const grupos = computed<Grupo[]>(() => {
  const mapa = new Map<string, { nome: string; turmas: Set<string>; total: number; quantidade: number; maisAntiga: Date | null }>();

  for (const c of cobrancas.value) {
    const student = c.enrollment?.student;
    const id = student?.id ? String(student.id) : "";
    if (!id) continue;

    const atual = mapa.get(id) ?? {
      nome: student?.name || student?.nome || "Sem Nome",
      turmas: new Set<string>(),
      total: 0,
      quantidade: 0,
      maisAntiga: null,
    };

    const team = c.enrollment?.team;
    atual.turmas.add(team?.title || team?.name || team?.nome || "Turma não identificada");
    atual.total += Number(c.amount ?? 0);
    atual.quantidade += 1;

    const venc = c.due_date ? new Date(c.due_date) : null;
    if (venc && !isNaN(venc.getTime()) && (!atual.maisAntiga || venc < atual.maisAntiga)) {
      atual.maisAntiga = venc;
    }

    mapa.set(id, atual);
  }

  return Array.from(mapa.entries()).map(([id, g]) => ({
    id,
    nome: g.nome,
    turmas: Array.from(g.turmas).join(", "),
    quantidade: g.quantidade,
    total: g.total,
    maisAntiga: g.maisAntiga ? g.maisAntiga.toLocaleDateString("pt-BR") : "—",
    diasAtraso: g.maisAntiga ? diasEmAtraso(g.maisAntiga) : 0,
  }));
});

const gruposFiltrados = computed(() => {
  const termo = normalizarTexto(busca.value);

  const lista = grupos.value.filter(
    (g) => !termo || normalizarTexto(g.nome).includes(termo)
  );

  return [...lista].sort((a, b) => {
    if (ordenacao.value === "nome") return a.nome.localeCompare(b.nome, "pt-BR");
    if (ordenacao.value === "atraso") return b.diasAtraso - a.diasAtraso;
    return b.total - a.total;
  });
});

const totalGeral = computed(() => grupos.value.reduce((acc, g) => acc + g.total, 0));
const totalCobrancas = computed(() => grupos.value.reduce((acc, g) => acc + g.quantidade, 0));

// Carrega só no navegador (no servidor a requisição vem sem a sessão do usuário).
onMounted(carregar);

function verAluno(id: string) {
  navigateTo(`/alunos/${id}`);
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

.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.summary-card {
  background: #ffffff;
  padding: 22px;
  border-radius: 14px;
  border-left: 5px solid #c62828;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.summary-card p {
  margin: 0 0 6px;
  color: #666;
  font-size: 14px;
  font-weight: 600;
}

.summary-card h2 {
  margin: 0;
  color: #c62828;
  font-size: 28px;
  font-weight: 800;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search {
  flex: 1;
  min-width: 220px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #ffffff;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  font-family: inherit;
}

.select {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #ffffff;
  color: #333;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.search:focus,
.select:focus {
  outline: none;
  border-color: #c62828;
}

.card {
  background: #ffffff;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border-left: 5px solid #c62828;
}

.loading {
  color: #666;
  font-style: italic;
}

.error-text {
  color: #c62828;
  font-weight: 600;
  margin: 0 0 12px;
}

.retry-button {
  background: #c62828;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
}

.retry-button:hover {
  background: #a91f1f;
}

.table-wrap {
  overflow-x: auto;
}

.table {
  width: 100%;
  min-width: 720px;
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
  vertical-align: middle;
}

.status {
  padding: 3px 10px;
  border-radius: 20px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  margin-left: 6px;
}

.pendente {
  background: #c62828;
}

.view-button {
  background: #ffffff;
  color: #c62828;
  border: 2px solid #c62828;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}

.view-button:hover {
  background: #c62828;
  color: #ffffff;
}

.empty-state {
  text-align: center;
  color: #888;
  padding: 25px;
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

  .summary {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .filters {
    flex-direction: column;
  }

  .search,
  .select {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
}

@media (max-width: 480px) {
  .main {
    padding: 14px;
  }

  .card {
    padding: 18px;
  }
}
</style>