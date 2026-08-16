<template>
  <div class="page">
    <h1 class="title">Gestão da Turma</h1>

    <button class="back" @click="voltar">← Voltar</button>

    <div v-if="loading" class="card">
      <h2 class="text-dark">Carregando turma...</h2>
    </div>

    <div v-else-if="turma">
      <div class="card">
        <h2 class="text-dark">{{ turma.nome }}</h2>
        <p class="text-dark"><strong>Horário:</strong> {{ turma.dia }}</p>
        <p class="text-dark"><strong>Curso:</strong> {{ turma.curso }}</p>
        <p class="text-dark"><strong>Status:</strong> Turma ativa</p>
      </div>

      <div class="card">
        <h3 class="text-dark">Alunos da turma</h3>

        <div v-if="turma.alunos.length === 0" class="text-dark">
          Nenhum aluno matriculado nesta turma.
        </div>

        <table v-else class="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Status Financeiro</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="aluno in turma.alunos" :key="aluno.id">
              <td>{{ aluno.nome }}</td>
              <td>{{ aluno.email }}</td>
              <td>{{ aluno.telefone }}</td>
              <td>
                <span
                  :class="[
                    'status',
                    aluno.status === 'Pago' ? 'pago' : 'pendente'
                  ]"
                >
                  {{ aluno.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="card">
      <h2 class="text-dark">Turma não encontrada</h2>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";

const route = useRoute();

const turma = ref(null);
const loading = ref(true);

async function carregarTurma() {
  try {
    const id = String(route.params.id);

    const cursos = await $fetch("/api/courses");
    const enrollments = await $fetch("/api/enrollments");

    let turmaEncontrada = null;

    for (const curso of cursos) {
      const team = curso.teams.find((t) => String(t.id) === id);

      if (team) {
        const alunosDaTurma = enrollments
          .filter((e) => String(e.teamId) === id)
          .map((e) => ({
            id: e.student.id,
            nome: e.student.name,
            email: e.student.email,
            telefone: e.student.phone,
            status:
              e.charges?.some((c) => c.status === "PENDING")
                ? "Pendente"
                : "Pago",
          }));

        turmaEncontrada = {
          id: team.id,
          nome: team.name,
          dia: team.schedule || "Sem horário",
          curso: curso.name,
          alunos: alunosDaTurma,
        };

        break;
      }
    }

    turma.value = turmaEncontrada;
  } catch (error) {
    console.error("Erro ao carregar turma:", error);
    turma.value = null;
  } finally {
    loading.value = false;
  }
}

function voltar() {
  navigateTo("/turmas");
}

onMounted(() => {
  carregarTurma();
});
</script>

<style>
.page {
  padding: 30px;
  background: #f4f4f4;
  min-height: 100vh;
}

.title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #c62828;
}

.back {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.text-dark {
  color: #222 !important;
}

.table {
  width: 100%;
  margin-top: 15px;
  border-collapse: collapse;
}

.table th {
  background: #f0f0f0;
  padding: 12px;
  text-align: left;
  color: #222 !important;
}

.table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  color: #222 !important;
}

.status {
  padding: 6px 12px;
  border-radius: 999px;
  color: white !important;
  font-size: 12px;
  font-weight: bold;
}

.pago {
  background: #34c38f;
}

.pendente {
  background: #f46a6a;
}
</style>