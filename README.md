
# Gestão de Matrículas

Aplicação para gestão de alunos, turmas, matrículas e cobrança financeira em um sistema escolar.

## Visão geral

Este projeto combina:

- Nuxt 4 para a interface web e APIs do servidor
- Prisma para acesso ao banco de dados
- PostgreSQL como banco relacional
- Docker Compose para subir o banco localmente
- Arquivos de coleção para testes de API em OpenCollection/Bruno

A aplicação cobre os principais processos de uma instituição de ensino:

- cadastro de alunos
- cadastro de turmas
- matrícula de alunos em turmas
- geração de cobranças mensais
- acompanhamento de pagamentos e atrasos

## Stack tecnológica

- Nuxt
- Vue 3
- TypeScript
- Prisma
- PostgreSQL
- Bun
- Docker Compose

## Requisitos

- Node.js ou Bun instalado
- Docker e Docker Compose
- Git

## Configuração inicial

1. Clone o repositório
2. Instale as dependências:

```bash
bun install
```

3. Suba o banco PostgreSQL com Docker:

```bash
docker compose up -d db
```

4. Gere o cliente do Prisma:

```bash
bunx prisma generate
```

5. Aplique as migrações do banco:

```bash
bunx prisma migrate dev --name init
```

6. Popule dados iniciais com o seed:

```bash
bunx tsx ./prisma/seed.ts
```

7. Inicie a aplicação em modo de desenvolvimento:

```bash
bun run dev
```

A API estará disponível em:

```text
http://localhost:3000
```

## Estrutura do projeto

```text
.
├── app/
│   ├── app.vue
│   ├── error.vue
│   ├── assets/
│   └── pages/
├── server/
│   ├── api/
│   ├── generated/
│   ├── lib/
│   └── modules/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
├── compose.yaml
├── nuxt.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── Gestão de Matriculas/
    ├── opencollection.yml
    ├── Students/
    ├── Courses/
    ├── Enrollments/
    └── Billing/
```

## Modelo de dados

O banco é estruturado com os seguintes principais modelos:

- Student
  - id
  - name
  - cpf
  - email
  - phone
  - createdAt

- Course
  - id
  - name
  - description
  - price
  - createdAt

- Team
  - id
  - name
  - schedule
  - courseId
  - createdAt

- Enrollment
  - id
  - studentId
  - teamId
  - startDate
  - active

- Charge
  - id
  - enrollmentId
  - year
  - month
  - amount
  - dueDate
  - status

- Payment
  - id
  - chargeId
  - amount
  - method
  - paidAt

## Endpoints da API

### Alunos

- GET /api/students
  - Lista todos os alunos.

- POST /api/students
  - Cria um aluno novo.

- GET /api/students/:id
  - Busca um aluno pelo id.

- PUT /api/students/:id
  - Atualiza dados do aluno.

- DELETE /api/students/:id
  - Remove um aluno.

### Turmas

- GET /api/courses
  - Lista todas as turmas.

- POST /api/courses
  - Cria uma nova turma.

- GET /api/courses/:id
  - Busca uma turma pelo id.

- PUT /api/courses/:id
  - Atualiza uma turma.

- DELETE /api/courses/:id
  - Remove uma turma.

### Matrículas

- GET /api/enrollments
  - Lista as matrículas.

- POST /api/enrollments
  - Cria uma matrícula vinculando aluno e turma.

- GET /api/enrollments/:id
  - Busca uma matrícula pelo id.

- GET /api/enrollments/student/:id
  - Lista as matrículas de um aluno específico.

### Cobrança

- POST /api/billing
  - Gera cobranças mensais ou registra um pagamento, de acordo com o campo action.

- GET /api/billing/late
  - Retorna cobranças em atraso.

### Exemplos de payload

#### Criação de aluno

```json
{
  "name": "Fulana",
  "cpf": "000.000.000-05",
  "email": "email@email.com",
  "phone": "90000-0000"
}
```

#### Criação de turma

```json
{
  "name": "TURMA 2",
  "schedule": "Segunda e quarta de 10h às 11:30",
  "price": "120.15"
}
```

#### Matrícula

```json
{
  "studentId": "<student_id>",
  "classId": "<team_id>"
}
```

#### Cobrança mensal

```json
{
  "action": "generate",
  "enrollmentId": "<enrollment_id>",
  "year": 2026,
  "amount": 120.15
}
```

## Coleção de requisições

A pasta [Gestão de Matriculas](Gestão%20de%20Matriculas) contém arquivos de coleção para testes de API em formato OpenCollection, incluindo exemplos para estudantes, cursos, matrículas e cobrança.

## Observações importantes

- O projeto usa UUID como identificador principal para alunos, turmas e matrículas.
- O Prisma gera os tipos e modelos em [server/generated](server/generated).
- O banco pode ser gerenciado e validado com Prisma CLI.
- A aplicação ainda pode receber refinamentos de validação e padronização de respostas HTTP.

## Fluxo recomendado para desenvolvimento

```bash
bun install
docker compose up -d db
bunx prisma generate
bunx prisma migrate dev --name init
bunx tsx ./prisma/seed.ts
bun run dev
```

## Licença

Este projeto está sob a mesma licença do repositório principal, conforme indicado no arquivo LICENSE.

