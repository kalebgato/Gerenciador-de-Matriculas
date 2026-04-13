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

    <!-- MAIN -->
    <main class="main">

      <header class="topbar">
        <h1>Turmas</h1>
        <button class="back" @click="goDashboard">Voltar</button>
      </header>

      <!-- FILTRO -->
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
          <p>{{ turma.dia }} - {{ turma.horario }}</p>
          <p><strong>Professor:</strong> {{ turma.professor }}</p>
          <p><strong>{{ turma.alunos.length }} alunos</strong></p>
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

        <button class="close" @click="fecharPainel">
          Fechar
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const filtroProfessor = ref("");
const turmaSelecionada = ref(null);
const loading = ref(false);


const turmas = [
  {
    id: "Jean-Sabado-1400",
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
    id: "Maria-Quarta-1800",
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

function fecharPainel() {
  turmaSelecionada.value = null;
}


function entrarTurma() {
  if (!turmaSelecionada.value || loading.value) return;

  loading.value = true;

  const id = turmaSelecionada.value.id;

  turmaSelecionada.value = null;

  navigateTo(`/turmas/${id}`);
}


onBeforeRouteLeave(() => {
  turmaSelecionada.value = null;
});

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

.sidebar {
  width: 200px;
  padding: 20px;
  background: #f5f5f5;
}

.main {
  flex: 1;
  padding: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.turma-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.turma-card:hover {
  transform: scale(1.02);
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: flex-end;
}

.panel {
  width: 350px;
  background: white;
  padding: 20px;
}

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
  background: #34c38f;
}

.pendente {
  background: #f46a6a;
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

.enter:disabled {
  opacity: 0.7;
}

.close {
  width: 100%;
  margin-top: 10px;
}
</style>