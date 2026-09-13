# Portfólio — Hudson Farias

Meu site pessoal. Aqui apresento quem sou, o que faço e como me encontrar — uma vitrine profissional em página única, pensada para quem quer conhecer minha trajetória em poucos segundos.

## O que é

Construí um portfólio moderno em página única, com navegação por seções e conteúdo carregado dinamicamente a partir de uma API dedicada. Priorizei clareza na apresentação: sem excesso de informação, destacando experiência, habilidades e projetos de forma objetiva.

## Seções

| Seção | O que mostro |
|-------|--------------|
| **Hero** | Minha apresentação com efeito de digitação nos cargos, localização, disponibilidade e CTAs para contratação e download do CV |
| **Sobre** | Texto sobre mim, redes sociais e números da minha trajetória (anos de experiência, projetos, clientes) |
| **Skills** | Minhas habilidades organizadas por categoria, com ícones |
| **Experiências** | Linha do tempo da minha carreira — empresas, períodos e descrições |
| **Projetos** | Carrossel interativo com repositórios do GitHub — preview, descrição e links |
| **Contato** | Meu e-mail e canais para conversa |

## Destaques

- **Tema claro e escuro** — respeito a preferência do sistema ou deixo o visitante escolher manualmente
- **Animações sutis** — entrada progressiva dos blocos e interações no carrossel de projetos
- **Painel administrativo** — área interna onde visualizo e gerencio o conteúdo do portfólio (experiências, skills, projetos e redes sociais), com login via Discord
- **Responsivo** — adaptei o layout de mobile a desktop, com tipografia Geist e componentes shadcn/ui

## Stack

Next.js · React · TypeScript · Tailwind CSS · shadcn/ui

## Relação com a API

Este app vive em `apps/web` do repositório `portfolio-api`. Consumo o backend em `apps/backend` ([api.hudsondev.tech](https://api.hudsondev.tech/)), que centraliza perfil, experiências, habilidades, projetos (via GitHub) e redes sociais. O login Discord fica no `portfolio-auth`, fora deste repo. No site público exibo apenas o que liberei; no painel admin vejo dados adicionais quando estou autenticado.

---

**Hudson Farias** — Software Developer · Fullstack Engineer · DevOps
