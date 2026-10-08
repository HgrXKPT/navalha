# T-001 · Repositório no GitHub e primeiro PR

| Tipo | Tamanho | Marco | Depende de |
|---|---|---|---|
| feature | M (até 1h) | 0 · Primeiro dia | — |

**Conceito novo:** fluxo de branch, PR e CI; o `<head>` do HTML.

## Contexto

Primeiro dia no time. Antes de qualquer tela, você publica o repositório no GitHub e leva um PR pequeno pelo fluxo inteiro: branch, check, review, PR com CI e merge. A mudança é no `<head>` da página: hoje a aba mostra "web" e o ícone do Vite.

## Passo a passo

1. No VS Code, abra a pasta **`D:\Projetct\navalha`**, que é a raiz do projeto, e não a pasta `web`. Instale as extensões que o VS Code recomendar (Prettier e Oxc).
2. Crie a `main` a partir da branch da onda e publique no GitHub:

   ```powershell
   cd D:\Projetct\navalha
   git switch -c main
   gh repo create navalha --public --source . --remote origin
   git push -u origin main
   ```

   A branch `chore/onda-1` não é mais necessária e pode ser apagada: `git branch -d chore/onda-1`.
3. Prepare o front e abra a página:

   ```powershell
   cd web
   npm install
   npx playwright install chromium
   npm run dev
   ```

   Abra http://localhost:5173. Por enquanto, a página tem uma linha de texto só.
4. Crie a branch do ticket com `git switch -c feature/T-001-github-e-primeiro-pr` (ou com o `/proximo`, que cria a mesma).
5. Faça a mudança descrita nos critérios.
6. Confira o trabalho: `npm run format`, depois `npm run check` e `npm run e2e -- T-001`.
7. Peça o review com `/revisar`.
8. Faça o commit, mande a branch para o GitHub e abra o PR:

   ```powershell
   git add -A
   git commit -m "feat(site): ajusta título, idioma e ícone da página"
   git push -u origin HEAD
   gh pr create --fill
   ```

9. Na página do PR, espere o CI ficar verde e faça o merge com `gh pr merge --squash --delete-branch`. Depois, volte para a `main` com `git switch main` e `git pull`.

## Critérios de aceite

- [ ] **Dado** que abro a página, **então** o `<html>` declara o idioma `pt-BR`.
- [ ] **Dado** que abro a página, **então** a aba mostra o título `Barbearia Navalha · Agende seu horário`. Copie daqui, porque o "·" é o ponto médio, e não um ponto comum.
- [ ] **Dado** que abro a página, **então** o ícone da aba é o da Navalha. Para isso, copie `design/favicon.svg` por cima de `web/public/favicon.svg`.
- [ ] O repositório `navalha` está no GitHub, e o PR deste ticket mostra o CI verde antes do merge.

## Layout

Não há tela nova. Confira no DevTools, na aba Elements, o `<html lang>` e o `<title>`.

## Fora do escopo

- Mexer no `App.tsx` ou criar qualquer estilo.
- Configurar a Vercel, que é o T-002.

## Guia rápido

- [Fluxo de trabalho › Primeira vez na máquina](../guias/fluxo-de-trabalho.md#primeira-vez-na-máquina)
- [Fluxo de trabalho › Abrindo o PR e fazendo o merge](../guias/fluxo-de-trabalho.md#abrindo-o-pr-e-fazendo-o-merge)
- [HTML semântico › O head do documento](../guias/html-semantico.md#o-head-do-documento)
- [DevTools › Elements e estilos computados](../guias/devtools.md#elements-e-estilos-computados)
- Oficial: [MDN · o elemento title](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/title)

## Como conferir

`npm run check` · `npm run e2e -- T-001` · `/revisar`
