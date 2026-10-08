# Navalha

Agendamento online para barbearia. O cliente escolhe o serviço, o barbeiro e o horário pelo celular, e o dono acompanha tudo num painel.

**Demo:** o link entra no T-002.

> Projeto de portfólio construído por tickets, como num time de produto: cada funcionalidade nasce num ticket do [backlog](backlog/BOARD.md), passa por review e por CI e é publicada a cada merge. Os [guias](guias/) são a consulta rápida durante os tickets.

## Status

| Marco | Entrega | Status |
|---|---|---|
| 0 · Primeiro dia | repositório, CI e deploy contínuo | ⬜ |
| 1 · Site público | página da barbearia, responsiva e acessível | ⬜ |
| 2 · Agendamento no front | fluxo de agendamento em 5 etapas | ⬜ |
| 3 · Fullstack | API .NET com PostgreSQL e agendamento de verdade | ⬜ |
| 4 · Painel do dono | login, CRUD, filtros na URL e dashboard | ⬜ |
| 5 · Produção | tempo real, concorrência e performance | ⬜ |
| 6 · Next.js | site público com SSR e SEO | ⬜ |

## Stack

- **Front:** React 19, TypeScript strict, Vite 8 e CSS Modules. O Tailwind entra no marco 4.
- **Qualidade:** oxlint, Prettier, Vitest + Testing Library, Playwright com axe e GitHub Actions.
- **Back, a partir do marco 3:** .NET 10 Minimal API, EF Core e PostgreSQL.

## Como rodar

```powershell
cd web
npm install
npx playwright install chromium
npm run dev
```

O site abre em http://localhost:5173.

## Scripts

Rode dentro de `web/`:

| Script | O que faz |
|---|---|
| `npm run dev` | sobe o site em modo de desenvolvimento |
| `npm run build` | confere os tipos e gera o build em `dist/` |
| `npm run check` | tipos, lint, formatação e testes de unidade (o CI roda o `check` e o `build`) |
| `npm run format` | formata o código com o Prettier |
| `npm run e2e -- T-0xx` | roda o teste de aceite de um ticket |
| `npm run shots` | tira screenshots em 375, 768 e 1280px para o review |

## Estrutura

```
web/        o front (React + Vite)
design/     tokens e telas de referência
backlog/    BOARD.md e um arquivo por ticket
guias/      guias rápidos de consulta
desafios/   um desafio técnico por marco
docs/       a spec do projeto
```
