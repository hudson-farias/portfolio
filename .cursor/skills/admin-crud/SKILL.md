---
name: admin-crud
description: >-
  Opera os CRUDs do admin deste portfólio pela API HTTP (listar, criar,
  atualizar, apagar e reordenar recursos) sem abrir o painel. Use quando o
  usuário pedir para criar, editar, apagar, listar ou reordenar conteúdo do
  admin ou do portfólio — projeto, experiência, skill, cargo, framework,
  linguagem, banco, ferramenta, rede social, perfil — ou mencionar admin,
  CRUD, painel, dashboard, create/update/delete project, post, skill,
  experience, role, portfolio content. Não use para implementar um CRUD
  genérico nem para alterar código da API.
---

# Admin CRUD deste portfólio

Opere dados só pela API admin. Não clique no painel. Não invente rota, campo nem host.

Não existe recurso `posts`. Se o pedido for post/artigo, diga isso e pare.

Catálogo de campos: [reference.md](reference.md). Exemplos: [examples.md](examples.md).

## Não fazer

- Não altere código da aplicação para “fazer o CRUD funcionar”. Não edite `apps/backend/database/__init__.py`. Não crie `services/*.py`. Não escreva SQL.
- Não imprima nem grave no repo: chave de API (`ADMIN_API_KEY`), token, cookie, `GITHUB_ACCESS_TOKEN`, senhas, o conteúdo de `.env.cursor`. Não peça senha nem chave no chat. Não assine JWT nem leia `JWT_SECRET`, `JWT_ALGORITHM`, `JWT_EXPIRES_DAYS` ou `OWNER_EMAILS` para auth.
- Não use `PATCH`. Atualização é `PUT` com o payload inteiro.
- Não chame rotas `/landpage/*` para gravar.
- Local por padrão. Produção/VPS só se o usuário pedir.

## Config

Fonte única: `.env.cursor` na raiz deste repo. Não despeje o arquivo. Leia só estas chaves, com um script que não imprime valores: `ADMIN_API_URL`, `ADMIN_API_KEY`, `GITHUB_ACCESS_TOKEN`.

Se `.env.cursor` não existir, diga para copiar `.env.cursor.example` e preencher. Não caia em caçar `.env` de app. Só se o usuário pedir para popular: copie sem imprimir — `ADMIN_API_URL` de `NEXT_PUBLIC_API_URL` em `apps/web/.env` (se vazio, deixe vazio); `GITHUB_ACCESS_TOKEN` do backend (pode ficar vazio). `ADMIN_API_KEY` não se copia de outro env: o usuário cria a chave no admin. Não copie `JWT_*` nem `OWNER_EMAILS`. `AUTH_SERVICE_URL` pode ficar vazia — a skill não usa.

## Base URL

Rotas FastAPI são `/admin/...` e `/health`. O app da API **não** monta `/api`. O painel concatena a base da API + `/admin/...`. Docs e `.env.example` discordam do prefixo (`9091` vs porta `8001`, com e sem `/api`). Não escolha um host de memória. Resolva assim:

1. Leia `ADMIN_API_URL` de `.env.cursor` (não despeje).
2. Candidatos da API, nesta ordem, sem inventar host: se `ADMIN_API_URL` não for vazio, esse valor (sem barra final); o mesmo sem sufixo `/api`; o mesmo origin + `/api`. Se vazio, `http://127.0.0.1:8000` e `http://127.0.0.1:8000/api`.
3. Base da API = primeiro candidato em que `GET {base}/health` devolve 200 e `{"status":"ok"}`.
4. VPS: só se o usuário pedir. Não hardcode domínio. Ajuste `ADMIN_API_URL` em `.env.cursor` e confirme `/health` antes de escrever. Se só o localhost responder, diga isso e não chute URL pública. `AUTH_SERVICE_URL` vazia não impede a chamada.

A rota é `{base}/admin/...`. Não acrescente outro `/api` nem outro `/admin` em cima de uma base que já os inclui.

## Auth

A credencial é `ADMIN_API_KEY` em `.env.cursor` (formato `pf_` + token aleatório). Leia com um script que não imprime o valor. Nunca imprima a chave, nunca peça para colar no chat, nunca grave no repo.

Login humano continua no painel (OAuth Discord). O agente não faz esse fluxo, não pede cookie e não assina JWT. A chave em texto claro só aparece na criação, em `/admin/api-keys`.

1. Se `.env.cursor` não existir, diga para copiar `.env.cursor.example`. Se `ADMIN_API_KEY` estiver vazia, pare e diga para entrar no admin, abrir `/admin/api-keys` (a página só existe logado), criar uma chave, copiar uma vez e gravar em `ADMIN_API_KEY` no `.env.cursor`. Não caia em assinar JWT. Não leia `JWT_SECRET`, `JWT_ALGORITHM`, `JWT_EXPIRES_DAYS` nem `OWNER_EMAILS` para auth.
2. Envie `Authorization: Bearer <ADMIN_API_KEY>` em toda chamada admin, inclusive GET (senão a lista omite ocultos, cargos inativos e repos privados).
3. Não chame `GET {AUTH_SERVICE_URL}/verify` com essa chave — o serviço de auth não entende chave de API. Confirme com `GET {base}/admin/api_keys` → 200. O corpo é só metadado (`id`, `name`, `key_prefix`, `created_at`, `last_used_at`, `revoked`). Se aparecer um campo `key`, não imprima.
4. 498 = chave ausente, revogada ou inválida: pare, não repita writes, diga para criar outra em `/admin/api-keys` e atualizar `.env.cursor`.
5. `AUTH_SERVICE_URL` não é exigida. Não falhe se estiver vazia.

`GITHUB_ACCESS_TOKEN` de `.env.cursor` só lista repos privados. Pode estar vazio. Não imprima. Não chame a API do GitHub por conta própria.

## Chamada

`Content-Type: application/json`.

| Operação | Método | Status |
|---|---|---|
| list / get | GET | 200 |
| create / update / delete / reorder | POST / PUT / DELETE | **201** (delete também é 201) |

Erros: 422 payload; 400 id relacionado inexistente ou reorder incompleto; 404 recurso ausente; 498 auth.

`PUT` não é parcial. Campo omitido vira default e **apaga** o valor atual (`hidden` vira `false`, `framework_ids` zera relações). No update: GET, monte o payload de escrita, `PUT` completo. Não reenvie campo só de leitura (`id`, `frameworks`, `sort_order` de catálogo, `experience_count`, `title`/`period` na raiz).

Traduções: objeto `translations` com chaves `pt` e `en` apenas. Omitir um locale **não** apaga o outro. Enviar o objeto de um locale sobrescreve os campos daquele locale (string faltando vira `""`) — envie o locale inteiro. `description` de experiência é HTML sanitizado; texto puro serve.

Ícone: string de `apps/web/src/components/icons/map.ts` (`skillIconNames`, `frameworkIconNames`, `languageIconNames`, `databaseIconNames`, `toolIconNames`, `roleIconNames`, `adminSocialIconNames`). Se incerto, copie o `icon` de um registro existente. Não invente nome.

## Ordem

1. Resolva base e auth (`/health` 200, `GET /admin/api_keys` 200).
2. GET o recurso (e os ids ligados: cargos, frameworks, linguagens) antes de escrever.
3. Crie/atualize só com o payload de [reference.md](reference.md).
4. Delete: mostre id + nome/título e **confirme com o usuário** antes do `DELETE`.
5. Valide na hora (abaixo). Só então siga para o próximo recurso.

## Validar

Write deve ser **201**. Em seguida GET do item (200) e confira o campo alterado.

Create devolve a **lista**, não o id isolado. O id novo é o maior da lista (experiência, cargo, skill, ferramenta, linguagem, banco, framework, rede). Projeto externo: `git_id` negativo novo em `visible`. Aí `GET` esse id.

Delete: GET do id deve ser **404**.

Não dê a operação como feita só com o status do write.

## API fora

Não invente outro comando. Não rode reset de volume. Não migre banco por conta própria.

- API no host (fluxo diário, `README.md`): em `apps/backend`, venv ativo, `uvicorn main:app --reload --host 0.0.0.0 --port 8000`.
- Postgres local documentado: `./scripts/dev-db.sh up` a partir da raiz deste repo. Esse script **não está** na árvore. Se faltar, diga isso. O compose que o comentário aponta é `infrastructure/docker-compose.db.yml` (porta 5433). Não use `infrastructure/docker-compose.yml` no dia a dia (sobe a API em container).
- Auth (login humano no painel; a skill não chama esse serviço nem manda a chave para `/verify`): em `../portfolio-auth`, `docker compose up -d --build` (host 8001).
- VPS (não é o fluxo diário), a partir da raiz deste repo:

```bash
docker compose -p portfolio-api --env-file apps/backend/.env \
  -f infrastructure/docker-compose.yml up -d --build
```

Subiu, probe `/health` de novo. Sem 200, pare.
