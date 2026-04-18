# Padroes e Snippets para P0

## Padrão 1: Pagina que carrega lista com filtro

Usar em: turmas/index.vue (filtrar por curso)

```vue
<template>
  <div class="page">
    <h1>Turmas</h1>

    <!-- Filtro -->
    <select v-model="selectedCourseId" class="select">
      <option :value="null">Todos os cursos</option>
      <option v-for="course in courses" :key="course.id" :value="course.id">
        {{ course.title }}
      </option>
    </select>

    <!-- Estados -->
    <div v-if="pending" class="loading">Carregando...</div>
    <div v-else-if="error" class="error">{{ error.message }}</div>
    <div v-else-if="!teams || teams.length === 0" class="empty">
      Nenhuma turma encontrada
    </div>

    <!-- Lista -->
    <div v-else class="teams-grid">
      <div
        v-for="team in teams"
        :key="team.id"
        class="team-card"
        @click="navigateTo(`/turmas/${team.id}`)"
      >
        <h3>{{ team.title }}</h3>
        <p>{{ team.days_of_week }} - {{ team.horary }}</p>
        <p><strong>Curso:</strong> {{ team.course?.title }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Filtro reativo
const selectedCourseId = ref<string | null>(null);

// Composables
const { list: listCourses } = useCourses();
const { list: listTeams } = useTeams();

// Carrega lista de cursos
const { data: courses } = await useAsyncData("courses", () => listCourses());

// Carrega turmas com filtro reativo
const { data: teams, pending, error, refresh } = await useAsyncData(
  "teams",
  () => selectedCourseId.value
    ? listTeams(selectedCourseId.value)
    : listTeams(),
  { watch: [selectedCourseId] }
);
</script>

<style scoped>
.page {
  padding: 20px;
}

.select {
  margin-bottom: 20px;
  padding: 8px;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.team-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.team-card:hover {
  transform: scale(1.02);
}

.loading, .error, .empty {
  padding: 20px;
  text-align: center;
}

.error {
  color: #d32f2f;
}
</style>
```

---

## Padrão 2: Pagina que carrega detalhe por ID da rota

Usar em: turmas/[id].vue

```vue
<template>
  <div class="page">
    <!-- Estados -->
    <div v-if="pending" class="loading">Carregando...</div>
    <div v-else-if="error" class="error">{{ error.message }}</div>
    <div v-else-if="!team" class="empty">Turma não encontrada</div>

    <!-- Conteudo -->
    <div v-else>
      <h1>{{ team.title }}</h1>
      <p>{{ team.days_of_week }} - {{ team.horary }}</p>
      <p><strong>Curso:</strong> {{ team.course?.title }}</p>

      <!-- Tabela de alunos -->
      <h3>Alunos Matriculados</h3>
      <table v-if="students.length > 0" class="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.name }}</td>
            <td>{{ student.email }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty-table">Nenhum aluno matriculado</p>

      <button @click="voltar">Voltar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import type { Student } from "~/app/types/api";

const route = useRoute();
const teamId = route.params.id as string;

// Composables
const { getById: getTeam } = useTeams();
const { list: listEnrollments } = useEnrollments();

// Carrega turma
const { data: team, pending, error } = await useAsyncData(
  `team-${teamId}`,
  () => getTeam(teamId)
);

// Carrega matriculas
const { data: enrollments } = await useAsyncData(
  `enrollments-${teamId}`,
  () => listEnrollments()
);

// Filtra alunos da turma
const students = computed<Student[]>(() => {
  if (!enrollments.value) return [];
  return enrollments.value
    .filter(e => e.team_id === teamId)
    .map(e => e.student)
    .sort((a, b) => a.name.localeCompare(b.name));
});

const voltar = () => navigateTo("/turmas");
</script>

<style scoped>
.page { padding: 20px; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
.loading, .error, .empty, .empty-table { padding: 20px; text-align: center; }
.error { color: #d32f2f; }
</style>
```

---

## Padrão 3: Dashboard com multiplos dados paralelos

Usar em: dashboard.vue

```vue
<template>
  <div class="dashboard">
    <!-- Cards -->
    <section class="cards">
      <div class="card">
        <p>Total de Alunos</p>
        <h2 v-if="totalStudents">{{ totalStudents }}</h2>
        <h2 v-else>-</h2>
      </div>

      <div class="card">
        <p>Pagos</p>
        <h2 v-if="totalPaid">{{ totalPaid }}</h2>
        <h2 v-else>-</h2>
      </div>

      <div class="card">
        <p>Pendentes</p>
        <h2 v-if="totalPending">{{ totalPending }}</h2>
        <h2 v-else>-</h2>
      </div>

      <div class="card">
        <p>% Inadimplência</p>
        <h2 v-if="inadimplenciaPercent">{{ inadimplenciaPercent.toFixed(1) }}%</h2>
        <h2 v-else>-</h2>
      </div>
    </section>

    <!-- Tabela com estados -->
    <section class="table-section">
      <h3>Alunos Recentes</h3>
      <div v-if="enrollmentsPending" class="loading">Carregando...</div>
      <div v-else-if="enrollmentsError" class="error">
        Erro ao carregar alunos: {{ enrollmentsError.message }}
      </div>
      <table v-else-if="recentEnrollments.length > 0" class="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Turma</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in recentEnrollments" :key="e.id">
            <td>{{ e.student.name }}</td>
            <td>{{ e.team.title }}</td>
            <td>
              <span class="status" :class="statusClass(e.id)">
                {{ statusText(e.id) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">Sem alunos matriculados</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Enrollment } from "~/app/types/api";

// Composables
const { list: listStudents } = useStudents();
const { listLateCharges } = useBilling();
const { list: listEnrollments } = useEnrollments();

// Dados em paralelo
const { data: students } = await useAsyncData("students", () => listStudents());
const { data: lateCharges } = await useAsyncData("late-charges", () => listLateCharges());
const { data: enrollments, pending: enrollmentsPending, error: enrollmentsError } = await useAsyncData(
  "enrollments",
  () => listEnrollments()
);

// Calculos derivados
const totalStudents = computed(() => students.value?.length ?? 0);
const totalPending = computed(() => lateCharges.value?.length ?? 0);
const totalPaid = computed(() => enrollments.value?.length ?? 0 - totalPending.value);
const inadimplenciaPercent = computed(() => {
  if (totalStudents.value === 0) return 0;
  return (totalPending.value / totalStudents.value) * 100;
});

const recentEnrollments = computed(() => {
  return (enrollments.value ?? []).slice(0, 5);
});

// Helpers
const statusClass = (enrollmentId: string) => {
  const isLate = lateCharges.value?.some(c => c.enrollment_id === enrollmentId);
  return isLate ? "pendente" : "pago";
};

const statusText = (enrollmentId: string) => {
  return statusClass(enrollmentId) === "pago" ? "Pago" : "Pendente";
};
</script>

<style scoped>
.dashboard { padding: 20px; }
.cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
.card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
.status { padding: 4px 8px; border-radius: 4px; font-size: 12px; color: white; }
.status.pago { background: #34c38f; }
.status.pendente { background: #f46a6a; }
.loading, .error, .empty { padding: 20px; text-align: center; }
.error { color: #d32f2f; }
</style>
```

---

## Padrão 4: Interceptador global de 401

Criar: [app/plugins/http-error-handler.ts]

```ts
export default defineNuxtPlugin(() => {
  const router = useRouter();
  const { logout } = useAuth();

  // Intercepta erros de $fetch globalmente
  $fetch.create({
    onResponseError({ error, response }) {
      if (response.status === 401) {
        // Sessao expirada
        logout().then(() => {
          router.push("/login");
        });
        
        // Opcional: mostrar notificacao
        console.warn("Sessao expirada. Faça login novamente.");
      }
    },
  });
});
```

**Alternativa (melhor)**: estender useApiClient

```ts
// app/composables/useApiClient.ts
export const useApiClient = () => {
  const request = async <T>(path: string, options: RequestOptions = {}) => {
    const headers = process.server ? useRequestHeaders(["cookie"]) : undefined;

    try {
      return await $fetch<T>(path, {
        method: options.method,
        query: options.query,
        body: options.body,
        credentials: "include",
        headers,
      } as any);
    } catch (error: any) {
      // Intercepta 401
      if (error.status === 401) {
        const { logout } = useAuth();
        await logout();
        await navigateTo("/login");
        throw createError({
          statusCode: 401,
          statusMessage: "Sessao expirada. Faça login novamente.",
        });
      }
      throw error;
    }
  };

  return {
    get: <T>(path: string, query?: RequestOptions["query"]) =>
      request<T>(path, { method: "GET", query }),
    post: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: "POST", body }),
    // ... rest dos verbos
  };
};
```

---

## Padrão 5: Tratamento de erro em formulario

Usar em: futuros forms de CRUD

```vue
<template>
  <form @submit.prevent="handleSubmit" class="form">
    <div class="form-group">
      <label>Nome</label>
      <input v-model="form.name" type="text" required />
    </div>

    <!-- Erro do servidor -->
    <div v-if="error" class="error-box">
      {{ error.message }}
    </div>

    <button :disabled="loading">
      {{ loading ? "Salvando..." : "Salvar" }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const form = reactive({ name: "" });
const loading = ref(false);
const error = ref<any>(null);

const { create } = useStudents(); // ou outro composable

const handleSubmit = async () => {
  error.value = null;
  loading.value = true;

  try {
    await create(form);
    // Sucesso - navegar ou resetar form
    navigateTo("/alunos");
  } catch (err: any) {
    // Erro do servidor
    error.value = {
      message: err.data?.statusMessage ?? "Erro ao salvar",
    };
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form { max-width: 400px; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; }
.form-group input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
.error-box { background: #ffebee; color: #d32f2f; padding: 12px; border-radius: 4px; margin-bottom: 15px; }
button { background: #d32f2f; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
button:disabled { opacity: 0.7; cursor: not-allowed; }
</style>
```

---

## Checklist de qualidade apos implementar P0

- [ ] Sem console.log ou debug em producao
- [ ] Nenhum array hardcoded com dados
- [ ] Todos os erros 4xx/5xx tratados na UI
- [ ] Loading states visivel em todas as requisicoes
- [ ] Tipagem forte (sem `any` desnecessario)
- [ ] Reutilizacao de composables em vez de $fetch direto
- [ ] Funciona em SSR (sem acesso a window fora de client)
- [ ] Responsivo basico em mobile
- [ ] 401 redireciona para login automaticamente
