# Regras da IA no Navalha

Este repositório é, ao mesmo tempo, um **produto de portfólio** e o **projeto de estudo** do Higor:
- o produto é o Navalha, agendamento online de uma barbearia;
- o estudo é aprender front resolvendo tickets, como num emprego.

A spec do projeto está em [docs/2026-10-07-spec-navalha.md](docs/2026-10-07-spec-navalha.md).

Estas regras valem para o Claude Code, que as carrega pelo `CLAUDE.md`, e para o Antigravity. São regras de projeto: pela §0 do contrato base, quando conflitam com as regras globais, elas prevalecem.

## Quem é o Higor

- Dev backend .NET/C# experiente. No front, o CSS começa do zero e o React está no básico.
- Responda em português do Brasil. Use C#/.NET como ponte quando ajudar e diga onde a analogia quebra.
- Comece pela intuição em 2 ou 3 frases e só depois entre no detalhe. Seja direto.

## Mapa do repositório

| Caminho | O que é | Quem escreve |
|---|---|---|
| `web/src/` | o código do front | o Higor, com a IA ajudando quando ele pede. Os arquivos-base da onda 1 (tokens, reset e dados) vieram prontos |
| `web/e2e/aceite/` | os testes de aceite, um por ticket | a IA, no papel de QA |
| `web/e2e/support/`, `web/tools/` e as configurações do `web/` | ferramentas | a IA |
| `api/` | a API .NET, que chega no marco 3 | a IA faz o esqueleto e o fluxo de referência; as features são do Higor |
| `design/` | tokens e telas de referência | a IA |
| `backlog/` | o `BOARD.md` e os tickets | a IA |
| `guias/` | os guias rápidos | a IA |
| `desafios/` | um desafio por marco | a IA cria o projeto inicial, e o Higor resolve |
| `docs/` | a spec (os planos de onda ficam fora do repositório) | a IA |

## Como a IA ajuda

- **Liberada para tudo:** explicar, dar exemplo, escrever uma parte do código e corrigir. Não existe escada de dicas.
- Quando escrever código de um ticket, diga em poucas linhas o que ele faz e por quê.
- O review vale para o PR inteiro, inclusive para o código que a IA escreveu.
- **A exceção combinada é o desafio.** Num ticket do tipo `desafio`, como o T-015, se o Higor pedir ajuda:
  1. lembre o combinado: o desafio é sem IA, porque é o termômetro do que ficou na cabeça dele;
  2. só ajude se ele confirmar que quer mesmo assim.
- Se a dúvida for sobre um tema futuro, responda curto e diga em que marco o tema aparece.

## Stack e limites

- **Stack:**
  - React 19 com componentes funcionais e hooks, TypeScript strict e Vite 8;
  - CSS Modules (o Tailwind só entra no marco 4);
  - oxlint, Prettier, Vitest + Testing Library e Playwright 1.64 com axe.
- **Nunca sugira** `create-react-app`, class components, `ReactDOM.render` nem `any` para calar erro. Quando o Error Boundary chegar, ele é feito com a lib `react-error-boundary`.
- `useEffect` serve para sincronizar com um sistema externo. Ele não serve para derivar estado nem para reagir a evento.
- **CSS:**
  - cores, espaços, fontes, tamanhos de texto e raios vêm dos tokens de `web/src/styles/tokens.css`;
  - valores estruturais que o próprio ticket define (como `20rem`, `85%`, `z-index: 10` ou uma conta com tokens) e a borda fina de 1px são permitidos;
  - breakpoints de 640px e 1024px;
  - mobile-first.
- **Testes:** até o marco 2, os testes do projeto são só os de aceite do QA. Os testes unitários do Higor começam no marco 3. Antes disso, não escreva teste unitário num ticket, mesmo que uma regra global peça.

## Convenções do código

- Os componentes do site público ficam em `web/src/site/`, um por arquivo `PascalCase.tsx`, cada um com o seu `PascalCase.module.css`.
- Os dados ficam em `web/src/data/`, os utilitários em `web/src/lib/` e os estilos globais em `web/src/styles/`.
- Identificadores em inglês e textos da interface em português.

## Edição e Git

- O `backlog/BOARD.md` é atualizado pela IA sem mostrar o diff antes. É uma regra deste projeto.
- As entregas de cada onda (tickets, telas, guias, testes de aceite e a API da empresa) vão numa branch `chore/onda-N`, com um plano curto aprovado antes. Veja "Preparação de onda".
- Se um teste de aceite estiver errado, a IA corrige o teste na própria branch do ticket, num commit separado `test(aceite): …`.
- Nunca faça `git push`, e nunca faça commit na `main`.
- Os commits seguem o padrão Conventional Commits, com o corpo em tópicos curtos, sem rodapé e sem co-author.
- Os commits do código dos tickets são do Higor. A IA só commita as entregas da onda e as correções de teste de aceite.

## Protocolo do /proximo

1. Se a branch atual é de ticket (`feature/T-…` ou `fix/T-…`), ou se o `BOARD.md` tem um ticket 🟦: retome esse ticket, mostrando o resumo dele (passo 9), e pare. Não crie outra branch.
2. Se a árvore tem mudanças não commitadas, avise o Higor e pare.
3. Se a branch `main` não existe, mostre o T-001, que é o ticket que cria a `main`, e pare.
4. Se o repositório tem remoto, rode `git switch main` e `git pull --ff-only`. Se `git branch --no-merged main` listar alguma branch de ticket, peça para o Higor terminar o PR dela antes, e pare.
5. Leia o `BOARD.md` da `main`. Se não sobrou nenhum ticket ⬜, avise e proponha a próxima onda (veja "Preparação de onda").
6. Pegue o primeiro ticket ⬜ cujo "Depende de" já está ✅.
7. Crie a branch `feature/T-0xx-slug`, ou `fix/T-0xx-slug` se o ticket for de bug. O slug é o mesmo do nome do arquivo do ticket, por exemplo `feature/T-003-esqueleto-semantico`.
8. Marque o ticket como 🟦 no `BOARD.md`. A marcação entra no commit do ticket.
9. Mostre o título, o conceito novo, um resumo dos critérios de aceite, o layout e os links do guia rápido. Não resolva o ticket.

## Protocolo do /revisar

1. Descubra o ticket pelo nome da branch (`T-0xx`) e leia o arquivo dele em `backlog/`.
2. Rode os checks dentro de `web/`:
   - `npm run check`;
   - `npm run e2e -- T-0xx`, mas **só se** existir `web/e2e/aceite/T-0xx-*.spec.ts` (o T-002 e os desafios não têm teste de aceite);
   - para regressão, `npm run e2e -- T-a T-b …` com os tickets ✅ do mesmo marco que têm arquivo de aceite;
   - se o ticket mexe em `api/`: `dotnet build` (sem warning novo), `dotnet test` e `dotnet format --verify-no-changes`.

   Se um caso do e2e falhar, rode só ele de novo uma vez (com `-g "nome do caso"`) antes de pedir ajustes. Falha que some na segunda vez é instabilidade do servidor de testes, não do código.
3. Leia o que mudou:
   - `git status --short`, para ver os arquivos novos e os alterados;
   - `git diff main...HEAD` e `git diff`, para o que já foi commitado e o que ainda não foi;
   - o conteúdo inteiro de cada arquivo novo (não rastreado), porque o `git diff` não mostra arquivo que o git ainda não conhece.
4. **Se o ticket é de tela** (tem a seção Layout com PNG): rode `npm run shots`, abra os PNGs de `web/.shots/` e compare com os de `design/`. Olhe a estrutura, o espaçamento pela escala de tokens e a responsividade. Não compare pixel por pixel.
5. **Se o ticket é o desafio**: no PowerShell, rode `$env:SHOTS_URL="file:///D:/Projetct/navalha/desafios/m1/index.html"; npm run shots` e depois `Remove-Item Env:SHOTS_URL`. Avalie pelos critérios do README do desafio.
6. Responda neste formato:
   - **Veredito:** ✅ aprovado ou 🔁 ajustes.
   - **Critérios:** cada critério de aceite com ✅ ou ❌ e a evidência, que pode ser um `arquivo:linha`, a saída de um teste ou um screenshot.
   - **Comentários:** até 5, do mais importante ao menos importante. Cada um traz o `arquivo:linha`, o peso (🔴 bloqueia, 🟡 sugestão, ⚪ detalhe), o porquê e, quando ajudar, uma sugestão de código.
   - **O que está bom:** um fato concreto do código, sem elogio vazio.
7. Qualquer 🔴 ou check vermelho dá 🔁 ajustes.
8. **Se aprovar:**
   - no `BOARD.md`, marque ✅ e escreva na coluna "Nota do review" uma linha com o que vale lembrar na próxima onda, por exemplo "🟡 guardou em useState um valor derivado";
   - passe para "Candidatos a ticket" todo 🟡 que ficou sem resolver;
   - lembre o Higor do commit, do PR e do merge.

## Preparação de onda

Quando todos os tickets do marco estiverem ✅:

1. Proponha no chat a lista de tickets da próxima onda, com o título e o conceito novo de cada um.
   - A lista segue os marcos da spec e se ajusta pelas notas do `BOARD.md` e pelos candidatos a ticket.
   - A proposta segue, em versão curta, o formato de plano do contrato base: objetivo, fora do escopo, arquivos, passos, riscos e decisões.
2. Com o ok do Higor:
   - confira as versões das bibliotecas;
   - produza os arquivos numa branch `chore/onda-N`: tickets, telas de referência, guias novos, testes de aceite e, a partir do marco 3, a parte da API que é da empresa;
   - faça o commit.

   O plano da onda fica fora do repositório, em `D:\Projetct\docs\agentes\`, porque descreve a solução de referência. Em `docs/` só entra a spec.
3. Cada teste de aceite novo precisa ficar vermelho antes do seu ticket e verde dali em diante. Prove isso com uma solução de referência feita fora do repositório.
