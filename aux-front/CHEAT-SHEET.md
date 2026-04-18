# 📋 CHEAT SHEET - P0 Quick Reference

## Print this and keep at your desk! 

---

## 🎯 Os 4 Passos P0 (em ordem)

```
1️⃣  DASHBOARD     → app/pages/dashboard.vue       (30-45 min)
2️⃣  TURMAS/LIST   → app/pages/turmas/index.vue    (20-30 min)
3️⃣  TURMAS/DETAIL → app/pages/turmas/[id].vue     (15-25 min)
4️⃣  401 HANDLER   → app/composables/useApiClient.ts (10-15 min)
```

---

## 🔧 Patterns to Copy (PADROES-P0.md)

| Tarefa | Pattern | Arquivo |
|--------|---------|---------|
| Dashboard | Pattern 3 | app/pages/dashboard.vue |
| Turmas/list | Pattern 1 | app/pages/turmas/index.vue |
| Turmas/detail | Pattern 2 | app/pages/turmas/[id].vue |
| 401 handler | Pattern 4 | app/composables/useApiClient.ts |
| Futuros forms | Pattern 5 | (qualquer form novo) |

---

## ✅ Validation Checklist (TESTES-P0.md)

```
[ ] 1. Login + sessao persiste
[ ] 2. Dashboard mostra dados reais (numeros, nao mock)
[ ] 3. Turmas lista com filtro por curso
[ ] 4. Turma/id carrega corretamente
[ ] 5. Remover cookie > redireciona para login
[ ] 6. Loading/error states sao visiveis

Success metrics (todos 10):
[ ] Nao ha dados hardcoded
[ ] Composables sao usados
[ ] Loading states visiveis
[ ] Erros sao tratados
[ ] 401 redireciona
[ ] Sessao persiste
[ ] SSR funciona
[ ] Tipagem forte
[ ] Sem $fetch direto
[ ] Code review OK
```

---

## 💾 Key Composables to Use

```ts
// Importar SEMPRE assim:
import { useAuth } from '~/composables/useAuth'
import { useTeams } from '~/composables/useTeams'
import { useStudents } from '~/composables/useStudents'
import { useBilling } from '~/composables/useBilling'
import { useEnrollments } from '~/composables/useEnrollments'
```

---

## 📡 API Endpoints (Quick Lookup)

```
GET  /api/teams                    → lista turmas
GET  /api/teams?course_id=X        → turmas por curso
GET  /api/teams/:id                → uma turma
GET  /api/students                 → lista alunos
GET  /api/enrollments              → lista matriculas
GET  /api/enrollments/student/:id  → matriculas por aluno
GET  /api/billing/late             → cobrancas atrasadas
```

---

## 🎨 Vue 3 + Nuxt Patterns

### useAsyncData (como usar)
```ts
// Com filtro reativo:
const { data: teams } = await useAsyncData(
  'teams',
  () => selectedCourseId.value 
    ? useTeams().list(selectedCourseId.value) 
    : useTeams().list(),
  { watch: [selectedCourseId] }
)

// Sem filtro:
const { data: students, pending, error } = await useAsyncData(
  'students',
  () => useStudents().list()
)
```

### Computed values
```ts
const totalStudents = computed(() => students.value?.length ?? 0)
```

### Conditional rendering
```html
<div v-if="pending">Carregando...</div>
<div v-else-if="error">{{ error.message }}</div>
<div v-else>{{ data }}</div>
```

---

## 🔐 Auth Pattern

```ts
// Check se autenticado:
const { session, ensureSession } = useAuth()
await ensureSession()

// Logout:
const { logout } = useAuth()
await logout()

// Check sessao no middleware:
if (session.authenticated) { /* ... */ }
```

---

## ⚠️ Common Mistakes (dont do!)

```
❌ const turmas = [...]  // hardcoded data
✅ const { data: turmas } = await useAsyncData(...)

❌ $fetch('/api/teams')  // sem composable
✅ useTeams().list()

❌ let myType = { id: '1' }  // type local
✅ import { Team } from '~/app/types/api'

❌ if (!pending) { /* ... */ }  // esqueceu 'else'
✅ if (pending) { ... } else if (error) { ... } else { ... }

❌ navigateTo("/turmas/" + id)  // concatenacao
✅ navigateTo(`/turmas/${id}`)  // template literal
```

---

## 🛠️ Debug Commands

```bash
# Type check:
bun run type-check

# Format code:
Shift+Alt+F (in VS Code)

# Check imports:
Ctrl+Shift+P > "Organize Imports"

# Check linter:
Look at Problems panel (Ctrl+Shift+M)
```

---

## 🧪 Test Scenarios (Quick)

### Scenario 1 (5 min)
```
1. Login
2. Check cookie in DevTools
3. Reload page
4. Still logged in? ✅
```

### Scenario 2 (5 min)
```
1. /dashboard
2. Cards have numbers > 0? ✅
3. Tabela mostra nomes reais? ✅
```

### Scenario 3 (5 min)
```
1. /turmas
2. Selecionar curso
3. Lista filtra? ✅
```

### Scenario 4 (5 min)
```
1. Clicar turma
2. URL eh /turmas/{uuid}? ✅
3. Alunos listados? ✅
```

### Scenario 5 (5 min)
```
1. DevTools > Application > Cookies
2. Delete gm_auth_token
3. Reload
4. Redireciona /login? ✅
```

### Scenario 6 (5 min)
```
1. Abra Network tab
2. Veja requisicoes GET /api/...
3. Resposta 200 OK? ✅
4. Payload tem dados? ✅
```

---

## 📞 Who to ask

```
Duvida de backend?      → backend team
Duvida de tipos?        → app/types/api.ts ou tech lead
Duvida de composable?   → docs/composables.md
Duvida de pattern Vue?  → PADROES-P0.md ou Vue 3 docs
Bloqueador?             → Tech lead
```

---

## ⏰ Time Estimate (Checklist)

- [ ] 9:00 - 10:00  Leia docs (INDEX, ROADMAP, P0-EXECUCAO)
- [ ] 10:00 - 10:30 Meeting de kickoff
- [ ] 14:00 - 14:45 Tarefa 1 (Dashboard)
- [ ] EOD Terça    Tarefa 2 (Turmas/list)
- [ ] EOD Quarta   Tarefa 3 (Turmas/detail)
- [ ] EOD Quinta   Tarefa 4 (401) + Code review
- [ ] Sexta        Testes + PR + Merge

**Total: 1 semana, pronto sexta fim do expediente**

---

## 📂 File Locations

```
Frontend code:
  /app/pages/           ← telas
  /app/composables/     ← logica de API
  /app/types/           ← tipos compartilhados
  /app/middleware/      ← auth middelware
  
Backend code:
  /server/api/          ← endpoints
  /server/modules/      ← logica de negocio

Documentacao DESTA SESSAO:
  front-todo.md         ← todas tarefas
  ROADMAP-P0.md         ← visao geral
  P0-EXECUCAO.md        ← tecnico passo-a-passo
  PADROES-P0.md         ← snippets prontos
  TESTES-P0.md          ← teste
  INDEX.md              ← indice/navegacao
  START.md              ← comecando hoje
  CHANGELOG-DOCS.md     ← historico
  CHEAT-SHEET.md        ← este arquivo
```

---

## 🚀 One Liner Start

```bash
# Terminal 1 (backend)
cd /server && bun run dev

# Terminal 2 (frontend)  
bun run dev

# Terminal 3 (code)
code .

# Browser
http://localhost:3000
```

---

## ✨ Pro Tips

1. **Abra 2 terminais lado a lado**
   - Um para backend, um para frontend
   - Vira obvious quando algo cai

2. **DevTools sempre ligado (F12)**
   - Network tab pra ver requisicoes
   - Console pra ver erros
   - Application pra ver cookies/storage

3. **Snippets de PADROES-P0.md**
   - Copy/paste + adapte
   - Nao eh recomendado reescrever do zero

4. **Commit frequente**
   - A cada tarefa completa: git add + commit
   - Mais facil fazer rollback se precisar

5. **Pedir review diario**
   - Tech lead ve em < 1h
   - Corrige rapido, nao deixa acumular

---

## 🎓 Learning Resources (if stuck)

```
Vue 3 Docs:     https://vuejs.org/
Nuxt Docs:      https://nuxt.com/
useAsyncData:   https://nuxt.com/docs/api/composables/use-async-data
Prisma:         https://www.prisma.io/docs
TypeScript:     https://www.typescriptlang.org/docs
```

---

## 💬 Slack Messages Templates

```
"Comecando Tarefa 1 (Dashboard), tempo 30-45min, vou avisar quando terminar"

"Pronto para review tarefa 1, branch: feat/p0-dashboard"

"Terminei tudo P0, rodando TESTES-P0.md agora, status em 30min"

"Achei bloqueador em X, preciso de ajuda, enviei no #dev"
```

---

## 🎯 Success = When

```
✅ Sexta, fim do dia
✅ Todos 4 commits fazendo merge
✅ Todos 10 items de metricas de sucesso = verde
✅ Pronto para dar Demo segunda-feira
✅ Pronto para comcar P1 proxima semana
```

---

## 🔗 Quick Links

- Backend Swagger: http://localhost:3000/api/docs
- Frontend: http://localhost:3000
- Repo: /home/kalebgato/Workspace/Voluntario/Gerenciador-de-Matriculas
- This cheat sheet: CHEAT-SHEET.md

---

## Print & Pin! 📌

Save this or print. Keep visible during codificacao.
