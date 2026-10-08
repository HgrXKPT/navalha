# Flexbox
> Para: T-009, T-012, T-013 · Leitura: ~7 min

## Eixo principal e cruzado

`display: flex` no pai põe os filhos diretos em fila. A fila corre no eixo principal, e o eixo cruzado é o perpendicular a ele. As propriedades do flexbox falam desses dois eixos, e não de horizontal e vertical.

O `flex-direction` escolhe o eixo principal: `row`, o padrão, é horizontal, com os itens lado a lado; `column` é vertical, com os itens um embaixo do outro. O `justify-content` trabalha sempre no eixo principal, e o `align-items`, no cruzado. Se a direção muda, eles trocam de papel: em `column`, quem posiciona na vertical é o `justify-content`.

```css
/* Barra de ferramentas: botões lado a lado */
.toolbar {
  display: flex; /* row é o padrão */
}
/* Painel de notificações: uma embaixo da outra */
.notificationList {
  display: flex;
  flex-direction: column; /* eixo principal na vertical */
}
```

**Armadilhas**

- Só os filhos diretos viram itens flex. Os netos seguem o fluxo normal.
- `row-reverse` e `column-reverse` invertem só o desenho. O Tab e o leitor de tela continuam na ordem do HTML.
- Por fora, o flex container se comporta como `block` e ocupa a largura toda. Para ele seguir o texto na mesma linha, use `inline-flex`.

**Ponte com C#:** se você já usou XAML, o `flex-direction` é o `Orientation` do `StackPanel`. Onde quebra: o `StackPanel` só empilha. O flex também distribui a sobra, estica e encolhe os itens e quebra linha.

## Alinhamento

O `justify-content` distribui a sobra no eixo principal. O `align-items` posiciona os itens no eixo cruzado, dentro da linha.

| `justify-content` | Efeito |
|---|---|
| `flex-start` e `flex-end` | itens no começo (o comportamento padrão) ou no fim |
| `center` | itens no meio |
| `space-between` | o primeiro e o último nas pontas, e a sobra dividida entre os itens |
| `space-evenly` | espaços iguais entre os itens e nas pontas |

O `align-items` aceita `stretch` (o padrão: em `row`, os itens esticam até a altura da linha), `center`, `flex-start`, `flex-end` e `baseline`, que alinha pela base do texto. O `align-self` muda o alinhamento de um item só. Uma `margin-inline-start: auto` num item absorve a sobra e empurra esse item, e os seguintes, para o fim.

```css
/* Barra de ferramentas: título à esquerda, ações à direita */
.toolbar {
  display: flex;
  justify-content: space-between; /* a sobra vai para o meio */
  align-items: center;            /* centraliza no eixo cruzado */
}
/* Outra forma: só o último item vai para a direita */
.toolbarEnd {
  margin-inline-start: auto;
}
```

**Armadilhas**

- O `justify-content` não faz nada quando não sobra espaço, por exemplo quando todos os itens têm `flex: 1`.
- Com `space-between` e um item só, ele fica no começo, e não no meio.
- `justify-items` e `justify-self` são do grid. No flexbox, eles são ignorados.
- Item com tamanho definido no eixo cruzado (`height` em `row`, `width` em `column`) não estica com o `stretch`.

## Espaço entre itens

O espaço entre os itens vai no container, com `gap`. Ele só aparece entre os itens, nunca nas pontas. Com dois valores, o primeiro é o `row-gap`, entre as linhas (quando há quebra), e o segundo é o `column-gap`, entre os itens da mesma linha. O `gap` e o `justify-content` se completam: o `gap` garante o espaço mínimo, e o `justify-content` distribui o que sobrar além dele.

```css
/* Barra de ferramentas: grupos nas pontas, botões espaçados */
.toolbar {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4); /* mínimo entre os grupos, mesmo sem sobra */
}
.toolbarGroup {
  display: flex;
  gap: var(--space-2); /* entre os botões de cada grupo */
}
```

**Armadilhas**

- A margin dos itens soma com o `gap`. Para cada espaço, escolha um dos dois. O porquê de preferir o `gap` está em [Box model › Margin padding e gap](box-model.md#margin-padding-e-gap).
- O `gap` vai no container. Num elemento que não é flex nem grid, ele não faz nada.

## Quebra de linha

Por padrão (`flex-wrap: nowrap`), tudo fica numa linha só. Os itens encolhem até o mínimo do conteúdo e, se ainda assim não couberem, vazam do container. Com `flex-wrap: wrap`, o item que não cabe desce para uma linha nova.

Cada linha é independente. O `justify-content` alinha os itens dentro de cada linha, e os itens de uma linha não formam colunas com os da outra. Com várias linhas, o `align-content` distribui as linhas no eixo cruzado.

```css
/* Filtros de uma galeria de fotos: descem para a linha de baixo */
.filters {
  display: flex;
  flex-wrap: wrap;                    /* sem isso, vazam da tela */
  gap: var(--space-2) var(--space-3); /* entre as linhas, entre os itens */
}
```

**Armadilhas**

- `nowrap` com itens que não encolhem faz a página inteira rolar na horizontal no celular.
- Com `flex-grow`, cada linha divide a própria sobra. Se a última linha tem poucos itens, eles esticam mais que os das outras linhas.
- Os itens de linhas diferentes precisam ficar alinhados em colunas? Isso é grid. Veja [Grid › Grid ou flexbox](grid.md#grid-ou-flexbox).

## Crescer e encolher

Cada item parte de um tamanho base, o `flex-basis`. Se sobra espaço na linha, o `flex-grow` diz quanto da sobra cada item leva. Se falta, o `flex-shrink` diz quanto cada item cede.

| Propriedade | Padrão | O que faz |
|---|---|---|
| `flex-basis` | `auto` | tamanho inicial; `auto` usa o `width` (em `column`, o `height`) ou, sem ele, o conteúdo |
| `flex-grow` | `0` | peso na divisão da sobra; `0` não cresce |
| `flex-shrink` | `1` | peso na divisão da falta; `0` nunca encolhe |

O atalho `flex` junta os três, nesta ordem:

- `flex: 0 0 auto`, o mesmo que `flex: none`: o item fica do tamanho do conteúdo e não cresce nem encolhe. Bom para ícone e botão.
- `flex: 1`, que vira `1 1 0%`: a base é zero, e o item fica com a sobra toda. Vários itens com `flex: 1` dividem o espaço em partes iguais, desde que o conteúdo mínimo de cada um caiba.
- `flex: auto`, que vira `1 1 auto`: o item cresce a partir do tamanho do conteúdo.

```css
/* Barra de ferramentas: a busca ocupa o que sobrar */
.toolbar {
  display: flex;
  gap: var(--space-2);
}
.searchField {
  flex: 1;        /* 1 1 0%: fica com toda a sobra */
  min-width: 0;   /* deixa encolher abaixo do conteúdo mínimo */
}
.toolbarButton {
  flex: 0 0 auto; /* tamanho do conteúdo, nunca encolhe */
}
```

**Armadilhas**

- Um item flex não encolhe abaixo do conteúdo mínimo dele, como uma palavra longa ou uma URL. O culpado é o `min-width: auto`, que é o padrão. `min-width: 0` libera.
- `flex: 1` e `flex-grow: 1` não são a mesma coisa. Com `flex-grow: 1` sozinho, a base continua `auto`, e o item com mais texto fica maior.
- Ícone ou imagem achatado numa fila? Dê `flex: 0 0 auto` (ou `flex-shrink: 0`) a ele.

**Ponte com C#:** é um rateio proporcional, como dividir um desconto entre os itens de uma venda. Com `flex-grow` 1 e 2, a sobra vira 3 partes: um item leva 1, e o outro, 2. Onde quebra: na falta, o peso é o `flex-shrink` multiplicado pelo `flex-basis`, então o item maior cede mais. Existe um piso, o conteúdo mínimo, e o que um item não pode ceder fica para os outros. E a conta é refeita a cada mudança de largura.

## Para ir além

- [MDN · Conceitos básicos de flexbox](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts)
- [MDN · flex](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Reference/Properties/flex)
- [web.dev · Flexbox](https://web.dev/learn/css/flexbox?hl=pt-br)
