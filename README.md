# Portfólio — Hudson Farias

Meu site pessoal e a API que o alimenta, no mesmo repositório. Apresento quem sou, a trajetória e os projetos que escolho mostrar — e atualizo o conteúdo sem republicar o frontend a cada texto.

## O que é

Juntei duas aplicações que se falam só por HTTP: o site em Next.js (`apps/web`) e a API em FastAPI (`apps/backend`). Não há pacote compartilhado nem workspaces de npm na raiz.

O site público está em [hudsondev.tech](https://www.hudsondev.tech/). A API sobe à parte, em VPS. O login do painel é OAuth do Discord, no repositório irmão `portfolio-auth`. O visitante vê o conteúdo público; editar exige essa sessão ou uma chave criada em `/admin/api-keys`.

## O site

Em português e inglês (`/pt` e `/en`), com tema claro e escuro.

| Onde | O que mostro |
|------|----------------|
| **Sobre** | Nome, cargos, localização, disponibilidade, texto e redes |
| **Experiência** | Histórico profissional, na ordem que eu defino — e só o que não marquei como oculto |
| **Projetos** | Repositórios do GitHub que eu publico, e projetos externos quando cadastro um |
| **Frameworks, bancos, ferramentas, skills** | A stack, na home e em páginas próprias — frameworks só entram no público se estiverem com “Exibir no site” |
| **Contato** | E-mail e canais do perfil |
| **Currículo** | PDF gerado pela API a partir do que cadastrei |

## Painel

Em `/admin` eu gerencio perfil, experiências, projetos, frameworks, bancos de dados, ferramentas, skills, linguagens, cargos e redes sociais. O dashboard resume as contagens. As chaves de acesso ficam em `/admin/api-keys` — o segredo aparece só na criação.

Nos projetos, escolho quais repositórios do GitHub entram ou cadastro um externo com a URL do repositório. Título e descrição existem em pt e en.

## A API

As rotas não usam o prefixo `/api`. O site concatena a origem da API com o caminho:

- `/landpage/...` — conteúdo público
- `/admin/...` — painel
- `/health` — checagem
- `/docs` — documentação (caminho do `.env.example` do backend)

O conteúdo fica no PostgreSQL, com traduções em pt e en. O currículo sai de `/landpage/resume`.

Com sessão admin (cookie `ACCESS_TOKEN_ADMIN` ou Bearer), há também:

- `POST /landpage/resume/job-match` — body `{ "url": "https://..." }`; analisa a vaga com Gemini e devolve filtros sugeridos + skills faltantes
- `POST /landpage/resume/skills` — body `{ "name", "icon" }`; cria uma skill sem passar por `/admin`

No `.env` do backend: `GEMINI_API_KEY` (obrigatória para o job-match) e opcionalmente `GEMINI_MODEL` (default `gemini/gemini-3.8-flash`). A chave fica só na API. Se ainda estiver `gemini/gemini-2.0-flash`, troque — esse modelo foi descontinuado.

## Stack

**Site** — Next.js · React · TypeScript · Tailwind CSS · shadcn/ui

**API** — FastAPI · Pydantic · SQLAlchemy · Alembic · PostgreSQL · ReportLab · Docker

## Como rodar

No dia a dia os apps sobem no host. Só o PostgreSQL fica em container, pelo compose `infrastructure/docker-compose.db.yml` (porta **5433**).

```bash
cp apps/backend/.env.example apps/backend/.env
# POSTGRES_HOST=127.0.0.1
# POSTGRES_PORT=5433
# AUTH_SERVICE_URL=http://localhost:9091

docker compose -p portfolio-api --env-file apps/backend/.env \
  -f infrastructure/docker-compose.db.yml up -d

cd apps/backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --host 0.0.0.0 --port 8000
```

Migrations ficam em `apps/backend/alembic/versions/`. Depois de puxar código que altera o schema, rode `alembic upgrade head` no diretório do backend (com o `.env` apontando para o Postgres).


A documentação fica em http://localhost:8000/docs. Python 3.12 está no `.tool-versions` e na imagem do `Dockerfile`.

No site, copie `apps/web/.env.example` para `apps/web/.env`. A origem da API não leva `/api`: o cliente já chama `/landpage/...` e `/admin/...`. O auth do exemplo no backend é `http://localhost:9091`. O CORS do exemplo aceita `http://localhost:3000`.

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_URL=http://localhost:9091
```

```bash
cd apps/web
pnpm install && pnpm dev
```

### API na VPS

Não é o fluxo do dia a dia. Esse compose sobe a API e o Postgres; o site não entra nele.

```bash
docker compose -p portfolio-api --env-file apps/backend/.env \
  -f infrastructure/docker-compose.yml up -d --build
```

No `.env` da VPS, o exemplo pede `POSTGRES_HOST=db` e `POSTGRES_PORT=5432`. O workflow [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) republica a API quando mudam `apps/backend/**` ou `infrastructure/**`.

---

**Hudson Farias** — Software Developer · Fullstack Engineer · DevOps
