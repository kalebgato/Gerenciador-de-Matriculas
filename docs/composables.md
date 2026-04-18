# Composables

## Objetivo da Pagina

Documentar a camada de composables do frontend, deixando claro o papel de cada composable e como eles encapsulam a integracao com o backend.

## Escopo

- Inclui composables de autenticacao, cliente HTTP e recursos do dominio.
- Nao inclui exemplos completos de tela consumindo cada composable.

## Visao Geral

Os composables do projeto ficam em [/app/composables](/app/composables) e concentram duas responsabilidades:

1. estado compartilhado de frontend;
2. integracao tipada com os endpoints do backend.

## Composables Disponiveis

### useAuth

Arquivo: [/app/composables/useAuth.ts](/app/composables/useAuth.ts)

Responsabilidade:

- controlar o estado da sessao do usuario;
- executar login e logout;
- consultar a sessao atual;
- respeitar o valor de `authEnabled` resolvido em tempo de build.

Metodos principais:

- `login(email, password)`
- `logout()`
- `me()`
- `ensureSession(force?)`

Estado exposto:

- `authEnabled`
- `session`

### useApiClient

Arquivo: [/app/composables/useApiClient.ts](/app/composables/useApiClient.ts)

Responsabilidade:

- encapsular o uso de `$fetch`;
- enviar cookies automaticamente;
- expor verbos HTTP com interface curta e consistente.

Metodos:

- `get`
- `post`
- `put`
- `patch`
- `delete`

### useCourses

Arquivo: [/app/composables/useCourses.ts](/app/composables/useCourses.ts)

Responsabilidade:

- integrar o frontend com o recurso de cursos.

Metodos:

- `list()`
- `getById(id)`
- `create(payload)`
- `update(id, payload)`
- `remove(id)`

### useStudents

Arquivo: [/app/composables/useStudents.ts](/app/composables/useStudents.ts)

Responsabilidade:

- integrar o frontend com o recurso de estudantes.

Metodos:

- `list()`
- `getById(id)`
- `create(payload)`
- `update(id, payload)`
- `remove(id)`

### useTeams

Arquivo: [/app/composables/useTeams.ts](/app/composables/useTeams.ts)

Responsabilidade:

- integrar o frontend com turmas;
- permitir filtro opcional por curso.

Metodos:

- `list(courseId?)`
- `getById(id)`
- `create(payload)`
- `update(id, payload)`
- `remove(id)`

### useEnrollments

Arquivo: [/app/composables/useEnrollments.ts](/app/composables/useEnrollments.ts)

Responsabilidade:

- integrar o frontend com matriculas.

Metodos:

- `list()`
- `getById(id)`
- `listByStudent(studentId)`
- `create(payload)`

### useBilling

Arquivo: [/app/composables/useBilling.ts](/app/composables/useBilling.ts)

Responsabilidade:

- integrar o frontend com cobrancas e pagamentos.

Metodos:

- `listLateCharges()`
- `execute(payload)`

## Types Compartilhados

Os contratos usados pelos composables ficam em [/app/types/api.ts](/app/types/api.ts).

Esse arquivo concentra:

- entidades de dominio do frontend;
- inputs de criacao e atualizacao;
- tipos de resposta da API;
- unioes como `BillingActionInput`.

## Diretriz de Uso

O frontend deve preferir:

1. chamar um composable de dominio a partir da pagina ou componente;
2. evitar `$fetch` direto em tela quando ja existir composable;
3. manter os tipos em `app/types` e nao repetir interfaces locais sem necessidade.

## Exemplos Praticos

### Listar turmas em uma pagina

```ts
const { list } = useTeams();

const { data: teams, pending, error, refresh } = await useAsyncData("teams", () => list());
```

### Buscar turmas por curso

```ts
const selectedCourseId = ref<string | null>(null);
const { list } = useTeams();

const { data: teams } = await useAsyncData(
  "teams-by-course",
  () => list(selectedCourseId.value ?? undefined),
  { watch: [selectedCourseId] },
);
```

### Criar estudante

```ts
const { create } = useStudents();

const form = reactive({
  name: "Aluno Exemplo",
  cpf: "123.456.789-00",
  email: "aluno@example.com",
  dn: "2006-01-01T00:00:00.000Z",
  phone: "99999-0000",
  responsable_name: "Responsavel",
  responsable_phone: "99999-9999",
  active: true,
});

const save = async () => {
  await create(form);
};
```

### Garantir sessao em componente de layout

```ts
const { session, ensureSession } = useAuth();

await ensureSession();
```

## Referencias

- [/docs/README.md](/docs/README.md)
- [/docs/frontend-vue.md](/docs/frontend-vue.md)
- [/docs/autenticacao.md](/docs/autenticacao.md)
