export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Gerenciador de Matriculas API",
    description:
      "Documentacao Swagger dos endpoints do backend em server/api.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "/",
      description: "Servidor atual",
    },
  ],
  tags: [
    { name: "Auth", description: "Autenticacao e sessao" },
    { name: "Courses", description: "Gestao de cursos" },
    { name: "Students", description: "Gestao de estudantes" },
    { name: "Teams", description: "Gestao de turmas" },
    { name: "Enrollments", description: "Gestao de matriculas" },
    { name: "Billing", description: "Cobrancas e pagamentos" },
  ],
  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Realiza login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login realizado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    authEnabled: { type: "boolean" },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Realiza logout",
        responses: {
          200: {
            description: "Logout realizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessMessage" },
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Retorna sessao atual",
        responses: {
          200: {
            description: "Sessao valida",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    authenticated: { type: "boolean" },
                    authEnabled: { type: "boolean" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        email: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/courses": {
      get: {
        tags: ["Courses"],
        summary: "Lista cursos",
        responses: {
          200: {
            description: "Lista de cursos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/CourseWithTeams" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Courses"],
        summary: "Cria curso",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CourseCreateInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Curso criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Course" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/courses/{id}": {
      get: {
        tags: ["Courses"],
        summary: "Busca curso por id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: {
            description: "Curso encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CourseWithTeams" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Courses"],
        summary: "Atualiza curso",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CourseUpdateInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Curso atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Course" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Courses"],
        summary: "Remove curso",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: {
            description: "Curso removido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessMessage" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/students": {
      get: {
        tags: ["Students"],
        summary: "Lista estudantes",
        responses: {
          200: {
            description: "Lista de estudantes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Student" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Students"],
        summary: "Cria estudante",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/StudentCreateInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Estudante criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Student" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/students/{id}": {
      get: {
        tags: ["Students"],
        summary: "Busca estudante por id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: {
            description: "Estudante encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Student" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Students"],
        summary: "Atualiza estudante",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/StudentUpdateInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Estudante atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Student" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Students"],
        summary: "Remove estudante",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: {
            description: "Estudante removido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessMessage" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/teams": {
      get: {
        tags: ["Teams"],
        summary: "Lista turmas",
        parameters: [
          {
            name: "course_id",
            in: "query",
            required: false,
            description: "Filtra turmas por curso",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Lista de turmas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/TeamWithCourse" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Teams"],
        summary: "Cria turma",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TeamCreateInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Turma criada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Team" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/teams/{id}": {
      get: {
        tags: ["Teams"],
        summary: "Busca turma por id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: {
            description: "Turma encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TeamWithCourse" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Teams"],
        summary: "Atualiza turma",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TeamUpdateInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Turma atualizada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Team" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
      delete: {
        tags: ["Teams"],
        summary: "Remove turma",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: {
            description: "Turma removida",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessMessage" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/enrollments": {
      get: {
        tags: ["Enrollments"],
        summary: "Lista matriculas",
        responses: {
          200: {
            description: "Lista de matriculas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/EnrollmentWithRelations" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Enrollments"],
        summary: "Cria matricula",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EnrollmentCreateInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Matricula criada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Enrollment" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/enrollments/{id}": {
      get: {
        tags: ["Enrollments"],
        summary: "Busca matricula por id",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          200: {
            description: "Matricula encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EnrollmentWithRelations" },
              },
            },
          },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/enrollments/student/{id}": {
      get: {
        tags: ["Enrollments"],
        summary: "Lista matriculas por estudante",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do estudante",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Matriculas do estudante",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/EnrollmentWithTeam" },
                },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/billing": {
      post: {
        tags: ["Billing"],
        summary: "Gera cobrancas ou registra pagamento",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  { $ref: "#/components/schemas/BillingGenerateInput" },
                  { $ref: "#/components/schemas/BillingPayInput" },
                ],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Operacao concluida",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessMessage" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/api/billing/late": {
      get: {
        tags: ["Billing"],
        summary: "Lista cobrancas atrasadas",
        responses: {
          200: {
            description: "Lista de cobrancas atrasadas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/LateCharge" },
                },
              },
            },
          },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
  },
  components: {
    parameters: {
      IdParam: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
      },
    },
    responses: {
      BadRequest: {
        description: "Erro de validacao",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Unauthorized: {
        description: "Nao autenticado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      NotFound: {
        description: "Recurso nao encontrado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      InternalError: {
        description: "Erro interno",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
    schemas: {
      SuccessMessage: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
        required: ["message"],
      },
      ErrorResponse: {
        type: "object",
        properties: {
          statusCode: { type: "integer", example: 400 },
          statusMessage: { type: "string", example: "Parametros invalidos" },
        },
        required: ["statusCode", "statusMessage"],
      },
      Course: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          active: { type: "boolean" },
        },
        required: ["id", "title", "active"],
      },
      CourseWithTeams: {
        allOf: [
          { $ref: "#/components/schemas/Course" },
          {
            type: "object",
            properties: {
              teams: {
                type: "array",
                items: { $ref: "#/components/schemas/Team" },
              },
            },
          },
        ],
      },
      CourseCreateInput: {
        type: "object",
        properties: {
          title: { type: "string" },
          active: { type: "boolean", default: true },
        },
        required: ["title"],
      },
      CourseUpdateInput: {
        type: "object",
        properties: {
          title: { type: "string" },
          active: { type: "boolean" },
        },
      },
      Student: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          cpf: { type: "string" },
          email: { type: "string", nullable: true },
          dn: { type: "string", format: "date-time", nullable: true },
          phone: { type: "string", nullable: true },
          responsable_name: { type: "string", nullable: true },
          responsable_phone: { type: "string", nullable: true },
          active: { type: "boolean" },
        },
        required: ["id", "name", "cpf", "active"],
      },
      StudentCreateInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          cpf: { type: "string" },
          email: { type: "string" },
          dn: { type: "string", format: "date-time" },
          phone: { type: "string" },
          responsable_name: { type: "string" },
          responsable_phone: { type: "string" },
          active: { type: "boolean", default: true },
        },
        required: ["name", "cpf"],
      },
      StudentUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          cpf: { type: "string" },
          email: { type: "string" },
          dn: { type: "string", format: "date-time" },
          phone: { type: "string" },
          responsable_name: { type: "string" },
          responsable_phone: { type: "string" },
          active: { type: "boolean" },
        },
      },
      Team: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          course_id: { type: "string", format: "uuid" },
          title: { type: "string" },
          team_leader_id: { type: "string", nullable: true },
          start_date: { type: "string", format: "date-time", nullable: true },
          end_date: { type: "string", format: "date-time", nullable: true },
          horary: { type: "string", nullable: true },
          days_of_week: { type: "string", nullable: true },
          active: { type: "boolean" },
          payment_date: { type: "string", format: "date-time", nullable: true },
          price: { type: "number" },
        },
        required: ["id", "course_id", "title", "active", "price"],
      },
      TeamWithCourse: {
        allOf: [
          { $ref: "#/components/schemas/Team" },
          {
            type: "object",
            properties: {
              course: { $ref: "#/components/schemas/Course" },
            },
          },
        ],
      },
      TeamCreateInput: {
        type: "object",
        properties: {
          course_id: { type: "string", format: "uuid" },
          title: { type: "string" },
          team_leader_id: { type: "string" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          horary: { type: "string" },
          days_of_week: { type: "string" },
          active: { type: "boolean", default: true },
          payment_date: { type: "string", format: "date-time" },
          price: { type: "number" },
        },
        required: ["course_id", "title", "price"],
      },
      TeamUpdateInput: {
        type: "object",
        properties: {
          title: { type: "string" },
          team_leader_id: { type: "string" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          horary: { type: "string" },
          days_of_week: { type: "string" },
          active: { type: "boolean" },
          payment_date: { type: "string", format: "date-time" },
          price: { type: "number" },
        },
      },
      Enrollment: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          student_id: { type: "string", format: "uuid" },
          team_id: { type: "string", format: "uuid" },
        },
        required: ["id", "student_id", "team_id"],
      },
      EnrollmentWithRelations: {
        allOf: [
          { $ref: "#/components/schemas/Enrollment" },
          {
            type: "object",
            properties: {
              student: { $ref: "#/components/schemas/Student" },
              team: { $ref: "#/components/schemas/Team" },
            },
          },
        ],
      },
      EnrollmentWithTeam: {
        allOf: [
          { $ref: "#/components/schemas/Enrollment" },
          {
            type: "object",
            properties: {
              team: { $ref: "#/components/schemas/Team" },
            },
          },
        ],
      },
      EnrollmentCreateInput: {
        type: "object",
        properties: {
          student_id: { type: "string", format: "uuid" },
          team_id: { type: "string", format: "uuid" },
        },
        required: ["student_id", "team_id"],
      },
      ChargeStatus: {
        type: "string",
        enum: ["PENDING", "PAID", "OVERDUE"],
      },
      PaymentMethod: {
        type: "string",
        enum: ["CREDIT_CARD", "DEBIT_CARD", "BOLETO", "PIX"],
      },
      Payment: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          enrollment_id: { type: "string", format: "uuid" },
          charge_id: { type: "string", format: "uuid" },
          amount: { type: "number" },
          payment_date: { type: "string", format: "date-time" },
          method: { $ref: "#/components/schemas/PaymentMethod" },
        },
        required: [
          "id",
          "enrollment_id",
          "charge_id",
          "amount",
          "payment_date",
          "method",
        ],
      },
      Charge: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          enrollment_id: { type: "string", format: "uuid" },
          year: { type: "integer" },
          month: { type: "integer", minimum: 1, maximum: 12 },
          amount: { type: "number" },
          due_date: { type: "string", format: "date-time" },
          paid: { type: "boolean" },
          status: { $ref: "#/components/schemas/ChargeStatus" },
          payments: {
            type: "array",
            items: { $ref: "#/components/schemas/Payment" },
          },
        },
        required: [
          "id",
          "enrollment_id",
          "year",
          "month",
          "amount",
          "due_date",
          "paid",
          "status",
        ],
      },
      LateCharge: {
        allOf: [
          { $ref: "#/components/schemas/Charge" },
          {
            type: "object",
            properties: {
              enrollment: {
                allOf: [
                  { $ref: "#/components/schemas/Enrollment" },
                  {
                    type: "object",
                    properties: {
                      student: { $ref: "#/components/schemas/Student" },
                      team: { $ref: "#/components/schemas/Team" },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      BillingGenerateInput: {
        type: "object",
        properties: {
          action: { type: "string", enum: ["generate"] },
          enrollmentId: { type: "string", format: "uuid" },
          year: { type: "integer", minimum: 2000 },
          amount: { type: "number", minimum: 0.01 },
        },
        required: ["action", "enrollmentId", "year", "amount"],
      },
      BillingPayInput: {
        type: "object",
        properties: {
          action: { type: "string", enum: ["pay"] },
          charge_id: { type: "string", format: "uuid" },
          amount: { type: "number", minimum: 0.01 },
          method: { $ref: "#/components/schemas/PaymentMethod" },
        },
        required: ["action", "charge_id", "amount", "method"],
      },
    },
  },
} as const;
