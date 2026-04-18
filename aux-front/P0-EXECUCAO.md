# Plano de Execução P0 - Eliminar Mocks do Dashboard e Turmas

## Objetivo
Substituir dados hardcoded (mockados) por chamadas reais aos composables de dominio, mantendo a mesma UX visual mas com dados vivos do backend.

---

## Tarefa 1: Integrar Dashboard com dados reais

### Arquivo: [app/pages/dashboard.vue](app/pages/dashboard.vue)

#### Mudanças esperadas:

1. **Importar composables de dominio**
   ```ts
   const { list: listStudents } = useStudents();
   const { listLateCharges } = useBilling();
   const { list: listEnrollments } = useEnrollments();
   ```

2. **Remover array hardcoded `alunos`**
   - Atualmente: 3 elementos fixos com dados fakos
   - Novo: carrega via useAsyncData + listEnrollments()

3. **Implementar cards com dados reais**
   - Card "Total de Alunos": students.length
   - Card "Pagos": enrollments com status PAID (precisará cruzar com billing)
   - Card "Pendentes": late charges count
   - Card "% Inadimplência": late.length / total_charges * 100

4. **Refazer tabela com alunos reais**
   - Origem: GET /api/enrollments (retorna student + team + info de cobrança)
   - Mostrar: nome do aluno, turma, status (Pago/Pendente derivado de enrollment + billing)

#### Criterio de aceite:
- Sem dados hardcoded
- Casos de erro tratados (pending, error states)
- Fallback de vazio quando sem matriculas

---

## Tarefa 2: Integrar Turmas (lista) com dados reais

### Arquivo: [app/pages/turmas/index.vue](app/pages/turmas/index.vue)

#### Mudanças esperadas:

1. **Remover array mockado `turmas`**
   - Atualmente: 2 elementos fixos com nomes e professores fasos
   - Novo: carrega via useTeams().list()

2. **Implementar filtro por curso em vez de professor**
   - Backend suporta: GET /api/teams?course_id=...
   - UI: select com opcoes de GET /api/courses
   - Filtro reativo com useAsyncData + watch em selectedCourseId

3. **Exibir IDs reais da API**
   - Atualmente gera id artificial tipo "Jean-Sabado-1400"
   - Novo: usar team.id retornado pelo backend

4. **Normalizar exibicao de turmas**
   - Adaptar campos: team.title, team.horary, team.days_of_week, team.course?.title

#### Criterio de aceite:
- Clique em turma navega para /turmas/id_real_da_api
- Filtro por curso funciona e recarrega lista
- Sem dados mockados no script

---

## Tarefa 3: Integrar Detalhe de Turma com dados reais

### Arquivo: [app/pages/turmas/[id].vue](app/pages/turmas/[id].vue)

#### Mudanças esperadas:

1. **Carregar turma por ID real**
   - Atualmente: busca em array mockado
   - Novo: useTeams().getById(id) + useAsyncData

2. **Buscar alunos matriculados na turma**
   - Backend oferece: GET /api/enrollments (retorna todas)
   - Frontend filtra: enrollment.team_id === turmaId
   - Exibir: nome do aluno, email, telefone, status

3. **Tratar estado "turma nao encontrada"**
   - Se getById retornar 404, exibir mensagem
   - Se vazio, exibir "Nenhum aluno matriculado"

#### Criterio de aceite:
- Dados vindo 100% da API
- Descricao e alunos reais
- Erro tratado se turma nao existe

---

## Tarefa 4: Implementar interceptacao global de 401

### Arquivo: [app/composables/useApiClient.ts](app/composables/useApiClient.ts)

#### Mudanças esperadas:

1. **Adicionar try/catch para 401 em request comum**
   ```ts
   const request = async <T>(path: string, options: RequestOptions = {}) => {
     try {
       return await $fetch<T>(path, { ... });
     } catch (error: any) {
       if (error.status === 401) {
         const { logout } = useAuth();
         await logout();
         await navigateTo('/login');
         throw new Error('Sessao expirada. Faça login novamente.');
       }
       throw error;
     }
   };
   ```

2. **Alternativa: usar plugin Nuxt (mais limpo)**
   - Criar [app/plugins/http-error-handler.ts]
   - Interceptar $fetch globalmente
   - Redirecionar 401 e exibir toast/mensagem

#### Criterio de aceite:
- Usuario com sessao expirada e tenta acao redireciona automaticamente
- Mensagem amigavel ao usuario

---

## Checklist de execucao

- [ ] Tarefa 1: dashboard.vue
  - [ ] Remover array alunos hardcoded
  - [ ] Importar useStudents, useBilling, useEnrollments
  - [ ] Implementar useAsyncData para cada card
  - [ ] Calcular totais dinamicamente
  - [ ] Atualizar tabela com dados reais
  - [ ] Testar sem backend (error states)

- [ ] Tarefa 2: turmas/index.vue
  - [ ] Remover array turmas hardcoded
  - [ ] Remover funcao gerarIdTurma (usar id da API)
  - [ ] Implementar select de cursos (useCourses)
  - [ ] Filtro reativo por curso
  - [ ] Navegar para /turmas/id real

- [ ] Tarefa 3: turmas/[id].vue
  - [ ] Carregar turma por id da rota
  - [ ] Buscar enrollments e filtrar por team_id
  - [ ] Exibir alunos reais
  - [ ] Tratamento de 404 e vazio

- [ ] Tarefa 4: useApiClient.ts (ou plugin novo)
  - [ ] Interceptar 401
  - [ ] Logout automatico
  - [ ] Redirecionar para /login
  - [ ] Mensagem de sessao expirada

---

## Notas de implementacao

1. **useAsyncData vs $fetch direto**
   - Use useAsyncData em paginas e componentes para cache e ssr
   - Permite { watch: [...] } para reatividade de filtros
   - Exemplo:
     ```ts
     const courseId = ref<string | null>(null);
     const { data: teams } = await useAsyncData(
       'teams-by-course',
       () => courseId.value ? useTeams().list(courseId.value) : useTeams().list(),
       { watch: [courseId] }
     );
     ```

2. **Tipagem forte**
   - Todos os dados vem ja tipados em app/types/api.ts
   - Nao duplicar tipos, reutilizar StudentWithoutId, TeamWithCourse, etc.

3. **Erros de negocio**
   - Backend retorna { statusMessage: "..." } em 400+
   - Frontend deve exibir statusMessage ao usuario
   - Exemplo: "Aluno ja cadastrado" deve aparecer no form

4. **SSR-safe**
   - Evitar acesso a window/document fora de client-only blocks
   - useAsyncData funciona em SSR e client com $fetch e cookies

5. **States de loading**
   - Dashboard pode ficar com skeleton/spinner enquanto carrega
   - Ou manter dados da requisicao anterior enquanto recarrega

6. **Persistencia de filtros** (opcional)
   - Guardar courseId selecionado em localStorage para melhor UX
   - Recuperar ao montar turmas/index.vue

---

## Tempo estimado por tarefa
- Tarefa 1 (dashboard): 30-45min
- Tarefa 2 (turmas/index): 20-30min
- Tarefa 3 (turmas/[id]): 15-25min
- Tarefa 4 (401 handler): 10-15min
- **Total: ~90 min** se sem bloqueadores

---

## Como validar apos terminar

1. Subir backend (bun run dev em /server)
2. Subir frontend (bun run dev em app ou root)
3. Login com credenciais do nuxt.config.ts (admin@admin.com / 123 se AUTH_ENABLED)
4. Ir para /dashboard e conferir cards com dados reais do db
5. Ir para /turmas e criar uma turma no backend, conferir aparece na lista
6. Clicar em turma, ir para /turmas/id real
7. Invalidar cookie (abre DevTools > Application > Cookies > remover gm_auth_token)
8. Tentar acao qualquer em dashboard (deve redirecionar para /login)

---

## Prox passos apos P0
- Iniciar P1: CRUD de alunos (paginas de criacao e edicao)
- Iniciar P1: CRUD de cursos (paginas de criacao e edicao)
