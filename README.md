# Portfolio

Site e API do portfólio, no mesmo repositório. O login OAuth continua no `portfolio-auth` (repo separado).

Sem `shared/`, sem npm workspaces. Frontend e API falam só via HTTP.

## Estrutura

```
apps/web         # Next.js (host em dev, :3000) — Vercel em produção
apps/backend     # FastAPI + Alembic (host em dev, :8000)
infrastructure/  # Compose: Postgres local + API/Postgres na VPS
scripts/         # Bootstrap do Postgres local
```

O `portfolio-auth` fica fora deste repo.

## Desenvolvimento local

Apps no **host**; **só o PostgreSQL** em container.

### Pré-requisitos

- Docker + Docker Compose (apenas para o Postgres)
- Python 3.12+ (asdf: `.tool-versions`) + venv do backend
- Node.js 20+ e pnpm
- `portfolio-auth` rodando à parte, se for usar o admin

### Bootstrap

```bash
# Use um .env local (127.0.0.1:5433). Não aponte o bootstrap para o Postgres da VPS.
cp apps/backend/.env.example apps/backend/.env
# POSTGRES_HOST=127.0.0.1  POSTGRES_PORT=5433
# AUTH_SERVICE_URL=http://127.0.0.1:8001/api

./scripts/dev-bootstrap.sh

cd apps/backend && source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

cd apps/web && cp .env.example .env && pnpm install && pnpm dev
```

| Peça | Como sobe | URL |
|------|-----------|-----|
| PostgreSQL | `./scripts/dev-db.sh up` | `127.0.0.1:5433` |
| API | `uvicorn` no host | http://localhost:8000/docs |
| Web | `pnpm dev` | http://localhost:3000 |
| Auth | repo `portfolio-auth` | http://localhost:8001 |

No `.env` do site:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_AUTH_URL=http://localhost:8001/api
```

Comandos do banco:

```bash
./scripts/dev-db.sh up
./scripts/dev-db.sh status
./scripts/dev-db.sh down     # para (mantém volume)
./scripts/dev-db.sh reset    # apaga o volume
```

## API em Docker (VPS)

Não é o fluxo do dia a dia. Compose da API **e** do Postgres (volume `portfolio-api_postgres_data`):

```bash
docker compose -p portfolio-api --env-file apps/backend/.env \
  -f infrastructure/docker-compose.yml up -d --build
```

Na VPS, `apps/backend/.env` usa `POSTGRES_HOST=db` e `POSTGRES_PORT=5432` (nome do service, porta interna). O frontend **não** sobe neste compose — continua na Vercel, com root directory `apps/web`.

O workflow [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) faz o deploy da API quando mudam `apps/backend/**` ou `infrastructure/**`. Push só em `apps/web/**` não rebuilda a API.

Na primeira subida desta estrutura, o workflow move `.env` da raiz para `apps/backend/.env` se o arquivo novo ainda não existir.
