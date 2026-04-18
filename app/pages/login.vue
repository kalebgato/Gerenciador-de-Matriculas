<template>
  <div class="container">
    <form @submit.prevent="handleLogin" class="card">
      
      <h1 class="title">PRODAGIN</h1>
      <p class="subtitle">Login</p>

      <label class="label">E-mail</label>
      <input
        v-model="email"
        type="email"
        placeholder="Digite seu e-mail"
        class="input"
      />

      <label class="label">Senha</label>
      <input
        v-model="senha"
        type="password"
        placeholder="Digite sua senha"
        class="input"
      />

      <button class="button" :disabled="loading">
        {{ loading ? "Entrando..." : "Entrar" }}
      </button>

      <p class="link">Esqueceu sua senha?</p>
    </form>
  </div>
</template>

<script setup lang='ts'>
import { ref } from "vue";

const email = ref("");
const senha = ref("");
const loading = ref(false);
const { authEnabled, login } = useAuth();

async function handleLogin() {
  if (!authEnabled.value) {
    navigateTo("/dashboard");
    return;
  }

  try {
    loading.value = true;
    await login(email.value, senha.value);
    navigateTo("/dashboard");
  } catch (error) {
    const message = (error as any)?.data?.statusMessage ?? "Credenciais invalidas";
    alert(message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 320px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.title {
  text-align: center;
  color: #c62828;
  margin-bottom: 10px;
}

.button {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #d32f2f;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.button:hover {
  background: #b71c1c;
}

</style>
