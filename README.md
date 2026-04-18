
# Gerenciador de Matriculas

Sistema web para gestao de matriculas, turmas, estudantes, cobrancas e pagamentos.

## Resumo

- Stack principal: Nuxt 4, Vue 3, Prisma e PostgreSQL.
- Backend em `server/api` + `server/modules` com regras de negocio por dominio.
- Frontend em `app/` com parte das telas ainda em modo prototipo.

## Inicio Rapido

```bash
bun install
docker compose up -d
bunx prisma migrate dev --name init
bunx prisma db seed
bun run dev
```

Aplicacao local padrao: `http://localhost:3000`

## Scripts

- `bun run dev`
- `bun run build`
- `bun run preview`
- `bun run typecheck`

## Documentacao

Toda a documentacao detalhada foi centralizada em [docs/README.md](docs/README.md).

Leituras recomendadas:

- [docs/quickstart.md](docs/quickstart.md)
- [docs/projeto.md](docs/projeto.md)
- [docs/arquitetura.md](docs/arquitetura.md)
- [docs/rotas.md](docs/rotas.md)
- [docs/deploy.md](docs/deploy.md)
- [docs/troubleshooting.md](docs/troubleshooting.md)

## Estado Atual

- Backend funcional para cursos, estudantes, turmas, matriculas e cobranca.
- Frontend com autenticacao local e telas parcialmente mockadas.
