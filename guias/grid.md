# Grid
> Para: T-008, T-009, T-012 · Leitura: ~5 min

## Linhas e colunas

`display: grid` no pai cria uma tabela invisível. Você define as colunas no pai, e os filhos diretos ocupam as células em ordem, linha por linha. O grid cria as linhas sozinho, conforme precisa, cada uma com a altura do item mais alto.

- `grid-template-columns` define as colunas. `12rem 1fr` são duas: uma fixa e uma flexível.
- `fr` é uma fração da sobra. Em `1fr 2fr`, a sobra (o que fica depois das colunas fixas e do `gap`) vira 3 partes, e a segunda coluna leva 2.
- `repeat(3, 1fr)` é o mesmo que `1fr 1fr 1fr`.
- `gap: A B` dá o espaço entre as linhas (A) e entre as colunas (B).
- Os itens esticam até a altura da linha. Cards lado a lado ficam com a mesma altura.
- `grid-column: span 2` faz o item ocupar duas colunas, e `grid-column: 1 / -1`, a linha inteira.

```css
/* Quadro de tarefas: 1 coluna no celular, 3 no desktop */
.board {
  display: grid;
  gap: var(--space-5) var(--space-4); /* entre as linhas, entre as colunas */
}
@media (min-width: 1024px) {
  .board {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.boardTitle {
  grid-column: 1 / -1; /* o título ocupa a linha inteira */
}
```

**Armadilhas**

- Só os filhos diretos viram itens do grid. Numa `ul` em grid, o item é o `li`, e não o que está dentro dele.
- O `1fr` tem piso: a coluna não fica mais estreita que o conteúdo mínimo dela. Uma palavra longa ou uma imagem larga alarga a coluna e estoura o grid. `minmax(0, 1fr)` tira o piso.
- Coluna em `%` não desconta o `gap`: `50% 50%` com `gap` estoura o pai. Use `fr`.
- `var()` não funciona na condição do `@media`. Escreva `640px` ou `1024px` direto.

**Ponte com C#:** o `fr` é o `*` das colunas do `Grid` do XAML: `2fr` equivale a `Width="2*"`. É um rateio da sobra pelos pesos. Onde quebra: o `1fr` tem o piso do conteúdo mínimo (ele vale `minmax(auto, 1fr)`). E no CSS você não diz a célula de cada item: ele ocupa a próxima livre, sozinho.

## Colunas automáticas

`repeat(auto-fit, minmax(MIN, 1fr))` deixa o navegador decidir quantas colunas cabem. Cada coluna tem no mínimo MIN, e a sobra é dividida entre elas. A grade passa de 1 para 2, 3 ou mais colunas conforme a largura, sem media query.

- `minmax(min, max)`: a coluna fica entre os dois valores.
- `auto-fill` e `auto-fit` criam o máximo de colunas que cabem. A diferença só aparece quando há menos itens que colunas. O `auto-fill` mantém as colunas vazias e reserva o espaço delas. O `auto-fit` colapsa as vazias, e os itens esticam até ocupar a linha. Com 2 fotos onde cabem 4 colunas, o `auto-fill` deixa as fotos estreitas, com duas colunas vazias ao lado, e o `auto-fit` estica as duas até a linha toda.
- O truque para não estourar no celular é `minmax(min(15rem, 100%), 1fr)`. Com `minmax(15rem, 1fr)`, um container com menos de 15rem de largura (celular estreito ou zoom) faz a página rolar na horizontal, porque a coluna não fica menor que 15rem. O `min(15rem, 100%)` usa o menor dos dois valores: quando o container é estreito, a coluna fica com 100% dele.

```css
/* Galeria de fotos: quantas colunas couberem, sem media query */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr));
  gap: var(--space-4);
}
```

**Armadilhas**

- O número de colunas depende da largura do container, descontado o padding dele, e não da largura da tela.
- `repeat(auto-fit, 1fr)` é inválido: o `auto-fit` precisa de um mínimo fixo, como em `minmax(12rem, 1fr)`.
- Numa tela muito larga, cabem muitas colunas. Para limitar, limite a largura do container.

## Grid ou flexbox

A regra prática: o flexbox trabalha em uma dimensão, e o grid, em duas.

- **Flexbox:** uma fila, numa direção. O tamanho de cada item vem do conteúdo, e quando a fila quebra, cada linha se resolve sozinha. Bom para barra de ferramentas, grupo de botões, tags, ícone com texto e para centralizar uma coisa.
- **Grid:** linhas e colunas ao mesmo tempo. O pai define as colunas, e os itens se encaixam alinhados nas duas direções. Bom para galeria, lista de cards, quadro de tarefas e o esqueleto da página.

A pergunta que decide: os itens de baixo precisam ficar alinhados em colunas com os de cima? Se sim, grid. Se só precisam ficar lado a lado e descer quando faltar espaço, flex. Os dois se combinam: grid na lista, flex dentro de cada item.

```css
/* Flex: cada linha se resolve sozinha, sem colunas */
.photoTags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

/* Grid: as mesmas colunas valem para todas as linhas */
.photoGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);
}
```

**Armadilhas**

- Itens com `width: 33.33%` num flex com `flex-wrap: wrap`, para imitar 3 colunas: a porcentagem não desconta o `gap`, a soma passa de 100%, e só cabem 2 por linha. Use grid.

**Ponte com C#:** o flex é uma `List<T>` que quebra em linhas. O grid é uma matriz `T[,]`, preenchida linha por linha. Onde quebra: no grid, o número de colunas pode ser calculado na hora (`auto-fit`), e um item pode ocupar várias células (`span`).

## Para ir além

- [MDN · Conceitos básicos de layout de grade](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Guides/Grid_layout/Basic_concepts)
- [MDN · grid-template-columns](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Reference/Properties/grid-template-columns)
- [web.dev · Grade](https://web.dev/learn/css/grid?hl=pt-br)
