<template>
  <div class="dashboard">


    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p @click="goDashboard">Dashboard</p>
        <p class="active">Turmas</p>
        <p @click="logout">Logout</p>
      </nav>
    </aside>

  
    <main class="main">

      <!-- HEADER -->
      <header class="topbar">
        <h1>Turmas</h1>
        <button class="back" @click="goDashboard">Voltar</button>
      </header>

      <select v-model="filtroProfessor" class="select">
        <option value="">Todos professores</option>
        <option 
          v-for="prof in professores" 
          :key="prof"
          :value="prof"
        >
          {{ prof }}
        </option>
      </select>


      <section class="cards">
        <div
          class="turma-card"
          v-for="(turma, i) in turmasFiltradas"
          :key="i"
          @click="selecionarTurma(turma)"
        >
          <h3>{{ turma.nome }}</h3>
          <p>🗓 {{ turma.dia }} às {{ turma.horario }}</p>
          <p>👨‍🏫 {{ turma.professor }}</p>
          <p class="badge">{{ turma.alunos.length }} alunos</p>
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

        <div
          v-for="(aluno, i) in turmaSelecionada.alunos"
          :key="i"
          class="aluno"
        >
          <span>{{ aluno.nome }}</span>

          <span
            :class="['status', aluno.status === 'Pago' ? 'pago' : 'pendente']"
          >
            {{ aluno.status }}
          </span>
        </div>

        <button 
          class="enter"
          :disabled="loading"
          @click="entrarTurma"
        >
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>

        <button class="close" @click="turmaSelecionada = null">
          Fechar
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const filtroProfessor = ref("");
const turmaSelecionada = ref(null);
const loading = ref(false);

const turmas = [
  {
    nome: "Tecido Acrobático",
    professor: "Jean",
    dia: "Sábado",
    horario: "14:00",
    alunos: [
      { nome: "Ana Souza", status: "Pago" },
      { nome: "Camila Santos", status: "Pendente" },
    ],
  },
  {
    nome: "Tecido Acrobático",
    professor: "Maria",
    dia: "Quarta",
    horario: "18:00",
    alunos: [
      { nome: "Carlos Lima", status: "Pago" },
    ],
  },
];

const professores = [...new Set(turmas.map(t => t.professor))];

const turmasFiltradas = computed(() => {
  if (!filtroProfessor.value) return turmas;
  return turmas.filter(t => t.professor === filtroProfessor.value);
});

function selecionarTurma(turma) {
  turmaSelecionada.value = turma;
  loading.value = false;
}

function gerarIdTurma(t) {
  return `${t.professor}-${t.dia}-${t.horario}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/:/g, "");
}

function entrarTurma() {
  if (!turmaSelecionada.value || loading.value) return;

  const id = gerarIdTurma(turmaSelecionada.value);

  loading.value = true;
  navigateTo(`/turmas/${id}`);
}

function logout() {
  localStorage.removeItem("auth");
  navigateTo("/login");
}

function goDashboard() {
  navigateTo("/dashboard");
}

onMounted(() => {
  if (process.client) {
    const isLogged = localStorage.getItem("auth");
    if (!isLogged) navigateTo("/login");
  }
});
</script>

<style>
.dashboard {
  display: flex;
}

/* SIDEBAR */
.sidebar {
  width: 220px;
  padding: 25px 20px;
  background: white;
  height: 100vh;
  border-right: 1px solid #eee;
}

.logo {
  color: #c62828;
  margin-bottom: 30px;
}

.sidebar p {
  margin: 12px 0;
  cursor: pointer;
  color: #555;
  transition: 0.2s;
}

.sidebar p:hover {
  color: #c62828;
}

.sidebar .active {
  color: #c62828;
  font-weight: bold;
}

/* MAIN */
.main {
  flex: 1;
  padding: 30px 40px;
  background: #f4f6f9;
}

/* HEADER */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.back {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.select {
  margin-bottom: 20px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.turma-card {
  background: white;
  padding: 20px;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: 0.25s;
}

.turma-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.badge {
  margin-top: 10px;
  font-weight: bold;
  color: #c62828;
}


.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: flex-end;
}

.panel {
  width: 380px;
  background: white;
  padding: 25px;
}

/* ALUNO */
.aluno {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.status {
  padding: 5px 10px;
  border-radius: 8px;
  color: white;
}

.pago {
  background: #2ecc71;
}

.pendente {
  background: #e74c3c;
}

.enter {
  width: 100%;
  margin-top: 20px;
  background: #d32f2f;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
}

.close {
  width: 100%;
  margin-top: 10px;
}
</style>