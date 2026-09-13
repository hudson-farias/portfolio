# Recursos admin

Prefixo real: `/admin`. Métodos e campos abaixo são os do código. Não documente delete onde não há rota.

Identidade: inteiro `id`, exceto projetos (`git_id`).

## Query (só GET lista)

| Recurso | Query |
|---|---|
| skills, tools, databases, languages, frameworks | `q` |
| social_networks | `q`, `position` |
| experiences | `q`, `role_id`, `contract_type` (`CLT` \| `PJ` \| `FREELANCER`), `hidden` |
| roles | `q`, `seniority` (`Junior` \| `Pleno` \| `Senior` \| `Lead`), `show`, `active`, `featured` |
| projects, profile | nenhuma |

Sem Bearer, a lista de experiências força `hidden=false` e a de cargos força `active=true`.

## Traduções

```json
"translations": {
  "pt": { },
  "en": { }
}
```

| Recurso | Campos do locale |
|---|---|
| projects | `title`, `description` |
| experiences | `period`, `description` |
| roles | `title`, `summary` |
| profile | `summary`, `about_me`, `location` |

`translations` é obrigatório no write desses quatro. Skills, tools, databases, frameworks, languages e social_networks **não** têm traduções.

## projects

| Método | Rota | Operação |
|---|---|---|
| GET | `/admin/projects` | list — corpo `{visible, options}` |
| GET | `/admin/projects/{git_id}` | get |
| POST | `/admin/projects/{git_id}` | create a partir de um repo GitHub (`git_id` > 0, vindo de `options`) |
| POST | `/admin/projects/external` | create externo (servidor gera `git_id` negativo) |
| PUT | `/admin/projects/{git_id}` | update |
| DELETE | `/admin/projects/{git_id}` | delete |

Não existe `POST /admin/projects` sem id.

Write (`ProjectPayload`):

- obrigatório: `translations`
- opcionais: `image_url`, `live_url`, `repo_url`, `framework_ids` (default `[]`)
- `POST /external` e `PUT` de `git_id` < 0 exigem `repo_url` senão **422**
- `framework_ids` inexistente → **400**

`options` = repos GitHub ainda fora do portfólio. `visible` = já publicados (externos têm `git_id` < 0).

## experiences

| Método | Rota | Operação |
|---|---|---|
| GET | `/admin/experiences` | list — `{experiences, roles}` |
| GET | `/admin/experiences/{experience_id}` | get |
| POST | `/admin/experiences` | create |
| PUT | `/admin/experiences/{experience_id}` | update |
| DELETE | `/admin/experiences/{experience_id}` | delete |
| PUT | `/admin/experiences/reorder` | reorder |

Write:

- obrigatórios: `company`, `translations`
- opcionais: `role_id`, `contract_type` (`CLT` \| `PJ` \| `FREELANCER`), `live_url`, `hidden` (default `false`), `framework_ids` (default `[]`)
- `framework_ids` inexistente → **400**
- `sort_order` é do servidor: não envie no create nem no update

Reorder: `{ "ids": [ ...todos os ids existentes... ] }`. Conjunto diferente → **400**. Não é reorder parcial.

## roles

| Método | Rota | Operação |
|---|---|---|
| GET | `/admin/roles` | list — array |
| GET | `/admin/roles/{role_id}` | get |
| POST | `/admin/roles` | create |
| PUT | `/admin/roles/{role_id}` | update |
| DELETE | `/admin/roles/{role_id}` | delete |

Write:

- obrigatório: `translations` (o título visível é `translations.pt.title`)
- opcionais: `category`, `seniority` (`Junior` \| `Pleno` \| `Senior` \| `Lead`), `show` (default `false`), `featured` (default `false`), `active` (default `true`), `sort_order` (default `0`), `color`, `icon`

Não há rota de reorder. Delete de cargo põe `role_id` das experiências em null (FK `SET NULL`). Ainda assim confirme.

## skills

| Método | Rota | Operação |
|---|---|---|
| GET | `/admin/skills` | list — `{skills}` |
| GET | `/admin/skills/{skill_id}` | get |
| POST | `/admin/skills` | create |
| PUT | `/admin/skills/{skill_id}` | update |
| DELETE | `/admin/skills/{skill_id}` | delete |

Write obrigatório: `name`, `icon`.

## tools, languages

Mesmo formato. Troque o segmento: `tools` \| `languages`. Id: `tool_id` \| `language_id`.

| Método | Rota | Operação |
|---|---|---|
| GET | `/admin/{recurso}` | list — array |
| GET | `/admin/{recurso}/{id}` | get |
| POST | `/admin/{recurso}` | create |
| PUT | `/admin/{recurso}/{id}` | update |
| DELETE | `/admin/{recurso}/{id}` | delete |
| PUT | `/admin/{recurso}/reorder` | reorder |

Write obrigatório: `name`, `icon`. Tool tem `url` opcional. `sort_order` o servidor define no create e preserva no update — não envie.

Reorder: `{ "ids": [ ...todos os ids existentes... ] }`. Conjunto diferente → **400**. Não é reorder parcial.

## databases

Mesmas rotas que tools (`/admin/databases`, id `database_id`, `/admin/databases/reorder`).

Write: obrigatórios `name`, `icon`. Opcional `scope`: `sql` \| `nosql`.

## frameworks

Mesmas rotas (`/admin/frameworks`, id `framework_id`, `/admin/frameworks/reorder`).

Write:

- obrigatórios: `name`, `icon`
- opcionais: `scope` (`backend` \| `frontend` \| `fullstack` \| `mobile` \| `automation` \| `other`), `language_ids` (default `[]`; id inexistente → **400**)

## social_networks

| Método | Rota | Operação |
|---|---|---|
| GET | `/admin/social_networks` | list — array |
| GET | `/admin/social_networks/{social_network_id}` | get |
| POST | `/admin/social_networks` | create |
| PUT | `/admin/social_networks/{social_network_id}` | update |
| DELETE | `/admin/social_networks/{social_network_id}` | delete |

Write obrigatório: `url`, `icon`, `positions` (array de string).

`positions` que a landpage conhece: `hero`, `about`, `skills`, `experience`, `projects`, `contact`, `footer`. O schema não enumera; use só esses ids. A UI exige pelo menos uma — envie pelo menos uma.

Não há reorder.

## profile

Singleton. Sem create e sem delete.

| Método | Rota | Operação |
|---|---|---|
| GET | `/admin/profile` | get |
| PUT | `/admin/profile` | update |

Write obrigatório: `name`, `email`, `whatsapp`, `linkedin`, `github`, `gitlab`, `translations`. Opcionais: `last_name` (default `""`), `available` (default `true`).

PUT devolve o objeto do perfil (201), não uma lista.

## Fora de CRUD

`GET /admin` é dashboard somente leitura. Não faça POST nele.
