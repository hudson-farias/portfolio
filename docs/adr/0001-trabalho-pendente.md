# ADR 0001 — Deixar o trabalho pendente explícito

- Status: aceito
- Data: 2026-10-12

## Contexto

O site já escolhe tema pelo cookie `portfolio-ui-theme` e `resolveTheme` cobre a home, a experiência, os projetos e as rotas de contato, frameworks, bancos, skills e ferramentas. O Noir Blue tem view própria dessas páginas. Três decisões antigas continuam visíveis no código e pareciam “o produto acabado” se ninguém as escrevesse:

O currículo ainda importa o `PageIntro` de `themes/default` e não chama `resolveTheme`. O builder mora na rota. Enquanto essa página não entrar no mesmo contrato das outras, quem seleciona Noir Blue vê o intro do tema Padrão só ali. O fallback ficou de propósito nessa rota, até o shell dela seguir o tema. As outras subpáginas dedicadas já saíram desse fallback.

O formulário de contato está desligado nos dois temas: campos `disabled`, `preventDefault`, e a frase de que será habilitado em breve. Não há rota de envio. O CSP usa `form-action 'self'`, então um POST direto do formulário para a origem da API seria bloqueado. O limiter do slowapi já está montado na aplicação e nenhuma rota o usa. Ligar o botão antes do route handler no Next e do POST com rate limit na API enviaria o visitante para um endpoint que não existe.

O workflow `.github/workflows/ci-cd.yml` só observa `apps/backend/**`, `infrastructure/**` e o próprio arquivo, e só republica a API pelo compose da VPS. O site fica de fora porque esse compose é API e Postgres. O frontend sobe à parte. Alargar esse job para buildar o Next misturaria dois deploys que hoje são separados.

Em volta disso há pendências menores que o código já denuncia: wordmark `Hudson` fixo, aria-labels em português nos dois locales, rodapé Noir Blue que corta links já recebidos nas props, eyebrow genérico `02 / ${title}`, card `summary_large_image` sem imagem, ausência de analytics, de testes, de `not-found`/`error`, e de página pública por projeto embora `image_url` já exista.

## Decisão

Esses itens ficam registrados como trabalho pendente, nesta ordem, com o comportamento atual e o desejado na [especificação](../spec.md):

1. Currículo via `resolveTheme`.
2. Chrome do Noir Blue (wordmark do perfil, aria-labels i18n, rodapé completo, eyebrow por página).
3. Formulário de contato (POST na API com rate limit + route handler no Next).
4. Página de cada projeto, usando `image_url`.
5. Imagem de Open Graph.
6. Analytics simples (Plausible ou Umami) sem afrouxar o CSP além da origem desse serviço.
7. Testes do gerador de PDF, do job-match e do `resolveTheme`.
8. Páginas `not-found` e `error`.
9. Pipeline de build e deploy de `apps/web`, separado do workflow da API.

A ordem começa pelo que o visitante já consegue acionar (tema e a frase “em breve” do contato), segue para conteúdo e compartilhamento, e deixa medição, testes, erro e deploy do site para depois. Importar repositórios do GitLab não entra nesta lista: GitLab continua campo de perfil e rede.

O README só aponta para esta decisão e para a spec. A spec é a fonte da lista. Quando um item for feito, a spec é que se atualiza.

## Consequências

Quem for implementar lê a spec em vez de inferir escopo pelo código pela metade. O currículo permanece no intro Padrão até o item 1. O formulário permanece desligado até o item 3. O CI permanece só da API até o item 9.

O wordmark, o rodapé cortado e o eyebrow `02 / ${title}` continuam no Noir Blue até o item 2. O rate limit segue disponível e sem uso até existir a rota de contato.
