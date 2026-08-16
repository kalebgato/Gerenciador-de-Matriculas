<template>
  <div class="dashboard">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p class="active">Dashboard</p>
        <p @click="goTurmas">Turmas</p>
        <p @click="logout">Logout</p>
      </nav>
    </aside>

    <main class="main">
      <header class="topbar">
        <h1>Dashboard</h1>

        <button class="logout-btn" @click="logout">
          Sair
        </button>
      </header>

      <section class="cards">
        <div class="card blue">
          <p>Total de Alunos</p>
          <h2>{{ totalAlunos }}</h2>
        </div>

        <div class="card green">
          <p>Pagos</p>
          <h2>{{ pagos }}</h2>
        </div>

        <div class="card red">
          <p>Pendentes</p>
          <h2>{{ pendentes }}</h2>
        </div>

        <div class="card orange">
          <p>% Inadimplência</p>
          <h2>{{ inadimplencia }}%</h2>
        </div>
      </section>

      <section class="table-section">
        <h3>Alunos</h3>

        <table class="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="aluno in alunos" :key="aluno.id">
              <td>{{ aluno.name }}</td>
              <td>{{ aluno.email }}</td>

              <td>
                <span
                  :class="[
                    'status',
                    alunosPendentesIds.includes(aluno.id)
                      ? 'pendente'
                      : 'pago'
                  ]"
                >
                  {{
                    alunosPendentesIds.includes(aluno.id)
                      ? "Pendente"
                      : "Pago"
                  }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const alunos = ref([]);
const cobrancasPendentes = ref([]);

const totalAlunos = computed(() => alunos.value.length);

const pendentes = computed(() => cobrancasPendentes.value.length);

const pagos = computed(() => {
  return totalAlunos.value - pendentes.value;
});

const inadimplencia = computed(() => {
  if (totalAlunos.value === 0) return 0;

  return Math.round((pendentes.value / totalAlunos.value) * 100);
});

const alunosPendentesIds = computed(() => {
  return cobrancasPendentes.value.map(
    (cobranca) => cobranca.enrollment.student.id
  );
});

onMounted(async () => {
  const isLogged = localStorage.getItem("auth");

  if (!isLogged) {
    navigateTo("/login");
    return;
  }

  await carregarDados();
});

async function carregarDados() {
  try {
    const [studentsRes, lateRes] = await Promise.all([
      $fetch("/api/students"),
      $fetch("/api/billing/late"),
    ]);

    alunos.value = studentsRes;
    cobrancasPendentes.value = lateRes;
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
  }
}

function logout() {
  localStorage.removeItem("auth");
  navigateTo("/login");
}

function goTurmas() {
  navigateTo("/turmas");
}
</script>

<style>
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

.logout-btn {
  background: #d32f2f;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
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

.blue {
  background: linear-gradient(135deg, #4f8ef7, #3a6edc);
}

.green {
  background: linear-gradient(135deg, #34c38f, #2a9d6f);
}

.red {
  background: linear-gradient(135deg, #f46a6a, #d9534f);
}

.orange {
  background: linear-gradient(135deg, #f7b84b, #d98c1f);
}

.table-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
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
</style>