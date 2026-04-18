
# Gerenciador de Matriculas

Sistema web para gestao de matriculas, turmas, estudantes, cobrancas e pagamentos.

O projeto usa Nuxt como frontend e backend, Prisma como camada de persistencia e PostgreSQL como banco de dados. A aplicacao esta organizada em camadas simples e objetivas: paginas Vue no frontend, rotas HTTP em server/api, regras de negocio em server/modules e acesso ao banco com Prisma.

## Visao Geral

- Frontend em Nuxt 4 com Vue 3.
- Backend em rotas server-side do Nuxt com H3.
- Banco PostgreSQL com Prisma ORM.
- Seed e migrations versionadas.
- Documentacao tecnica detalhada em docs.

## Stack

- Nuxt 4.4.2
- Vue 3.5
- Prisma 7.5
- PostgreSQL 18
- Tailwind CSS via plugin Vite
- TypeScript

## Estrutura de Documentacao

- [docs/projeto.md](docs/projeto.md): objetivo, stack, recursos e visao funcional.
- [docs/arquitetura.md](docs/arquitetura.md): arquitetura, diretorios, fluxos e diagramas.
- [docs/deploy.md](docs/deploy.md): ambiente, banco, execucao local e deploy.
- [docs/rotas.md](docs/rotas.md): paginas, APIs, payloads e comportamento das rotas.
- [docs/exemplos-api.md](docs/exemplos-api.md): exemplos praticos de chamadas HTTP.
- [docs/plantuml/arquitetura-geral.puml](docs/plantuml/arquitetura-geral.puml): diagrama de arquitetura.
- [docs/plantuml/fluxo-matricula.puml](docs/plantuml/fluxo-matricula.puml): fluxo de matricula.
- [docs/plantuml/fluxo-cobranca.puml](docs/plantuml/fluxo-cobranca.puml): fluxo de cobranca.
- [docs/plantuml/organizacao-diretorios.puml](docs/plantuml/organizacao-diretorios.puml): mapa de diretorios.

## Execucao Rapida

### 1. Dependencias

```bash
bun install
```

### 2. Banco de dados

```bash
docker compose up -d
```

### 3. Variavel de ambiente

Exemplo de DATABASE_URL:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/db?schema=public
```

### 4. Prisma

```bash
bunx prisma migrate dev --name init
bunx prisma db seed
```

### 5. Aplicacao

```bash
bun run dev
```

## Scripts

- `bun run dev`: sobe o ambiente de desenvolvimento.
- `bun run build`: gera o build de producao.
- `bun run preview`: executa o build gerado.
- `bun run typecheck`: valida a tipagem do projeto.
- `bun run postinstall`: gera o client Prisma e prepara o Nuxt.

## Situacao Atual

O backend esta funcional e possui rotas para cursos, estudantes, turmas, matriculas e cobranca. O frontend ainda mistura telas prototipadas com dados mockados e telas que ainda nao refletem integralmente os endpoints do backend.

Em especial:

- o backend exposto em server/api esta operacional;
- o schema Prisma esta alinhado ao modelo relacional atual;
- a camada de autenticacao no frontend ainda e apenas local, baseada em localStorage;
- parte das paginas ainda usa dados estaticos em vez de consumir a API.

## Diagrama ER

O diagrama da base relacional esta em [docs/db_relations.wsd](docs/db_relations.wsd).
