<template>
  <div class="page">

    <h1 class="title">Gestão da Turma</h1>

    <button class="back" @click="voltar">← Voltar</button>

    <div v-if="turma">

      <!-- INFO -->
      <div class="card">
        <h2>{{ turma.nome }}</h2>
        <p>{{ turma.dia }} - {{ turma.horario }}</p>
        <p><strong>Professor:</strong> {{ turma.professor }}</p>
      </div>

      <!-- TABELA -->
      <div class="card">
        <h3>Alunos</h3>

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
            <tr v-for="(aluno, i) in turma.alunos" :key="i">
              <td>{{ aluno.nome }}</td>
              <td>{{ aluno.email }}</td>
              <td>{{ aluno.telefone }}</td>
              <td>
                <span
                  :class="['status', aluno.status === 'Pago' ? 'pago' : 'pendente']"
                >
                  {{ aluno.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div v-else>
      <h2>Turma não encontrada</h2>
    </div>

  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();


const turmas = [
  {
    id: "Jean-Sabado-1400",
    nome: "Tecido Acrobático",
    professor: "Jean",
    dia: "Sábado",
    horario: "14:00",
    alunos: [
      {
        nome: "Ana Souza",
        email: "ana.souza@email.com",
        telefone: "(92) 99123-4567",
        status: "Pago",
      },
      {
        nome: "Camila Santos",
        email: "camila.santos@email.com",
        telefone: "(92) 99234-5678",
        status: "Pendente",
      },
      {
        nome: "Carlos Lima",
        email: "carlos.lima@email.com",
        telefone: "(92) 99345-6789",
        status: "Pago",
      },
      {
        nome: "Juliana Oliveira",
        email: "juliana.oliveira@email.com",
        telefone: "(92) 99456-7890",
        status: "Pago",
      },
      {
        nome: "Marcos Ferreira",
        email: "marcos.ferreira@email.com",
        telefone: "(92) 99567-8901",
        status: "Pendente",
      },
      {
        nome: "Fernanda Costa",
        email: "fernanda.costa@email.com",
        telefone: "(92) 99678-9012",
        status: "Pago",
      },
      {
        nome: "Rafael Almeida",
        email: "rafael.almeida@email.com",
        telefone: "(92) 99789-0123",
        status: "Pendente",
      },
      {
        nome: "Patrícia Gomes",
        email: "patricia.gomes@email.com",
        telefone: "(92) 99890-1234",
        status: "Pago",
      },
      {
        nome: "Lucas Martins",
        email: "lucas.martins@email.com",
        telefone: "(92) 99901-2345",
        status: "Pago",
      },
      {
        nome: "Beatriz Rocha",
        email: "beatriz.rocha@email.com",
        telefone: "(92) 99012-3456",
        status: "Pendente",
      },
    ],
  },
  {
    id: "Maria-Quarta-1800",
    nome: "Tecido Acrobático",
    professor: "Maria",
    dia: "Quarta",
    horario: "18:00",
    alunos: [
      {
        nome: "Carlos Lima",
        email: "carlos@email.com",
        telefone: "(92) 99999-3333",
        status: "Pago",
      },
    ],
  },
];


const turma = computed(() => {
  const id = route.params.id;
  const encontrada = turmas.find(t => t.id === id);

  console.log("ID:", id);
  console.log("Turma encontrada:", encontrada);

  return encontrada;
});

/* VOLTAR */
function voltar() {
  navigateTo("/turmas");
}
</script>

<style>
.page {
  padding: 30px;
  background: #f4f4f4;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center; /* 🔥 centraliza tudo */
}

/* CONTEÚDO CENTRAL */
.page > * {
  width: 100%;
  max-width: 1100px;
}

/* TÍTULO */
.title {
  font-size: 28px;
  margin-bottom: 10px;
  color: #c62828;
}

/* BOTÃO */
.back {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;

  width: fit-content; /* 🔥 resolve o botão gigante */
}

/* CARD */
.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  width: 100%; /* 🔥 força ocupar tudo */
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* INFO */
.card h2 {
  margin-bottom: 5px;
}

.card p {
  margin: 4px 0;
  color: #555;
}

/* TABELA */
.table {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;
  table-layout: fixed; /* 🔥 resolve quebra */
}

.table th {
  background: #eee;
  padding: 12px;
  text-align: left;
  color: #333;
}

.table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  color: #333;
  word-break: break-word; /* 🔥 evita quebrar layout */
}

/* STATUS */
.status {
  padding: 6px 12px;
  border-radius: 999px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  display: inline-block;
}

.pago {
  background: #34c38f;
}

.pendente {
  background: #f46a6a;
}
</style>