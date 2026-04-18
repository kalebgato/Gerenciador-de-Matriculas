# Guia de Teste e Validacao para P0

## Objetivo
Descrever como validar que o frontend P0 esta funcionando corretamente com o backend real, sem mock.

---

## Prerequisitos

1. Backend rodando:
   ```bash
   cd /home/kalebgato/Workspace/Voluntario/Gerenciador-de-Matriculas
   bun run dev
   ```
   Deve estar disponivel em `http://localhost:3000`

2. Frontend rodando (em outra aba/terminal):
   ```bash
   # Ja deve estar em watch mode apos mudancas
   # Se nao, rode:
   bun run dev
   ```
   Deve estar disponivel em `http://localhost:3000` (ou verificar a saida)

3. Banco de dados com dados iniciais:
   ```bash
   bun run seed
   ```
   Isso popula db com:
   - Alguns cursos
   - Alguns estudantes
   - Algumas turmas
   - Algumas matriculas

---

## Cenario 1: Login e Sessao

**Objetivo**: Validar que autenticacao funciona e sessao persiste.

### Passos:
1. Abrir `http://localhost:3000/login`
2. Entrar com credenciais (padrao: admin@admin.com / 123)
3. Confirmar redirecionamento para `/dashboard`
4. F12 -> Application -> Cookies -> verificar `gm_auth_token` existe e tem valor
5. Recarregar pagina (F5)
6. Verificar que permanece em `/dashboard` (sessao valida)

### Validacao:
- [ ] Credenciais invalidas exibem erro
- [ ] Login com credenciais validas redireciona
- [ ] Cookie `gm_auth_token` criado com httpOnly
- [ ] Sessao persiste apos reload

---

## Cenario 2: Dashboard com dados reais

**Objetivo**: Verificar que cards e tabela carregam dados vivos do banco.

### Passos apos login:
1. Ir para `/dashboard`
2. Conferir loading state brevemente
3. Verificar cards:
   - "Total de Alunos" mostra numero > 0
   - "Pagos/Pendentes" mostram numeros realistas
   - "% Inadimplencia" calcula corretamente
4. Conferir tabela "Alunos":
   - Mostra nomes reais (nao "Ana Souza", "Camila Santos" etc fixos)
   - Mostra turmas reais
   - Status derivado de dados

### Validacao:
- [ ] Cards nao mostram valores hardcoded
- [ ] Tabela tem dados vindo de GET /api/enrollments
- [ ] Reload do dashboard atualiza dados
- [ ] Se banco vazio, mostra "Sem alunos matriculados"

### Teste adicional (provocar dados):
```bash
# Em outro terminal, inserir estudante/matricula manualmente
# (ou usar POST /api/students + POST /api/enrollments)

# Exemplo com curl:
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "cpf": "12345678901",
    "email": "test@test.com"
  }'

# Voltar para dashboard e conferir se aparece novo aluno
```

---

## Cenario 3: Turmas com dados reais e filtro

**Objetivo**: Verificar lista de turmas carrega API e filtro por curso funciona.

### Passos:
1. Ir para `/turmas`
2. Conferir loading state
3. Verificar lista de turmas:
   - Titulos reais (nao "Tecido Acrobático" fixo)
   - IDs reais (nao strings geradas localmente)
4. Selecionar um curso no filtro
5. Lista recarrega mostrando apenas turmas daquele curso
6. Desselecionar (voltar para "Todos os cursos")
7. Lista volta ao completo

### Validacao:
- [ ] Turmas carregam de GET /api/teams
- [ ] IDs sao UUIDs reais do backend
- [ ] Filtro por curso funciona (watch reativo)
- [ ] Select de cursos vem de GET /api/courses

### Teste de click:
- [ ] Clicar em turma navega para `/turmas/{id_real}`
- [ ] URL tem UUID, nao string artificial

---

## Cenario 4: Detalhe de Turma

**Objetivo**: Verificar carregamento de turma por ID e listagem de alunos.

### Passos:
1. Clicar em uma turma em `/turmas`
2. Deve navegar para `/turmas/{id_da_turma}`
3. Verificar:
   - Titulo da turma mostra corretamente
   - Dias/horarios reais
   - Curso associado mostra
   - Alunos matriculados listados (pelo menos 1)

### Validacao:
- [ ] Carregamento de turma vem de GET /api/teams/:id
- [ ] Alunos vem de GET /api/enrollments filtrado por team_id
- [ ] Se turma nao existe (ID invalido), mostra "Turma nao encontrada"
- [ ] Se nenhum aluno, mostra "Nenhum aluno matriculado"

### Teste de ID invalido:
```
1. Acessar http://localhost:3000/turmas/99999-invalido-99999
2. Deve exibir "Turma nao encontrada"
3. Nao deve dar erro de console (erro tratado)
```

---

## Cenario 5: Sessao expirada e 401

**Objetivo**: Verificar que 401 redireciona para login automaticamente.

### Passos:
1. Estar logado em qualquer pagina privada (ex: /dashboard)
2. Abrir DevTools (F12 -> Application -> Cookies)
3. Deletar cookie `gm_auth_token` manualmente
4. Voltar para a aba do app e tentar qualquer acao (ex: clicar em turma ou recarregar)
5. Deve redirecionar para `/login`
6. Mensagem "Sessao expirada" ou similar deve aparecer (console ou toast)

### Validacao:
- [ ] Sessao expirada causa redirecionamento automatico
- [ ] Usuario nao consegue acessar paginas privadas sem sessao
- [ ] Mensagem amigavel exibida

### Teste programatico (no console do browser):
```javascript
// Forcar erro 401 manualmente
const result = await fetch('http://localhost:3000/api/teams', {
  credentials: 'include'
  // Sem cookie, deve retornar 401
});
console.log(result.status); // Deve ser 401
```

---

## Cenario 6: Estados de carregamento e erro

**Objetivo**: Verificar que loading states e erros sao mostrados adequadamente.

### Teste de loading:
1. Ir para `/turmas`
2. Logo antes de listar, deve ver "Carregando..." brevemente
3. Depois que carrega, desaparece e lista aparece

### Teste de erro (simular):
```bash
# Parar o backend
# Ctrl+C no terminal do backend

# Voltar para frontend e tentar navegar para /turmas
# Deve exibir erro da rede

# Reiniciar backend
# Recarregar pagina
# Deve voltar a funcionar
```

### Validacao:
- [ ] Estados pending, error e empty sao visiveis
- [ ] Mensagens de erro sao legveis
- [ ] UI nao fica travada durante loading

---

## Teste de Regressao

Apos implementar P0, rodar estes testes rapidos regularmente:

### Checklist rapido (5-10 min):
- [ ] Login com credencial errada mostra erro
- [ ] Login com credencial correta redireciona e mantém sessao
- [ ] Dashboard carrega dados (nao mostra valores fixos)
- [ ] /turmas lista turmas reais (nao mockadas)
- [ ] Clicar em turma leva para /turmas/{id_real}
- [ ] Detalhe da turma carrega alunos reais
- [ ] Remover cookie no DevTools e tentar acao redireciona para login
- [ ] Reload em qualquer pagina funciona (SSR OK)

---

## Problemas comuns e troubleshooting

### Problema: "Cannot GET /turmas/:id"
**Causa**: Rota nao existe ou parametro ID nao esta correto
**Solucao**: 
- Conferir que arquivo [app/pages/turmas/[id].vue] existe
- Verificar que route.params.id esta sendo lido corretamente
- Check console do browser para erros de tipagem

### Problema: "Turma nao encontrada" sempre
**Causa**: ID da turma nao bate com banco
**Solucao**:
- Ir para /turmas e copiar ID real de uma turma
- Acessar `/turmas/{ID}` diretamente
- Se ainda mostra nao encontrada, backend pode estar retornando 404
- Verificar que getById esta sendo chamado corretamente

### Problema: Dashboard mostra valores fixos
**Causa**: Dados mockados ainda presentes ou composables nao estao sendo chamados
**Solucao**:
- Remover array `alunos` do dashboard.vue completamente
- Conferir que `useAsyncData` esta sendo usado
- Abrir Network tab (F12) e verificar se GET /api/enrollments esta sendo chamado
- Se nao, adicionar console.log na composable para debug

### Problema: "Falha ao carregar turmas" mas backend esta ligado
**Causa**: CORS, cookies nao sendo enviados, ou erro de autenticacao
**Solucao**:
- Conferir que useApiClient envia `credentials: 'include'`
- Verificar que middleware de auth.global.ts esta protegendo rotas privadas
- Abrir Network tab e ver resposta completa (erro 401, 400, etc)
- Se 401, cookie pode ter expirado

### Problema: Dados nao atualizam apos criar/editar
**Causa**: useAsyncData pode estar em cache e nao recarregando
**Solucao**:
- Adicionar { watch: [trigger] } em useAsyncData se houver reatividade
- Ou adicionar botao de refresh manual na UI
- Ou executar refresh() da composable apos mutacao

---

## Metricas de sucesso para P0

**Frontend está pronto para P1 quando:**

1. ✅ Dashboard exibe dados reais em todos os 4 cards
2. ✅ Dashboard tabela mostra alunos reais (nao mockados)
3. ✅ /turmas lista turmas reais com IDs da API
4. ✅ /turmas/:id carrega turma e alunos em tempo real
5. ✅ Filtro por curso em /turmas funciona
6. ✅ 401 redireciona automaticamente para login
7. ✅ Nao ha dados hardcoded em nenhuma pagina
8. ✅ Loading states visiveis em todas as requisicoes
9. ✅ Erros sao exibidos em formato legivel
10. ✅ Recarregar pagina funciona (SSR OK)

---

## Proximos passos

Apos validar P0 completamente:
1. Criar issue/PR com checklist acima
2. Fazer code review para garantir padroes seguidos
3. Iniciar P1 (CRUD de alunos)
