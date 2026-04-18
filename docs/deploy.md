# Implantacao e Deploy

## Requisitos

- Bun instalado para executar scripts locais.
- Docker e Docker Compose para o banco PostgreSQL.
- Variavel DATABASE_URL configurada.

## Banco de Dados

O projeto inclui um compose simples em [compose.yaml](compose.yaml) com um container PostgreSQL.

### Parametros atuais

| Chave | Valor |
| --- | --- |
| imagem | postgres:18 |
| porta | 5432 |
| database | db |
| usuario | postgres |
| senha | postgres |
| container | db_psql |

## Variaveis de Ambiente

Exemplo:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/db?schema=public
```

O arquivo [prisma.config.ts](prisma.config.ts) carrega o .env com override. Isso garante que a URL local do projeto prevaleca sobre variaveis exportadas no shell.

## Subida Local

### 1. Instalar dependencias

```bash
bun install
```

### 2. Subir o banco

```bash
docker compose up -d
```

### 3. Aplicar migrations

```bash
bunx prisma migrate dev --name init
```

### 4. Popular com seed

```bash
bunx prisma db seed
```

### 5. Rodar aplicacao

```bash
bun run dev
```

## Build e Validacao

```bash
bun run build
bun run typecheck
```

## Deploy de Aplicacao

Hoje o projeto esta preparado principalmente para execucao em ambiente Node com build do Nuxt. O fluxo basico de deploy e:

1. provisionar PostgreSQL;
2. configurar DATABASE_URL;
3. instalar dependencias;
4. gerar Prisma Client e preparar Nuxt;
5. executar migrations;
6. gerar build com `bun run build`;
7. publicar a saida do Nuxt em ambiente Node.

## Artefatos Importantes

| Arquivo | Papel |
| --- | --- |
| [package.json](package.json) | scripts de dev, build e typecheck |
| [nuxt.config.ts](nuxt.config.ts) | configuracao da aplicacao Nuxt |
| [compose.yaml](compose.yaml) | PostgreSQL local |
| [prisma.config.ts](prisma.config.ts) | configuracao do Prisma |
| [prisma/schema.prisma](prisma/schema.prisma) | schema do banco |
| [prisma/seed.ts](prisma/seed.ts) | dados iniciais |

## Observacoes Operacionais

- O projeto usa o Prisma com output customizado em server/generated.
- As migrations ficam em prisma/migrations.
- O typecheck depende de `vue-tsc` e `@vue/language-core` declarados no projeto.
- O frontend ainda contem paginas com dados mockados; isso nao bloqueia o deploy tecnico, mas limita a aderencia funcional da interface ao backend.
