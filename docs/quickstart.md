# Quickstart

## Objetivo da Pagina

Permitir onboarding tecnico rapido para executar e validar o projeto localmente.

## Escopo

- Inclui setup minimo, subida da aplicacao e smoke test.
- Nao inclui cenarios avancados de deploy.

Guia direto para subir o projeto em ambiente local rapidamente.

## Pre-requisitos

- Bun instalado.
- Docker e Docker Compose instalados.

## Passo a passo

### 1. Instalar dependencias

```bash
bun install
```

### 2. Subir PostgreSQL

```bash
docker compose up -d
```

### 3. Configurar ambiente

Garanta que existe uma variavel DATABASE_URL valida no ambiente local.

Exemplo:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/db?schema=public
```

### 4. Aplicar migrations e seed

```bash
bunx prisma migrate dev --name init
bunx prisma db seed
```

### 5. Rodar app

```bash
bun run dev
```

Aplicacao local padrao:

```bash
http://localhost:3000
```

## Validacao rapida

### Build

```bash
bun run build
```

### Typecheck

```bash
bun run typecheck
```

## Rotas para smoke test

```bash
curl -s http://localhost:3000/api/courses
curl -s http://localhost:3000/api/students
curl -s http://localhost:3000/api/teams
curl -s http://localhost:3000/api/enrollments
curl -s http://localhost:3000/api/billing/late
```

Para exemplos detalhados, consulte [docs/exemplos-api.md](docs/exemplos-api.md).

## Referencias

- [docs/README.md](docs/README.md)
- [docs/deploy.md](docs/deploy.md)
- [docs/troubleshooting.md](docs/troubleshooting.md)
