# Plano — Navalha, onda 1 (marcos 0 e 1)

> **Para agentes:** use `superpowers:executing-plans` (execução nativa, recomendada no fim). Os passos usam checkbox (`- [ ]`).

**Objetivo:** criar o repositório `D:\Projetct\navalha` com tudo o que a "empresa" entrega na onda 1:
- o front configurado;
- os tokens e os dados locais;
- as telas de referência;
- os testes de aceite;
- 15 tickets e 13 guias;
- o desafio do marco 1;
- os comandos `/proximo` e `/revisar`;
- o CI.

Com isso, o Higor começa direto pelo T-001.

**Arquitetura:** monorepo com `web/` (Vite + React + TS), `design/`, `backlog/`, `guias/`, `desafios/` e `docs/`. A solução dos tickets é construída **fora do repositório** (`<scratchpad>\ref`), estado por estado, e nunca entra nele. Ela tem duas funções:
- gerar as telas em PNG;
- provar, caso de teste por caso de teste, que cada teste de aceite está vermelho antes do seu ticket e verde dele em diante.

**Stack:**
- **Template:** `create-vite@9.2.1` react-ts, que traz React ^19.2.8, Vite ^8.3.0, TypeScript ~6.0.2 e oxlint ^1.81.0.
- **Ferramentas por cima do template:** Prettier ^3.9, Vitest ^5.0, jsdom ^30.1, Testing Library (react ^16.3, dom ^10.4, jest-dom ^7.0, user-event ^14.6), @playwright/test ^1.64 (Chromium da revisão 1248) e @axe-core/playwright ^4.13.
- **Fontes:** @fontsource/oswald ^5.3 e @fontsource-variable/inter ^5.3.
- **CI:** `actions/checkout@v7` e `actions/setup-node@v7`, com Node 24.

**Spec:** `D:\Projetct\docs\agentes\2026-10-07-spec-navalha.md`

---

## Contexto

O roteiro de 17 dias do `/Frontend` deu lugar a um projeto de portfólio feito por tickets, como num emprego: o Navalha, agendamento online de uma barbearia. A spec foi aprovada em 2026-10-07. Este plano cobre só a onda 1: o marco 0 (primeiro PR e deploy) e o marco 1 (site público em HTML e CSS). Um revisor independente já leu esta versão, e os 20 apontamentos dele estão incorporados.

## Os 6 itens do contrato

1. **Objetivo:** entregar a onda 1 da spec, com o repositório pronto para os tickets T-001 a T-015.
2. **Fora do escopo:**
   - a solução dos tickets dentro do repositório;
   - a API e os marcos 2 em diante;
   - criar o repositório no GitHub, dar push e configurar a Vercel, que são tarefas do T-001 e do T-002;
   - mexer no `/Frontend`;
   - qualquer commit na `main`, que ainda não vai existir.
3. **Arquivos afetados:**
   - criados: tudo em `D:\Projetct\navalha\**` (veja "Mapa de arquivos");
   - atualizado: `D:\Projetct\docs\agentes\2026-10-07-spec-navalha.md`, só na tabela da §15, para refletir os Ajustes 1 e 2;
   - criado: `D:\Projetct\docs\agentes\2026-10-07-plano-navalha-onda-1.md`, a cópia final deste plano.
4. **Passos:** as Tarefas 1 a 11, cada uma com o comando de conferência e a saída esperada.
5. **Riscos:** veja a seção "Riscos".
6. **O que preciso decidir:** nada.

## Ajustes em relação à spec

1. **Conceitos dos tickets, para manter no máximo 2 por ticket:**
   - T-005 passa a ser box model e CSS Modules (o primeiro componente com estilo próprio). O cabeçalho em duas linhas sai só com `display: block` e `inline-block`.
   - O flexbox vai para o T-009, junto com o `flex-wrap`.
   - O T-007 fica com `Intl.NumberFormat` e renderização condicional (o selo "Mais pedido").
2. **E2E nos tickets que eram só de review visual:** T-004, T-008, T-010 e T-012 ganham e2e, além do review visual. Eles conferem estilo computado, colunas e rolagem, nunca pixel.
3. **Favicon próprio:** `design/favicon.svg` é separado do `design/logo.svg`, porque um logo horizontal não fica legível em 16px.
4. **`CLAUDE.md` com a linha `@AGENTS.md`,** para o Claude Code carregar as regras com certeza.
5. **Proteção contra CRLF:** entram o `.gitattributes` com `eol=lf` e o `.vscode/settings.json`. O Git desta máquina tem `core.autocrlf=true` (no gitconfig do sistema), e sem isso o `prettier --check` reprova os arquivos.
6. **Desafio do marco 1 em HTML e CSS puros, sem build.** Os PNGs dele ficam em `design/desafio-m1/`, como a §9 pede.
7. **Fotos dos barbeiros em `web/public/barbers/`, por URL,** para os testes, que rodam em Node, conseguirem importar `src/data/*.ts`.
8. **Detalhes de acessibilidade que viram critério de ticket:**
   - A faixa de depoimentos recebe `tabIndex={0}` e `aria-label="Lista de depoimentos"`, porque a regra `scrollable-region-focusable` do axe reprova região rolável que o teclado não alcança.
   - O `main` recebe `tabIndex={-1}`, para o link de pular funcionar sempre.
   - Links dentro de texto continuam sublinhados, porque a cor primária tem só cerca de 2:1 de contraste contra o texto.
9. **Porta própria para o e2e (5199).** Há vários projetos Vite em `D:\Projetct` na porta 5173, e o e2e poderia testar o projeto errado.

## Restrições globais

- O código fica em inglês. Interface, tickets, guias e títulos de teste ficam em português, com acentos.
- Cada ticket tem no máximo 2 conceitos novos. P leva até 30 min, e M até 1h.
- Os testes de aceite buscam elementos pelo **papel e pelo texto acessível** definidos no ticket. Eles são escritos contra o **estado final do marco 1**.
- **Cada caso de teste fica vermelho no estado anterior ao seu ticket.** Os casos que não ficam (por exemplo, o axe usado como guarda) levam o comentário `// guarda de regressão: <motivo>`.
- A solução de referência vive só em `<scratchpad>\ref\`.
- **Git:**
  - a branch é `chore/onda-1`;
  - os commits seguem o Conventional Commits, com corpo em tópicos de até 2 linhas, **sem rodapé e sem co-author**;
  - nunca fazer push;
  - não criar a `main`.
- **Medidas:**
  - breakpoints em 640px e 1024px;
  - viewports MOBILE 375×812, TABLET 768×1024, DESKTOP 1280×800 e WIDE 1600×900;
  - o e2e e a ferramenta de screenshots usam a porta 5199 e `reducedMotion: "reduce"`.

## Pontos de atenção do review

1. **CRLF no Windows:** um clone limpo não pode reprovar o `npm run check`. Provado na Tarefa 11, Passo 3.
2. **O `tsc -b` checando o e2e:** um `tsconfig.e2e.json` próprio, com `moduleResolution: "bundler"` e a lib DOM, tira o e2e do `nodenext`.
3. **Falso verde por padrão do navegador:**
   - o Chromium já desenha contorno de foco sozinho, então os testes exigem `outline` exatamente `solid 3px var(--color-focus)`;
   - para o Playwright, um elemento fora da tela continua "visível", então o link de pular é testado com `toBeInViewport`.
4. **Acoplamento entre tickets:** a matriz caso × estado da Tarefa 5 prova que nenhum caso depende de um ticket futuro.
5. **Medir antes de a página assentar:** o helper `gotoReady` espera as fontes e as imagens, `stableBox` espera a posição parar de mudar, e a rolagem é instantânea.

---

## Contrato do marco 1 (fonte única de textos, nomes e medidas)

### Estrutura final da página (estado do T-014)

```html
<a href="#conteudo">Pular para o conteúdo</a>                       <!-- T-014: fora da tela até receber foco (transform) -->
<header>                                                             <!-- banner; sticky no T-011 -->
  <a href="#inicio"><img src="{logo.svg}" alt="Barbearia Navalha"></a>
  <button aria-expanded="false" aria-controls="menu-principal">Menu</button>  <!-- T-013: só abaixo de 640px, nome sempre "Menu" -->
  <nav aria-label="Principal" id="menu-principal">                   <!-- fechado = display: none -->
    <ul><li><a href="#servicos">Serviços</a></li><li><a href="#barbeiros">Barbeiros</a></li>
        <li><a href="#depoimentos">Depoimentos</a></li><li><a href="#contato">Contato</a></li></ul>
  </nav>
</header>
<main id="conteudo" tabindex="-1">
  <section id="inicio"><h1>Seu corte com hora marcada</h1>
    <p>Barbearia clássica no coração de Pinheiros. Escolha o serviço, o barbeiro e o horário, sem fila e sem espera.</p>
    <a href="#servicos">Agendar horário</a></section>
  <section id="servicos"><h2>Serviços</h2> <ul> li > article(h3, descrição, "R$ 45,00", "30 min", selo "Mais pedido" se popular) </ul></section>
  <section id="barbeiros"><h2>Barbeiros</h2> <ul> li > article(img alt="Foto de {nome}", h3, ul aria-label="Especialidades" > li) </ul></section>
  <section id="depoimentos"><h2>Depoimentos</h2> <ul tabindex="0" aria-label="Lista de depoimentos"> li > figure(blockquote > p, figcaption "— {autor}") </ul></section>
  <section id="contato"><h2>Contato</h2>
    <address>Rua dos Pinheiros, 1234 – Pinheiros, São Paulo – SP <a href="tel:+5511912345678">(11) 91234-5678</a> <a href="https://wa.me/5511912345678">Conversar no WhatsApp</a></address>
    <table><caption>Horário de funcionamento</caption> thead(th "Dia", th "Horário") · tbody 7 × tr(th scope="row" dia, td horário)</table></section>
</main>
<footer><p>© 2026 Barbearia Navalha</p> <a href="#inicio">Voltar ao topo</a></footer>
```

**Ordem de Tab no DESKTOP (T-014):** Pular para o conteúdo → Barbearia Navalha → Serviços → Barbeiros → Depoimentos → Contato → Agendar horário → Lista de depoimentos → (11) 91234-5678 → Conversar no WhatsApp → Voltar ao topo.

**Componentes pedidos nos tickets** (quem confere é o review, não o e2e):
- `src/site/Header.tsx`, `Hero.tsx`, `Services.tsx`, `ServiceCard.tsx`, `Barbers.tsx`, `BarberCard.tsx`, `Testimonials.tsx`, `Contact.tsx` e `Footer.tsx`, cada um com o seu `.module.css`;
- `src/styles/base.css` (T-004; a classe `.container` entra no T-012);
- `src/lib/format.ts`, com `formatCurrency(value: number): string` (T-007).

### Layout por ticket (os testes e os tickets usam estes fatos)

| Ticket | Fatos de layout |
|---|---|
| T-004 | `base.css`: `body` com `--color-bg`, `--color-text` e `--font-body`; `h1` a `h3` com `--font-display`; `a` com `--color-primary`, sublinhado; `section` com `padding: var(--space-7) var(--space-4)` |
| T-005 | O cabeçalho tem duas linhas em qualquer largura até o T-012: o logo e, abaixo, os links. Cada link é `inline-block`, com `padding-block: var(--space-3)`, o que dá altura de 44px ou mais. Os 4 links ficam na mesma linha |
| T-006 | O fundo de `#inicio` é `url(hero.svg)` com sobreposição escura. O botão tem fundo `--color-primary`, e no hover `--color-primary-strong`. O foco é `outline: 3px solid var(--color-focus); outline-offset: 3px` |
| T-008 | `grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr)); gap: var(--space-5)`. Dá 1 coluna em 375px, 2 em 768px e 3 em 1280px e em 1600px |
| T-009 | 2 colunas no celular. A foto é quadrada (`aspect-ratio: 1`, `object-fit: cover`, raio `--radius-full`). As especialidades ficam em `display: flex; flex-wrap: wrap; gap: var(--space-2)` |
| T-010 | No celular, faixa horizontal com `overflow-x: auto` e `scroll-snap-type: x mandatory`. A página **nunca** rola na horizontal |
| T-011 | O cabeçalho é `position: sticky; top: 0`, com fundo opaco. As seções têm `scroll-margin-top: var(--scroll-offset)`, que vale 7,5rem, mais que o cabeçalho de duas linhas |
| T-012 | **A partir de 640px:** logo e links numa linha só (flex), com os links mantendo a área de toque de 44px; barbeiros em 4 colunas; `section` com `padding-inline: var(--space-6)`. **A partir de 1024px:** depoimentos em grade de 3 colunas, sem rolagem, e o endereço e a tabela lado a lado. A `.container` tem `max-width: var(--container-max); margin-inline: auto` |
| T-013 | Abaixo de 640px, o botão "Menu" fica à direita do logo (flex). Com o menu fechado, o `nav` tem `display: none`. Com o menu aberto, os links aparecem em coluna. Clicar num link fecha o menu |
| T-014 | O link de pular sai da tela com `transform` e volta quando recebe foco. Todo `:focus-visible` usa `outline: 3px solid var(--color-focus); outline-offset: 3px`. O `main:focus` fica sem contorno |

---

## Mapa de arquivos

```
navalha/
├── .gitattributes  .gitignore  .vscode/{settings.json,extensions.json}  .github/workflows/ci.yml
├── AGENTS.md  CLAUDE.md  README.md
├── .claude/skills/{proximo,revisar}/SKILL.md     .agents/skills/{proximo,revisar}/SKILL.md
├── docs/2026-10-07-spec-navalha.md  docs/2026-10-07-plano-navalha-onda-1.md
├── design/{tokens.md,logo.svg,favicon.svg}  design/m1/*.png (14)  design/desafio-m1/layout-{375,1280}.png
├── backlog/BOARD.md  backlog/T-001-….md … T-015-….md
├── guias/*.md (13)
├── desafios/m1/{README.md,dados.md,index.html,styles.css,assets/*.svg}
└── web/
    ├── package.json  package-lock.json  index.html  vite.config.ts  playwright.config.ts  .gitignore (o do template)
    ├── tsconfig.json  tsconfig.app.json  tsconfig.node.json  tsconfig.e2e.json  .oxlintrc.json  .prettierrc.json  .prettierignore
    ├── public/favicon.svg (o do Vite; o T-001 troca)  public/barbers/{rafael,bruno,caio,diego}.svg
    ├── src/main.tsx  src/App.tsx  src/test/setup.ts  src/styles/{reset.css,tokens.css}  src/assets/{logo.svg,hero.svg}
    ├── src/data/{types.ts,services.ts,barbers.ts,testimonials.ts,business.ts}
    ├── e2e/support/{viewports.ts,axe.ts,page.ts}  e2e/aceite/T-0xx-*.spec.ts (13)
    └── tools/{shots.config.ts,shots.spec.ts}
```

---

## Tarefa 1: repositório

**Arquivos:** `.gitattributes`, `.gitignore`, `.vscode/settings.json` e `.vscode/extensions.json`.

- [ ] **Passo 1:** `git init -b chore/onda-1 D:\Projetct\navalha`. Esperado: "Initialized empty Git repository".
- [ ] **Passo 2:** `.gitattributes`:
```gitattributes
* text=auto eol=lf
*.png binary
*.jpg binary
*.woff2 binary
```
- [ ] **Passo 3:** `.gitignore` com:
  - `node_modules/`, `dist/`, `coverage/`, `playwright-report/`, `test-results/`, `.shots/` e `*.local`;
  - `.env` e `.env.*`, com a exceção `!.env.example`;
  - `.vscode/*`, com as exceções `!.vscode/settings.json` e `!.vscode/extensions.json`;
  - `.idea/`, `.DS_Store`, `bin/` e `obj/`.
- [ ] **Passo 4:** `.vscode/settings.json` com `"files.eol": "\n"`, `"editor.formatOnSave": true` e `"editor.defaultFormatter": "esbenp.prettier-vscode"`. `.vscode/extensions.json` recomenda `esbenp.prettier-vscode` e `oxc.oxc-vscode`.
- [ ] **Passo 5:** commit `chore: configura o repositório`. Conferência: `git branch` mostra só `chore/onda-1`.

## Tarefa 2: front com Vite e ferramentas

**Produz:**
- os scripts `check`, `e2e` e `shots`;
- `MOBILE`, `TABLET`, `DESKTOP` e `WIDE`;
- `expectNoA11yViolations(page, options?)`;
- `gotoReady(page, path?)`, `resolveColor(page, token)`, `stableBox(locator)` e `focusedName(page)`.

- [ ] **Passo 1:** em `navalha/`, rodar `npm create vite@9.2.1 web -- --template react-ts --no-interactive --no-immediate`.
- [ ] **Passo 2:** apagar `src/App.css`, `src/index.css`, `src/assets/*`, `public/icons.svg` e `web/README.md`. **Manter** o `web/.gitignore`, porque o oxlint o usa para ignorar o `dist`, e o `public/favicon.svg` do Vite, que o T-001 troca.
- [ ] **Passo 3:** instalar as dependências:
  - `npm install`;
  - `npm install @fontsource/oswald@^5.3 @fontsource-variable/inter@^5.3`;
  - `npm install -D prettier@^3.9 vitest@^5.0 jsdom@^30.1 @testing-library/react@^16.3 @testing-library/dom@^10.4 @testing-library/jest-dom@^7.0 @testing-library/user-event@^14.6 @playwright/test@^1.64 @axe-core/playwright@^4.13`;
  - `npx playwright install chromium`, que deve baixar a revisão 1248.
- [ ] **Passo 4:** no `package.json`, definir `"name": "navalha-web"` e estes scripts:
```json
"dev": "vite", "build": "tsc -b && vite build", "preview": "vite preview",
"typecheck": "tsc -b", "lint": "oxlint",
"format": "prettier --write .", "format:check": "prettier --check .",
"test": "vitest run --passWithNoTests",
"check": "npm run typecheck && npm run lint && npm run format:check && npm run test",
"e2e": "playwright test", "shots": "playwright test -c tools/shots.config.ts"
```
- [ ] **Passo 5:** `vite.config.ts` recebe `/// <reference types="vitest/config" />` e o bloco `test: { environment: "jsdom", include: ["src/**/*.test.{ts,tsx}"], setupFiles: ["./src/test/setup.ts"] }`. O `src/test/setup.ts` tem `import "@testing-library/jest-dom/vitest";` (o revisor conferiu que as duas entradas existem nas versões atuais).
- [ ] **Passo 6:** ajustar os tsconfigs:
  - `tsconfig.app.json`: acrescentar `"strict": true`, para deixar explícito;
  - `tsconfig.node.json`: não muda;
  - criar `tsconfig.e2e.json`:
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.e2e.tsbuildinfo",
    "target": "es2023", "lib": ["ES2023", "DOM", "DOM.Iterable"], "types": ["node"],
    "module": "esnext", "moduleResolution": "bundler", "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true, "moduleDetection": "force", "noEmit": true, "skipLibCheck": true,
    "strict": true, "noUnusedLocals": true, "noUnusedParameters": true, "erasableSyntaxOnly": true
  },
  "include": ["e2e", "tools", "playwright.config.ts"]
}
```
  - `tsconfig.json`: acrescentar `{ "path": "./tsconfig.e2e.json" }` às `references`.
- [ ] **Passo 7:** `playwright.config.ts`:
```ts
import { defineConfig, devices } from "@playwright/test";

const port = 5199;
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL, trace: "retain-on-failure", reducedMotion: "reduce" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: `npm run dev -- --port ${port} --strictPort`, url: baseURL, reuseExistingServer: true },
});
```
- [ ] **Passo 8:** criar os helpers:
  - **`e2e/support/viewports.ts`:** as 4 constantes.
  - **`e2e/support/axe.ts`:** `expectNoA11yViolations(page, { include?: string; rules?: string[] } = {})`. Se houver `include`, faz antes `await expect(page.locator(include).first()).toBeAttached()`. Usa as tags `wcag2a`, `wcag2aa`, `wcag21a` e `wcag21aa`, e `withRules(rules)` quando `rules` vier. Falha com `expect(violations.map(v => \`${v.id}: ${v.help} (${v.nodes.length}x)\`)).toEqual([])`.
  - **`e2e/support/page.ts`:**
    - `gotoReady(page, path = "/")`: chama `page.goto(path)` e espera `document.fonts.ready` e `page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0))`.
    - `resolveColor(page, token)`: cria um `span` com `style.color = var(--token)` e devolve `getComputedStyle(span).color`.
    - `stableBox(locator)`: lê o `boundingBox` a cada 2 `requestAnimationFrame` até duas leituras iguais, no máximo 20 vezes, e senão lança "A posição não estabilizou".
    - `focusedName(page)`: devolve o nome do `document.activeElement`, nesta ordem de preferência: `aria-label`, depois `textContent.trim()`, depois o `alt` da `img` de dentro.
- [ ] **Passo 9:** `.prettierrc.json` com `{ "endOfLine": "lf" }`, e `.prettierignore` com `dist`, `coverage`, `playwright-report`, `test-results`, `.shots` e `package-lock.json`.
- [ ] **Passo 10:**
  - `src/main.tsx` importa só as fontes por enquanto: `@fontsource-variable/inter/index.css`, `@fontsource/oswald/500.css` e `@fontsource/oswald/600.css`. Vai com `.css`, porque o TS 6 liga o `noUncheckedSideEffectImports`. Os imports de estilo entram na Tarefa 3.
  - `src/App.tsx` devolve `<p>Navalha: comece pelo T-001 em backlog/BOARD.md.</p>`.
- [ ] **Passo 11:** `.github/workflows/ci.yml`. Rodar em `pull_request` e em `push` para `main`. Um job `web` com `working-directory: web`, que faz:
  - `actions/checkout@v7`;
  - `actions/setup-node@v7` com `node-version: 24`, `cache: npm` e `cache-dependency-path: web/package-lock.json` (as três entradas foram conferidas no `action.yml` da v7.0.0);
  - `npm ci`, `npm run check` e `npm run build`.
- [ ] **Passo 12:** rodar `npm run format`, `npm run check` e `npm run build`. Esperado: os três terminam com código 0, e o Vitest avisa que não achou testes e sai com 0.
- [ ] **Passo 13:** commit `chore(web): cria o front com Vite e configura as ferramentas`.

## Tarefa 3: tokens, reset, imagens e dados

**Produz:**
- os tipos `Service`, `Barber`, `Testimonial`, `OpeningHours` e `Business`;
- as constantes `services`, `barbers`, `testimonials` e `business`.

- [ ] **Passo 1:** `src/styles/tokens.css` com estes valores:

| Grupo | Tokens |
|---|---|
| Cores | `--color-bg #111111`, `--color-surface #1b1b1b`, `--color-surface-raised #252525`, `--color-border #343434`, `--color-text #f4efe6`, `--color-text-muted #b5ad9f`, `--color-primary #c9a45c`, `--color-primary-strong #e0bd73`, `--color-on-primary #111111`, `--color-focus #f2d38a`, `--color-overlay rgb(17 17 17 / 0.75)` |
| Tipografia | `--font-display "Oswald", "Arial Narrow", sans-serif`; `--font-body "Inter Variable", "Segoe UI", system-ui, sans-serif`; `--text-sm .875rem`, `--text-base 1rem`, `--text-lg 1.125rem`, `--text-xl 1.5rem`, `--text-2xl 2rem`, `--text-3xl 2.75rem`; `--leading-tight 1.15`, `--leading-normal 1.6`; `--tracking-wide .06em` |
| Espaço | `--space-1` .25rem, `--space-2` .5rem, `--space-3` .75rem, `--space-4` 1rem, `--space-5` 1.5rem, `--space-6` 2rem, `--space-7` 3rem, `--space-8` 4rem |
| Forma e layout | `--radius-sm .375rem`, `--radius-md .75rem`, `--radius-full 999px`, `--shadow-card`, `--container-max 72rem`, `--scroll-offset 7.5rem` |

- [ ] **Passo 2:** um script WCAG no scratchpad confere os contrastes. Esperado: todos passam. Se algum falhar, ajustar o valor, e o resultado vira a tabela do `design/tokens.md`. Os pares são:
  - 4,5:1 para `text` sobre `bg`, `surface` e `surface-raised`;
  - 4,5:1 para `text-muted` sobre `bg` e `surface`;
  - 4,5:1 para `primary` sobre `bg`;
  - 4,5:1 para `on-primary` sobre `primary` e sobre `primary-strong`;
  - 3:1 para `focus` sobre `bg`;
  - para registro, `primary` contra `text` fica abaixo de 3:1, e por isso os links dentro de texto são sublinhados.
- [ ] **Passo 3:** `src/styles/reset.css` faz:
  - `box-sizing: border-box`;
  - `margin: 0`;
  - mídia com `display: block; max-width: 100%`;
  - `font: inherit` nos controles de formulário;
  - um bloco `@media (prefers-reduced-motion: reduce)` que zera `scroll-behavior`, `transition-duration` e `animation-duration` com `!important`.

  O reset **não** define cor, fonte, estilo de lista nem `font-style` do `address`, porque isso fica para os tickets.

  Depois, acrescentar no `main.tsx` os imports `./styles/reset.css` e `./styles/tokens.css`.
- [ ] **Passo 4:** criar os SVGs à mão:
  - `src/assets/logo.svg`: a navalha mais a palavra "NAVALHA" desenhada em traços, com `<title>Barbearia Navalha</title>`;
  - `design/favicon.svg`: só a navalha, em 32×32, com o mesmo `<title>`;
  - `src/assets/hero.svg`: 1600×900, escuro, com listras discretas de barber pole e uma tesoura;
  - `public/barbers/*.svg`: 4 silhuetas. A `caio.svg` tem proporção **3:4** (300×400), de propósito.
  - Copiar o logo para `design/logo.svg`.
- [ ] **Passo 5:** `src/data/types.ts`:
```ts
export type Service = { id: string; name: string; description: string; price: number; durationMinutes: number; popular: boolean };
export type Barber = { id: string; name: string; photoUrl: string; specialties: string[] };
export type Testimonial = { id: string; author: string; quote: string };
export type OpeningHours = { day: string; hours: string };
export type Business = {
  name: string;
  address: { street: string; district: string; city: string; state: string };
  phone: { display: string; href: string };
  whatsappUrl: string;
  openingHours: OpeningHours[];
};
```
- [ ] **Passo 6:** os arquivos de dados, sem import de asset:

| Arquivo | Conteúdo |
|---|---|
| `services.ts` | corte · Corte · "Tesoura e máquina, com acabamento na navalha." · 45 · 30 · popular — barba · Barba · "Toalha quente, navalha e balm hidratante." · 35 · 30 — corte-e-barba · Corte e barba · "O combo completo, por um preço menor." · 70 · 60 · popular — pezinho · Pezinho · "Acabamento do contorno entre um corte e outro." · 15 · 15 — sobrancelha · Sobrancelha · "Limpeza e alinhamento na navalha." · 15 · 15 — pigmentacao · Pigmentação de barba · "Preenche falhas e uniformiza a cor da barba." · 42.9 · 30 |
| `barbers.ts` | rafael · Rafael Lima · Degradê, Navalhado — bruno · Bruno Costa · Barba, Pigmentação — caio · Caio Mendes · Tesoura, Infantil — diego · Diego Rocha · Degradê, Desenhos (`photoUrl: "/barbers/{id}.svg"`) |
| `testimonials.ts` | Lucas Andrade: "Marquei pelo celular em dois minutos e fui atendido na hora. Nunca mais pego fila." — Pedro Henrique: "O Rafael acertou o degradê de primeira. Virei cliente fixo." — Marcos Vinícius: "Toalha quente, navalha e um café enquanto espera. Atendimento de verdade." — Thiago Martins: "Levei meu filho para o primeiro corte, e a paciência do Caio fez toda a diferença." — Gustavo Ribeiro: "Ambiente bom, preço justo e horário respeitado. Recomendo." |
| `business.ts` | Barbearia Navalha · Rua dos Pinheiros, 1234 · Pinheiros · São Paulo · SP · `(11) 91234-5678` e `tel:+5511912345678` · `https://wa.me/5511912345678` · Segunda-feira: Fechado; Terça-feira a Sexta-feira (uma linha cada): 09:00 às 20:00; Sábado: 08:00 às 18:00; Domingo: Fechado |

- [ ] **Passo 7:** `design/tokens.md` traz:
  - a tabela de tokens, com nome, valor e uso;
  - os breakpoints 640px e 1024px, com a nota de que variável CSS não funciona dentro de `@media`;
  - a tabela de contraste;
  - a regra "só tokens, nenhum hexadecimal no CSS dos componentes".
- [ ] **Passo 8:** rodar `npm run check` e `npm run build`, que devem passar. Depois, commit `chore(web): adiciona tokens, reset, imagens e dados da barbearia` e commit `docs(design): documenta os tokens e adiciona logo e favicon`.

## Tarefa 4: testes de aceite

**Arquivos:** `web/e2e/aceite/`, com T-001, T-003, T-004, T-005, T-006, T-007, T-008, T-009, T-010, T-011, T-012, T-013 e T-014.

**Padrões:**
- cada arquivo começa com `// Teste de aceite do T-0xx, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.`;
- os dados vêm de `../../src/data/*.ts`, sem repetir texto;
- o viewport é definido com `test.use` dentro de `test.describe`;
- as medidas usam `gotoReady` e `stableBox`;
- a largura vem de `document.documentElement.clientWidth`, e não de `innerWidth`;
- a rolagem usa `scrollTo({ …, behavior: "instant" })`, seguido de `expect.poll`.

**Modelo completo** (os outros seguem o mesmo estilo):

```ts
// web/e2e/aceite/T-013-menu-do-celular.spec.ts
// Teste de aceite do T-013, escrito pelo QA (IA). Se estiver errado, quem corrige é a IA.
import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "../support/axe";
import { focusedName, gotoReady } from "../support/page";
import { DESKTOP, MOBILE } from "../support/viewports";

const links = ["Serviços", "Barbeiros", "Depoimentos", "Contato"];

test.describe("no celular", () => {
  test.use({ viewport: MOBILE });

  test.beforeEach(async ({ page }) => {
    await gotoReady(page);
  });

  test("o menu começa fechado", async ({ page }) => {
    const button = page.getByRole("banner").getByRole("button", { name: "Menu" });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toHaveAttribute("aria-controls", "menu-principal");
    await expect(page.locator("#menu-principal")).toBeHidden();
  });

  test("com o menu fechado, o Tab pula os links", async ({ page }) => {
    for (let i = 0; i < 5 && (await focusedName(page)) !== "Menu"; i++) await page.keyboard.press("Tab");
    expect(await focusedName(page)).toBe("Menu");
    await page.keyboard.press("Tab");
    expect(links).not.toContain(await focusedName(page));
  });

  test("o botão abre e fecha o menu", async ({ page }) => {
    const button = page.getByRole("banner").getByRole("button", { name: "Menu" });
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    for (const name of links) {
      await expect(page.locator("#menu-principal").getByRole("link", { name, exact: true })).toBeVisible();
    }
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#menu-principal")).toBeHidden();
  });

  test("escolher um link fecha o menu e vai para a seção", async ({ page }) => {
    const button = page.getByRole("banner").getByRole("button", { name: "Menu" });
    await button.click();
    await page.locator("#menu-principal").getByRole("link", { name: "Barbeiros", exact: true }).click();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL(/#barbeiros$/);
  });

  test("o cabeçalho com o menu aberto passa no axe", async ({ page }) => {
    await page.getByRole("banner").getByRole("button", { name: "Menu" }).click();
    await expectNoA11yViolations(page, { include: "header" });
  });
});

test.describe("no desktop", () => {
  test.use({ viewport: DESKTOP });

  // guarda de regressão: no T-012 já não existe botão, e os links já aparecem.
  test("não tem botão de menu, e os links ficam à mostra", async ({ page }) => {
    await gotoReady(page);
    await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
    const nav = page.getByRole("navigation", { name: "Principal" });
    for (const name of links) await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
  });
});
```

**Casos dos outros arquivos:**

| Arquivo | Casos |
|---|---|
| T-001 | `html` com `lang="pt-BR"`; título da aba "Barbearia Navalha · Agende seu horário"; `link[rel="icon"]` com href `/favicon.svg`, e `page.request.get("/favicon.svg")` ok com o texto contendo "Barbearia Navalha" |
| T-003 | papéis `banner`, `navigation` "Principal" (anexado), `main` e `contentinfo`; o link do logo com href `#inicio`; os 4 links do nav com seus hrefs; exatamente 1 `h1`, o de `section#inicio`, com o texto do contrato; o `h2` de cada seção; o "© 2026 Barbearia Navalha" no rodapé; axe na página inteira |
| T-004 | o fundo e a cor do `body` iguais a `resolveColor` de `--color-bg` e `--color-text`; o `fontFamily` do `body` contém "Inter", e o do `h1` e o do 1º `h2` contém "Oswald"; uma **sonda** (`<p><a href="#sonda">sonda</a></p>` inserida no fim do `main`) tem a cor de `--color-primary` e `textDecorationLine` com "underline"; a `section#servicos` tem `paddingTop` igual a 48px (`--space-7`); axe na página inteira só com `rules: ["color-contrast"]` |
| T-005 | DESKTOP: os 4 links do nav têm o mesmo `y` (±2) e altura de 44px ou mais (com `stableBox`). Não há caso de "logo acima dos links", porque o T-012 põe os dois na mesma linha. Axe em `header` no MOBILE e no DESKTOP (`// guarda de regressão`) |
| T-006 | `#inicio` tem um parágrafo com "sem fila e sem espera" e o link "Agendar horário" com href `#servicos`; o `backgroundImage` de `#inicio` contém "url("; o fundo do botão é `--color-primary`, e depois do `hover()` é `--color-primary-strong`; apertando Tab até o botão (no máximo 15 vezes), o `outline` dele fica `solid`, com 3px e a cor de `--color-focus`; axe em `#inicio` no MOBILE (`// guarda de regressão`) |
| T-007 | os `article` de `#servicos` são `services.length`; para cada serviço, o card tem o h3 com o nome exato, o preço que bate com a regex `R\$\s*{preço}` (preço com `Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 })`) e o texto `{durationMinutes} min`; o "Mais pedido" aparece só nos populares, `services.filter(s => s.popular).length` vezes; axe em `#servicos` |
| T-008 | TABLET: os 2 primeiros cards com o mesmo `y` (±2), e o 3º abaixo. DESKTOP: os 3 primeiros com o mesmo `y`, e o 4º abaixo. MOBILE: cada card começa abaixo do anterior, e a página não rola na horizontal (`// guarda de regressão`) |
| T-009 | os `article` de `#barbeiros` são `barbers.length`; cada um tem a `img` "Foto de {nome}", o h3 e a lista "Especialidades" com `specialties`. MOBILE: em toda foto, a diferença entre largura e altura é no máximo 1; os 2 primeiros cards têm o mesmo `y`; as especialidades de um mesmo card ficam lado a lado (o `y` de cada uma ±2). Axe em `#barbeiros` no MOBILE |
| T-010 | os `figure` de `#depoimentos` são `testimonials.length`, cada um com `blockquote` (citação) e `figcaption` (autor); a lista "Lista de depoimentos" tem `tabindex="0"`. MOBILE: a lista tem `overflow-x` auto ou scroll, `scrollWidth` maior que `clientWidth` e `scroll-snap-type` contendo "x"; a página não rola na horizontal. Axe em `#depoimentos` no MOBILE |
| T-011 | a tabela "Horário de funcionamento" tem as colunas ["Dia", "Horário"], os cabeçalhos de linha iguais a `openingHours.map(h => h.day)` e as células com os horários; o `#contato address` contém a rua, o link do telefone e "Conversar no WhatsApp"; o rodapé tem "Voltar ao topo" com href `#inicio`. MOBILE e DESKTOP: depois de rolar até o fim (com `scrollY` maior que 0), o `y` do banner fica entre -1 e 1. DESKTOP: depois de clicar em "Serviços", o banner fica entre -1 e 1 **e** o topo do h2 "Serviços" fica no fundo do banner ou abaixo. Axe em `#contato` e em `footer` |
| T-012 | DESKTOP: o centro do logo e o do 1º link do nav ficam a no máximo 8px de distância; os 4 primeiros barbeiros têm o mesmo `y`; nada em `#depoimentos` rola na horizontal, e os 3 primeiros `figure` têm o mesmo `y`; a tabela começa à direita do fim do `address`; axe na página inteira. WIDE: a lista de serviços tem até 1153px, e as margens dos dois lados são iguais (±2, por `clientWidth`). MOBILE e DESKTOP: a página não rola na horizontal (`// guarda de regressão`) |
| T-014 | MOBILE: antes do Tab, o link "Pular para o conteúdo" não está no viewport; o 1º Tab dá foco a ele, e ele fica no viewport (`ratio: 1`) com href `#conteudo`; depois do Enter, a URL termina em `#conteudo`, e, depois de 2 `requestAnimationFrame`, o próximo Tab foca "Agendar horário". DESKTOP: Tab até o foco voltar ao `body` ou repetir o 1º elemento; a lista de nomes é igual à ordem do contrato, e cada elemento focado tem `outline` `solid`, com 3px e a cor de `--color-focus`. Axe na página inteira no MOBILE com o menu fechado, no MOBILE com o menu aberto e no DESKTOP (`// guarda de regressão`) |

- [ ] **Passo 1:** escrever os 13 arquivos.
- [ ] **Passo 2:** rodar `npm run format` e `npm run check`. Esperado: passam, e o `tsc -b` checa também o e2e pelo `tsconfig.e2e.json`.
- [ ] **Passo 3:** rodar `npx playwright test`. Esperado: todo caso que não é guarda falha, porque o App ainda é só um parágrafo. Nada é commitado antes da Tarefa 5.

## Tarefa 5: solução de referência, estado por estado (fora do repositório)

**Local:** `<scratchpad>\ref\`, uma cópia de `navalha/web` **sem `e2e/` e sem `node_modules`**. Lá rodar `npm ci`, `git init` e o commit `base`.

- [ ] **Passo 1:** implementar a solução um ticket por vez, seguindo o contrato. Cada estado ganha um commit e uma tag: `t-001`, `t-003`, `t-004` e assim até `t-014`. O visual precisa ser de um site de barbearia bem acabado: escuro, com detalhe em latão, títulos em Oswald caixa-alta e texto em Inter.
- [ ] **Passo 2:** em cada tag, subir `npm run dev -- --port 5174 --strictPort` no `ref` e, a partir de `navalha/web`, rodar `E2E_BASE_URL=http://localhost:5174 npx playwright test --reporter=json > <scratchpad>\matriz\<tag>.json`.
- [ ] **Passo 3:** um script no scratchpad monta a matriz caso × estado e verifica duas regras:
  - todo caso do T-k fica **verde** em `t-k` e em todas as tags seguintes;
  - todo caso do T-k fica **vermelho** na tag anterior a `t-k`, exceto os casos marcados com `// guarda de regressão`.

  Esperado: 0 violações. Se houver alguma, corrigir o teste (ou a referência, se o defeito for dela) e voltar ao Passo 2.
- [ ] **Passo 4:** na tag `t-014`, rodar `npm run check` no `ref`, que deve passar. Rodar também o Lighthouse mobile pela CLI (`npx lighthouse http://localhost:5174 --only-categories=accessibility --form-factor=mobile --quiet --chrome-flags="--headless"`). Esperado: acessibilidade 95 ou mais.
- [ ] **Passo 5:** em `navalha/web`, rodar `npm run format` e `npm run check`. Depois, commit `test(aceite): adiciona os testes de aceite dos marcos 0 e 1`.

## Tarefa 6: telas de referência

**Arquivos:** `web/tools/shots.config.ts`, `web/tools/shots.spec.ts` e `design/m1/*.png`.

- [ ] **Passo 1:** a ferramenta de screenshots, que o `/revisar` também usa:
  - variáveis de ambiente: `SHOTS_BASE_URL` (padrão `http://localhost:5199`), `SHOTS_URL` (padrão `/`, também aceita `file:///…`) e `SHOTS_DIR` (padrão `.shots`);
  - sobe o Vite (`cwd: ".."`, porta 5199) quando `SHOTS_BASE_URL` não está definida, com `reducedMotion: "reduce"`;
  - gera a página inteira em 375, 768 e 1280px;
  - gera recortes em 375px do `header`, do `footer` e de cada `section[id]`, com `header { position: static !important }` injetado por `addStyleTag`;
  - tem a cena "menu-aberto-375", que clica em "Menu" quando o botão existe;
  - tem a cena "foco-375", que aperta 1 Tab e fotografa o topo;
  - espera `document.fonts.ready` antes de cada foto.
- [ ] **Passo 2:** exportar os PNGs a partir das tags do `ref`:

| PNG | Tag | Origem |
|---|---|---|
| `style-tile.png` | — | `ref/style-tile.html`, com cores, escala de tipo e de espaço |
| `cabecalho-375.png` | t-005 | recorte do header |
| `hero-375.png` | t-006 | recorte de `#inicio` |
| `servicos-375.png`, `servicos-768.png` | t-008 | `#servicos` |
| `barbeiros-375.png` | t-009 | `#barbeiros` |
| `depoimentos-375.png` | t-010 | `#depoimentos` |
| `contato-rodape-375.png` | t-011 | `#contato` e o footer |
| `pagina-1280.png` | t-012 | página inteira |
| `menu-fechado-375.png`, `menu-aberto-375.png` | t-013 | header e a cena do menu aberto |
| `foco-375.png` | t-014 | cena de foco |
| `pagina-375.png` | t-014 | página inteira |

- [ ] **Passo 3:** abrir cada PNG e conferir a legibilidade, o alinhamento e a fidelidade aos tokens. Se algum estiver ruim, corrigir a tag no `ref` e exportar de novo.
- [ ] **Passo 4:** rodar `npm run format` e `npm run check`. Depois, commit `chore(web): adiciona a ferramenta de screenshots` e commit `docs(design): adiciona as telas do marco 1`.

## Tarefa 7: os 13 guias

**Formato de cada guia:**
- título e a linha "Para: T-0xx · Leitura: ~N min";
- as seções da tabela abaixo, com **os títulos exatos**, porque eles viram as âncoras dos tickets;
- em cada seção: o essencial, um exemplo mínimo de até 15 linhas (nunca a solução de um ticket do Navalha), as armadilhas e, quando couber, a ponte com C# e onde ela quebra;
- no fim, a seção "Para ir além", com de 1 a 3 links oficiais (MDN em pt-BR, quando existir, web.dev ou react.dev);
- de 1 a 2 páginas;
- títulos sem pontuação e sem crase.

| Guia | Seções (`##`) |
|---|---|
| `ponte-dotnet.md` | cópia literal de `/Frontend/guia/ponte-dotnet.md` |
| `fluxo-de-trabalho.md` | A sessão de 1h · Primeira vez na máquina · Branch por ticket · Checks antes do review · Pedindo o review · Abrindo o PR e fazendo o merge · Deploy na Vercel · Quando o check falha |
| `devtools.md` | Elements e estilos computados · Modo responsivo · Console · Lighthouse · React DevTools |
| `html-semantico.md` | O head do documento · Landmarks · Hierarquia de títulos · Listas · Citações · Tabelas · Endereço e links especiais · Div ou elemento semântico |
| `css-fundamentos.md` | Como o CSS decide · Herança · Unidades · Variáveis CSS · Cores e fundos · Pseudo-classes |
| `box-model.md` | As quatro caixas · Box sizing · Margin padding e gap · Display |
| `flexbox.md` | Eixo principal e cruzado · Alinhamento · Espaço entre itens · Quebra de linha · Crescer e encolher |
| `grid.md` | Linhas e colunas · Colunas automáticas · Grid ou flexbox |
| `posicionamento.md` | Os valores de position · Sticky · Camadas · Âncoras e cabeçalho fixo |
| `responsivo.md` | Mobile first · Media queries · Container · Imagens fluidas · Rolagem horizontal |
| `css-modules.md` | Por que módulos · Como usar · Várias classes e estados · Estilo global ou de módulo |
| `acessibilidade.md` | Por que importa · Texto alternativo · Contraste · Teclado e foco · Pular para o conteúdo · Botões que abrem e fecham · axe e Lighthouse |
| `estado-e-eventos.md` | Estado com useState · Eventos · Renderização condicional · Por que não mutar |

- [ ] **Passo 1:** despachar 3 subagentes em paralelo, com 4 guias cada. Cada um recebe o formato acima, o público ("dev .NET, CSS do zero"), as versões da stack e a proibição de mostrar o código de qualquer seção do Navalha. O `ponte-dotnet.md` é copiado direto.
- [ ] **Passo 2:** revisar cada guia: precisão técnica contra a documentação oficial, acentos, títulos exatos e ausência de solução de ticket.
- [ ] **Passo 3:** commit `docs(guias): adiciona os guias rápidos do marco 1`.

## Tarefa 8: desafio do marco 1

**Arquivos:** `desafios/m1/README.md`, `dados.md`, `index.html`, `styles.css`, `assets/{logo,hero,sobre}.svg` e `design/desafio-m1/layout-{375,1280}.png`.

- [ ] **Passo 1:** **Café Grão**, uma landing page de cafeteria em tema claro, com:
  - um cabeçalho com o logo e os links Cardápio, Sobre e Contato;
  - um hero com o h1 "Café de verdade, feito na hora" e o link "Ver cardápio";
  - a seção "Cardápio", com 6 cards: Espresso R$ 7,00, Cappuccino R$ 12,00, Latte R$ 13,50, Mocha R$ 15,00, Pão de queijo R$ 8,00 e Bolo do dia R$ 11,00;
  - a seção "Sobre", com imagem e texto lado a lado no desktop;
  - um rodapé com endereço, horário e ©.

  O `styles.css` inicial traz só os tokens (`:root`) e um reset. O `index.html` traz só o `head`, com `lang`, título e o link do CSS. Os textos ficam em `dados.md`.
- [ ] **Passo 2:** fazer a solução no `ref/desafio-m1/` e gerar os PNGs com `SHOTS_URL=file:///…`.
- [ ] **Passo 3:** o README traz:
  - as regras: 1h30 cronometrada, sem IA, com consulta liberada ao MDN e ao código do próprio Navalha;
  - como abrir: dois cliques no `index.html` ou `npx serve desafios/m1`;
  - a entrega: na branch `feature/T-015-desafio-m1`;
  - os 5 critérios de avaliação: semântica, fidelidade ao layout, responsividade sem rolagem horizontal, acessibilidade (alt, contraste e foco) e organização do CSS.
- [ ] **Passo 4:** commit `docs(desafios): adiciona o desafio do marco 1`.

## Tarefa 9: board e tickets

**Arquivos:**
- `backlog/BOARD.md`;
- `T-001-github-e-primeiro-pr.md`, `T-002-deploy-vercel.md`, `T-003-esqueleto-semantico.md`, `T-004-base-visual.md` e `T-005-cabecalho.md`;
- `T-006-hero.md`, `T-007-card-de-servico.md`, `T-008-grade-de-servicos.md`, `T-009-barbeiros.md` e `T-010-depoimentos.md`;
- `T-011-contato-e-rodape.md`, `T-012-versao-desktop.md`, `T-013-menu-do-celular.md`, `T-014-acessibilidade.md` e `T-015-desafio-m1.md`.

**Modelo de ticket:**

```md
# T-0xx · Título

| Tipo | Tamanho | Marco | Depende de |
|---|---|---|---|
| feature | M (até 1h) | 1 · Site público | T-0yy |

**Conceito novo:** …; …

## Contexto
2 ou 3 linhas, na voz do PO.

## Critérios de aceite
- [ ] **Dado** … **quando** … **então** … (com os textos e papéis exatos do Contrato)
- [ ] (arquivos e componentes esperados; medidas por token)

## Layout
![…](../design/m1/….png)
Medidas: (tokens usados, tirados do CSS do `ref`)

## Fora do escopo
- …

## Guia rápido
- [Guia › Seção](../guias/arquivo.md#ancora)
- Oficial: [MDN · …](…)

## Como conferir
`npm run check` · `npm run e2e -- T-0xx` · `/revisar`
```

**O T-001 tem uma seção "Passo a passo"** com:
1. abrir no VS Code a pasta `navalha`, e não a `web`;
2. `git switch -c main`;
3. `gh repo create navalha --public --source . --remote origin`;
4. `git push -u origin main`;
5. `cd web`, `npm install` e `npx playwright install chromium`;
6. a branch do ticket;
7. o título "Barbearia Navalha · Agende seu horário", pronto para copiar (o "·" é difícil de digitar);
8. `npm run format` antes do check;
9. `gh pr create` e `gh pr merge`.

O T-002 traz as telas da Vercel, com o Root Directory `web`.

- [ ] **Passo 1:** escrever o `BOARD.md`, com:
  - a legenda ⬜ 🟦 ✅;
  - uma tabela por marco, com as colunas Ticket (link), Título, Tipo, Tam., Status e Nota do review;
  - a seção "Candidatos a ticket", vazia.
- [ ] **Passo 2:** escrever os 15 tickets:
  - os conceitos seguem a §15 da spec com os Ajustes 1 e 8;
  - os critérios citam o Contrato letra por letra;
  - as medidas saem do CSS do `ref`;
  - nenhum ticket mostra código da solução.
- [ ] **Passo 3:** commit `docs(backlog): adiciona o board e os tickets dos marcos 0 e 1`.

## Tarefa 10: regras da IA e comandos

**Arquivos:**
- `AGENTS.md`;
- `CLAUDE.md`, com uma linha só: `@AGENTS.md`;
- `.claude/skills/{proximo,revisar}/SKILL.md`: frontmatter com `name`, `description` e `disable-model-invocation: true`, e corpo apontando para o protocolo no `AGENTS.md`, mais `$ARGUMENTS`;
- `.agents/skills/{proximo,revisar}/SKILL.md`: o mesmo corpo, sem `disable-model-invocation`, no formato das skills do `/Frontend`.

**Seções do `AGENTS.md`:**

1. **O projeto**, com link para a spec em `docs/`.
2. **Quem é o Higor:** dev .NET, front do zero, português do Brasil. A IA usa C# como ponte e diz onde a analogia quebra.
3. **O mapa do repositório:** quem escreve o quê, conforme a §8 da spec.
4. **Como a IA ajuda:**
   - está liberada para tudo;
   - quando escreve código, explica em poucas linhas;
   - o review vale para o PR inteiro;
   - **num ticket de desafio, se o Higor pedir ajuda, a IA lembra o combinado "sem IA" e só ajuda se ele confirmar**.
5. **Stack e limites:** a §6.4 da spec, mais os pacotes e as versões desta onda.
6. **Convenções:**
   - componentes em `src/site/`, cada um como `PascalCase.tsx` com o seu `PascalCase.module.css`;
   - dados em `src/data/`, utilitários em `src/lib/`;
   - identificadores em inglês, textos da interface em português.
7. **Edição e Git:**
   - o `BOARD.md` é atualizado sem mostrar diff, porque isso é regra de projeto (§0 do contrato base);
   - as entregas de onda vão em `chore/onda-N`, com um plano curto aprovado antes;
   - a correção de um teste de aceite é um commit `test(aceite): …` separado, na branch do ticket;
   - nunca push, nunca commit na `main`, sempre Conventional Commits, nunca co-author.
8. **Protocolo do `/proximo`:** a §6.5 da spec, com estes detalhes:
   - marca 🟦 no `BOARD.md` da branch nova;
   - se a `main` não existe, mostra o T-001;
   - se existe remoto, roda `git switch main && git pull --ff-only` antes de criar a branch.
9. **Protocolo do `/revisar`:** a §6.6 da spec, com estes detalhes:
   - o ticket é descoberto pelo nome da branch;
   - a regressão roda `npm run e2e -- T-a T-b …` com os tickets ✅ do marco;
   - nos tickets de tela, roda `npm run shots` e compara com os PNGs;
   - no desafio, usa `SHOTS_URL=file:///…/desafios/m1/index.html` e os critérios do README do desafio;
   - se aprovar, marca ✅, escreve a nota no `BOARD.md` e lembra do commit e do PR.
10. **Preparação de onda:** a §6.8 da spec.

- [ ] **Passo 1:** escrever os arquivos.
- [ ] **Passo 2:** commit `docs(ia): adiciona o AGENTS.md e os comandos /proximo e /revisar`.

## Tarefa 11: README, documentos e verificação final

- [ ] **Passo 1:** escrever o `README.md`, a vitrine do projeto, com:
  - o pitch em 2 linhas;
  - o status por marco, todos em ⬜;
  - a stack;
  - como rodar: `cd web`, `npm install`, `npx playwright install chromium` e `npm run dev`;
  - os scripts e a estrutura;
  - os links para `backlog/BOARD.md` e `guias/`;
  - a linha "Demo: o link entra no T-002".
- [ ] **Passo 2:** atualizar a tabela da §15 da spec (T-005, T-007 e T-009, e a coluna de conferência de T-004, T-008, T-010 e T-012) em `D:\Projetct\docs\agentes\`. Depois, copiar a spec e a versão final deste plano para `docs/` e para `D:\Projetct\docs\agentes\2026-10-07-plano-navalha-onda-1.md`. Fazer o commit `docs: adiciona o README, a spec e o plano da onda 1`.
- [ ] **Passo 3:** rodar `git clone D:\Projetct\navalha <scratchpad>\clone` e, dentro de `clone\web`, `npm ci`, `npm run check` e `npm run build`. Esperado: tudo passa, o que prova que não há problema de CRLF.
- [ ] **Passo 4:** no `clone\web`, rodar `npm run e2e -- T-001`. Esperado: **3 falhas**, com mensagens claras sobre `lang`, título e favicon.
- [ ] **Passo 5:** rodar o checador de links no scratchpad sobre `backlog/`, `guias/`, `desafios/`, `design/` e o README. Ele confere o arquivo de cada link e a âncora no formato do GitHub (minúsculas, sem pontuação, espaço vira hífen, acentos mantidos). Esperado: 0 links quebrados.
- [ ] **Passo 6:** rodar `grep -E "linux-x64-gnu" web/package-lock.json` para os pacotes nativos (rolldown, oxlint e lightningcss). Esperado: aparecem, e o `npm ci` do CI no Linux funciona.
- [ ] **Passo 7:** conferir que `git status` está limpo, que `git branch` mostra só `chore/onda-1` e que `git log --oneline` lista os commits atômicos.
- [ ] **Passo 8:** um subagente revisor sem contexto revisa a branch inteira contra a spec e este plano. Corrigir o que for 🔴 e anotar o resto.

---

## Riscos

| Risco | Efeito | Mitigação |
|---|---|---|
| CRLF do Git no Windows | o `prettier --check` reprova | `.gitattributes`, `.vscode` e o teste no clone limpo |
| Mudanças no Vitest 5 ou no jest-dom 7 | a configuração não sobe | o revisor conferiu as entradas, e o Passo 12 da Tarefa 2 prova |
| Um teste que depende de um ticket futuro | o Higor vê vermelho sem culpa | a matriz caso × estado da Tarefa 5 |
| Falso verde (foco padrão, menu "escondido" sem `display: none`, rolagem suave) | o ticket "passa" sem o conceito | foco exato, `toBeHidden`, `reducedMotion` e a regra do vermelho antes de cada ticket |
| Telas feias ou guias errados | o portfólio perde valor, e o Higor aprende errado | revisão visual dos PNGs e revisão dos guias contra a documentação |
| Onda grande (cerca de 70 arquivos) | a sessão fica longa | guias em paralelo e um commit por tarefa |

## Verificação de ponta a ponta

1. O `npm run check` e o `npm run build` passam num clone limpo.
2. A matriz caso × estado não tem nenhuma violação.
3. O `npm run e2e -- T-001` falha no repositório, e o T-001 a T-014 passam na tag `t-014`.
4. Nenhum link quebrado, e os 14 PNGs do M1 e os 2 do desafio foram revisados.
5. A branch `chore/onda-1` tem commits atômicos, não existe `main`, e nada foi enviado com push.

## Execução recomendada

**Nativa.** Eu executo nesta sessão. Os guias vão para 3 subagentes em paralelo, e no fim um revisor sem contexto avalia a branch inteira.

O motivo é que textos, tokens, dados, testes, tickets e PNGs formam um contrato apertado, e um único executor mantém tudo coerente. Só os guias são independentes. Aprovar este plano aprova também esse modo de execução.
