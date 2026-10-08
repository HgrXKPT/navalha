# Box model
> Para: T-005, T-012 · Leitura: ~8 min

## As quatro caixas

Todo elemento da página é uma caixa retangular feita de quatro camadas. De dentro para fora: o conteúdo, o respiro interno, a borda e o espaço externo. Quase todo problema de espaçamento se resolve descobrindo em qual camada mexer.

| Camada | O que é | Propriedade |
|---|---|---|
| content | o texto, a imagem ou os filhos | `width` e `height` |
| padding | o respiro entre o conteúdo e a borda | `padding` |
| border | a linha em volta do padding | `border` |
| margin | o espaço por fora da borda, que afasta as vizinhas | `margin` |

O `background` pinta o content e o padding (e, por padrão, também a área embaixo da borda). A margin é sempre transparente. O `outline`, usado no contorno de foco, fica fora da conta: ele é desenhado por fora da borda e não ocupa espaço.

Para ver as quatro caixas de um elemento, abra o DevTools (F12), selecione o elemento na aba **Elements** e olhe o desenho na aba **Computed**.

```css
/* Cartão de perfil de usuário */
.profileCard {
  padding: var(--space-5);               /* respiro interno, com fundo */
  border: 1px solid var(--color-border); /* em volta do padding */
  margin-block-end: var(--space-6);      /* afasta o próximo cartão */
  background: var(--color-surface);      /* não pinta a margin */
}
```

**Armadilhas**

- Espaço que precisa de fundo é padding. Espaço transparente é margin.
- A área de clique de um link ou de um botão vai até a borda: inclui o padding, mas não a margin. Para aumentar a área de toque, aumente o padding.

## Box sizing

O `box-sizing` decide o que o `width` e o `height` medem. No padrão do CSS, o `content-box`, eles medem só o content, e o padding e a borda somam por fora. Com `border-box`, eles medem a caixa até a borda, e o content encolhe para caber.

| `width: 300px`, `padding: 20px` e `border: 1px` | Largura na tela |
|---|---|
| `content-box` (padrão do CSS) | 342px (300 + 40 + 2) |
| `border-box` | 300px, com 258px de content |

O `reset.css` do projeto aplica `border-box` a todos os elementos, inclusive ao `::before` e ao `::after`. Então, no Navalha, o `width` que você escreve é a largura que aparece na tela. A margin fica de fora nos dois modos.

```css
/* Campo de busca de uma galeria de fotos, na largura toda do pai */
.searchField {
  width: 100%;
  padding-inline: var(--space-4);
  border: 1px solid var(--color-border);
}
/* content-box: 100% + 2rem de padding + 2px de borda, e estoura o pai
   border-box: 100% no total, com o padding e a borda por dentro */
```

**Armadilhas**

- O `box-sizing` não é herdado. Por isso o reset usa `*, *::before, *::after`, que casa com todos os elementos, em vez de declarar só no `html`.
- Evite `height` fixa em caixa com texto. Se o texto crescer (fonte maior, zoom, frase mais longa), ele vaza da caixa. Deixe a altura vir do conteúdo mais o padding, ou use `min-height`.

## Margin padding e gap

O padding afasta o conteúdo da borda, por dentro. A margin afasta a caixa das vizinhas, por fora. O `gap` afasta os filhos uns dos outros e é escrito no pai, que precisa ser flex ou grid.

**Atalhos.** Um valor vale para os quatro lados. Com dois, o primeiro é cima e baixo, e o segundo, os lados. Com três: cima, lados e baixo. Com quatro, a ordem é `top right bottom left`, no sentido do relógio.

**Propriedades lógicas.** Elas trocam cima, baixo, esquerda e direita por dois eixos: `block`, o sentido em que os blocos se empilham (vertical, em português), e `inline`, o sentido do texto (horizontal).

- `padding-block`: em cima e embaixo. `padding-inline`: à esquerda e à direita.
- `margin-block-start`: em cima. `margin-block-end`: embaixo.
- `margin-inline: auto`: divide a sobra entre os dois lados e centraliza um bloco mais estreito que o pai. Veja [Responsivo › Container](responsivo.md#container).

**Margin colapsando (margin collapsing).** Na vertical, as margens de dois blocos vizinhos não somam: vale a maior. Um bloco com `margin-block-end: var(--space-6)` seguido de outro com `margin-block-start: var(--space-4)` fica a `--space-6` dele, e não à soma. A margin de cima do primeiro filho também pode "vazar" para fora do pai, se o pai não tiver padding nem borda em cima. Nada disso acontece na horizontal, nem entre os filhos de um flex ou grid container.

**Gap ou margin entre irmãos.** Prefira o `gap` no pai. Ele só aparece entre os itens, nunca nas pontas, e não colapsa. A margin nos filhos sobra no último item e, na vertical, colapsa.

```css
/* Lista de tarefas centralizada, com o espaço entre os itens no pai */
.taskList {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);            /* só entre as tarefas, nunca nas pontas */
  padding-block: var(--space-5);  /* em cima e embaixo */
  padding-inline: var(--space-4); /* à esquerda e à direita */
  max-width: 40rem;
  margin-inline: auto;            /* a sobra vai igual para os dois lados */
}
```

**Armadilhas**

- `gap` num pai com `display: block` não faz nada.
- A distância entre dois blocos ficou menor que a soma das margens? É o colapso.
- `margin-inline: auto` só centraliza um bloco com `max-width` ou `width` menor que o pai. Num elemento inline, não faz nada.

**Ponte com C#:** o `gap` é o separador do `string.Join(", ", itens)`: só entra entre os itens. A margin em cada filho é como concatenar `item + ", "`: sobra um no fim, e você acaba escrevendo `:last-child { margin: 0 }`. Onde quebra: o `gap` só existe em flex, grid e multi-column. Num pai comum, não existe `Join`: ou você usa margin, ou transforma o pai em flex ou grid.

## Display

O `display` decide como a caixa se comporta por fora, em relação às vizinhas. Em `flex` e `grid`, ele também decide como ela organiza os filhos por dentro.

| Valor | Na linha | `width` e `height` | Padding e margin verticais | Padrão de |
|---|---|---|---|---|
| `block` | começa numa linha nova e ocupa a largura toda | funcionam | ocupam espaço | `div`, `p`, `section`, `ul` |
| `inline` | segue o texto, sem quebrar a linha | ignorados | o padding é pintado, mas não ocupa espaço; a margin não tem efeito | `a`, `span`, `strong` |
| `inline-block` | segue o texto, sem quebrar a linha | funcionam | ocupam espaço | `button`, `input` |
| `flex` e `grid` | por fora, igual ao `block` | funcionam | ocupam espaço | — |
| `none` | some: não ocupa espaço e sai do Tab e do leitor de tela | — | — | — |

**O link e a área de toque.** Um `<a>` é `inline`. Com `padding-block`, o fundo dele cresce, mas a linha não: o pai não fica mais alto, o vizinho não se afasta, e o padding invade o que está em cima e embaixo. A área de toque não ganha espaço no layout.

Com `inline-block` (ou `block`), o padding passa a contar. A altura vira a altura da linha (`font-size` × `line-height`) mais o padding de cima e o de baixo. Exemplo: um texto de 16px com `line-height: 1.6` tem 25,6px de linha. Com 12px de padding em cima e embaixo, a caixa fica com 49,6px, acima dos 44px que a WCAG recomenda para área de toque.

```css
/* Links de paginação de uma galeria de fotos */
.pageLink {
  display: inline-block;          /* sem isso, o padding vertical não ocupa espaço */
  padding-block: var(--space-3);  /* 12px em cima e 12px embaixo */
  padding-inline: var(--space-4);
}
```

**Armadilhas**

- `width` e `height` num elemento `inline` são ignorados sem nenhum aviso. Se a medida "não pega", confira o `display` na aba **Computed** do DevTools.
- O filho direto de um flex ou grid container vira bloco sozinho, mesmo sendo um `<a>`. O neto, não: um `<a>` dentro de um `<li>` continua inline, mesmo com o `<ul>` em flex.
- `display: none` tira o elemento também do Tab e do leitor de tela. Para tirar só da tela, veja [Posicionamento › Âncoras e cabeçalho fixo](posicionamento.md#âncoras-e-cabeçalho-fixo).

## Para ir além

- [MDN · O modelo de caixa](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Styling_basics/Box_model)
- [MDN · Dominando margin collapsing](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Guides/Box_model/Margin_collapsing)
- [web.dev · Espaçamento](https://web.dev/learn/css/spacing?hl=pt-br)
