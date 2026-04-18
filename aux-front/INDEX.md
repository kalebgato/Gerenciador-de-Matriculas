# INDEX - Documentacao de Implementacao Frontend

## TL;DR (muito longo; não li)

```
Backend pronto ✅ | Frontend precisa de integração

Tem 90 min? → Vá direto para P0-EXECUCAO.md
Quer snippets prontos? → PADROES-P0.md
Quer entender tudo? → Comece aqui
Pronto para testar? → TESTES-P0.md
```

---

## Documentos Gerados (18 de abril de 2026)

### 1. 📋 front-todo.md
**O que é**: Checklist completo de pendências do frontend
**Para quem**: Gerentes, arquitetos, anyone que quer ver o big picture
**Conteudo**:
- Gap por dominio (Auth, Courses, Students, Teams, Enrollments, Billing)
- Priorização em P0, P1, P2
- Criterios de aceite por item
- Matriz de cobertura backend vs frontend
- Ordem sugerida de execucao

**Ler se**:
- Quer saber status geral do projeto
- Precisa estimar tempo total de trabalho
- Quer priorizar tarefas para stakeholders

---

### 2. 🗺️ ROADMAP-P0.md
**O que é**: Sumário executivo visual com contexto geral
**Para quem**: Qualquer um começando a trabalhar nesta etapa
**Conteudo**:
- Status atual (backend vs frontend)
- Arquitetura da solução
- Fluxo de implementacao recomendado (4 semanas)
- Dependencias e bloqueadores
- Checkpoints de controle
- Estimativa de esforço por tarefa

**Ler se**:
- Quer entender contexto antes de codificar
- Precisa planejar as 4 proximas semanas
- Quer saber quanto tempo leva

**Ler DEPOIS**:
- P0-EXECUCAO.md (detalhes tecnicos)

---

### 3. 🔧 P0-EXECUCAO.md
**O que é**: Plano tecnico com passo a passo de implementacao
**Para quem**: Desenvolvedores que vao implementar
**Conteudo**:
- 4 tarefas concretas e sequenciais
- Para cada tarefa:
  - Arquivo a editar
  - Mudancas esperadas (bullet points)
  - Criterio de aceite
- Checklist de execucao por tarefa
- Notas de implementacao (useAsyncData, SSR-safe, etc)
- Tempo estimado por tarefa
- Como validar apos terminar

**Ler se**:
- Vai implementar o P0
- Precisa entender exatamente o que fazer

**Leia ANTES de implementar**:
- PADROES-P0.md (para snippets)

---

### 4. 💡 PADROES-P0.md
**O que é**: Snippets prontos com padroes Vue/Nuxt
**Para quem**: Desenvolvedores implementando (use como reference/template)
**Conteudo**:
- 5 padroes prontos para copiar/colar:
  1. Lista com filtro (useTeams + filtro por curso)
  2. Detalhe por ID (getById + loadByRoute)
  3. Dashboard com multiplos dados (cards + tabela)
  4. Interceptador global de 401
  5. Tratamento de erro em formulario
- Checklist de qualidade apos implementar

**Usar**:
- Comece por PADROES-P0.md pattern 3 (dashboard)
- Depois pattern 1 (lista com filtro)
- Depois pattern 2 (detalhe por ID)
- Depois pattern 4 (401 handler)
- Depois pattern 5 (para futuros forms)

**Beneficio**:
- Codigo ja testado
- Segue convencoes do projeto
- Acelera implementacao em ~50%

---

### 5. ✅ TESTES-P0.md
**O que é**: Guia de teste e validacao com cenarios manuais
**Para quem**: QA, developer fazendo autoteste, anyone validando P0
**Conteudo**:
- Prerequisitos (backend/frontend rodando, seed data)
- 6 cenarios de teste:
  1. Login e sessao
  2. Dashboard com dados reais
  3. Turmas com filtro
  4. Detalhe de turma
  5. Sessao expirada (401)
  6. Estados de loading/erro
- Troubleshooting de 6 problemas comuns
- Metricas de sucesso (10 items)

**Usar apos**:
- Terminar implementacao do P0
- Antes de considerar "pronto"

**Tempo**:
- ~30 min para rodar todos cenarios
- ~5 min para troubleshooting basico

---

## Como usar (por funcao)

### Desenvolvedor (implementando P0)

1. **Segunda-feira (morning)**
   - Ler ROADMAP-P0.md (10 min)
   - Entender arquitetura geral

2. **Segunda-feira (afternoon)**
   - Ler P0-EXECUCAO.md (20 min)
   - Ler PADROES-P0.md (15 min)
   - Comcar com Tarefa 1 (Dashboard)

3. **Segunda - Quinta**
   - Executar Tarefas 1-4 sequencialmente
   - Usar PADROES-P0.md como reference
   - Se travar, consultar troubleshooting em TESTES-P0.md

4. **Sexta**
   - Rodar TESTES-P0.md cenarios 1-6
   - Ajustes finos
   - Code review

---

### Tech Lead (revisando/mentorado)

1. Ler front-todo.md (20 min)
2. Ler ROADMAP-P0.md (15 min)
3. Validar com TESTES-P0.md criterios (5 min/tarefa)
4. Code review com foco em PADROES-P0.md compliance

---

### Project Manager (acompanhando progresso)

- **front-todo.md** = status geral e roadmap total
- **ROADMAP-P0.md** = sprint de 1 semana e estimativas
- **TESTES-P0.md** = criterios de aceite (quando considerar "pronto")

**Check-in semanal**: "Quantos dos 10 itens de metricas de sucesso em TESTES-P0.md estao verdes?"

---

### QA (testando P0)

1. Ler TESTES-P0.md completo (30 min)
2. Rodar 6 cenarios (15-20 min cada)
3. Comparar resultado com "Validacao" de cada cenario
4. Se tiver desvio, criar issue com "Cenario N falhou em X"

---

## Quick Reference (Tabela)

| Pergunta | Resposta | Leia |
|----------|----------|------|
| Qual é o status geral? | Backend pronto, frontend precisa integração | front-todo.md |
| Quanto tempo leva? | ~90 min para P0, ~600 min para tudo | ROADMAP-P0.md |
| O que exatamente fazer? | 4 tarefas sequenciais (tarefa 1-4) | P0-EXECUCAO.md |
| Como implementar? | 5 padroes prontos para copiar | PADROES-P0.md |
| Como validar? | 6 cenarios de teste manual | TESTES-P0.md |
| Quando considerar pronto? | Todos 10 items de metricas em TESTES-P0.md | TESTES-P0.md |

---

## Ordem recomendada de leitura (por contexto)

### Cenario 1: "Comeca hoje, precisa ver o que fazer AGORA"
```
1. ROADMAP-P0.md (~15 min para entender contexto)
2. P0-EXECUCAO.md (~20 min para ter checklist de tarefas)
3. PADROES-P0.md (~5 min para escolher snippet inicial)
4. Comcar a codar!
```

### Cenario 2: "Quer entender tudo antes de comcar"
```
1. front-todo.md (~30 min)
2. ROADMAP-P0.md (~20 min)
3. P0-EXECUCAO.md (~20 min)
4. PADROES-P0.md (~15 min leitura superficial)
5. Entao P0-EXECUCAO.md novamente, com foco
```

### Cenario 3: "Vai fazer QA/teste"
```
1. ROADMAP-P0.md (entender o que foi feito)
2. TESTES-P0.md (cenarios de teste)
3. Rodar testes
```

### Cenario 4: "Precisa fazer code review"
```
1. P0-EXECUCAO.md (ver quais arquivos devem mudar)
2. PADROES-P0.md (ver quais padroes devem estar presentes)
3. TESTES-P0.md (ver criterios de aceite)
4. Revisar cada arquivo comparando com padroes
```

---

## Avisos e Lembretes Importantes

⚠️ **Antes de comcar P0:**
- [ ] Backend esta rodando (bun run dev em /server)
- [ ] Frontend esta rodando (bun run dev em app ou root)
- [ ] Banco foi seedado (bun run seed)
- [ ] Voce tem acesso a DevTools do browser (F12)

⚠️ **Durante implementacao:**
- [ ] Nao simplesmente remova dados mockados; substitua por useAsyncData
- [ ] Sempre use composables de dominio (useTeams, etc), nao $fetch direto
- [ ] Use tipos em app/types/api.ts, nao crie novos types locais
- [ ] Teste loading states (pending, error) nao apenas "sucesso"

⚠️ **Apos terminar:**
- [ ] Nao considere "pronto" ate passar todos 10 itens de TESTES-P0.md
- [ ] Faca code review com tech lead antes de merge
- [ ] Documente qualquer desvio do padroes em PR description

---

## Links Rapidos (internos)

- [front-todo.md](front-todo.md) - Checklist de tarefas
- [ROADMAP-P0.md](ROADMAP-P0.md) - Visao geral de 4 semanas
- [P0-EXECUCAO.md](P0-EXECUCAO.md) - Passo a passo tecnico
- [PADROES-P0.md](PADROES-P0.md) - Snippets prontos
- [TESTES-P0.md](TESTES-P0.md) - Teste e validacao

---

## Duvidas Frequentes

**P: Preciso ler tudo?**
A: Nao. Escolha seu cenario acima e siga a ordem recomendada.

**P: Qual arquivo eh o "chefe" (entry point)?**
A: ROADMAP-P0.md. Leia aquele primeiro.

**P: Posso pular P0-EXECUCAO.md e ir direto para PADROES-P0.md?**
A: Nao. P0-EXECUCAO.md te diz QUAIS arquivos mudar. PADROES-P0.md te diz COMO mudar. Voce precisa de ambos.

**P: Quanto tempo realmente leva?**
A: Se seguir PADROES-P0.md snippets: ~90 min.
   Se codificar do zero: ~150-180 min.

**P: O que fazer se ficar trancado?**
A: 1) Consulte troubleshooting em TESTES-P0.md
   2) Procure error mensagens no DevTools
   3) Abra issue com contexto do problema

---

## Feedback / Melhorias

Se encontrar:
- Documentacao incompleta/confusa
- Snippets que nao funcionam
- Criterios de teste que nao fazem sentido

Crie uma issue ou mensagem com:
- Qual documento?
- O que estava esperando?
- O que encontrou?

---

## Versao e Historia

- **v1.0** (18 de abril de 2026)
  - Documentacao inicial de P0
  - 5 documentos: front-todo, ROADMAP-P0, P0-EXECUCAO, PADROES-P0, TESTES-P0

---

## Proxima iteracao (P1)

Apos P0 estar completo:
- front-todo.md ja tem a lista de tarefas P1
- Seguir mesmo padrao: ROADMAP → EXECUCAO → PADROES → TESTES
