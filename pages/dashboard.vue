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
          <h2>120</h2>
        </div>

        <div class="card green">
          <p>Pagos</p>
          <h2>80</h2>
        </div>

        <div class="card red">
          <p>Pendentes</p>
          <h2>40</h2>
        </div>

        <div class="card orange">
          <p>% Inadimplência</p>
          <h2>33%</h2>
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
            <tr v-for="(aluno, i) in alunos" :key="i">
              <td>{{ aluno.nome }}</td>
              <td>{{ aluno.turma }}</td>

              <td>
                <span
                  :class="['status', aluno.status === 'Pago' ? 'pago' : 'pendente']"
                >
                  {{ aluno.status }}
                </span>
              </td>

              <td>
                <button class="btn">Ver detalhes</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

    </main>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const alunos = [
  { nome: "Ana Souza", turma: "Tecido Acrobático", status: "Pago" },
  { nome: "Camila Santos", turma: "Tecido Acrobático", status: "Pendente" },
  { nome: "Carlos Lima", turma: "Tecido Acrobático", status: "Pago" },
];

onMounted(() => {
  const isLogged = localStorage.getItem("auth");
  if (!isLogged) navigateTo("/login");
});

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

/* MAIN */
.main {
  flex: 1;
  padding: 30px;
}

/* TOPBAR */
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

.btn {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
</style>