<template>
  <div class="page">
    <aside class="sidebar">
      <h2 class="logo">PRODAGIN</h2>

      <nav>
        <p @click="goDashboard">Dashboard</p>
        <p @click="goTurmas">Turmas</p>
        <p @click="goAlunos">Alunos</p>
        <p class="active">Matrículas</p>
        <p @click="logout">Logout</p>
      </nav>
    </aside>

    <main class="main">
      <button class="back" @click="voltar">
        ← Voltar para Matrículas
      </button>

      <div class="card">
        <h1>Nova matrícula</h1>

        <div class="mode-toggle">
          <button
            type="button"
            :class="['mode-button', modo === 'existente' ? 'mode-active' : '']"
            @click="selecionarModo('existente')"
          >
            Aluno já cadastrado
          </button>
          <button
            type="button"
            :class="['mode-button', modo === 'novo' ? 'mode-active' : '']"
            @click="selecionarModo('novo')"
          >
            Cadastrar novo aluno
          </button>
        </div>

        <form @submit.prevent="criarMatricula">
          <template v-if="modo === 'existente'">
            <label for="aluno">Aluno</label>

            <select
              id="aluno"
              v-model="studentId"
              class="select"
              name="aluno"
              required
            >
              <option value="">Selecione um aluno</option>

              <option
                v-for="aluno in alunos"
                :key="aluno.id"
                :value="aluno.id"
              >
                {{ aluno.name || aluno.nome }}
              </option>
            </select>

            <div v-if="studentId" class="info-panel">
              <p v-if="carregandoInfo">Verificando matrículas deste aluno...</p>

              <template v-else>
                <p v-if="matriculasDoAluno.length === 0" class="info-ok">
                  Este aluno não possui matrículas em nenhuma turma.
                </p>

                <div v-else class="info-warning">
                  <p><strong>Este aluno já está matriculado em:</strong></p>
                  <ul>
                    <li v-for="m in matriculasDoAluno" :key="m.id">
                      {{ m.turma }} — Professor: {{ m.professor }}
                    </li>
                  </ul>
                </div>
              </template>
            </div>
          </template>

          <template v-else>
            <label for="novoNome">Nome completo</label>
            <input
              id="novoNome"
              v-model="novoNome"
              class="select"
              type="text"
              placeholder="Nome do aluno"
              required
            />

            <label for="novoCpf">CPF</label>
            <input
              id="novoCpf"
              v-model="novoCpf"
              class="select"
              type="text"
              placeholder="000.000.000-00"
              maxlength="14"
              required
              @input="novoCpf = formatarCpf(novoCpf)"
            />

            <label for="novoEmail">Email</label>
            <input
              id="novoEmail"
              v-model="novoEmail"
              class="select"
              type="email"
              placeholder="email@exemplo.com"
            />

            <label for="novoTelefone">Telefone</label>
            <input
              id="novoTelefone"
              v-model="novoTelefone"
              class="select"
              type="text"
              placeholder="(00) 00000-0000"
              maxlength="15"
              @input="novoTelefone = formatarTelefone(novoTelefone)"
            />

            <label for="novoDn">Data de nascimento</label>
            <input
              id="novoDn"
              v-model="novoDn"
              class="select"
              type="date"
            />

            <label for="novoResponsavelNome">Nome do responsável (opcional)</label>
            <input
              id="novoResponsavelNome"
              v-model="novoResponsavelNome"
              class="select"
              type="text"
              placeholder="Nome do responsável"
            />

            <label for="novoResponsavelTelefone">Telefone do responsável (opcional)</label>
            <input
              id="novoResponsavelTelefone"
              v-model="novoResponsavelTelefone"
              class="select"
              type="text"
              placeholder="(00) 00000-0000"
              maxlength="15"
              @input="novoResponsavelTelefone = formatarTelefone(novoResponsavelTelefone)"
            />
          </template>

          <label for="turma">Turma</label>

          <select
            id="turma"
            v-model="classId"
            class="select"
            name="turma"
            required
          >
            <option value="">Selecione uma turma</option>

            <option
              v-for="turma in turmas"
              :key="turma.id"
              :value="turma.id"
            >
              {{ turma.title || turma.name || turma.nome }}
              {{ turma.horary || turma.schedule ? ` - ${turma.horary || turma.schedule}` : "" }}
            </option>
          </select>

          <p
            v-if="mensagem"
            :class="['message', sucesso ? 'success' : 'error']"
          >
            {{ mensagem }}
          </p>

          <button
            type="submit"
            class="submit"
            :disabled="loading"
          >
            {{ loading ? "Matriculando..." : "Matricular aluno" }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

useHead({ title: "Nova Matrícula" })

interface Student {
  id: string
  name?: string
  nome?: string
}

interface Team {
  id: string
  title?: string
  name?: string
  nome?: string
  team_leader_id?: string
  horary?: string
  schedule?: string
  days_of_week?: string
}

interface Course {
  id: string
  name?: string
  teams?: Team[]
}

interface Enrollment {
  id?: string
  student_id?: string
  studentId?: string
  team_id?: string
  teamId?: string
  team?: Team
}

const api = useApiClient()

const alunos = ref<Student[]>([])
const turmas = ref<Team[]>([])

const modo = ref<"existente" | "novo">("existente")

const studentId = ref("")
const classId = ref("")

const novoNome = ref("")

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
const novoCpf = ref("")
const novoEmail = ref("")
const novoTelefone = ref("")
const novoDn = ref("")
const novoResponsavelNome = ref("")
const novoResponsavelTelefone = ref("")

const matriculasDoAluno = ref<{ id: string; turma: string; professor: string }[]>([])
const carregandoInfo = ref(false)

const loading = ref(false)
const mensagem = ref("")
const sucesso = ref(false)

async function carregarDados() {
  const [studentsResponse, coursesResponse] = await Promise.all([
    api.get("/api/students"),
    api.get("/api/courses")
  ]) as [any, any]

  alunos.value = Array.isArray(studentsResponse)
    ? studentsResponse
    : studentsResponse?.data || studentsResponse?.students || []

  const cursos: Course[] = Array.isArray(coursesResponse)
    ? coursesResponse
    : coursesResponse?.data || coursesResponse?.courses || []

  turmas.value = cursos.flatMap(curso => curso.teams || [])
}

function selecionarModo(novoModo: "existente" | "novo") {
  modo.value = novoModo
  mensagem.value = ""
  studentId.value = ""
  matriculasDoAluno.value = []
}

watch(studentId, async (novoId) => {
  matriculasDoAluno.value = []

  if (!novoId || modo.value !== "existente") {
    return
  }

  carregandoInfo.value = true

  try {
    const response: any = await api.get(`/api/enrollments/student/${encodeURIComponent(novoId)}`)
    const lista: Enrollment[] = Array.isArray(response)
      ? response
      : response?.data || response?.enrollments || []

    matriculasDoAluno.value = lista.map((e) => ({
      id: e.id || "",
      turma: e.team?.title || e.team?.name || e.team?.nome || "Turma não identificada",
      professor: e.team?.team_leader_id || "Não informado",
    }))
  } catch {
    matriculasDoAluno.value = []
  } finally {
    carregandoInfo.value = false
  }
})

function extrairMensagemErro(err: any, padrao: string) {
  return (
    err?.data?.message ||
    err?.data?.statusMessage ||
    err?.response?._data?.message ||
    err?.response?._data?.statusMessage ||
    padrao
  )
}

async function criarMatricula() {
  mensagem.value = ""
  sucesso.value = false

  if (!classId.value) {
    mensagem.value = "Selecione uma turma."
    return
  }

  if (modo.value === "existente" && !studentId.value) {
    mensagem.value = "Selecione um aluno."
    return
  }

  if (modo.value === "novo") {
    if (!novoNome.value.trim() || !novoCpf.value.trim()) {
      mensagem.value = "Preencha nome e CPF do novo aluno."
      return
    }
  }

  const turmaSelecionada = turmas.value.find(
    turma => String(turma.id) === String(classId.value)
  )

  if (!turmaSelecionada) {
    mensagem.value = "Turma inválida."
    return
  }

  loading.value = true

  try {
    let finalStudentId = studentId.value

    if (modo.value === "novo") {
      const novoAluno = await api.post<Student>("/api/students", {
        name: novoNome.value.trim(),
        cpf: novoCpf.value.trim(),
        email: novoEmail.value.trim() || undefined,
        phone: novoTelefone.value.trim() || undefined,
        dn: novoDn.value ? new Date(novoDn.value).toISOString() : undefined,
        responsable_name: novoResponsavelNome.value.trim() || undefined,
        responsable_phone: novoResponsavelTelefone.value.trim() || undefined,
      })

      finalStudentId = novoAluno.id
      alunos.value.push(novoAluno)
    }

    await api.post<Enrollment>("/api/enrollments", {
      student_id: finalStudentId,
      team_id: classId.value
    })

    sucesso.value = true
    mensagem.value = "Matrícula criada com sucesso."

    setTimeout(() => {
      navigateTo("/matriculas")
    }, 700)
  } catch (err: any) {
    mensagem.value = extrairMensagemErro(err, "Não foi possível criar a matrícula.")
  } finally {
    loading.value = false
  }
}

function voltar() {
  navigateTo("/matriculas")
}

function goDashboard() {
  navigateTo("/dashboard")
}

function goTurmas() {
  navigateTo("/turmas")
}

function goAlunos() {
  navigateTo("/alunos")
}

function logout() {
  localStorage.removeItem("auth")
  navigateTo("/login")
}

await carregarDados()
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
  flex-shrink: 0;
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
  min-width: 0;
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
  box-sizing: border-box;
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
  margin-bottom: 20px;
}

.mode-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
}

.mode-button {
  flex: 1;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #555;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.mode-button:hover {
  border-color: #c62828;
  color: #c62828;
}

.mode-active {
  background: #c62828;
  border-color: #c62828;
  color: #ffffff;
}

.mode-active:hover {
  color: #ffffff;
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

.select,
input.select {
  box-sizing: border-box;
  width: 100%;
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

select.select {
  cursor: pointer;
}

.select:focus {
  outline: none;
  border-color: #c62828;
}

.info-panel {
  margin: -6px 0 20px;
  padding: 14px;
  border-radius: 8px;
  font-size: 14px;
}

.info-ok {
  background: #dff5e9;
  color: #218838;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  margin: 0;
}

.info-warning {
  background: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 8px;
}

.info-warning p {
  margin: 0 0 6px;
  font-weight: 700;
}

.info-warning ul {
  margin: 0;
  padding-left: 20px;
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

@media (max-width: 800px) {
  .page {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    box-shadow: none;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding: 16px;
  }

  .logo {
    margin-bottom: 12px;
    font-size: 20px;
  }

  .sidebar nav {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .sidebar nav p {
    margin: 0;
    font-size: 14px;
    padding: 8px 12px;
  }

  .main {
    padding: 20px;
  }

  .card {
    max-width: 100%;
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .main {
    padding: 14px;
  }

  .card {
    padding: 18px;
  }

  .card h1 {
    font-size: 22px;
  }

  .mode-toggle {
    flex-direction: column;
  }
}
</style>