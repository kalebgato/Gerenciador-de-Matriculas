# Roadmap Visual e Sumario Executivo

## Status Atual (18 de abril de 2026)

```
Backend  ✅✅✅✅✅ Pronto (Auth, Courses, Students, Teams, Enrollments, Billing)
Frontend ⚠️⚠️⚠️⚠️⚠️ Em progresso (Telas existem, dados mockados)
```

---

## O que foi gerado neste ciclo

### Documentação
1. **front-todo.md** - Checklist completo de pendências do frontend
   - Gap por dominio
   - Priorização P0, P1, P2
   - Criterios de aceite

2. **P0-EXECUCAO.md** - Plano tecnico detalhado para primeira etapa
   - 4 tarefas concretas
   - Arquivos a modificar
   - Passo a passo de implementacao
   - ~90 min de trabalho

3. **PADROES-P0.md** - Snippets prontos com padrões
   - 5 padroes Vue/Nuxt prontos para copiar/colar
   - Baseados no que ja existe no projeto
   - Acelera implementacao

4. **TESTES-P0.md** - Guia de teste e validacao
   - 6 cenarios de teste manual
   - Troubleshooting comum
   - Metricas de sucesso

---

## Arquitetura da Solucao P0

```
┌─────────────────────────────────────────┐
│  Frontend (Vue 3 + Nuxt 4)              │
├─────────────────────────────────────────┤
│  Pages (turmas, dashboard)              │
│    ↓                                     │
│  Composables (useTeams, useStudents...) │
│    ↓                                     │
│  useApiClient (com interceptacao 401)   │
│    ↓                                     │
│  HTTP via $fetch                        │
│    ↓                                     │
├─────────────────────────────────────────┤
│         API Gateway (Nitro)             │
├─────────────────────────────────────────┤
│  Backend (Nitro + Prisma)               │
│  - GET /api/teams                       │
│  - GET /api/students                    │
│  - GET /api/enrollments                 │
│  - GET /api/billing/late                │
│  - etc                                  │
│    ↓                                     │
│  Banco de dados (PostgreSQL)            │
└─────────────────────────────────────────┘
```

**O que P0 muda:**
- Pages deixam de usar `const turmas = [...]` hardcoded
- Passam a usar `useTeams().list()` 
- Dados sao sempre frescos do banco

---

## Fluxo de Implementacao recomendado

### Semana 1 - P0 (Eliminar Mocks)
```
Segunda  → Tarefa 1 (Dashboard)
Terça    → Tarefa 2 (Turmas/index)
Quarta   → Tarefa 3 (Turmas/[id])
Quinta   → Tarefa 4 (401 handler)
Sexta    → Testes, ajustes finos, code review
```

**Output**: Frontend operavel sem um unico linha de mock, 100% dados reais

### Semana 2-3 - P1 (CRUD Alunos)
```
Segunda-Quarta → Criar paginas /alunos (lista, novo, edicao)
Quinta-Sexta   → Integrar com backend + validacoes + testes
```

### Semana 3-4 - P1 (CRUD Cursos e Turmas)
```
Similar ao fluxo de alunos
```

### Semana 4 - P1 (Matriculas e Cobranca)
```
Implementar fluxos de negocio (gerar cobrancas, pagar, listar atrasados)
```

---

## Dependencias e Bloqueadores

### O que JA esta pronto:
- ✅ Backend completo (todos endpoints)
- ✅ Composables de dominio (useTeams, useStudents, etc)
- ✅ useAuth e middleware de autenticacao
- ✅ Tipos compartilhados em app/types/api.ts
- ✅ Banco de dados e seed data

### O que ainda FALTA (P0):
- ❌ Remover mocks de dashboard e turmas
- ❌ Conectar composables nas paginas
- ❌ Interceptador global de 401
- ❌ Estados de loading/erro em telas

### Bloqueadores conhecidos:
- Nenhum conhecido por enquanto
- Se houver erro 5xx do backend durante teste, debugar com backend team

---

## Como usar este Material

### Para o desenvolvedor implementando:

1. **Comece por aqui** (este arquivo)
   - Entender contexto geral

2. **Leia P0-EXECUCAO.md**
   - Ver checklist de 4 tarefas
   - Entender que arquivo editar

3. **Consulte PADROES-P0.md**
   - Copiar snippet mais proximo do seu use case
   - Adaptar para sua tarefa especifica

4. **Implemente** seguindo o padrao escolhido

5. **Valide com TESTES-P0.md**
   - Rodar cenarios de teste
   - Conferir metricas de sucesso

### Para o gerente acompanhando:

- **front-todo.md** = status geral do projeto
- **P0-EXECUCAO.md** = estimativa de tempo (90 min para P0)
- **TESTES-P0.md** = criterios de aceite = quando considerar "pronto"
- Este arquivo = roadmap de 4 semanas

---

## Checkpoints de controle

### Checkpoint 1: Dashboard vivo
```
Criterio: Cards e tabela em /dashboard exibem dados reais
Teste:    npm run dev → login → /dashboard → verificar numeros mudam com banco
Tempo:    30-45 min
```

### Checkpoint 2: Turmas vivas
```
Criterio: /turmas lista turmas reais, /turmas/:id carrega turma correta
Teste:    /turmas → clicar em turma → ver alunos reais
Tempo:    45 min
```

### Checkpoint 3: 401 tratado
```
Criterio: Remover cookie → tentar acao → redireciona para login automaticamente
Teste:    DevTools → remover cookie → clicar em turma → vai para /login
Tempo:    15 min
```

### Checkpoint 4: P0 Completo
```
Criterio: Todos os 10 itens de "Metricas de sucesso" em TESTES-P0.md
Teste:    Rodar cenarios 1-6 de TESTES-P0.md com sucesso
Tempo:    Total ~90 min
```

---

## Recursos

### Documentacao interna do projeto:
- [docs/frontend-vue.md](docs/frontend-vue.md) - Convencoes Vue
- [docs/composables.md](docs/composables.md) - Cada composable explicado
- [docs/rotas.md](docs/rotas.md) - Endpoints do backend
- [docs/autenticacao.md](docs/autenticacao.md) - Fluxo de auth

### Exemplos prativos:
- [docs/exemplos-api.md](docs/exemplos-api.md) - curl examples

### Swagger UI (ao vivo):
- URL: `http://localhost:3000/api/docs`
- Acesso: sem autenticacao (documentacao)
- Util para: verificar exatamente o que cada endpoint retorna

---

## Estimativa de Esforço

### P0 (Eliminar Mocks) - PRIORITARIO
| Tarefa | Arquivo | Tempo | Dep | Status |
|--------|---------|-------|-----|--------|
| Dashboard | dashboard.vue | 30-45min | - | TODO |
| Turmas/List | turmas/index.vue | 20-30min | - | TODO |
| Turmas/Detail | turmas/[id].vue | 15-25min | - | TODO |
| 401 Handler | useApiClient.ts | 10-15min | - | TODO |
| **Subtotal** | | **~90 min** | | |
| Testes | Manual | 30 min | P0 | TODO |

### P1 (CRUD Alunos) - SEGUNDA PRIORIDADE
| Tarefa | Tempo | Dep | Status |
|--------|-------|-----|--------|
| Paginas /alunos | 60-90min | P0 | TODO |
| Integracao API | 30 min | /alunos pages | TODO |
| Validacoes UX | 20 min | API integrada | TODO |
| Testes | 30 min | - | TODO |
| **Subtotal** | **~150 min** | | |

### P1 (CRUD Cursos e Turmas) - TERCEIRA PRIORIDADE
- Similar ao CRUD de alunos: ~150 min

### P1 (Matriculas + Cobranca) - QUARTA PRIORIDADE
- Fluxos mais complexos: ~200 min

**Total estimado: ~600 min (10 horas) para ir de mock para 100% funcional**

---

## Success Criteria Final (End of P0)

```
✅ Nao ha nem uma linha de dados mockados no frontend
✅ Todas as telas carregam dados vivos do banco
✅ 401 redireciona automaticamente e com mensagem amigavel
✅ Sessao persiste apos reload
✅ Loading states visiveis em todas as operacoes
✅ Erros sao exibidos sem quebrar a UI
✅ Codigo segue padroes do projeto (Vue setup, tipos, composables)
✅ Funciona em SSR (sem erros de server/client mismatch)
✅ Responsivo basico em mobile
✅ Pronto para iniciar P1 sem retrabalho
```

---

## Proximos Passos Imediatos

### Hoje:
- [ ] Ler este documento e entender contexto
- [ ] Consultar PADROES-P0.md e escolher um para comeco

### Amanha:
- [ ] Comcar com Tarefa 1 (Dashboard) usando PADROES-P0.md pattern 3
- [ ] Depois Tarefa 2, 3, 4 sequencialmente

### Fim da semana:
- [ ] P0 completo
- [ ] Todos TESTES-P0.md passando
- [ ] Code review de P0
- [ ] Preparar para P1

---

## Contato / Escalacao

Se encontrar bloqueador:
1. Checar TESTES-P0.md troubleshooting
2. Verificar se backend esta rodando e seed foi executado
3. Abrir issue no GitHub com:
   - O que tentou
   - Que erro recebeu
   - Screenshot ou console log
