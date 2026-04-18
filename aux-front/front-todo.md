# Frontend TODO para cobrir o backend

## Objetivo

Este checklist enumera o que falta implementar no frontend (app/) para cobrir o backend (server/api/) ja existente.

## Diagnostico rapido

- Backend: modulos completos de auth, courses, students, teams, enrollments e billing.
- Frontend: login integrado, middleware de auth e composables de dominio prontos.
- Gap principal: paginas atuais usam dados mockados e quase nao consomem os composables de dominio.

## Status atual por dominio

- Auth: parcial (login/logout/sessao existem, mas faltam ajustes de UX e tratamento global de 401).
- Dashboard: nao integrado (cards e tabela estaticos).
- Courses: nao implementado em UI (sem pagina/lista/form).
- Students: nao implementado em UI (sem pagina/lista/form).
- Teams: parcial visual (paginas existem, mas com mock e sem CRUD real).
- Enrollments: nao implementado em UI (sem fluxo de matricula e consultas).
- Billing: nao implementado em UI (sem telas para gerar cobranca, pagar e listar atrasados).

---

## P0 - Integracao minima para operar sem mock

- [ ] Substituir dados mockados da pagina dashboard por dados reais
  - Origem backend:
    - GET /api/students
    - GET /api/billing/late
    - GET /api/enrollments
  - Entregaveis:
    - Card "Total de Alunos" vindo de students.length
    - Card "Pendentes/Inadimplencia" com base em late charges
    - Tabela com alunos reais (ao menos nome e status financeiro derivado)
  - Criterio de aceite:
    - Sem arrays hardcoded em dashboard.vue

- [ ] Substituir dados mockados de turmas em /turmas
  - Origem backend:
    - GET /api/teams (e opcionalmente query course_id)
  - Entregaveis:
    - Lista de turmas vinda de useTeams().list()
    - Filtro funcional (por curso, nao apenas por professor mockado)
    - Abertura de detalhe usando id real da turma
  - Criterio de aceite:
    - Navegacao para /turmas/:id com id retornado da API

- [ ] Substituir dados mockados da pagina /turmas/:id
  - Origem backend:
    - GET /api/teams/:id
    - GET /api/enrollments
  - Entregaveis:
    - Carregar dados da turma por id
    - Listar alunos matriculados na turma cruzando enrollments + student
  - Criterio de aceite:
    - Tela mostra turma e alunos reais sem dataset local fixo

- [ ] Implementar tratamento global de erro 401 no consumo da API
  - Origem backend:
    - server/middleware/auth.ts retorna 401 para endpoints privados sem sessao
  - Entregaveis:
    - Interceptacao em camada comum (useApiClient ou plugin)
    - Redirecionar para /login quando sessao expirar
    - Mensagem amigavel para usuario
  - Criterio de aceite:
    - Ao invalidar cookie, qualquer chamada privada leva ao login

---

## P1 - CRUDs principais de negocio (telas faltantes)

- [ ] Criar modulo de Courses no frontend
  - Rotas sugeridas:
    - /cursos (lista)
    - /cursos/novo (criacao)
    - /cursos/:id (detalhe/edicao)
  - Backend alvo:
    - GET /api/courses
    - POST /api/courses
    - GET /api/courses/:id
    - PUT /api/courses/:id
    - DELETE /api/courses/:id
  - Entregaveis de UX:
    - Tabela com titulo, ativo, quantidade de turmas
    - Form de criar/editar com validacao de title obrigatorio
    - Acao de excluir com confirmacao
  - Criterio de aceite:
    - Fluxo completo de CRUD sem curl

- [ ] Criar modulo de Students no frontend
  - Rotas sugeridas:
    - /alunos (lista)
    - /alunos/novo (criacao)
    - /alunos/:id (detalhe/edicao)
  - Backend alvo:
    - GET /api/students
    - POST /api/students
    - GET /api/students/:id
    - PUT /api/students/:id
    - DELETE /api/students/:id
  - Regras de negocio a refletir no form:
    - CPF unico (erros: "Aluno ja cadastrado" / "CPF ja cadastrado")
    - name e cpf obrigatorios
  - Entregaveis de UX:
    - Mascara/normalizacao de CPF
    - Campo de responsavel e contato
    - Toggle ativo/inativo
  - Criterio de aceite:
    - Front previne submissao invalida e exibe erro do backend com contexto

- [ ] Evoluir modulo de Teams para CRUD real
  - Rotas atuais a reaproveitar:
    - /turmas
    - /turmas/:id
  - Rotas adicionais sugeridas:
    - /turmas/nova
    - /turmas/:id/editar
  - Backend alvo:
    - GET /api/teams
    - GET /api/teams?course_id=...
    - POST /api/teams
    - GET /api/teams/:id
    - PUT /api/teams/:id
    - DELETE /api/teams/:id
  - Regras de negocio a refletir:
    - course_id obrigatorio
    - title obrigatorio
    - price obrigatorio e valido
  - Entregaveis de UX:
    - Select de curso baseado em GET /api/courses
    - Campos de agenda (dias/horario/inicio/fim)
    - Acao de exclusao com confirmacao
  - Criterio de aceite:
    - Nao existe mais geracao artificial de id no frontend

---

## P1 - Matriculas e cobranca (fluxos operacionais)

- [ ] Criar fluxo de matricula de aluno em turma
  - Rotas sugeridas:
    - /matriculas (lista)
    - /matriculas/nova (criar)
    - opcional: /alunos/:id/matriculas
  - Backend alvo:
    - GET /api/enrollments
    - POST /api/enrollments
    - GET /api/enrollments/:id
    - GET /api/enrollments/student/:id
  - Regras de negocio a refletir:
    - Impedir dupla matricula na mesma turma (mensagem: "Aluno ja matriculado nesta turma")
    - Validar selecao de aluno e turma
  - Entregaveis de UX:
    - Form com 2 selects (aluno/turma)
    - Lista de matriculas com filtros (aluno, turma)
  - Criterio de aceite:
    - Usuario cria matricula e ve retorno imediatamente na listagem

- [ ] Criar fluxo de cobranca e pagamento
  - Rotas sugeridas:
    - /financeiro/cobrancas-atrasadas
    - /financeiro/gerar-cobrancas
    - /financeiro/pagamentos
  - Backend alvo:
    - GET /api/billing/late
    - POST /api/billing action=generate
    - POST /api/billing action=pay
  - Regras de negocio a refletir:
    - amount > 0 para gerar e pagar
    - generate exige enrollmentId e year
    - pay exige charge_id e method valido (PIX, BOLETO, CREDIT_CARD, DEBIT_CARD)
    - impedir pagamento de cobranca quitada
  - Entregaveis de UX:
    - Lista de atrasados com aluno, turma, vencimento, valor
    - Form para gerar cobrancas anuais por matricula
    - Form para registrar pagamento parcial/total
  - Criterio de aceite:
    - Fluxo financeiro completo operavel via UI

---

## P2 - UX, robustez e padronizacao tecnica

- [ ] Padronizar estados de carregamento em todas as telas de dominio
  - loading inicial
  - loading de submit
  - disabled durante request

- [ ] Padronizar estados de erro e vazio
  - erro de rede
  - 400 com mensagem de negocio
  - 404 para recurso nao encontrado
  - estado vazio (sem registros)

- [ ] Criar componentes reutilizaveis de formulario/tabela/modal
  - reduzir duplicacao entre cursos, alunos, turmas e matriculas

- [ ] Melhorar navegacao principal (menu lateral)
  - incluir entradas para Cursos, Alunos, Turmas, Matriculas e Financeiro
  - indicar rota ativa

- [ ] Implementar refresh otimista e/ou invalidate apos mutacoes
  - apos create/update/delete, atualizar lista sem recarregar pagina inteira

- [ ] Revisar acessibilidade basica
  - labels em todos inputs
  - foco visivel
  - feedback de erro legivel por leitor de tela

- [ ] Revisar responsividade das telas de listagem e detalhe
  - tabela com fallback para mobile
  - formularios usaveis em viewport pequena

---

## P2 - Qualidade e observabilidade no frontend

- [ ] Adicionar testes de interface para fluxos criticos
  - login
  - CRUD de alunos
  - criacao de matricula
  - pagamento de cobranca

- [ ] Garantir tipagem estrita nos formularios
  - usar app/types/api.ts como fonte unica de contratos

- [ ] Evitar chamadas diretas com $fetch em paginas
  - usar composables de dominio existentes

- [ ] Instrumentar logs de erro de frontend (ao menos em dev)
  - facilitar diagnostico de falhas de integracao

---

## Matriz de cobertura (backend -> frontend)

- [ ] Auth
  - Backend pronto: login/logout/me
  - Front pronto: login + middleware + logout
  - Falta: tratamento global de expiracao de sessao/401

- [ ] Courses
  - Backend pronto: CRUD completo
  - Front pronto: composable
  - Falta: telas completas de CRUD

- [ ] Students
  - Backend pronto: CRUD completo + regra de CPF unico
  - Front pronto: composable
  - Falta: telas completas de CRUD + validacao UX

- [ ] Teams
  - Backend pronto: CRUD completo + filtro por curso
  - Front pronto: composable + paginas prototipo
  - Falta: integrar API real + CRUD completo

- [ ] Enrollments
  - Backend pronto: list/get/create/listByStudent
  - Front pronto: composable
  - Falta: telas e fluxo operacional

- [ ] Billing
  - Backend pronto: late + generate/pay
  - Front pronto: composable
  - Falta: telas e fluxo operacional

---

## Ordem sugerida de execucao

- [ ] 1) Eliminar mocks em dashboard e turmas
- [ ] 2) Entregar CRUD de alunos
- [ ] 3) Entregar CRUD de cursos
- [ ] 4) Entregar CRUD real de turmas
- [ ] 5) Entregar fluxo de matriculas
- [ ] 6) Entregar fluxo financeiro (gerar/pagar/atrasadas)
- [ ] 7) Endurecer UX de erro/loading e testes
