# Troubleshooting

## Objetivo da Pagina

Registrar falhas recorrentes e procedimentos curtos de resolucao.

## Escopo

- Inclui build, typecheck, prisma e erros comuns de API.
- Nao inclui troubleshooting de infraestrutura de producao.

Erros comuns do projeto e formas de resolucao.

## 1. Build falha por CSS nao encontrado

### Sintoma

Mensagem parecida com:

```text
Could not resolve "./app/assets/css/main.css"
```

### Causa

Caminho do CSS no Nuxt apontando para arquivo inexistente.

### Solucao

Validar o caminho em [nuxt.config.ts](nuxt.config.ts) e conferir o arquivo real em [/app/assets/main.css](/app/assets/main.css).

## 2. Prisma sem conexao com banco

### Sintoma

Erros de autenticacao ou conexao na migration/seed.

### Causa

- DATABASE_URL incorreta;
- container do PostgreSQL nao iniciado;
- porta 5432 ocupada por outra instancia.

### Solucao

1. Verificar se o banco subiu:

```bash
docker compose ps
```

2. Conferir DATABASE_URL.
3. Reaplicar migration:

```bash
bunx prisma migrate dev --name init
```

## 3. Typecheck falha com dependencias do Vue

### Sintoma

Erro envolvendo `@vue/language-core` ou `vue-tsc`.

### Causa

Dependencias de typecheck ausentes no ambiente.

### Solucao

```bash
bun install
bun run typecheck
```

Se necessario, confirme no [package.json](package.json) se `vue-tsc` e `@vue/language-core` estao em devDependencies.

## 4. API retorna 400 em matricula

### Sintoma

Resposta 400 em `POST /api/enrollments`.

### Causas comuns

- `student_id` ausente;
- `team_id` ausente;
- estudante nao existe;
- turma nao existe;
- matricula duplicada na mesma turma.

### Solucao

1. Validar payload.
2. Validar IDs existentes via:

```bash
curl -s http://localhost:3000/api/students
curl -s http://localhost:3000/api/teams
```

3. Repetir o POST com IDs validos.

## 5. API retorna 400 em billing generate

### Sintoma

Resposta 400 em `POST /api/billing` com acao generate.

### Causas comuns

- body sem `action`;
- `enrollmentId` ausente;
- `year` ausente;
- `amount` menor ou igual a zero;
- cobrancas do ano ja existem para a matricula.

### Solucao

Payload valido:

```json
{
  "action": "generate",
  "enrollmentId": "UUID_DA_MATRICULA",
  "year": 2028,
  "amount": 500
}
```

## 6. API retorna 400 em billing pay

### Sintoma

Resposta 400 em `POST /api/billing` com acao pay.

### Causas comuns

- `charge_id` ausente;
- `method` invalido;
- valor de pagamento invalido;
- cobranca ja quitada.

### Solucao

Payload valido:

```json
{
  "action": "pay",
  "charge_id": "UUID_DA_COBRANCA",
  "amount": 500,
  "method": "PIX"
}
```

Metodos aceitos: CREDIT_CARD, DEBIT_CARD, BOLETO, PIX.

## 7. Frontend loga mas backend continua sem protecao

### Sintoma

Usuario acessa telas apos login local, mas APIs nao exigem autenticacao.

### Causa

Autenticacao atual e apenas no frontend com localStorage.

### Solucao

Evoluir para autenticacao real com token/sessao e middleware backend.

## Referencias

- [/docs/README.md](/docs/README.md)
- [/docs/deploy.md](/docs/deploy.md)
- [/docs/rotas.md](/docs/rotas.md)
