<template>
  <div class="error-page">
    <div class="card">
      <h1 class="logo">PRODAGIN</h1>
      <p class="code">{{ error.statusCode }}</p>
      <h2>{{ titulo }}</h2>
      <p class="message">{{ mensagem }}</p>
      <button class="button" @click="voltar">Voltar ao início</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage?: string;
    message?: string;
  };
}>();

const titulo = computed(() => {
  if (props.error.statusCode === 404) return "Página não encontrada";
  if (props.error.statusCode >= 500) return "Erro no servidor";
  return "Algo deu errado";
});

const mensagem = computed(() => {
  if (props.error.statusCode === 404) {
    return "A página que você tentou acessar não existe ou foi movida.";
  }
  return (
    props.error.statusMessage ||
    props.error.message ||
    "Não foi possível completar sua solicitação. Tente novamente em instantes."
  );
});

function voltar() {
  clearError({ redirect: "/dashboard" });
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 20px;
}

.card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-top: 5px solid #c62828;
}

.logo {
  color: #c62828;
  font-weight: 800;
  font-size: 22px;
  letter-spacing: 0.5px;
  margin: 0 0 20px;
}

.code {
  font-size: 48px;
  font-weight: 800;
  color: #c62828;
  margin: 0;
}

h2 {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin: 8px 0 12px;
}

.message {
  color: #666;
  font-size: 15px;
  margin: 0 0 24px;
}

.button {
  background: #c62828;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  transition: background 0.15s;
}

.button:hover {
  background: #a91f1f;
}
</style>