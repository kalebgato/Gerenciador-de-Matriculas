# Implantacao e Deploy

## Objetivo da Pagina

Descrever os requisitos e o fluxo tecnico de execucao local e publicacao da aplicacao.

## Escopo

- Inclui ambiente, banco, migration, seed, build e validacao.
- Nao inclui pipeline CI/CD especifica.

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
AUTH_SECRET=troque-essa-chave-em-producao
AUTH_ADMIN_EMAIL=admin@admin.com
AUTH_ADMIN_PASSWORD=123
```

Observacao:

- a chave que ativa ou desativa autenticacao nao vem do ambiente;
- ela e uma constante de build definida em [nuxt.config.ts](nuxt.config.ts):

```ts
const AUTH_ENABLED = true; // altere aqui e rebuilde
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

## Referencias

- [/docs/README.md](/docs/README.md)
- [/docs/quickstart.md](/docs/quickstart.md)
- [/docs/troubleshooting.md](/docs/troubleshooting.md)
