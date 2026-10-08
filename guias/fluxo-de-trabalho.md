# Fluxo de trabalho
> Para: todos os tickets · Leitura: ~8 min

## A sessão de 1h

Cada ticket cabe numa sessão de cerca de 1h, sempre nesta ordem:

1. **`/proximo`** no chat da IA: mostra o próximo ticket do `backlog/BOARD.md` e cria a branch.
2. **Leia o ticket** (uns 5 min): critérios de aceite, layout, fora do escopo e guia rápido.
3. **Code com a IA à vontade** (40 a 50 min). Peça explicação do que ela escrever: o review vale para o PR inteiro, inclusive para o código dela.
4. **Confira**, no terminal, dentro de `web/`: `npm run format`, `npm run check` e `npm run e2e -- T-0xx`.
5. **Peça o review:** `/revisar` no chat da IA.
6. **Faça o commit, o PR e o merge.**

**O desafio de fim de marco é a exceção:** tem tempo marcado e é feito sem IA. No marco 1, ele é o T-015, e as regras ficam no README do desafio.

**Armadilhas**

- Ticket que não cabe em 1h: peça para a IA dividir em dois, em vez de esticar a sessão.
- Achou algo fora do escopo? Anote no `BOARD.md`, em "Candidatos a ticket", e volte ao ticket atual.

## Primeira vez na máquina

1. Abra no VS Code a pasta **`navalha`**, a raiz do repositório, e não a `web`. Só assim vale o `.vscode/settings.json`, que salva os arquivos com final de linha LF e formata com o Prettier ao salvar.
2. Instale as extensões recomendadas: Prettier (`esbenp.prettier-vscode`) e Oxc (`oxc.oxc-vscode`). O VS Code oferece num aviso quando a pasta abre. Se o aviso sumir, digite `@recommended` na busca de extensões.
3. Instale as dependências e o navegador dos testes:

```powershell
node -v                          # v24, a mesma versão do CI
gh auth status                   # confirma o login no GitHub
cd web
npm install                      # baixa os pacotes para web/node_modules
npx playwright install chromium  # baixa o Chromium dos testes de aceite
npm run dev                      # serve o site em http://localhost:5173
```

**Armadilhas**

- Abriu a `web` como pasta? O VS Code ignora o `.vscode/settings.json` da raiz, e um arquivo salvo com CRLF reprova no `prettier --check`. Confira no canto inferior direito do VS Code: tem que aparecer `LF`.
- `npm error enoent Could not read package.json` quer dizer que o terminal está fora da `web/`. Rode `cd web`.

**Ponte com C#:** o `npm install` faz o papel do `dotnet restore`, e o `npm run dev`, o do `dotnet watch run`. Onde quebra: os pacotes vão para `web/node_modules`, dentro do projeto, e não para um cache global como o do NuGet. O resto da tabela está na [Ponte .NET → Front](ponte-dotnet.md#ferramentas).

## Branch por ticket

Cada ticket tem a sua branch, criada a partir da `main` atualizada: `feature/T-0xx-slug`, ou `fix/T-0xx-slug` quando o ticket é de bug. O slug vem do nome do arquivo do ticket: `T-003-esqueleto-semantico.md` vira `feature/T-003-esqueleto-semantico`.

O `/proximo` cria a branch para você. Na mão, fica assim:

```powershell
git switch main
git pull
git switch -c feature/T-003-esqueleto-semantico
git branch --show-current   # mostra em qual branch você está
```

**Armadilhas**

- Começou a codar com a `main` ativa e ainda não fez commit? Rode o `git switch -c feature/...`: as mudanças vão junto para a branch nova.
- O T-001 é a exceção: antes da branch, ele cria a `main` e o repositório no GitHub. Siga o passo a passo do ticket.

## Checks antes do review

Antes do `/revisar`, rode na `web/`:

```powershell
npm run format         # o Prettier formata os arquivos (altera o disco)
npm run check          # tipos, lint, formatação e testes unitários
npm run e2e -- T-0xx   # o teste de aceite do ticket
```

O `check` roda quatro passos, nesta ordem, e para no primeiro que falhar:

| Passo | Ferramenta | O que confere |
|---|---|---|
| `typecheck` | `tsc -b` | os tipos de `src/`, dos testes de aceite (`e2e/`) e da configuração |
| `lint` | oxlint | padrões de bug e regras do React, como hook dentro de `if`. Aviso aparece, mas só erro reprova |
| `format:check` | `prettier --check .` | se cada arquivo está como o Prettier deixaria, inclusive com LF |
| `test` | Vitest | os testes unitários de `src/` (`*.test.ts` e `*.test.tsx`). Ainda não há nenhum, e o passo passa assim mesmo |

O `e2e` roda o teste de aceite escrito pelo QA (a IA): Playwright no Chromium, com o axe conferindo a acessibilidade. Ele sobe o próprio Vite na porta 5199, então o `npm run dev` pode continuar aberto na 5173.

**Armadilhas**

- O `npm run dev` não confere tipos. A página funciona com erro de tipo, e só o `check` acusa.
- O CI do PR roda o `check` e o `build`, mas não o e2e. O e2e fica com você e com o `/revisar`.

## Pedindo o review

Com os checks verdes, rode `/revisar` no chat da IA, com a branch do ticket ativa. Ele revisa a branch como um PR: acha o ticket pelo nome da branch, roda o `check`, roda o e2e do ticket e o dos tickets já concluídos do marco (para pegar regressão) e lê as mudanças. Nos tickets de tela, ele também gera screenshots com o `npm run shots` e compara com os PNGs de `design/`.

A resposta traz o veredito (aprovado ou ajustes), cada critério de aceite com a evidência, até 5 comentários e o que ficou bom. Cada comentário tem `arquivo:linha` e um peso: bloqueia, sugestão ou detalhe. Se aprovar, a IA marca o ticket como concluído no `BOARD.md`, com uma nota de uma linha, e essa mudança entra no commit do ticket. Se pedir ajustes, corrija e rode o `/revisar` de novo. E não leve para o PR código que você não sabe explicar: peça para a IA explicar antes do commit.

## Abrindo o PR e fazendo o merge

Depois do `/revisar` aprovado:

```powershell
git status                            # confira o que entra, inclusive o BOARD.md
git add -A                            # tudo do repositório, não só a web/
git commit -m "feat(site): cria o cabeçalho"
git push -u origin HEAD               # publica a branch no GitHub
gh pr create --fill                   # título e descrição vêm do commit
gh pr checks --watch                  # espera o CI e o deploy de preview
gh pr merge --squash --delete-branch  # um commit só na main; apaga a branch e volta para a main atualizada
```

A mensagem de commit segue o Conventional Commits, em português: `tipo(escopo): descrição`, em minúsculas e no presente. Os tipos são `feat` (funcionalidade), `fix` (correção), `refactor`, `test`, `docs` e `chore` (configuração e manutenção). O corpo é opcional, em tópicos curtos.

**Armadilhas**

- `git add .` dentro da `web/` só pega a `web/`, e a marcação do `BOARD.md` fica de fora.
- Com mais de um commit na branch, o `--fill` usa o nome da branch como título, e, no `--squash`, é o título do PR que vira o commit da `main`. Passe o título com `--title "feat(site): …"`.
- Sem regra de proteção na `main`, o GitHub aceita merge com o CI vermelho. Espere o `gh pr checks` terminar verde.

## Deploy na Vercel

A Vercel é configurada uma vez, no T-002, e depois publica sozinha. O merge na `main` vai para produção. O push em outra branch gera um deploy de preview, com URL própria, e, se a branch tem PR, o link aparece num comentário do PR. Na importação do repositório do GitHub (novo projeto no painel da Vercel), os campos que importam são:

| Campo | Valor |
|---|---|
| Root Directory | `web` |
| Framework Preset | Vite (a Vercel costuma detectar sozinha) |
| Build Command | `npm run build` (se vier outro valor, ligue o Override) |
| Output Directory | `dist` |

**Armadilhas**

- Sem o Root Directory `web`, a Vercel procura o projeto na raiz do repositório, onde não existe `package.json`.
- Com o Root Directory `web`, trate a `web/` como a raiz do site: tudo que ele usa precisa estar dentro dela, e não em `design/` ou em outra pasta do repositório.
- O `build` começa com `tsc -b`, então erro de tipo derruba o deploy. Nesse caso, a produção continua na última versão que deu certo, e o log do erro fica no painel da Vercel.

**Ponte com C#:** lembra uma pipeline de release ligada à `main`. Onde quebra: não existe servidor rodando o seu código. O build gera HTML, CSS e JS estáticos em `dist/`, e quem executa tudo é o navegador.

## Quando o check falha

**Comece pelo primeiro erro.** O `check` para no primeiro passo que falha. As linhas que começam com `>` mostram cada passo que rodou, como `> navalha-web@0.0.0 typecheck`, e o último antes do erro é o culpado. Leia a primeira mensagem: as seguintes costumam ser consequência dela. Se o problema for formatação (`[warn] Code style issues found…`), rode `npm run format` e o `check` de novo.

**Tipo (tsc):** a linha `src/App.tsx:12:7 - error TS2322: Type 'string' is not assignable to type 'number'.` traz arquivo, linha, coluna, código e mensagem. Ctrl+clique no caminho abre o arquivo na linha. Os códigos que mais aparecem: TS2322 (o valor não combina com o tipo), TS2339 e TS2551 (a propriedade não existe no tipo), TS2741 (falta uma prop obrigatória), TS6133 (declarado e nunca usado) e TS1484 (tipo importado sem `import type`).

**Lint (oxlint):** cada problema traz o nome da regra, como `react-hooks(rules-of-hooks)`, a mensagem, o trecho do código com `arquivo:linha:coluna` e uma linha `help:` com a sugestão. Se a mensagem não bastar, pesquise o nome da regra.

**e2e (Playwright):** a lista mostra cada caso pelo nome, e os que falharam aparecem de novo no fim, em `N failed`. Cada falha traz o esperado (`Expected`), o recebido (`Received`) e a linha do teste. Falha de axe vem como uma lista de regras: veja [Acessibilidade › axe e Lighthouse](acessibilidade.md#axe-e-lighthouse). Para ver o navegador:

```powershell
npm run e2e -- T-0xx --headed                  # abre o navegador durante o teste
npm run e2e -- T-0xx --debug                   # Playwright Inspector, passo a passo
npm run e2e -- T-0xx -g "trecho do nome"       # roda só os casos com esse nome
npx playwright show-trace test-results\nome-do-caso\trace.zip   # o comando exato aparece na falha
```

**CI vermelho no PR e verde na sua máquina:** o `gh pr checks` mostra qual check falhou, e o `gh run view --log-failed` mostra o log do passo. As causas mais comuns são um arquivo novo fora do commit e um `package.json` alterado sem o `package-lock.json` junto: o `npm ci` do CI exige os dois em sincronia.

**Teste de aceite errado?** Se você tem certeza de que o teste pede algo diferente do ticket, peça para a IA conferir. O teste é dela, e a correção vai num commit `test(aceite): …` separado.

## Para ir além

- [GitHub CLI · gh pr create](https://cli.github.com/manual/gh_pr_create)
- [Playwright · Running and debugging tests](https://playwright.dev/docs/running-tests)
- [Vercel · Deploying GitHub Projects with Vercel](https://vercel.com/docs/git/vercel-for-github)
