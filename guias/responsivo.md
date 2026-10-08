# Responsivo
> Para: T-008, T-009, T-010, T-012 · Leitura: ~6 min

Nos exemplos, os valores ficam soltos para facilitar a leitura. No Navalha, use os tokens de `tokens.css`. Só a condição do `@media` leva o número direto.

## Mobile first

O CSS sem `@media` é o do celular. Cada media query com `min-width` acrescenta só o que muda a partir daquela largura. O celular costuma ter o layout mais simples, numa coluna, então você escreve menos e sobrescreve pouco.

Os breakpoints do projeto são `640px` (tablet) e `1024px` (desktop).

```css
/* Celular: sem @media. Os botões ficam empilhados. */
.toolbar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* A partir de 640px, só o que muda: os botões lado a lado. */
@media (min-width: 640px) {
  .toolbar {
    flex-direction: row;
  }
}
```

**Armadilhas**
- Não misture `min-width` e `max-width` no mesmo componente. Em 640px exatos, `min-width: 640px` e `max-width: 640px` valem os dois, e as faixas se sobrepõem ou deixam buracos.
- Sem a meta viewport no `index.html`, o celular desenha a página como se tivesse uns 980px de largura, e as media queries passam a valer no celular. Veja [O head do documento](html-semantico.md#o-head-do-documento).

**Ponte com C#:** o CSS base é a classe base, e cada media query é uma subclasse que sobrescreve só o que muda. Onde quebra: ninguém escolhe uma subclasse. Todas as media queries que casam com a tela valem ao mesmo tempo, e a cascata decide propriedade por propriedade.

## Media queries

A sintaxe é `@media (min-width: 640px) { … }`. Dentro do bloco vão regras comuns, com seletor e chaves. A media query não muda a especificidade: ela só liga ou desliga as regras de dentro. Por isso a ordem importa: primeiro a regra base, depois o `640px`, por último o `1024px`.

Com CSS Modules, a media query fica no próprio módulo, logo abaixo das regras que ela altera.

```css
.title {
  font-size: 1.5rem;
}

@media (min-width: 640px) {
  .title {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  .title {
    font-size: 2.5rem;
  }
}
```

**Armadilhas**
- `var()` não funciona na condição: `@media (min-width: var(--bp))` nunca se aplica. Escreva o número. Dentro do bloco, os tokens funcionam normalmente.
- Se a regra de dentro tiver especificidade menor que a de fora, ela perde, mesmo com a tela larga. Repita o mesmo seletor.
- Você também vai ver a forma `@media (width >= 640px)`. Ela é equivalente, mas o projeto usa `min-width`.

## Container

O container limita a largura do conteúdo nas telas grandes e o centraliza. São três propriedades: `max-width` limita a largura, `margin-inline: auto` divide a sobra entre os dois lados, e `padding-inline` impede que o texto encoste na borda do celular.

Para o fundo ocupar a tela toda e o conteúdo ficar limitado, ponha o container dentro da seção: o fundo vai na seção, e a largura máxima no container.

```css
/* A faixa ocupa a largura toda e leva o fundo. */
.band {
  background-color: #f5f5f4;
}

/* O container, dentro dela, limita e centraliza o conteúdo. */
.container {
  max-width: 40rem;
  margin-inline: auto;
  padding-inline: 1rem;
}
```

**Armadilhas**
- `width: 960px` no lugar de `max-width` faz a página rolar na horizontal no celular.
- `margin: 0 auto` também zera a margem de cima e a de baixo. `margin-inline: auto` mexe só nas laterais.
- Com `box-sizing: border-box`, que o `reset.css` do projeto aplica a tudo, o `padding` fica dentro do `max-width`.

## Imagens fluidas

Uma imagem fluida nunca passa da largura do pai: `max-width: 100%`. O `reset.css` do projeto já faz isso em `img`, `picture`, `svg` e `video`.

Para as imagens de uma grade terem o mesmo formato, fixe a proporção com `aspect-ratio` e diga com `object-fit` como a foto preenche a caixa:

- `cover` preenche a caixa toda e corta o que sobra. Bom para fotos.
- `contain` mostra a imagem inteira e pode deixar faixas vazias. Bom para capas e logos, que não podem ser cortados.

```css
.thumb {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  object-position: center top; /* que parte fica quando corta */
}

.book-cover {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: contain;
}
```

**Armadilhas**
- Sem `object-fit`, o padrão é `fill`: a imagem estica e distorce.
- Se a `img` tiver os atributos `width` e `height`, ponha `height: auto` no CSS. O atributo fixa a altura, e o `aspect-ratio` só age quando uma das medidas é automática.
- `object-fit` vale para `img` e `video`. Para imagem de fundo, o equivalente é o `background-size`.

## Rolagem horizontal

A página inteira **nunca** pode rolar na horizontal. Para conferir, rode no Console `document.documentElement.scrollWidth > document.documentElement.clientWidth`. Se der `true`, algum elemento vaza.

Uma região rolável de propósito, como uma faixa de fotos, leva `overflow-x: auto` no container: o excesso fica dentro da faixa, e a página não mexe. `scroll-snap-type: x mandatory` no container e `scroll-snap-align` nos itens fazem a rolagem parar encaixada num item.

```css
.strip {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.photo {
  flex: 0 0 80%; /* não encolhe: cada foto ocupa 80% da faixa */
  scroll-snap-align: start;
}
```

Se a região não tiver nada focável dentro (só texto e imagens), o teclado pode não alcançá-la: nem todo navegador põe uma área rolável na ordem do Tab. Dê foco a ela com `tabIndex={0}` e um nome com `aria-label`, como em `<ul className={styles.strip} tabIndex={0} aria-label="Fotos da viagem">`. Com o foco na região, as setas rolam o conteúdo.

**Armadilhas**
- No JSX é `tabIndex`, com I maiúsculo. Use só o `0`: valor positivo bagunça a ordem do Tab.
- Não esconda o vazamento com `overflow-x: hidden`. Ele corta conteúdo e, num elemento ancestral, impede o `position: sticky` de funcionar. Ache o elemento que vaza.
- Culpados comuns: largura fixa em `px`, `100vw`, imagem sem `max-width` e palavra comprida, como uma URL. Para a palavra, use `overflow-wrap: anywhere`.

## Para ir além

- [MDN · Design Responsivo](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)
- [MDN · Usando Media Queries](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Guides/Media_queries/Using)
- [web.dev · Well-controlled scrolling with CSS Scroll Snap](https://web.dev/articles/css-scroll-snap) (em inglês; o MDN não tem este tema em português)
