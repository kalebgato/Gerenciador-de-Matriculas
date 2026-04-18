# Arquitetura

## Objetivo da Pagina

Documentar as camadas da aplicacao, a organizacao de diretorios e os principais fluxos.

## Escopo

- Inclui frontend, backend HTTP, dominio e persistencia.
- Nao inclui guia operacional de deploy.

## Visao Geral

O projeto segue uma arquitetura em camadas, com separacao simples entre interface, rotas HTTP, regras de negocio e persistencia.

```plantuml
@startuml arquitetura_geral
skinparam componentStyle rectangle

package "Frontend" {
  [Pages]
  [Components]
  [Composables]
}

package "Backend HTTP" {
  [server/api]
}

package "Regra de Negocio" {
  [Services]
  [Repositories]
}

package "Persistencia" {
  [Prisma Client]
  [PostgreSQL]
}

[Pages] --> [server/api]
[Components] --> [Pages]
[Composables] --> [Pages]
[server/api] --> [Services]
[Services] --> [Repositories]
[Repositories] --> [Prisma Client]
[Prisma Client] --> [PostgreSQL]
@enduml
```

Fonte do diagrama: [docs/plantuml/arquitetura-geral.puml](docs/plantuml/arquitetura-geral.puml).

## Camadas

### Frontend

Fica em app/ e e composto principalmente por paginas, componentes e composables. O Nuxt resolve as rotas de pagina automaticamente a partir de app/pages.

### Backend HTTP

Fica em server/api. Cada arquivo representa um endpoint HTTP. Essa camada e fina: le o request, valida formato minimo, chama o service e traduz excecoes em respostas HTTP.

### Regra de negocio

Fica em server/modules. Cada modulo tem tres arquivos:

- model.ts: definicoes de tipos do dominio local;
- repository.ts: operacoes de acesso a dados;
- service.ts: validacoes e orquestracao.

### Persistencia

O schema do banco fica em prisma/schema.prisma. O client gerado sai em server/generated e e consumido por server/lib/prisma.ts e pelos repositories.

## Organizacao dos Diretorios

```plantuml
@startmindmap
* Gerenciador de Matriculas
** app
*** pages
*** components
*** layouts
*** composables
*** middleware
*** assets
** server
*** api
*** modules
*** lib
*** generated
** prisma
*** schema.prisma
*** migrations
*** seed.ts
** docs
*** markdowns tecnicos
*** diagramas PlantUML
** compose.yaml
** nuxt.config.ts
** package.json
@endmindmap
```

Fonte do diagrama: [docs/plantuml/organizacao-diretorios.puml](docs/plantuml/organizacao-diretorios.puml).

## Responsabilidade por Diretorio

| Diretorio | Responsabilidade |
| --- | --- |
| app/pages | paginas roteaveis do frontend |
| app/components | componentes reutilizaveis |
| app/layouts | layouts compartilhados |
| app/composables | logica reaproveitavel da UI |
| app/middleware | middleware de navegacao do Nuxt |
| app/assets | estilos e recursos estaticos do app |
| server/api | endpoints HTTP |
| server/modules | regras de negocio por modulo |
| server/lib | utilitarios server-side |
| server/generated | artefatos gerados pelo Prisma |
| prisma | schema, migrations e seed |
| docs | documentacao e diagramas |

## Fluxo de Funcionamento

### Fluxo de navegacao atual

1. O usuario acessa o frontend.
2. O middleware global do app verifica a sessao via `useAuth().ensureSession()`.
3. Se necessario, o frontend consulta `GET /api/auth/me`.
4. Rotas protegidas so seguem com sessao valida.
5. O backend tambem valida o cookie nas rotas `/api/*` protegidas.

### Fluxo de requisicao backend

1. O cliente chama uma rota em server/api.
2. A rota interpreta parametros e body.
3. O service do modulo valida as regras de negocio.
4. O repository executa a operacao via Prisma.
5. O resultado volta como JSON.

### Fluxo de matricula

```plantuml
@startuml fluxo_matricula
actor Usuario
participant "Frontend/API Client" as Client
participant "POST /api/enrollments" as Api
participant "EnrollmentService" as Service
participant "EnrollmentRepository" as Repo
database PostgreSQL as Db

Usuario -> Client: solicita matricula
Client -> Api: POST {student_id, team_id}
Api -> Service: enroll(data)
Service -> Db: validar student existente
Db --> Service: ok
Service -> Db: validar team existente
Db --> Service: ok
Service -> Repo: buscar matricula duplicada
Repo -> Db: unique(team_id, student_id)
Db --> Repo: none
Repo --> Service: none
Service -> Repo: create(data)
Repo -> Db: insert enrollment
Db --> Repo: enrollment criado
Repo --> Service: resultado
Service --> Api: resultado
Api --> Client: 200 OK
@enduml
```

Fonte do diagrama: [docs/plantuml/fluxo-matricula.puml](docs/plantuml/fluxo-matricula.puml).

### Fluxo de cobranca

```plantuml
@startuml fluxo_cobranca
actor Usuario
participant Client
participant "POST /api/billing" as Api
participant BillingService as Service
participant BillingRepository as Repo
database PostgreSQL as Db

Usuario -> Client: gerar cobrancas do ano
Client -> Api: POST {action: generate, enrollmentId, year, amount}
Api -> Service: generateMonthlyCharges(...)
Service -> Repo: countChargesByEnrollmentAndYear
Repo -> Db: count charges
Db --> Repo: total
Repo --> Service: total

alt ja existe cobranca no ano
  Service --> Api: erro de duplicidade
  Api --> Client: 400
else nao existe
  loop 12 meses
    Service -> Repo: createCharge(...)
    Repo -> Db: insert charge
    Db --> Repo: ok
  end
  Service --> Api: sucesso
  Api --> Client: 200
end
@enduml
```

Fonte do diagrama: [docs/plantuml/fluxo-cobranca.puml](docs/plantuml/fluxo-cobranca.puml).

## Observacoes de Arquitetura

- O backend esta mais maduro que o frontend.
- A autenticacao agora existe no backend e no frontend, mas ainda em formato simples de usuario administrativo unico.
- A pasta server/generated nao deve ser editada manualmente.
- O arquivo [docs/plantuml/db_relations.wsd](docs/plantuml/db_relations.wsd) representa o modelo relacional de referencia.

## Referencias

- [docs/README.md](docs/README.md)
- [docs/projeto.md](docs/projeto.md)
- [docs/rotas.md](docs/rotas.md)
- [docs/autenticacao.md](docs/autenticacao.md)
