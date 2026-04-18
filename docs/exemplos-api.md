# Exemplos de API

Guia rapido de chamadas HTTP para testar o backend localmente.

Base URL padrao:

```bash
http://localhost:3000
```

## Cursos

### Listar cursos

```bash
curl -s http://localhost:3000/api/courses
```

### Criar curso

```bash
curl -i -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Curso de Violino",
    "active": true
  }'
```

## Estudantes

### Listar estudantes

```bash
curl -s http://localhost:3000/api/students
```

### Criar estudante

```bash
curl -i -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Aluno Exemplo",
    "cpf": "111.222.333-44",
    "email": "aluno.exemplo@email.com",
    "active": true
  }'
```

## Turmas

### Listar turmas

```bash
curl -s http://localhost:3000/api/teams
```

### Criar turma

Use um `course_id` existente:

```bash
curl -i -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": "UUID_DO_CURSO",
    "title": "Turma Noite",
    "horary": "19:00-21:00",
    "days_of_week": "Terca,Quinta",
    "active": true,
    "price": 450
  }'
```

## Matriculas

### Listar matriculas

```bash
curl -s http://localhost:3000/api/enrollments
```

### Criar matricula

```bash
curl -i -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "UUID_DO_ESTUDANTE",
    "team_id": "UUID_DA_TURMA"
  }'
```

### Tentar matricula duplicada

```bash
curl -i -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "UUID_DO_ESTUDANTE",
    "team_id": "UUID_DA_TURMA"
  }'
```

Esperado: HTTP 400 com mensagem de duplicidade.

## Cobranca e Pagamento

### Listar cobrancas atrasadas

```bash
curl -s http://localhost:3000/api/billing/late
```

### Gerar cobrancas de um ano

```bash
curl -i -X POST http://localhost:3000/api/billing \
  -H "Content-Type: application/json" \
  -d '{
    "action": "generate",
    "enrollmentId": "UUID_DA_MATRICULA",
    "year": 2028,
    "amount": 500
  }'
```

### Tentar gerar cobrancas duplicadas no mesmo ano

```bash
curl -i -X POST http://localhost:3000/api/billing \
  -H "Content-Type: application/json" \
  -d '{
    "action": "generate",
    "enrollmentId": "UUID_DA_MATRICULA",
    "year": 2028,
    "amount": 500
  }'
```

Esperado: HTTP 400 com mensagem de duplicidade anual.

### Pagar cobranca

```bash
curl -i -X POST http://localhost:3000/api/billing \
  -H "Content-Type: application/json" \
  -d '{
    "action": "pay",
    "charge_id": "UUID_DA_COBRANCA",
    "amount": 500,
    "method": "PIX"
  }'
```

## Dicas de Teste

- Consulte IDs reais primeiro em `/api/students`, `/api/teams`, `/api/enrollments`.
- Se o banco estiver vazio, rode o seed antes dos testes.
- Se receber HTTP 400, confira se os campos obrigatorios foram enviados com o nome correto.
