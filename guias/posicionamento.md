# Posicionamento
> Para: T-011, T-014 · Leitura: ~8 min

## Os valores de position

O `position` decide duas coisas: se o elemento continua ocupando o lugar dele no fluxo e a partir de onde contam o `top`, o `right`, o `bottom` e o `left`. O padrão, `static`, é o fluxo normal: um bloco embaixo do outro, e o texto em linha.

| Valor | Ocupa lugar no fluxo? | `top` e `left` contam a partir de | Uso típico |
|---|---|---|---|
| `static` (padrão) | sim | não funcionam | quase tudo |
| `relative` | sim, e o lugar original fica reservado | da posição original dele | referência para filhos `absolute` |
| `absolute` | não: os vizinhos ocupam o lugar dele | do bloco de contenção | selo, contador, botão de fechar |
| `fixed` | não | da tela (o viewport) | barra que não sai do lugar ao rolar |
| `sticky` | sim | da borda do ancestral que rola (em geral, a tela) | título que gruda ao rolar |

O **bloco de contenção (containing block)** é a caixa de referência do `top`, do `left` e das porcentagens. Para o `absolute`, é o ancestral mais próximo com `position` diferente de `static`. O `top: 0` encosta na borda de dentro dele, e o padding desse ancestral não afasta o filho. Sem ancestral posicionado, a referência é o bloco inicial: um retângulo do tamanho da tela, no topo da página, que rola com ela. Para o `fixed`, a referência é a própria tela.

```css
/* Ícone de notificações com o contador no canto */
.bell {
  position: relative; /* vira o bloco de contenção do contador */
}

.counter {
  position: absolute; /* sai do fluxo */
  top: 0;
  right: 0;           /* canto de cima, à direita, do .bell */
}
```

**Armadilhas**

- `absolute` sem ancestral posicionado se posiciona pelo topo da página, e não pelo pai. Ponha `position: relative` no pai que deve servir de referência.
- `absolute` e `fixed` saem do fluxo: o conteúdo seguinte sobe e fica por baixo deles. Reserve o espaço, com padding no pai, por exemplo.
- `absolute` encolhe até o tamanho do conteúdo. Para ocupar a largura do bloco de contenção, use `left: 0` e `right: 0` juntos.
- Um ancestral com `transform`, `filter` ou `perspective` diferente de `none` vira o bloco de contenção do `fixed`. O elemento deixa de ficar preso na tela e passa a rolar com esse ancestral.

**Ponte com C#:** o `absolute` procura a referência como o MSBuild procura o `Directory.Build.props`: sobe pelos ancestrais e para no primeiro que tem `position` diferente de `static`. Se nenhum serve, fica com o bloco inicial, no topo da página. Onde quebra: `transform`, `filter` e `perspective` também fazem um ancestral virar a referência, e uma animação pode trazer um deles sem você perceber.

## Sticky

O `sticky` é um híbrido. Até chegar ao limite, ele se comporta como `relative` e rola com a página. Quando a borda dele alcança o limite que você definiu (`top: 0`, por exemplo), ele gruda ali. Ele só gruda dentro do pai: quando o pai sai da tela, o elemento vai junto. Diferente do `fixed`, o `sticky` continua no fluxo: o lugar dele fica reservado, e nada começa escondido por baixo dele.

```css
/* Painel de notificações agrupado por dia: o título do dia
   gruda no topo enquanto as notificações dele passam */
.dayHeading {
  position: sticky;
  top: 0;                        /* obrigatório: sem ele, age como relative */
  background: var(--color-bg);   /* sem fundo, a lista aparece por trás */
  padding-block: var(--space-2);
}
```

**Armadilhas**

- Sem `top` (ou `bottom`, `left`, `right`), o `sticky` nunca gruda.
- Um ancestral com `overflow` em `hidden`, `auto` ou `scroll` faz o `sticky` grudar nele, e não na tela. Se esse ancestral não rola, parece que o `sticky` parou de funcionar. Suba pelos ancestrais no DevTools procurando o `overflow`. Se você só precisa cortar o que vaza, `overflow: clip` corta sem esse efeito.
- Se o pai tem a mesma altura que o elemento, como um wrapper só em volta dele, não sobra espaço para grudar.
- O `sticky` cria um contexto de empilhamento (veja [Camadas](#camadas)). Se algo passa por cima dele ao rolar, dê um `z-index` a ele.

## Camadas

Quando duas caixas se sobrepõem, o `z-index` decide quem fica na frente: o maior. Ele só funciona em elemento posicionado (qualquer `position` menos `static`) ou em item de flex e grid. No empate, quem vem depois no HTML fica na frente.

O `z-index` não é global. Alguns elementos criam um **contexto de empilhamento (stacking context)**: um grupo que vai para a frente ou para trás como uma peça só. Lá dentro, o `z-index` de cada filho só se compara com o dos outros filhos do mesmo grupo. Um filho com `z-index: 9999` não passa na frente de quem já está na frente do grupo dele.

Criam um contexto, entre outros:

- `position: relative` ou `absolute` com `z-index` diferente de `auto`;
- `position: fixed` ou `sticky`, sempre;
- item de flex ou grid com `z-index` diferente de `auto`;
- `transform` diferente de `none`;
- `opacity` menor que 1;
- `isolation: isolate`, que serve só para isso.

No exemplo, o menu de um painel de notificações deveria abrir por cima da galeria vizinha, mas fica atrás dela:

```css
.panel {
  position: relative;
  z-index: 1;    /* cria um contexto: o painel inteiro vale 1 */
}
.panelMenu {
  position: absolute;
  z-index: 9999; /* só se compara com quem está dentro do .panel */
}
.gallery {
  position: relative;
  z-index: 2;    /* fica na frente do .panel e de tudo dentro dele */
}
```

**Armadilhas**

- `z-index` num elemento `static`, fora de flex e grid, não faz nada.
- `opacity: 0.99`, `transform` ou `filter` num ancestral criam um contexto sem você perceber. Menu "preso" atrás de outra coisa quase sempre é isso. No DevTools, suba pelos ancestrais procurando um deles.
- Aumentar o número (`999`, `9999`) não adianta quando o problema é o contexto. Suba o `z-index` de quem cria o contexto: no exemplo, o do `.panel`, e não o do menu.

**Ponte com C#:** a ordem de pintura é como `OrderBy(contexto).ThenBy(zIndex)`. O menu do exemplo vale `(1, 9999)`, e a galeria vale `(2)`: a galeria vence no primeiro critério. No empate total, vale a ordem do HTML, como no `OrderBy` do LINQ, que é estável. Onde quebra: elemento sem `position` nem entra na ordenação. Ele é pintado antes, por baixo dos posicionados (só um `z-index` negativo vai para baixo dele).

## Âncoras e cabeçalho fixo

Um link para `#ajuda` rola a página até o elemento com `id="ajuda"` e encosta o topo dele no topo da tela. Com um cabeçalho `sticky` ou `fixed`, esse topo fica escondido atrás do cabeçalho. O `scroll-margin-top` no alvo resolve: o navegador rola um pouco menos e deixa esse espaço livre em cima. Ele também vale para o `scrollIntoView()`. Quando todos os alvos precisam do mesmo espaço, existe a alternativa no container que rola: `scroll-padding-top` no `html` vale para a página inteira.

**Fora da tela, mas no Tab.** Cada jeito de esconder tira o elemento de um lugar diferente:

| Técnica | Some da tela? | Continua no Tab e no leitor de tela? |
|---|---|---|
| `display: none` | sim, e libera o espaço | não |
| `visibility: hidden` | sim, mas o espaço continua reservado | não |
| `opacity: 0` | sim, mas continua ocupando espaço e recebendo clique | sim |
| `transform` para fora da tela | sim | sim |

O `transform` só muda onde o elemento é desenhado. Para o layout, para o Tab e para o leitor de tela, ele continua no mesmo lugar. Use para algo que precisa aparecer quando recebe o foco do teclado.

```css
/* Página de ajuda: o tópico-alvo fica abaixo da barra fixa */
.helpTopic {
  scroll-margin-top: var(--space-8);
}

/* Barra de atalhos: fora da tela até alguém chegar nela pelo Tab */
.shortcutBar {
  position: fixed;
  bottom: 0;
  transform: translateY(100%); /* desenhada logo abaixo da tela */
}
.shortcutBar:focus-within {
  transform: none;             /* algo dentro dela recebeu foco */
}
```

**Armadilhas**

- O `scroll-margin-top` vai no alvo, o elemento que tem o `id`. Não vai no link nem no cabeçalho.
- O valor precisa cobrir a altura do cabeçalho no pior caso. Se o cabeçalho muda de altura entre o celular e o desktop, confira as duas larguras.
- Perto do fim da página, o alvo não chega ao topo, porque não sobra página para rolar. Isso é normal.
- Um painel fechado com `transform` continua no Tab, e o teclado entra em algo invisível. Se fechado é para sumir de verdade, use `display: none` ou `visibility: hidden`.

## Para ir além

- [MDN · position](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Reference/Properties/position)
- [web.dev · Contextos de empilhamento e z-index](https://web.dev/learn/css/z-index?hl=pt-br)
- [MDN · scroll-margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-margin-top) (em inglês; o MDN não tem esta página em português)
