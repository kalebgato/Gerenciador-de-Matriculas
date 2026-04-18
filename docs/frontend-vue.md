# Organizacao do Frontend Vue

## Objetivo da Pagina

Documentar como os arquivos `.vue` do frontend estao organizados e quais convencoes o projeto esta adotando para templates, scripts, estilos e integracao com o backend.

## Escopo

- Inclui estrutura de paginas, componentes, composables, middleware e estilos.
- Nao inclui design system formal nem biblioteca de componentes dedicada.

## Estrutura Atual

O frontend fica em [app](app) e esta organizado principalmente assim:

- [app/pages](app/pages): paginas roteaveis do Nuxt.
- [app/components](app/components): componentes reutilizaveis.
- [app/composables](app/composables): estado e integracao com backend.
- [app/middleware](app/middleware): protecao e regras de navegacao.
- [app/assets/css/main.css](app/assets/css/main.css): estilos globais.
- [app/types](app/types): contratos tipados usados pelo app.

## Convencao dos Arquivos .vue

### Ordem recomendada

1. `<template>`
2. `<script setup lang='ts'>`
3. `<style scoped>` quando houver conflitos de nomes

### Script

Os scripts devem usar TypeScript:

- `script setup lang='ts'`

Objetivo:

- melhorar inferencia de tipos;
- alinhar com os composables tipados;
- reduzir erros ao integrar com a API.

### Estilos

Regra adotada no projeto:

- estilos base e exclusivos podem ir para [app/assets/css/main.css](app/assets/css/main.css);
- estilos com nomes comuns como `card`, `title`, `table`, `status`, `main`, `sidebar` devem permanecer locais em `<style scoped>` para evitar conflito entre paginas.

### Integracao com backend

Paginas e componentes devem preferir:

- composables de dominio (`useCourses`, `useStudents`, etc.);
- `useAuth()` para sessao;
- `useApiClient()` apenas quando ainda nao existir composable especifico.

## Componentes Reutilizaveis

### AuthLogoutAction

Arquivo: [app/components/AuthLogoutAction.vue](app/components/AuthLogoutAction.vue)

Papel:

- centralizar a acao de logout;
- evitar repeticao de logica em paginas;
- permitir uso como `button`, `p`, `a` ou `span`.

## Middleware de Navegacao

Arquivo principal: [app/middleware/auth.global.ts](app/middleware/auth.global.ts)

Papel:

- proteger paginas por padrao;
- liberar rotas publicas explicitamente;
- redirecionar usuario autenticado para fora da tela de login.

## Paginas Atuais

- [app/pages/login.vue](app/pages/login.vue): login com backend.
- [app/pages/dashboard.vue](app/pages/dashboard.vue): painel inicial.
- [app/pages/index.vue](app/pages/index.vue): listagem/prototipo de turmas.
- [app/pages/turmas/index.vue](app/pages/turmas/index.vue): navegacao de turmas.
- [app/pages/turmas/[id].vue](app/pages/turmas/%5Bid%5D.vue): detalhe de uma turma.

## Regras de Evolucao

Ao criar uma nova pagina ou componente:

1. use `script setup lang='ts'`;
2. extraia acesso HTTP para composables;
3. prefira tipos em `app/types`;
4. mova estilos globais para `app/assets/css/main.css` apenas quando nao houver risco de colisao;
5. use `scoped` quando a classe for genérica ou compartilhavel por nome.

## Exemplos de Estrutura

### Pagina consumindo composable de dominio

```vue
<template>
  <section>
    <h1>Turmas</h1>
    <p v-if="pending">Carregando...</p>
    <p v-else-if="error">Falha ao carregar turmas.</p>
    <ul v-else>
      <li v-for="team in teams ?? []" :key="team.id">
        {{ team.title }}
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const { list } = useTeams();
const { data: teams, pending, error } = await useAsyncData("teams-page", () => list());
</script>

<style scoped>
section {
  display: grid;
  gap: 1rem;
}
</style>
```

### Componente reutilizavel orientado a acao

```vue
<template>
  <button type="button" @click="handleClick">
    Sair
  </button>
</template>

<script setup lang="ts">
const { logout } = useAuth();

const handleClick = async () => {
  await logout();
  await navigateTo("/login");
};
</script>
```

## Referencias

- [docs/README.md](docs/README.md)
- [docs/composables.md](docs/composables.md)
- [docs/autenticacao.md](docs/autenticacao.md)
- [docs/arquitetura.md](docs/arquitetura.md)
