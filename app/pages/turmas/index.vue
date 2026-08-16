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
      <header class="topbar">
        <h1>Turmas</h1>
        <button class="back" @click="goDashboard">Voltar</button>
      </header>

      <section class="cards">
        <div
          class="turma-card"
          v-for="turma in turmasFiltradas"
          :key="turma.id"
          @click="selecionarTurma(turma)"
        >
          <h3>{{ turma.nome }}</h3>
          <p><strong>Horário:</strong> {{ turma.dia }}</p>
          <p><strong>Turma ativa</strong></p>
        </div>
      </section>
    </main>

    <div v-if="turmaSelecionada" class="overlay">
      <div class="panel">
        <h2>{{ turmaSelecionada.nome }}</h2>
        <p><strong>Horário:</strong> {{ turmaSelecionada.dia }}</p>

        <hr />

        <h3>Detalhes da turma</h3>

        <div class="aluno">
          <span>Visualizar detalhes da turma</span>
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

const turmaSelecionada = ref(null);
const loading = ref(false);
const turmas = ref([]);

const turmasFiltradas = computed(() => turmas.value);

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

  navigateTo(`/turmas/${turmaSelecionada.value.id}`);
}

async function carregarTurmas() {
  try {
    const cursos = await $fetch("/api/courses");

    const listaTurmas = [];

    cursos.forEach((curso) => {
      curso.teams.forEach((team) => {
        listaTurmas.push({
          id: team.id,
          nome: team.name,
          dia: team.schedule || "Sem horário",
        });
      });
    });

    turmas.value = listaTurmas;

  } catch (error) {
    console.error("Erro ao carregar turmas:", error);
  }
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

onMounted(async () => {
  const isLogged = localStorage.getItem("auth");

  if (!isLogged) {
    navigateTo("/login");
    return;
  }

  await carregarTurmas();
});
</script>

<style>
.dashboard {
  display: flex;
  min-height: 100vh;
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

.back {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.turma-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.turma-card:hover {
  transform: translateY(-4px);
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
  margin: 20px 0;
}

.enter {
  width: 100%;
  margin-top: 20px;
  background: #d32f2f;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}

.close {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
}
</style>