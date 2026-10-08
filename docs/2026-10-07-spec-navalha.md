# Spec — Navalha: aprender front fullstack por tickets

- **Data:** 2026-10-07
- **Status:** aprovada em 2026-10-07; §8, §9 e §15 sincronizadas com o plano da onda 1
- **Origem:** brainstorming de 2026-10-07. As seções 1 a 4 foram aprovadas no chat.

## 1. Objetivo

Higor, dev .NET, quer virar fullstack para vagas React no mercado. Para isso, vai construir um produto de portfólio, o **Navalha**, resolvendo tickets iguais aos de um emprego: feature, bug, refactor, revisão de PR e desafio técnico. Este projeto substitui o roteiro de 17 dias do `/Frontend`.

**O projeto está pronto quando as três condições valem:**

1. O Navalha está publicado, com site público em Next.js, painel em Vite e API .NET com banco.
2. Todo PR mergeado passou pelo `/revisar`, e o Higor entende o que está nele, inclusive o código escrito com IA.
3. O desafio final, um take-home de 4h feito sem IA, foi aprovado no review.

## 2. Premissas e restrições

- **Tempo:** de 4 a 7h por semana, em sessões de cerca de 1h. Cada ticket cabe numa sessão: o tamanho P leva até 30 min, e o M, até 1h. Não existe ticket maior que isso, e uma feature grande vira vários tickets.
- **Ponto de partida:**
  - CSS: praticamente zero.
  - React: componentes, props e listas, que foram os dias 1 e 2 do roteiro antigo.
  - .NET: forte.
- **Volume:** cerca de 80 tickets, ou umas 16 semanas no ritmo de 5 tickets por semana. O marco 1 fica publicado em cerca de 3 semanas.
- **Ambiente, conferido em 2026-10-07:** Node 24.15, npm 11.12, .NET SDK 10.0.201, Docker 29.7 com Compose 5.4 e `gh` 2.98 logado como HgrXKPT.
- **Ferramentas de IA:** Claude Code e Antigravity. As regras ficam no `AGENTS.md`, e os comandos são duplicados em `.claude/skills/` e `.agents/skills/`.

## 3. Fora do escopo

- **O método antigo inteiro:** aquecimento, leitura obrigatória, ADR, `/fechar-dia`, diário, técnica de Feynman, quiz, nota de confiança e `PROGRESSO.md`.
- **Mudanças no `/Frontend`:** ele fica como arquivo. Só o `guia/ponte-dotnet.md` é copiado.
- **Restrições à IA:** não existe escada de dicas. A única exceção é o desafio de fim de marco (§6.4).
- **Tecnologias:** Redux, Axios, CSS-in-JS, GraphQL, mobile nativo, Angular e Vue.
- **Funcionalidades:** vários estabelecimentos (multi-tenant), pagamento online e notificação por e-mail ou WhatsApp.
- **Pixel-perfect:** o layout é conferido pela estrutura, pelo uso da escala de tokens e pela responsividade, não pixel a pixel.

## 4. Produto

**Navalha** é o agendamento online da Barbearia Navalha, uma barbearia fictícia.

**Site público** (para o cliente, mobile-first):

- Página da barbearia, com serviços, barbeiros, depoimentos, horário de funcionamento e localização.
- Agendamento em 5 etapas: serviço → barbeiro → dia e horário → dados do cliente → confirmação. No fim, o cliente recebe um código.
- Consulta e cancelamento do agendamento pelo código.

**Painel** (com login, desktop-first):

- Agenda do dia e da semana.
- Cadastro de serviços e de barbeiros.
- Clientes, com busca, filtro e paginação.
- Dashboard com gráfico.
- Configurações de horário de funcionamento e folgas.
- Papéis: o **dono** vê e faz tudo, e o **barbeiro** vê só a própria agenda.

**Regras de negócio** (todas na API):

- Horários disponíveis = horário de funcionamento − agendamentos existentes − folgas, levando em conta a duração do serviço.
- Dois agendamentos no mesmo horário do mesmo barbeiro geram 409.
- O cancelamento exige pelo menos 2 horas de antecedência.
- O fuso de referência é `America/Sao_Paulo`, e a API guarda as datas em UTC.

**Idioma:** o código fica em inglês. A interface, os tickets e os guias ficam em português.

## 5. Stack e ordem de entrada

Cada peça entra quando um ticket precisa dela. As versões exatas são conferidas no início de cada onda (§6.8).

| Camada | Escolha | Entra no marco |
|---|---|---|
| Base do front | React 19, TypeScript strict e Vite | 1 |
| Estilo | CSS puro com CSS Modules; depois Tailwind 4, migrando o CSS que o Higor escreveu | 1, e o Tailwind no 4 |
| Rotas e estado | React Router; `useState` e Context; depois Zustand com persistência | 2 |
| Formulários | primeiro na mão; depois React Hook Form + Zod | 2 |
| Datas | date-fns | 2 |
| Dados do servidor | primeiro fetch na mão; depois TanStack Query | 3 |
| API | .NET 10 Minimal API, EF Core e PostgreSQL no Docker Compose | 3 |
| Testes | Playwright para os testes de aceite do QA; Vitest + Testing Library + MSW, xUnit + NSubstitute e Playwright para os testes do Higor | aceite desde o 0; testes do Higor a partir do 3 |
| Autenticação | cookie httpOnly, rotas protegidas e papéis | 4 |
| Gráfico | Recharts | 4 |
| Tempo real | SignalR | 5 |
| SSR e SEO | Next.js com App Router no site público | 6 |
| Deploy | Vercel no front; API e banco publicados | 0 na Vercel; 3 para API e banco; 4 para a mesma origem (§14); 6 para o Next.js |

## 6. Como o trabalho funciona

### 6.1 A sessão

1. `/proximo` mostra o próximo ticket e cria a branch. Também dá para abrir o `BOARD.md` e pegar o primeiro ⬜.
2. O Higor lê o ticket, em uns 5 minutos.
3. Ele coda de 40 a 50 minutos, usando a IA à vontade.
4. Ele confere: `npm run check` no `web/`, os checks da API quando o ticket mexe nela (§11) e `npm run e2e -- T-0xx` quando o ticket tem teste de aceite.
5. Ele roda o `/revisar`. Se aprovar, a IA marca ✅ no `BOARD.md`, a marcação entra no commit do ticket, e o Higor faz o merge.

### 6.2 Formato do ticket

Cada ticket é um arquivo `backlog/T-0xx-slug.md`, com estas partes:

- **Cabeçalho:** ID, título (com o prefixo `[API]` ou `[Web]` quando o ticket faz parte de uma história), tipo, tamanho (P ou M), marco e história (`H-xx`), quando houver.
- **Conceito novo:** no máximo 2. O resto do ticket repete o que já foi visto.
- **Contexto:** 2 ou 3 linhas, como o PO escreveria.
- **Critérios de aceite:** checkboxes no formato dado / quando / então, com os papéis e os textos acessíveis que o teste de aceite procura.
- **Layout:** os PNGs de `design/`, nos tickets de tela.
- **Contrato:** endpoint, entrada e saída, nos tickets de API ou de consumo de API. A partir do marco 4, parte dos tickets traz só a necessidade, e o próprio Higor desenha o contrato.
- **Fora do escopo:** o que não fazer neste ticket.
- **Guia rápido:** a seção do guia em `guias/` e 1 link da documentação oficial.

### 6.3 Tipos de ticket

- **Feature**, a maioria: a tarefa `[API]` ou `[Web]` de uma história, ou uma parte de tela.
- **Bug:** relato no estilo de QA, com os passos para reproduzir. A partir do marco 3, parte dos bugs vem de problemas reais que o `/revisar` encontrou no código do Higor.
- **Refactor ou débito técnico:** por exemplo, migrar o CSS do site para Tailwind.
- **Revisar PR de colega**, um por marco a partir do marco 2: a IA cria a branch `colega/T-0xx-slug`, com uma mudança que contém de 3 a 5 problemas plantados. O Higor escreve o review no chat e depois compara com o gabarito, que fica no fim do ticket, dentro de um bloco recolhido (`<details>`).
- **Desafio técnico**, no fim de cada marco: tem tempo marcado, é feito sem IA e tem enunciado e layout próprios, fora do Navalha. O projeto inicial já vem pronto em `desafios/mN/`, para o tempo ir todo para o problema.

### 6.4 IA

- **Liberada** para explicar, dar exemplo, implementar partes e corrigir.
- Quando a IA escreve código, diz em poucas linhas o que ele faz e por quê. Ela usa C# como ponte quando isso ajuda e diz onde a analogia quebra.
- O review vale para tudo que está no PR, inclusive o código escrito pela IA.
- **Exceção combinada:** o desafio de fim de marco é feito sem IA.
- **Limites de stack**, herdados do `AGENTS.md` antigo e atualizados:
  - não sugerir `create-react-app`, class components, `ReactDOM.render` nem `any` para calar erro;
  - Error Boundary é feito com a lib `react-error-boundary`;
  - `useEffect` serve só para sincronizar com um sistema externo.

### 6.5 `/proximo`

- Lê o `BOARD.md` e mostra o primeiro ticket ⬜ cujos pré-requisitos estão ✅.
- Cria a branch a partir da `main` atualizada: `feature/T-0xx-slug`, ou `fix/T-0xx-slug` se o ticket for de bug. A exceção é o T-001: como é ele que cria a `main`, o próprio ticket traz os comandos.
- Se todos os tickets do marco estão ✅, avisa e propõe a próxima onda (§6.8).

### 6.6 `/revisar`

1. Lê o ticket da branch atual.
2. Roda os checks:
   - `npm run check`;
   - os checks da API (§11), se o ticket mexe em `api/`;
   - `npm run e2e` do ticket e dos tickets ✅ do mesmo marco, como regressão.
3. Lê o `git diff main...HEAD`.
4. Nos tickets de tela, tira screenshots em 375px e 1280px com o Playwright e compara com os PNGs de `design/`.
5. Responde com:
   - o veredito: ✅ aprovado ou 🔁 ajustes;
   - cada critério de aceite, com a evidência;
   - até 5 comentários, cada um com `arquivo:linha`, um peso (🔴 bloqueia, 🟡 sugestão, ⚪ detalhe) e uma sugestão de código quando isso ajuda;
   - o que está bom, citando um fato concreto do código.
6. Se aprovar, marca ✅ no `BOARD.md` e anota, em uma linha, o que vale lembrar na próxima onda (por exemplo: "🟡 guardou em `useState` um valor derivado"). Os 🟡 que ficarem sem resolver viram candidatos a ticket de bug ou de débito.

### 6.7 Guias rápidos

- Um guia por tema, com 1 ou 2 páginas. Cada guia traz:
  - o essencial;
  - um exemplo mínimo, que nunca é a solução de um ticket;
  - as armadilhas;
  - onde a analogia com C# quebra;
  - o link oficial.
- Cada seção tem uma âncora, para o ticket apontar direto para ela.
- Os guias chegam na onda do marco que precisa deles.

### 6.8 Ondas

- A onda N reúne os arquivos do marco N: tickets, telas, guias e testes de aceite. A partir do marco 3, ela inclui também a parte da API que é da "empresa".
- A onda 1 cobre os marcos 0 e 1.
- **Preparação:**
  1. No fim de um marco, a IA propõe no chat a lista de tickets da próxima onda, com título e conceito novo, ajustada pelas anotações do `BOARD.md`. A proposta segue, em versão curta, o formato de plano do contrato base: objetivo, fora do escopo, arquivos, passos, riscos e decisões.
  2. Com o ok do Higor, ela confere as versões das bibliotecas, produz os arquivos numa branch `chore/onda-N` e faz o commit.
- O plano de implementação desta spec cobre só a onda 1. As ondas seguintes seguem a preparação acima.

## 7. Marcos

Cada marco termina com algo publicado e com um desafio técnico sem IA. Os números de tickets incluem o desafio e, a partir do marco 2, o PR de colega.

**0 · Primeiro dia** (2 tickets)
O Higor faz o primeiro PR passando pelo fluxo completo e configura o deploy automático na Vercel.

**1 · Site público** (13 tickets)
- **Entrega:** a página da barbearia, publicada e responsiva.
- **Front:** HTML semântico, box model, flexbox, grid, mobile-first, tokens de design e acessibilidade básica. O marco fecha com o primeiro `useState`, no menu do celular.
- **Desafio:** uma landing page de outro negócio a partir de um layout, em 1h30.

**2 · Agendamento no front** (12 tickets)
- **Entrega:** o fluxo de 5 etapas funcionando com dados locais.
- **Front:** estado e eventos, estado derivado, rotas, formulário (primeiro na mão, depois com React Hook Form + Zod), datas e Zustand com persistência. O Zustand chega por um bug de QA: "recarreguei a página no meio e perdi tudo".
- **Desafio:** um formulário em etapas de outro domínio, em 2h.

**3 · Fullstack** (15 tickets)
- **Entrega:** o agendamento grava no banco, e a API e o banco estão publicados.
- **Front:** primeiro o fetch na mão, para sentir os problemas de loading, erro e corrida entre requisições. Depois vem o TanStack Query, com queries e mutations, os erros do ProblemDetails mostrados por campo e o 409 de horário ocupado. É aqui que entra o primeiro teste do Higor, com Vitest + MSW.
- **API:** listar barbeiros por serviço, horários disponíveis, criar agendamento e consultar ou cancelar agendamento, cada um com os seus testes.
- **Desafio:** lista com filtro e paginação sobre uma API pronta, em 2h.

**4 · Painel do dono** (16 tickets)
- **Entrega:** o painel publicado, com um login de demonstração.
- **Front:** migração do CSS do site para Tailwind, login, rotas protegidas, CRUD com tabela, filtro e paginação guardados na URL, gráfico e formulário dinâmico (horários e folgas).
- **API:** autenticação por cookie, papéis e os endpoints de admin. O contrato passa a ser desenhado pelo Higor em parte dos tickets.
- **Desafio:** um CRUD com filtros na URL, em 2h30.

**5 · Produção** (12 tickets)
- **Entrega:** a agenda atualiza ao vivo, e o Lighthouse dá 90 ou mais.
- **Front:** SignalR, ETag e 412 para edição concorrente, Error Boundary, code splitting, imagens responsivas (as fotos reais substituem os placeholders), acessibilidade por teclado e um teste E2E escrito pelo Higor.
- **API:** o hub do SignalR e o ETag nas edições.
- **Desafio:** caçar e corrigir 5 bugs plantados, em 2h.

**6 · Next.js** (10 tickets)
- **Entrega:** o site público migrado para Next.js, com SSR e SEO. O painel continua no Vite, porque área logada não precisa de SEO.
- **Front:** App Router, Server e Client Components, metadata, ISR e `next/image`.
- **Desafio final:** um take-home completo em 4h. Ele é o critério 3 de pronto (§1).

## 8. Repositório e responsabilidades

```
D:\Projetct\navalha\
├── web/                  front em Vite + React + TS
│   └── e2e/aceite/       testes de aceite, um arquivo por ticket: T-0xx-slug.spec.ts
├── api/                  .NET 10, chega na onda do marco 3
├── design/               tokens e telas em PNG
├── backlog/              BOARD.md e um arquivo por ticket
├── guias/                guias rápidos
├── desafios/             um projeto inicial por marco
├── docs/                 a spec (os planos de onda ficam fora do repositório)
├── .github/workflows/    CI do PR
├── .claude/skills/       /proximo e /revisar (Claude Code)
├── .agents/skills/       /proximo e /revisar (Antigravity)
├── AGENTS.md             regras da IA
├── CLAUDE.md             importa o AGENTS.md para o Claude Code
└── README.md             vitrine do portfólio
```

| Caminho | Quem escreve |
|---|---|
| `web/src/` | o Higor, com a IA ajudando quando ele pede. A exceção são os arquivos-base da onda 1 (tokens, reset e dados locais) |
| configuração do `web/` (tsconfig, oxlint, Prettier, Vitest, Playwright e scripts) | a IA |
| `web/e2e/aceite/` | a IA, no papel de QA |
| `api/` | a IA escreve o esqueleto e o fluxo de referência; as features são do Higor |
| `design/`, `backlog/`, `guias/`, `docs/`, `.github/`, `AGENTS.md` e skills | a IA |
| `desafios/` | a IA cria o projeto inicial, e o Higor resolve |
| `README.md` | a IA, a cada onda. O link do deploy entra no T-002, pelo Higor |

O `AGENTS.md` do projeto libera a IA para atualizar o `BOARD.md` sem mostrar o diff antes. Isso vale por ser regra de projeto, conforme a §0 do contrato base.

## 9. Onda 1 (marcos 0 e 1): o que é entregue

- **Repositório:** `D:\Projetct\navalha`, iniciado na branch `chore/onda-1`.
- **`web/`:**
  - Vite + React 19 + TypeScript strict, oxlint, Prettier, Vitest + Testing Library (configurados, ainda sem testes do Higor) e Playwright + `@axe-core/playwright`.
  - Scripts: `dev`, `build`, `preview`, `lint`, `format`, `typecheck`, `test`, `check` (que roda `typecheck`, `lint`, a checagem de formatação e `test`) e `e2e`.
- **`web/src/` mínimo:**
  - `main.tsx` e um `App.tsx` vazio;
  - `styles/reset.css` e `styles/tokens.css`;
  - `data/`, com os tipos e os dados locais: serviços, barbeiros, depoimentos e horário de funcionamento;
  - imagens placeholder geradas em SVG.
- **`design/`:**
  - `tokens.md`;
  - o logo e o favicon em SVG (separados, porque o logo horizontal não fica legível em 16px);
  - as telas do marco 1 em 375px, uma por seção, mais o menu aberto;
  - a página inteira em 1280px;
  - o layout do desafio do marco 1.

  As telas são desenhadas em HTML fora do repositório e exportadas em PNG.
- **`backlog/`:** o `BOARD.md` e os tickets T-001 a T-015 (§15).
- **`guias/`:**
  1. `ponte-dotnet.md`, copiado do `/Frontend`;
  2. `fluxo-de-trabalho.md`, que cobre branch, checks, `/revisar`, PR, merge, CI e deploy na Vercel;
  3. `devtools.md`;
  4. `html-semantico.md`;
  5. `css-fundamentos.md`, que cobre seletores, especificidade, cascata, herança, unidades e `var()`;
  6. `box-model.md`;
  7. `flexbox.md`;
  8. `grid.md`;
  9. `posicionamento.md`;
  10. `responsivo.md`, que cobre mobile-first, media queries, imagens fluidas, `overflow` e `scroll-snap`;
  11. `css-modules.md`;
  12. `acessibilidade.md`;
  13. `estado-e-eventos.md`.
- **`web/e2e/aceite/`:** testes de aceite para os tickets que têm estrutura ou comportamento verificável, com axe em todos os tickets de tela.
- **CI** (`.github/workflows/ci.yml`): em cada PR, roda `npm ci`, `npm run check` e `npm run build` no `web/`. O e2e fica fora do CI e roda localmente e no `/revisar`.
- **`desafios/m1/`:** o projeto inicial do desafio.
- **Arquivos de raiz e de IA:**
  - `AGENTS.md`;
  - as skills `proximo` e `revisar`, em `.claude/skills/` e em `.agents/skills/`;
  - `README.md`;
  - `.gitignore`.
- **`docs/`:** uma cópia desta spec. O plano da onda fica fora do repositório, em `D:\Projetct\docs\agentes\`, porque descreve a solução de referência.

## 10. Onda do marco 3: o esqueleto da API

- Uma solução .NET 10 em `api/`, com o projeto da API e o projeto de testes.
- Minimal API organizada por feature, com entidades de domínio ricas.
- EF Core + PostgreSQL no Docker Compose, com migrations e seed.
- ProblemDetails em todo erro, e OpenAPI com o Scalar como interface.
- Testes com xUnit + NSubstitute.
- O fluxo de referência completo: `GET /api/services`, com teste.
- Proxy do Vite para `/api` no ambiente de desenvolvimento.

## 11. Quando um ticket está pronto

- `npm run check` passa: tipos, lint, formatação e testes.
- Na API, o `dotnet build` não gera warning novo, e o `dotnet test` e o `dotnet format --verify-no-changes` passam.
- `npm run e2e -- T-0xx` passa, quando o ticket tem teste de aceite.
- O `/revisar` aprova.

## 12. Git

- Uma branch por ticket: `feature/T-0xx-slug` ou `fix/T-0xx-slug`.
- Commits no padrão Conventional Commits, e merge na `main` por PR no GitHub.
- As entregas da IA chegam numa branch `chore/onda-N`, já com commit. A IA nunca faz push e nunca commita na `main`.
- O repositório nasce na branch `chore/onda-1`. No T-001, o Higor cria a `main` a partir dela e publica no GitHub.

## 13. Riscos

| Risco | Mitigação |
|---|---|
| Um ticket fica grande demais | o Higor pede, e a IA divide o ticket em dois na hora |
| O teste de aceite falha por um detalhe | os testes buscam pelo papel e pelo texto acessível que o próprio ticket define. Se o erro estiver no teste, quem corrige é a IA |
| O teste de um ticket quebra com um ticket seguinte do mesmo marco | os testes de aceite de um marco são escritos contra o estado final do marco. Exemplo: o teste do cabeçalho (T-005) não exige o menu visível em 375px, porque o T-013 o recolhe |
| Uma biblioteca muda de versão ou de API | cada onda confere as versões e os guias antes de sair |
| O Higor para por semanas | cada marco publicado é um ponto de parada com portfólio, e o `/proximo` continua de onde ele parou |
| Produzir as ondas dá muito trabalho (telas, tickets e guias) | uma onda por marco, nunca tudo de uma vez |

## 14. Decisões agendadas

Estas decisões ficam para depois de propósito: cada uma tem um momento e um critério definidos.

- **Hospedagem da API e do banco:** decidida na onda do marco 3.
  - Critério: ser gratuita, rodar .NET 10 (em container ou nativo) e ter PostgreSQL gerenciado gratuito que não expira.
  - Candidatos, ainda a verificar: Render + Neon, e Azure App Service F1 + Neon.
- **Mesma origem em produção:** decidida na onda do marco 4. O cookie de autenticação e o SignalR exigem que o front e a API pareçam a mesma origem, ou pelo menos o mesmo site, para o navegador.
  - Opções: um rewrite da Vercel para a API, a API servindo o build do painel ou um domínio próprio com subdomínios.
  - Critério: o cookie precisa ser de primeira parte, e o WebSocket precisa funcionar.
  - A decisão vira um ticket do marco 4, e a escolha é explicada na descrição do PR.

## 15. Onda 1: tickets

| ID | Título | Tipo | Conceito novo | Como o aceite é conferido |
|---|---|---|---|---|
| T-001 | Repositório no GitHub e primeiro PR: título, idioma e favicon | feature M | fluxo de branch, PR e CI; o `<head>` do HTML | e2e e CI verde no PR |
| T-002 | Deploy contínuo na Vercel | feature P | build de produção; deploy contínuo | manual: URL publicada e link no README |
| T-003 | Esqueleto semântico da página | feature M | HTML semântico; hierarquia de títulos | e2e |
| T-004 | Base visual com os tokens | feature M | cascata e herança; `var()` e `rem` | e2e e review visual |
| T-005 | Cabeçalho no celular | feature M | box model; CSS Modules | e2e e review visual |
| T-006 | Hero com chamada para agendar | feature M | backgrounds; `:hover` e `:focus-visible` | e2e e review visual |
| T-007 | Card de serviço | feature M | `Intl.NumberFormat`; renderização condicional | e2e e review visual |
| T-008 | Grade de serviços | feature P | CSS Grid com `auto-fit` e `minmax` | e2e e review visual |
| T-009 | Barbeiros | feature M | `object-fit` e `aspect-ratio`; flexbox com `flex-wrap` | e2e e review visual |
| T-010 | Depoimentos | feature P | `overflow`; `scroll-snap` | e2e e review visual |
| T-011 | Contato, horário e rodapé | feature M | tabela semântica; `position: sticky` | e2e e review visual |
| T-012 | Versão desktop | feature M | media queries com `min-width`; container | e2e e review visual em 1280px |
| T-013 | Menu do celular | feature M | `useState` e `onClick`; `aria-expanded` | e2e |
| T-014 | Acessibilidade e Lighthouse | feature M | navegação por teclado (link "Pular para o conteúdo" e foco visível); Lighthouse | e2e (axe e ordem de foco), e a nota do Lighthouse colada no PR |
| T-015 | Desafio do marco 1 | desafio, 1h30, sem IA | — | review |

Do T-003 ao T-011, as telas são as de 375px, porque o site é construído mobile-first. A adaptação para o desktop vem toda no T-012.
