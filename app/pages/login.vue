<template>
  <div class="page">
    <form @submit.prevent="handleLogin" class="card">
      <h1 class="logo">PRODAGIN</h1>
      <p class="subtitle">Acesse sua conta</p>

      <label class="label" for="email">E-mail</label>
      <input
        id="email"
        v-model="email"
        type="email"
        placeholder="Digite seu e-mail"
        class="input"
        required
      />

      <label class="label" for="senha">Senha</label>
      <input
        id="senha"
        v-model="senha"
        type="password"
        placeholder="Digite sua senha"
        class="input"
        required
      />

      <p v-if="mensagemErro" class="message error">
        {{ mensagemErro }}
      </p>

      <button class="button" type="submit" :disabled="loading">
        {{ loading ? "Entrando..." : "Entrar" }}
      </button>

      <p class="link">Esqueceu sua senha?</p>
    </form>
  </div>
</template>

<script setup lang='ts'>
import { ref } from "vue";

useHead({ title: "Login" });

const email = ref("");
const senha = ref("");
const loading = ref(false);
const mensagemErro = ref("");
const { authEnabled, login } = useAuth();

async function handleLogin() {
  mensagemErro.value = "";

  if (!authEnabled.value) {
    navigateTo("/dashboard");
    return;
  }

  try {
    loading.value = true;
    await login(email.value, senha.value);
    navigateTo("/dashboard");
  } catch (error) {
    mensagemErro.value = (error as any)?.data?.statusMessage ?? "Credenciais inválidas";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f7f7f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 20px;
}

.card {
  box-sizing: border-box;
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-top: 5px solid #c62828;
  display: flex;
  flex-direction: column;
}

.logo {
  text-align: center;
  color: #c62828;
  font-weight: 800;
  font-size: 26px;
  letter-spacing: 0.5px;
  margin: 0 0 4px;
}

.subtitle {
  text-align: center;
  color: #888;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 24px;
}

.label {
  font-weight: 700;
  color: #333;
  font-size: 14px;
  margin-bottom: 6px;
}

.input {
  box-sizing: border-box;
  width: 100%;
  padding: 11px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 18px;
  font-size: 15px;
  font-family: inherit;
  color: #333;
}

.input:focus {
  outline: none;
  border-color: #c62828;
}

.message {
  padding: 10px;
  border-radius: 8px;
  margin: -6px 0 16px;
  font-weight: 600;
  font-size: 14px;
}

.error {
  background: #fde2e2;
  color: #c62828;
}

.button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #c62828;
  color: white;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.15s;
}

.button:hover:not(:disabled) {
  background: #a91f1f;
}

.button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.link {
  text-align: center;
  color: #c62828;
  font-size: 13px;
  font-weight: 600;
  margin: 16px 0 0;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 380px) {
  .page {
    padding: 12px;
  }

  .card {
    padding: 28px 22px;
  }

  .logo {
    font-size: 22px;
  }
}
</style>