# Projeto

## Objetivo da Pagina

Consolidar escopo funcional, stack, recursos e estado atual do produto.

## Escopo

- Inclui visao de dominio, recursos e maturidade do sistema.
- Nao inclui detalhes de rotas endpoint por endpoint.

## Objetivo

O Gerenciador de Matriculas e uma aplicacao para controle academico e financeiro de uma operacao baseada em cursos e turmas. O sistema cobre o cadastro de estudantes, organizacao de cursos, definicao de turmas, matriculas, geracao de cobrancas recorrentes e registro de pagamentos.

## Escopo Funcional

O projeto esta dividido em cinco eixos principais:

1. Cadastro e manutencao de estudantes.
2. Cadastro e manutencao de cursos.
3. Cadastro e manutencao de turmas.
4. Matricula de estudantes em turmas.
5. Controle de cobrancas mensais e pagamentos.

## Stack Tecnologica

| Camada | Tecnologia | Papel |
| --- | --- | --- |
| Interface | Nuxt 4 + Vue 3 | Paginas, navegacao, SSR e UI |
| API | H3 via Nuxt server routes | Endpoints HTTP do sistema |
| Negocio | Services e repositories em TypeScript | Validacoes e orquestracao |
| Persistencia | Prisma ORM | Acesso tipado ao banco |
| Banco | PostgreSQL 18 | Armazenamento relacional |
| Tooling | Bun, Vite, vue-tsc | build, dev e validacao |

## Recursos

### Recursos de cadastro

- estudantes com CPF unico;
- cursos com estado ativo/inativo;
- turmas associadas a um curso;
- turmas com preco, horario, periodo e dias da semana.

### Recursos academicos

- matricula de aluno em turma;
- bloqueio de matricula duplicada na mesma turma;
- consulta de matriculas por aluno e por id.

### Recursos financeiros

- geracao de 12 cobrancas mensais por matricula;
- controle de status da cobranca: PENDING, PAID e OVERDUE;
- registro de pagamento com metodo;
- listagem de cobrancas atrasadas;
- protecao contra geracao duplicada de cobrancas no mesmo ano.

### Recursos de interface

- dashboard visual;
- tela de login local para navegacao do prototipo;
- paginas de turmas e detalhe de turma;
- suporte a fontes, icones, imagens e color mode via modulos do Nuxt.

## Estado Atual do Produto

O projeto ja possui uma base backend utilizavel, mas o frontend ainda esta em transicao entre prototipo e integracao real.

### O que ja esta consolidado

- modelagem relacional do banco;
- migrations e seed;
- rotas de API para os principais recursos;
- services com validacoes de negocio;
- build e typecheck do projeto.

### O que ainda e prototipado

- autenticacao real;
- guardas de rota no backend;
- consumo do backend por todas as paginas;
- dashboard com dados reais;
- telas de turmas com dados vindos da API.

## Entidades do Dominio

| Entidade | Papel |
| --- | --- |
| Student | estudante matriculavel |
| Course | curso que agrupa turmas |
| Team | turma de um curso |
| Enrollment | vinculo entre aluno e turma |
| Charge | cobranca mensal de uma matricula |
| Payment | pagamento de uma cobranca |
| User | usuario administrativo do sistema |

## Observacoes Importantes

- A pagina de login atual nao consulta o backend.
- O frontend usa localStorage para simular sessao.
- Algumas paginas usam dados mockados, enquanto o backend ja expone endpoints reais.

## Referencias

- [docs/README.md](docs/README.md)
- [docs/arquitetura.md](docs/arquitetura.md)
- [docs/rotas.md](docs/rotas.md)
