# DevTools do navegador
> Para: T-001, T-004, T-012, T-014 · Leitura: ~6 min

Chrome e Edge usam o mesmo DevTools, o do Chromium. Abra com F12 ou Ctrl+Shift+I.

## Elements e estilos computados

Ctrl+Shift+C liga o modo de inspeção: clique num elemento da página, e ele fica selecionado na árvore do HTML. O `<head>` fica no topo da árvore, com o `<title>` e o `<link rel="icon">`, e o `lang` está na tag `<html>`.

- **Styles:** todas as regras que valem para o elemento, da que vence para a que perde, com a origem de cada uma. Declaração vencida aparece riscada. Declaração inválida aparece riscada e com um ícone de aviso. Declaração inativa (válida, mas sem efeito ali) aparece apagada, com um ícone de informação que explica o motivo. O que vem dos pais aparece em **Inherited from**.
- **Computed:** o valor final de cada propriedade, depois da cascata. Expanda uma propriedade para ver qual regra venceu. No fim da aba, **Rendered Fonts** mostra a fonte que o navegador usou de verdade.
- **Box model:** o botão **Show sidebar**, na barra do Styles, mostra o diagrama com margin, border, padding e conteúdo. Passe o mouse numa camada para ver a área na página, e dê dois cliques num número para editar.
- **Editar ao vivo:** clique num valor e digite. As setas para cima e para baixo mudam o número de 1 em 1; com Shift, de 10 em 10; com Alt, de 0,1 em 0,1. A caixa ao lado de cada declaração liga e desliga. Para acrescentar uma declaração, clique dentro das chaves da regra.
- **Estados:** o botão **:hov** força `:hover`, `:focus`, `:focus-visible`, `:active` e outros. Assim você estiliza o foco sem apertar Tab a cada ajuste.

```css
/* No Styles, a regra que vence aparece em cima */
.notice.urgent {
  padding: var(--space-5);
}

/* Esta aparece embaixo: o padding riscado, a color valendo */
.notice {
  padding: var(--space-4);
  color: var(--color-text-muted);
}
```

**Armadilhas**

- Tudo que você muda no DevTools some ao recarregar. Passe para o código o que funcionou.
- Com CSS Modules, a classe aparece com um nome gerado, como `_notice_1a2b3_1`, e não com o nome que você escreveu. É normal.
- O navegador guarda o ícone da aba em cache. Se ele não mudar, confira o `<link rel="icon">` no Elements ou abra a página numa janela anônima.

## Modo responsivo

O site é mobile-first: confira primeiro no tamanho de celular.

1. Ctrl+Shift+M (ou o botão **Toggle device toolbar**) liga o modo responsivo.
2. Em **Dimensions**, deixe **Responsive** e digite a largura e a altura. Os testes de aceite usam 375 × 812 no celular e 1280 × 800 no desktop.
3. No menu **More options** (os três pontos da barra), **Show media queries** mostra uma faixa por breakpoint: laranja para `min-width` e azul para `max-width`. Clique numa faixa para ir àquela largura. **Show rulers** mostra réguas em pixels.

Em 375px, a página não pode rolar para o lado. No Console, `document.documentElement.scrollWidth > document.documentElement.clientWidth` devolve `true` quando algo vaza. Para achar o culpado, crie por um instante esta regra, no seu CSS ou com o botão **New Style Rule** do Styles:

```css
/* Temporário: o outline não ocupa espaço, então não muda o layout. Apague depois. */
* {
  outline: 1px solid red;
}
```

**Armadilhas**

- O modo responsivo é uma aproximação: o código não roda num celular de verdade.
- A `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` do `index.html` faz o celular usar a largura real da tela. Não apague.

## Console

Ctrl+Shift+J abre o Console. Em outro painel, Esc abre o Console na parte de baixo.

- Erro aparece em vermelho, e aviso em amarelo. O link à direita (`arquivo:linha`) leva ao código. Ctrl+L limpa a lista.
- No `npm run dev`, o React avisa no Console o que está errado, como `Each child in a list should have a unique "key" prop.`. Trate aviso como bug.
- Dá para digitar JavaScript e ver o resultado na hora:
  - `$0` é o elemento selecionado no Elements, e `getComputedStyle($0).fontFamily` mostra a fonte calculada dele;
  - `document.activeElement` mostra quem está com o foco.
- **Live Expression** (botão **Create Live Expression**, no topo do Console): digite `document.activeElement` e vá apertando Tab na página. O valor se atualiza sozinho, a cada 250 ms, e mostra o caminho do foco.

**Armadilhas**

- Um `console.log` dentro de um componente aparece duas vezes no `npm run dev`. É o `StrictMode` do `main.tsx`, que roda cada render duas vezes para achar bugs. No build de produção, isso não acontece.
- Erro de sintaxe aparece no terminal do `npm run dev` e numa camada sobre a página. Erro de tipo, não: só o `npm run check` acusa.
- Marque **Preserve log** para as mensagens não sumirem ao recarregar a página.

## Lighthouse

O Lighthouse audita a página e dá uma nota de 0 a 100 por categoria.

1. Abra a página numa janela anônima: extensões do navegador atrapalham a medição.
2. No DevTools, abra a aba **Lighthouse**. Deixe o modo **Navigation**, escolha o dispositivo **Mobile** e marque as categorias **Performance** e **Accessibility**.
3. Clique em **Analyze page load** (e, se pedir, em **Run audit**). O relatório sai em 30 a 60 segundos.

Como ler o relatório:

- **Cores da nota:** de 90 a 100 é verde (bom), de 50 a 89 é laranja (precisa melhorar) e de 0 a 49 é vermelho (ruim).
- **Accessibility:** média ponderada de auditorias que passam ou falham, sem nota parcial. As regras vêm do axe. Abra cada auditoria que falhou para ver os elementos culpados. A lista **Additional items to manually check** não entra na nota: é o que só uma pessoa consegue conferir.
- **Performance:** sai de métricas como o LCP (quando o maior conteúdo aparece) e o CLS (quanto a página pula enquanto carrega). A nota varia de uma rodada para outra: rode duas ou três vezes.

Para a Performance valer, meça o build de produção, e não o `npm run dev`:

```powershell
npm run build     # gera a pasta dist/
npm run preview   # serve o dist/ em http://localhost:4173
```

**Armadilhas**

- Nota 100 em Accessibility não quer dizer site acessível. A ferramenta só pega o que dá para conferir de forma automática.
- Quando o ticket pedir a nota no PR, cole as notas das categorias na descrição do PR.

## React DevTools

Instale a extensão **React Developer Tools** (na Chrome Web Store ou nos complementos do Edge). Em páginas feitas com React, o DevTools ganha as abas **Components** e **Profiler**.

- **Components** mostra a árvore de componentes, e não a de HTML. Selecione um componente para ver, à direita, as **props** e os **hooks**. Cada `useState` aparece como `State`, na ordem em que é chamado.
- Dá para editar uma prop ou um state ali mesmo e ver a tela mudar. Serve para testar um caso, como uma lista vazia, sem mexer no código.
- O botão de seleção, no canto da aba, deixa você clicar na página para achar o componente que desenhou aquele trecho.
- Nas configurações (a engrenagem), **Highlight updates when components render** contorna cada componente que renderiza de novo. Ajuda a ver o efeito de um `set`.

**Armadilhas**

- Componente sem nome, como `export default () => …`, aparece como `Anonymous`. Dê nome às funções.
- No build de produção, os nomes dos componentes podem vir encurtados. Inspecione no `npm run dev`.

**Ponte com C#:** lembra a Live Visual Tree e o Live Property Explorer do Visual Studio no WPF. Onde quebra: a árvore é de componentes (funções), e não de elementos. O HTML e o CSS de verdade ficam no Elements.

## Para ir além

- [Chrome DevTools · View and change CSS](https://developer.chrome.com/docs/devtools/css)
- [Chrome for Developers · Introduction to Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)
- [react.dev · React Developer Tools](https://react.dev/learn/react-developer-tools)
