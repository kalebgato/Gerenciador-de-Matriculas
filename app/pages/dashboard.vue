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

<script setup lang='ts'>
const alunos = [
  { nome: "Ana Souza", turma: "Tecido Acrobático", status: "Pago" },
  { nome: "Camila Santos", turma: "Tecido Acrobático", status: "Pendente" },
  { nome: "Carlos Lima", turma: "Tecido Acrobático", status: "Pago" },
];

function goTurmas() {
  navigateTo("/turmas");
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

</style>
