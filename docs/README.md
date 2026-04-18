# Documentacao Tecnica

Este diretorio concentra toda a documentacao detalhada do projeto.

## Padrao de Documentacao

- Versao do padrao: `v1.0`
- Data de referencia: `2026-04-18`
- Idioma: Portugues (pt-BR)

Cada documento deve conter:

1. Objetivo da pagina.
2. Escopo.
3. Conteudo tecnico.
4. Referencias cruzadas para outras paginas.

Template oficial: [docs/template.md](docs/template.md)

## Sumario

### Frontend

- [docs/quickstart.md](docs/quickstart.md): onboarding rapido para rodar o projeto.
- [docs/projeto.md](docs/projeto.md): escopo funcional, recursos e estado atual.
- [docs/arquitetura.md](docs/arquitetura.md): camadas, diretorios e fluxos.
- [docs/composables.md](docs/composables.md): composables do frontend e responsabilidade de cada um.
- [docs/frontend-vue.md](docs/frontend-vue.md): convencoes e organizacao dos arquivos Vue.
- [docs/rotas.md](docs/rotas.md): paginas e endpoints da API.
- [docs/exemplos-api.md](docs/exemplos-api.md): chamadas HTTP praticas com curl.

### Seguranca

- [docs/autenticacao.md](docs/autenticacao.md): implementacao da autenticacao no app e no server.
- [docs/fluxo-autenticacao.md](docs/fluxo-autenticacao.md): sequencia de login, validacao de sessao e logout.

### Operacao

- [docs/deploy.md](docs/deploy.md): setup de ambiente e fluxo de deploy.
- [docs/troubleshooting.md](docs/troubleshooting.md): erros comuns e resolucao.

## Diagramas

- [docs/plantuml/arquitetura-geral.puml](docs/plantuml/arquitetura-geral.puml)
- [docs/plantuml/organizacao-diretorios.puml](docs/plantuml/organizacao-diretorios.puml)
- [docs/plantuml/fluxo-matricula.puml](docs/plantuml/fluxo-matricula.puml)
- [docs/plantuml/fluxo-cobranca.puml](docs/plantuml/fluxo-cobranca.puml)
- [docs/plantuml/fluxo-autenticacao.puml](docs/plantuml/fluxo-autenticacao.puml)
- [docs/plantuml/db_relations.wsd](docs/plantuml/db_relations.wsd)
