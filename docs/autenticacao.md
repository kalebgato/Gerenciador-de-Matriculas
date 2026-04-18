# Autenticacao

## Objetivo da Pagina

Documentar como a autenticacao foi implementada no backend e no frontend, quais endpoints participam do processo e como o recurso pode ser habilitado ou desabilitado.

## Escopo

- Inclui middleware do server, endpoints de auth, cookie de sessao e controle no app.
- Nao inclui estrategia de multiusuario, RBAC ou recuperacao de senha.

## Visao Geral

O projeto usa autenticacao simples baseada em cookie httpOnly assinado. O backend valida a sessao em `server/middleware/auth.ts` e o frontend consome o estado atual via `useAuth()` e `app/middleware/auth.global.ts`.

## Pecas Principais

### Backend

- [server/lib/auth.ts](server/lib/auth.ts): assinatura e verificacao do token de sessao.
- [server/middleware/auth.ts](server/middleware/auth.ts): protege rotas `/api/*` quando a autenticacao esta ligada.
- [server/api/auth/login.post.ts](server/api/auth/login.post.ts): autentica usuario administrativo e cria cookie.
- [server/api/auth/logout.post.ts](server/api/auth/logout.post.ts): invalida a sessao atual.
- [server/api/auth/me.get.ts](server/api/auth/me.get.ts): informa ao frontend se existe sessao valida.

### Frontend

- [app/composables/useAuth.ts](app/composables/useAuth.ts): estado compartilhado da sessao e operacoes de login/logout.
- [app/middleware/auth.global.ts](app/middleware/auth.global.ts): aplica protecao padrao nas paginas.
- [app/pages/login.vue](app/pages/login.vue): formulario de login que chama o backend.
- [app/components/AuthLogoutAction.vue](app/components/AuthLogoutAction.vue): acao de logout reutilizavel.

## Modo de Funcionamento

1. O usuario envia email e senha para `POST /api/auth/login`.
2. O backend compara com as credenciais configuradas no `runtimeConfig`.
3. Em caso de sucesso, o backend cria um token assinado e grava um cookie httpOnly.
4. O frontend consulta `GET /api/auth/me` para montar o estado de sessao.
5. O middleware global do app decide se a rota pode seguir ou deve redirecionar.
6. O middleware do server protege os endpoints de negocio usando o mesmo cookie.

## Toggle de Autenticacao

A autenticacao e controlada por uma constante de build definida diretamente em [nuxt.config.ts](nuxt.config.ts).

```ts
// Altere aqui para habilitar ou desabilitar autenticacao no build.
const AUTH_ENABLED = true;
```

- `AUTH_ENABLED = true`: backend e frontend exigem autenticacao.
- `AUTH_ENABLED = false`: backend libera acesso e o frontend pula a validacao de sessao sem fazer nenhuma requisicao.

Essa constante alimenta dois lugares:

- `runtimeConfig.auth.enabled`: lido pelo backend no servidor.
- `runtimeConfig.public.authEnabled`: embutido no build do frontend.

O frontend nao precisa consultar o backend para saber o estado do toggle. O valor e resolvido em tempo de build.

Configuracao central:

- [nuxt.config.ts](nuxt.config.ts)

Variaveis de ambiente relevantes (credenciais e segredo, nao o toggle):

- `AUTH_SECRET`
- `AUTH_ADMIN_EMAIL`
- `AUTH_ADMIN_PASSWORD`

## Credenciais Atuais

Por padrao, o login administrativo usa valores definidos em ambiente ou fallback local:

- email: `admin@admin.com`
- senha: `123`

Em producao, o correto e sobrescrever isso por ambiente.

## Limitacoes Atuais

- Existe apenas um usuario administrativo configurado por credenciais fixas em ambiente/configuracao.
- Nao ha persistencia de sessoes em banco ou redis.
- Nao ha papeis, permissoes ou expiracao com renovacao silenciosa.

## Referencias

- [docs/README.md](docs/README.md)
- [docs/fluxo-autenticacao.md](docs/fluxo-autenticacao.md)
- [docs/rotas.md](docs/rotas.md)
- [docs/deploy.md](docs/deploy.md)
