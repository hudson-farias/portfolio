# Especificação — o que ainda falta

Contrato do trabalho pendente no portfólio. O [README](../README.md) aponta para esta lista. A decisão de registrá-la, e a ordem, estão no [ADR 0001](adr/0001-trabalho-pendente.md).

Caminhos abaixo são relativos à raiz de `portfolio-api/`.

## Lista

1. Terminar o Noir Blue na rota de currículo, via `resolveTheme`.
2. Corrigir o chrome do Noir Blue: wordmark do perfil, aria-labels com i18n, rodapé com os links que já chegam nas props, eyebrow do PageIntro por página.
3. Ligar o formulário de contato: POST na API com rate limit e route handler no Next.
4. Página de cada projeto, usando `image_url`.
5. Imagem de Open Graph.
6. Analytics simples dentro do CSP atual.
7. Testes do gerador de PDF, do job-match e do `resolveTheme`.
8. Páginas `not-found` e `error`.
9. Pipeline de build e deploy de `apps/web`.

Contato, frameworks, bancos, skills e ferramentas já entram no item 1 como fato consumado: essas rotas chamam `resolveTheme`. O que falta nessa frente é o currículo.

## 1. Currículo no tema escolhido

### Atual

A escolha de tema persiste no cookie `portfolio-ui-theme` (`apps/web/src/themes/ui-theme.ts`). `resolveTheme` (`apps/web/src/themes/resolve.ts`) devolve o módulo Padrão ou o Noir Blue.

Estas rotas já usam o tema resolvido, inclusive o `PageIntro` e a view:

- `apps/web/src/app/(home)/[segment]/page.tsx` (home)
- `experience/page.tsx`
- `projects/page.tsx`
- `contact/page.tsx`
- `frameworks/page.tsx`
- `databases/page.tsx`
- `skills/page.tsx`
- `tools/page.tsx`

O Noir Blue tem view própria de contato, frameworks, bancos, skills e ferramentas em `apps/web/src/themes/noir-blue/page/`. `themes/noir-blue/index.ts` exporta esses módulos locais.

A rota de currículo é a exceção. `apps/web/src/app/(home)/[segment]/resume/page.tsx` importa `PageIntro` de `@/themes/default/page-intro` e renderiza `ResumeBuilder` (`./resume-builder`) sem chamar `resolveTheme`. Com Noir Blue selecionado, o intro dessa página continua o do tema Padrão.

### Desejado

`resume/page.tsx` obtém o tema com `resolveTheme` e usa o `PageIntro` desse tema. A página deixa de importar `@/themes/default` direto. O builder pode continuar componente da rota até existir variante no tema; o shell da página segue o tema escolhido, no mesmo padrão das outras rotas públicas.

## 2. Chrome do Noir Blue

### Atual

Wordmark. `apps/web/src/themes/noir-blue/layout/header.tsx` escreve o texto `Hudson` no link da home. `HeaderProps` (`apps/web/src/themes/types.ts`) não carrega o nome do perfil. O layout público já tem esse nome: `hero.profile.name` chega ao rodapé como `profileName` em `apps/web/src/app/(home)/[segment]/layout.tsx`.

Aria-labels. O select de tema, no header Noir Blue e no header Padrão, usa `aria-label="Tema da interface"` fixo. `apps/web/src/components/theme/theme-toggle.tsx` usa, nos dois locales, `Ativar tema claro` e `Ativar tema escuro`.

Rodapé. O footer Padrão lista `pageLinks` e `stackLinks` por inteiro. O footer Noir Blue (`themes/noir-blue/layout/footer.tsx`) monta `quickLinks` com `pageLinks.slice(0, 3)` e `stackLinks.slice(0, 2)`. A ordem em que o layout entrega os links é:

- páginas: sobre, ferramentas, experiência, projetos, currículo, contato
- stack: frameworks, bancos, skills

No rodapé Noir Blue ficam sobre, ferramentas, experiência, frameworks e bancos. Somem projetos, currículo, contato e skills.

Eyebrow. `themes/noir-blue/page-intro.tsx` aceita `eyebrow` opcional. Sem a prop, o rótulo é `` `02 / ${title}` ``. Quem passa eyebrow hoje:

| Rota | Eyebrow |
| --- | --- |
| projetos | `` `03 / ${t.projects.title}` `` |
| contato | `` `04 / ${t.contact.title}` `` |
| frameworks | `` `04 / ${t.frameworks.title}` `` |
| bancos | `` `05 / ${t.databases.title}` `` |
| ferramentas | `` `06 / ${t.nav.tools}` `` |
| skills | `` `07 / ${t.skillsPage.title}` `` |
| experiência | ausente; cai no fallback `02 / ${title}` |

Contato e frameworks compartilham o índice `04`. O `PageIntro` do tema Padrão aceita `eyebrow` e não renderiza. A rota de currículo usa esse intro.

### Desejado

O wordmark do header Noir Blue sai do nome do perfil, o mesmo `hero.profile.name` que o rodapé já recebe.

Os aria-labels do select de tema e do `ThemeToggle` vêm do dicionário do locale ativo. O toggle é compartilhado pelos dois temas; o select do header Padrão repete a string fixa e entra no mesmo ajuste.

O rodapé Noir Blue renderiza os `pageLinks` e `stackLinks` que o layout já passa, inclusive projetos, currículo, contato e skills.

Cada página pública que usa o `PageIntro` do Noir Blue informa o próprio eyebrow. Experiência deixa de cair no fallback `02 / ${title}`. Contato e frameworks deixam de dividir o mesmo índice. Quando o currículo passar a usar o intro do tema resolvido, essa rota também informa o eyebrow dela.

## 3. Formulário de contato

### Atual

Os dois temas desligam o envio de propósito:

- `apps/web/src/themes/default/page/contact.tsx`
- `apps/web/src/themes/noir-blue/page/contact.tsx`

Inputs e botão ficam `disabled`. O `onSubmit` chama `preventDefault`. A cópia é `contact.formDisabled`: em pt, "O formulário será habilitado em breve."; em en, "The form will be enabled soon." (`apps/web/src/i18n/messages/pt.json` e `en.json`).

Não há rota de envio na API. O limiter do slowapi existe em `apps/backend/utils/rate_limit.py` e está em `app.state` (`apps/backend/main.py`), com handler de `RateLimitExceeded`. Nenhuma rota aplica o limiter.

O CSP em `apps/web/next.config.ts` inclui `form-action 'self'`. Um `<form action>` apontando para a origem da API é bloqueado. `connect-src` já inclui a origem da API, então um fetch do browser para a API cabe na política; um POST clássico de formulário para outro host, não.

### Desejado

O visitante envia nome, e-mail e mensagem. O POST entra num route handler do Next, na mesma origem do site, e esse handler encaminha para a API. A API aplica o rate limit por IP com o limiter que já está montado. A cópia de "em breve" sai quando o envio existir. Os dois temas habilitam os mesmos campos.

## 4. Página de cada projeto

### Atual

O projeto tem `image_url` (`String(150)`, nullable) em `apps/backend/database/projects.py`. O admin grava o campo e os cards dos dois temas mostram a imagem quando ela existe (`themes/default/page/projects.tsx`, `themes/noir-blue/page/projects.tsx`).

Não existe rota pública `/projects/[id]`. O `[id]` em `apps/web/src/app/admin/projects/[id]` é a edição no painel.

A importação de repositórios está em `apps/backend/services/github.py` e cobre só o GitHub, usuário `hudson-farias`. GitLab existe como campo de perfil e rede social. Não há importação de repositórios GitLab, e esta lista não a inclui.

### Desejado

Cada projeto publicado tem página própria, nos dois locales e nos dois temas, via `resolveTheme`. A página mostra a imagem (`image_url`), o papel, a stack, e os links de repositório e demo quando existirem. A listagem leva a essa página.

## 5. Imagem de Open Graph

### Atual

`generateLandpageMetadata` em `apps/web/src/app/(home)/[segment]/metadata.ts` define `twitter.card` como `summary_large_image`. `openGraph` e `twitter` saem com título, descrição e URL, sem `images`.

JSON-LD `Person` já sai no layout do segmento (`apps/web/src/app/(home)/[segment]/layout.tsx`). `apps/web/src/app/sitemap.ts` e `apps/web/src/app/robots.ts` já existem.

### Desejado

`openGraph.images` e `twitter.images` apontam para uma imagem de compartilhamento. O card continua `summary_large_image`. JSON-LD, sitemap e robots permanecem.

## 6. Analytics

### Atual

Não há script de analytics. O CSP (`apps/web/next.config.ts`) é `default-src 'self'`, `script-src 'self' 'unsafe-inline' 'unsafe-eval'`, `connect-src 'self'` mais as origens da API e do auth, e `form-action 'self'`.

### Desejado

Um analytics simples, Plausible ou Umami. O script e o envio de eventos cabem no CSP: origem explícita só desse serviço em `script-src` e `connect-src`, ou script na mesma origem. `form-action` e `default-src` ficam como estão.

## 7. Testes

### Atual

Não há testes de aplicação. O backend não tem suíte pytest. `apps/web/package.json` só declara `dev`, `build` e `start`.

Os três pontos que a suíte precisa cobrir:

- gerador de PDF do currículo: `apps/backend/generators/curriculum.py`, servido por `GET /landpage/resume` e `POST /landpage/resume` em `apps/backend/routers/landpage/resume/index.py`
- job-match: `POST /landpage/resume/job-match` em `apps/backend/routers/landpage/resume/job_match.py`
- `resolveTheme` em `apps/web/src/themes/resolve.ts` (`default` e `noir-blue`, e o fallback do id desconhecido)

### Desejado

Esses três comportamentos têm teste automatizado. A suíte roda no ambiente de cada app (pytest no backend, script de teste no web).

## 8. Páginas de erro

### Atual

Não há `not-found.tsx` nem `error.tsx` em `apps/web/src/app`.

### Desejado

O site tem `not-found` e `error` no App Router, em pt e en, coerentes com o tema ativo.

## 9. Pipeline do site

### Atual

`.github/workflows/ci-cd.yml` dispara em push na `main` quando mudam `apps/backend/**`, `infrastructure/**` ou o próprio workflow, e também por `workflow_dispatch`. O job faz pull na VPS e republica com `infrastructure/docker-compose.yml`. Esse compose sobe a API e o Postgres. `apps/web` está fora dos `paths` e fora do compose.

No dia a dia, o site e a API sobem no host. Só o Postgres do desenvolvimento local usa `infrastructure/docker-compose.db.yml`.

### Desejado

Mudança em `apps/web` tem pipeline próprio de build e deploy. O workflow da API continua responsável pela API. O site não entra no compose que só publica o backend.
