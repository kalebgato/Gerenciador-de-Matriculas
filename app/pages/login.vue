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

      <button class="button">Entrar</button>

      <p class="link">Esqueceu sua senha?</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const senha = ref("");

function handleLogin() {
  if (email.value === "admin@admin.com" && senha.value === "123") {
    localStorage.setItem("auth", "true");
    navigateTo("/dashboard");
  } else {
    alert("Credenciais inválidas");
  }
}
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f4f4f4;
}

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

.subtitle {
  text-align: center;
  margin-bottom: 20px;
}

.label {
  font-size: 14px;
  margin-top: 10px;
  display: block;
}

.input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #ccc;
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

.link {
  text-align: center;
  margin-top: 15px;
  font-size: 12px;
  color: #777;
}
</style>