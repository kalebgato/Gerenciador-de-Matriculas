<template>
  <div class="page">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p @click="goDashboard">Dashboard</p>
        <p @click="goTurmas">Turmas</p>
        <p class="active">Alunos</p>
        <p @click="goMatriculas">Matrículas</p>
        <p @click="logout">Logout</p>
      </nav>
    </aside>

    <main class="main">
      <button class="back" @click="voltar">
        ← Voltar para Alunos
      </button>

      <div class="card">
        <h1>Novo aluno</h1>

        <form @submit.prevent="criarAluno">
          <label for="nome">Nome completo</label>
          <input
            id="nome"
            v-model="nome"
            class="select"
            type="text"
            placeholder="Nome do aluno"
            required
          />

          <label for="cpf">CPF</label>
          <input
            id="cpf"
            v-model="cpf"
            class="select"
            type="text"
            placeholder="000.000.000-00"
            maxlength="14"
            required
            @input="cpf = formatarCpf(cpf)"
          />

          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            class="select"
            type="email"
            placeholder="email@exemplo.com"
          />

          <label for="telefone">Telefone</label>
          <input
            id="telefone"
            v-model="telefone"
            class="select"
            type="text"
            placeholder="(00) 00000-0000"
            maxlength="15"
            @input="telefone = formatarTelefone(telefone)"
          />

          <label for="dn">Data de nascimento</label>
          <input id="dn" v-model="dn" class="select" type="date" />

          <label for="responsavelNome">Nome do responsável (opcional)</label>
          <input
            id="responsavelNome"
            v-model="responsavelNome"
            class="select"
            type="text"
            placeholder="Nome do responsável"
          />

          <label for="responsavelTelefone">Telefone do responsável (opcional)</label>
          <input
            id="responsavelTelefone"
            v-model="responsavelTelefone"
            class="select"
            type="text"
            placeholder="(00) 00000-0000"
            maxlength="15"
            @input="responsavelTelefone = formatarTelefone(responsavelTelefone)"
          />

          <p v-if="mensagem" :class="['message', sucesso ? 'success' : 'error']">
            {{ mensagem }}
          </p>

          <button type="submit" class="submit" :disabled="loading">
            {{ loading ? "Cadastrando..." : "Cadastrar aluno" }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

useHead({ title: "Novo Aluno" })

const api = useApiClient()

const nome = ref("")

function formatarTelefone(valor: string): string {
  const digits = valor.replace(/\D/g, "").slice(0, 11)
  let out = ""
  if (digits.length > 0) out = "(" + digits.slice(0, 2)
  if (digits.length >= 2) out += ") "
  if (digits.length > 2) {
    const rest = digits.slice(2)
    if (rest.length <= 4) {
      out += rest
    } else if (rest.length <= 8) {
      out += rest.slice(0, rest.length - 4) + "-" + rest.slice(-4)
    } else {
      out += rest.slice(0, 5) + "-" + rest.slice(5)
    }
  }
  return out
}

function formatarCpf(valor: string): string {
  const digits = valor.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return digits.replace(/(\d{3})(\d+)/, "$1.$2")
  if (digits.length <= 9) return digits.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3")
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4")
}
const cpf = ref("")
const email = ref("")
const telefone = ref("")
const dn = ref("")
const responsavelNome = ref("")
const responsavelTelefone = ref("")

const loading = ref(false)
const mensagem = ref("")
const sucesso = ref(false)

function extrairMensagemErro(err: any, padrao: string) {
  return (
    err?.data?.message ||
    err?.data?.statusMessage ||
    err?.response?._data?.message ||
    err?.response?._data?.statusMessage ||
    padrao
  )
}

async function criarAluno() {
  mensagem.value = ""
  sucesso.value = false

  if (!nome.value.trim() || !cpf.value.trim()) {
    mensagem.value = "Preencha nome e CPF."
    return
  }

  loading.value = true

  try {
    await api.post("/api/students", {
      name: nome.value.trim(),
      cpf: cpf.value.trim(),
      email: email.value.trim() || undefined,
      phone: telefone.value.trim() || undefined,
      dn: dn.value ? new Date(dn.value).toISOString() : undefined,
      responsable_name: responsavelNome.value.trim() || undefined,
      responsable_phone: responsavelTelefone.value.trim() || undefined,
    })

    sucesso.value = true
    mensagem.value = "Aluno cadastrado com sucesso."

    setTimeout(() => {
      navigateTo("/alunos")
    }, 700)
  } catch (err: any) {
    mensagem.value = extrairMensagemErro(err, "Não foi possível cadastrar o aluno.")
  } finally {
    loading.value = false
  }
}

function voltar() {
  navigateTo("/alunos")
}

function goDashboard() {
  navigateTo("/dashboard")
}

function goTurmas() {
  navigateTo("/turmas")
}

function goMatriculas() {
  navigateTo("/matriculas")
}

function logout() {
  localStorage.removeItem("auth")
  navigateTo("/login")
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  min-height: 100vh;
  background: #f7f7f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.page > * {
  width: auto;
  max-width: none;
}

.sidebar {
  width: 230px;
  background: #ffffff;
  padding: 24px 16px;
  border-right: 1px solid #eee;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);
}

.logo {
  color: #c62828;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-bottom: 28px;
  font-size: 24px;
}

.sidebar nav p {
  margin: 4px 0;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  color: #444;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.15s, color 0.15s;
}

.sidebar nav p:hover {
  background: #fdecea;
  color: #c62828;
}

.sidebar nav .active {
  background: #c62828;
  color: #ffffff !important;
  font-weight: 700;
}

.main {
  flex: 1;
  padding: 32px 40px;
}

.back {
  background: #ffffff;
  color: #c62828;
  border: 2px solid #c62828;
  padding: 8px 18px;
  border-radius: 8px;
  margin-bottom: 24px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  transition: background 0.15s, color 0.15s;
}

.back:hover {
  background: #c62828;
  color: #ffffff;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border-left: 5px solid #c62828;
  max-width: 700px;
}

.card h1 {
  color: #222;
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 25px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 7px;
  font-weight: 700;
  color: #333;
  font-size: 15px;
}

.select {
  padding: 11px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  background: white;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  font-family: inherit;
}

.select:focus {
  outline: none;
  border-color: #c62828;
}

.submit {
  background: #c62828;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: 700;
  font-size: 15px;
  transition: background 0.15s;
}

.submit:hover:not(:disabled) {
  background: #a91f1f;
}

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  padding: 10px;
  border-radius: 8px;
  margin: 0 0 10px;
  font-weight: 600;
}

.success {
  background: #dff5e9;
  color: #218838;
}

.error {
  background: #fde2e2;
  color: #c62828;
}
</style>