# 🚀 COMECANDO AGORA - Guia de Proximos Passos

## Situacao Atual (18 de abril de 2026, ~fim do expediente)

```
✅ Backend: completo e rodando
✅ Documentacao: completa e pronta
⏳ Frontend P0: pronto para comecar (90 min de trabalho)
```

---

## O que fazer amanha (segunda-feira)

### Morning (9-10h)
```
[ ] Abra seu editor (VS Code)
[ ] Leia INDEX.md (15 min)
[ ] Leia ROADMAP-P0.md (20 min)
Entao, PAUSE
```

### Meeting (10-11h)
```
[ ] Sync com tech lead/team
[ ] Confirmar estimativa de 90 min
[ ] Blockers conhecidos? Nao tem nenhum
```

### Afternoon (14-17h)
```
COMECA DE VERDADE

[ ] Terminal 1: bun run dev (backend, em /server)
[ ] Terminal 2: bun run dev (frontend, em app/)
[ ] Browser: http://localhost:3000

[ ] Leia P0-EXECUCAO.md (20 min)
[ ] Leia PADROES-P0.md (15 min)

[ ] Comeca Tarefa 1 (Dashboard)
    - Abra app/pages/dashboard.vue
    - Use PADROES-P0.md pattern 3
    - Tempo: 30-45 min
```

### End of day
```
✅ Tarefa 1 (Dashboard) deve estar 80% pronta
Ou pronto mesmo (se fluxo bom)
```

---

## Proximos 4 dias (terça-sexta)

### Terça
```
[ ] Compleate Tarefa 1 (dashboard) - qualquer restaço
[ ] Code review com tech lead (15 min)
[ ] Comeca Tarefa 2 (turmas/index)
    - Use PADROES-P0.md pattern 1
    - Tempo: 20-30 min
```

### Quarta
```
[ ] Complete Tarefa 2
[ ] Code review (15 min)
[ ] Comeca Tarefa 3 (turmas/[id])
    - Use PADROES-P0.md pattern 2
    - Tempo: 15-25 min
```

### Quinta
```
[ ] Complete Tarefa 3
[ ] Code review (15 min)
[ ] Comeca Tarefa 4 (401 handler)
    - Use PADROES-P0.md pattern 4
    - Tempo: 10-15 min
```

### Sexta
```
[ ] Complete Tarefa 4
[ ] Code review final (30 min)
[ ] Rodar TESTES-P0.md (30 min)
    - 6 cenarios
    - Validar 10 metricas de sucesso
[ ] Ajustes finos (15 min)
[ ] PR + merge
```

---

## Ferramentas que vai precisar

### Ja tem:
- ✅ Bun (package manager)
- ✅ VS Code
- ✅ Node.js
- ✅ DevTools do browser (F12)

### Para ter em mao:
```bash
# Terminal 1 (backend)
cd /home/kalebgato/Workspace/Voluntario/Gerenciador-de-Matriculas
bun run dev

# Terminal 2 (frontend)
cd /home/kalebgato/Workspace/Voluntario/Gerenciador-de-Matriculas
bun run dev
```

### Links importantes:
- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api/docs
- Code: /home/kalebgato/Workspace/Voluntario/Gerenciador-de-Matriculas

---

## Checklist de "Pronto para comecar"

- [ ] Leia INDEX.md
- [ ] Leia ROADMAP-P0.md
- [ ] Backend consegue rodar (bun run dev em /server)
- [ ] Frontend consegue rodar (bun run dev em app)
- [ ] Browser abre http://localhost:3000 sem erro
- [ ] DevTools (F12) abre e mostra console limpo
- [ ] Seed foi executado (bun run seed) - banco tem dados
- [ ] Voce ja abriu P0-EXECUCAO.md e PADROES-P0.md
- [ ] Time know seu time estimate (~90 min)

---

## Checklist de "Prontos para P1"

Apos P0 estar 100% completo:
- [ ] Todos 10 items de TESTES-P0.md metricas de sucesso estao verdes
- [ ] Code review passou
- [ ] Branch foi mergeado
- [ ] Deploy foi feito
- [ ] Documentacao foi atualizada (se houver novos padroes descobertos)

ENTAO:
- [ ] Comeca P1 (CRUD de alunos)
- [ ] Mesmo ciclo: analise -> EXECUCAO -> PADROES -> TESTES

---

## Quando Solicitar Ajuda

### Bloqueador = para tudo e pede ajuda
```
Exemplos:
- Backend nao consegue rodar
- Frontend nao consegue rodar
- Database nao inicializa
- Erro de tipagem que nao entende
- Pattern em PADROES-P0.md nao funciona
```

**O que fazer:**
1. Copy/paste o error completo
2. Mencione qual tarefa esta fazendo
3. Mencione o que ja tentou
4. Abra issue ou chama tech lead

### Duvida de entendimento = continue com outro arquivo
```
Exemplos:
- "Nao entendo o que faz useAsyncData"
- "Qual diferenca entre await e without await?"
- "Por que precisa de { watch: [...] }?"
```

**O que fazer:**
1. Procure em PADROES-P0.md comentarios do pattern
2. Procure em docs/ do projeto
3. Google "vue 3 useAsyncData" (Nuxt docs oficial)
4. Se ainda nao entender, pergunta no standup

---

## Estrutura de Branch + Commit

### Branch
```bash
git checkout -b feat/p0-eliminate-mocks
```

### Commits (um por tarefa)
```
Commit 1: feat(dashboard): remove mock data and integrate useStudents/useBilling/useEnrollments
Commit 2: feat(turmas): remove mock data and integrate useTeams with course filter
Commit 3: feat(turmas/:id): load team data from API and list real students
Commit 4: feat(auth): add global 401 interceptor and redirect to login
```

### PR description (template)
```
## P0 - Eliminate Mock Data

Closes #X (se existe issue)

### Changes
- [ ] Dashboard: substitute mock alunos with real data from API
- [ ] Turmas/index: substitute mock turmas with real data from API
- [ ] Turmas/[id]: load turma and alunos from API
- [ ] useApiClient: add 401 interceptor

### Testing
- [ ] All 6 test scenarios in TESTES-P0.md pass
- [ ] All 10 success metrics in TESTES-P0.md are green
- [ ] DevTools console has no errors or warnings

### Review
- [ ] Code follows PADROES-P0.md patterns
- [ ] No hardcoded/mock data remaining
- [ ] Loading states visible for all async operations
- [ ] Error states handled gracefully
```

---

## Performance Checklist

Apos implementar cada tarefa, roda:

```bash
# No browser console (F12 > Console):
1. Abra Network tab
2. Reload pagina
3. Procure por:
   - GET /api/teams
   - GET /api/students
   - GET /api/enrollments
4. Verificar:
   - Status 200 (sucesso)
   - Response payload nao vazio
   - Tempo < 500ms
```

---

## Comunicacao

### Stand-up Diario
```
Manha (9:30):
"Ontem fiz X, hoje vou fazer Y, bloqueador eh Z"

Tarde (16:00):
"Terminei X, vou fazer Y amanha"
```

### Tech Lead Review
```
Cada dia apos terminar tarefa:
"Pronto para review" -> compartilha branch
Tech lead ve em ate 1h
Se tiver feedback, adaptar
Se OK, merge no mesmo dia
```

### PR
```
End of P0 (sexta):
Abre PR com todos 4 commits
Tech lead faz full review
Se OK, merge
Se nao OK, volta para dev com feedback
```

---

## Dicas Praticas

### Terminal / Desenvolvimento

```bash
# Depois de mudar dashboard.vue, recarregar é automatico
# (Nuxt hot reload)

# Se browser fica travado:
Ctrl+Shift+R (hard refresh, limpa cache)

# Se TypeScript reclama de tipos:
Ctrl+K Ctrl+I no VS Code (ver diagnostico)

# Se composable nao eh encontrado:
Checar que import esta presente:
import { useTeams } from '~/composables/useTeams'

# Se ainda assim nao funciona:
npm run type-check (rodar type checker)
ou
bun run type-check (se em bun)
```

### Browser / Debug

```bash
# F12 abrir DevTools
# > Network tab - ver requisicoes HTTP
# > Console tab - ver erros
# > Application > Cookies - ver sessao
# > Application > LocalStorage - ver dados persistidos

# Breakpoint no JS:
Sources tab > achar arquivo > clicar linha > F5 reload
Execucao para no breakpoint
```

### VSCode / Coding

```bash
# Formato rapido:
Shift+Alt+F (formatar arquivo)

# Rename symbol:
F2 (em cima do nome de variavel/funcao)

# Encontrar referencia:
Shift+F12 (ver aonde usa esta variavel)

# Preview de tipo:
Hover em cima do nome

# Ir para definicao:
Ctrl+Click ou F12
```

---

## Tira Duvidas

**P: Preciso fazer seed antes de cada teste?**
A: Nao. Uma vez eh suficiente. Dados persistem no banco.
   Se quiser limpar e re-seed: `bun run seed:reset`

**P: Posso usar localStorage para guardar dados em dev?**
A: Sim, mas P0 nao requer isso. Apenas dados vivos da API.

**P: E se dados do backend mudarem enquanto estou testando?**
A: Reload a pagina para ver dados novos. Ou clique em refresh botao (se add).

**P: Posso fazer commit sem passar nos testes?**
A: Nao. Se TESTES-P0.md nao pass, nao merge.

**P: Quanto tempo leva realmente?**
A: Varia: 60-120 min se fluir bem, 150-200 min se travar.
   Media: 90 min conforme documentacao.

**P: Posso pular alguma tarefa?**
A: Nao. 4 tarefas sao sequenciais. Depois P0 completo, pode vir P1.

---

## Recursos de Emergencia

### Se backend cai:
```bash
ps aux | grep node
kill PID

# Reiniciar:
cd /server
bun run dev
```

### Se frontend cai:
```bash
# Fechar terminal
Ctrl+C

# Reiniciar:
bun run dev
# Em outra aba/terminal
```

### Se banco cai:
```bash
# Checar status de postgres:
sudo systemctl status postgresql

# Restart:
sudo systemctl restart postgresql

# Re-seed:
bun run seed
```

### Se nada funciona:
1. Restart VS Code
2. Kill todos terminals
3. Apaga node_modules (limpeza)
4. `bun install`
5. `bun run dev` (frontend e backend em terminais separados)

---

## Sumario Ultra Rapido

```
📖 Leia: INDEX.md + ROADMAP-P0.md + P0-EXECUCAO.md
📝 Implemente: 4 tarefas de dashboard/turmas/401
✅ Teste: 6 cenarios de TESTES-P0.md
🎉 Merge: PR com 4 commits
```

**Tempo: ~1 semana, ~90 min coding + ~90 min testing/review**

---

## Mensagem Final

Nao se preocupe. Tudo esta documentado. Padroes sao prontos. Vai dar certo.

Qualquer duvida:
1. Consulte INDEX.md
2. Se ainda nao souber, pede ajuda

Good luck! 🚀
