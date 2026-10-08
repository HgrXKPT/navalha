# Fundamentos de CSS
> Para: T-004, T-006 · Leitura: ~8 min

Nos exemplos, os valores ficam soltos para facilitar a leitura. No Navalha, use os tokens (veja [Variáveis CSS](#variáveis-css)); a única exceção é a borda fina de 1px.

## Como o CSS decide

Quando várias regras dão valores diferentes à mesma propriedade do mesmo elemento, a cascata escolhe um. Ela olha, nesta ordem:

1. **Origem.** O seu CSS vence o CSS padrão do navegador, que é o que deixa o `h1` grande e o link azul.
2. **Especificidade.** Vence o seletor mais específico. Conte três colunas: ids, classes e elementos; pseudo-classes e atributos contam como classe. Compare da esquerda para a direita: um id vence qualquer quantidade de classes.
3. **Ordem.** Se empatar, vence a regra que aparece por último.

O atributo `style` vence qualquer seletor, e uma declaração com `!important` vence todas as normais.

```css
p { color: gray; }               /* (0,0,1) */
.intro { color: black; }         /* (0,1,0): vence o p */
#profile .intro { color: navy; } /* (1,1,0): vence os dois */

.tag { color: green; }
.tag { color: teal; }            /* mesma especificidade: vence a última */
```

**Armadilhas**
- Evite `!important`. Ele passa por cima da especificidade, e só outro `!important` o vence: vira uma escalada. Resolva com um seletor melhor. A exceção aceitável é forçar uma preferência do usuário, como o `prefers-reduced-motion` do `reset.css`.
- A origem vem antes da especificidade. Por isso o `* { margin: 0 }` do `reset.css`, com especificidade zero, vence a margem que o navegador dá ao `h1`.
- No DevTools (Elements › Styles), a declaração que perdeu aparece riscada.

**Ponte com C#:** lembra o DI do .NET, em que o último registro do mesmo serviço vence. Onde quebra: o CSS decide **por propriedade**, não por regra. A regra que perdeu no `color` continua valendo nas outras propriedades dela.

## Herança

Algumas propriedades passam do elemento pai para os filhos, na árvore do HTML. Herdam as de texto, como `color`, `font-family`, `font-size`, `font-weight` e `line-height`. Não herdam as de caixa, como `margin`, `padding`, `border`, `background` e `width`. Por isso, a cor e a fonte do texto costumam ser definidas uma vez, num ancestral, e o resto da árvore herda.

```css
.profile {
  color: #333;                 /* herda: os <p> de dentro ficam cinza-escuro */
  font-family: Georgia, serif; /* herda */
  border: 1px solid #ccc;      /* não herda: só o .profile tem borda */
  padding: 1rem;               /* não herda */
}

.profile a {
  color: inherit; /* força a herança: o link fica com a cor do pai */
}
```

**Armadilhas**
- A herança só age quando nenhuma regra define a propriedade no elemento. O navegador dá cor própria ao `a` e fonte própria a `button` e `input`, então eles não herdam. O `reset.css` do projeto já faz `font: inherit` nos botões e nos campos de formulário.
- `background` não herda. O filho é transparente por padrão, e por isso parece que herdou.

**Ponte com C#:** o nome lembra herança de classe, mas aqui quem herda é o elemento filho, na árvore do HTML, e só algumas propriedades. Onde quebra: não existe `override` nem `base`. O filho usa o valor do pai só quando nada define a propriedade nele.

## Unidades

| Unidade | Relativa a | Bom para |
|---|---|---|
| `px` | nada, é fixa | bordas e sombras finas |
| `rem` | a fonte do `html` (16px no padrão do navegador) | fonte e espaçamento |
| `em` | a fonte do próprio elemento | espaço que acompanha o texto |
| `%` | o elemento pai | larguras |
| `vw` | 1% da largura da janela | casos raros |

Use `rem` no tamanho da fonte. Quem aumenta a fonte padrão nas configurações do navegador vê o texto em `rem` crescer junto; em `px`, ele fica travado. Os tokens de fonte e de espaço do projeto já estão em `rem`: `--space-4` vale `1rem`.

```css
.badge {
  font-size: 0.875rem;    /* 14px com a raiz em 16px */
  padding: 0.25em 0.75em; /* acompanha a fonte do próprio .badge */
  border: 1px solid;      /* borda fina não precisa escalar */
}

.sidebar {
  width: 30%;             /* 30% da largura do pai */
}
```

**Armadilhas**
- `em` se acumula: `font-size: 1.2em` dentro de outro `1.2em` dá 1,44 vez a fonte de fora, porque no `font-size` o `em` usa a fonte do pai.
- Padding e margin em `%` usam a **largura** do pai, até em cima e embaixo.
- `100vw` inclui a largura da barra de rolagem vertical quando ela ocupa espaço na tela, como é comum no Windows. Um `width: 100vw` faz a página rolar na horizontal.

## Variáveis CSS

Uma custom property começa com `--` e é lida com `var()`. Declare no `:root` para valer na página toda. O segundo argumento do `var()` é o valor reserva, usado quando a variável não existe. A variável herda como o `color`: redefinida num elemento, o novo valor vale para ele e para os filhos.

Os tokens do Navalha ficam no `:root` de `web/src/styles/tokens.css`, e a tabela deles está em [design/tokens.md](../design/tokens.md). No CSS dos componentes, use só tokens: `padding: var(--space-4)`.

```css
:root {
  --accent: #2563eb;
}

.card {
  border: 2px solid var(--accent);
  color: var(--card-text, #222); /* reserva: --card-text não existe */
}

.card.dark {
  --accent: #93c5fd; /* vale só neste card e nos filhos */
}
```

**Armadilhas**
- Variável **não funciona na condição** do `@media`: `@media (min-width: var(--bp))` nunca se aplica. Escreva o número: `@media (min-width: 640px)`. Dentro das regras do bloco, `var()` funciona normalmente.
- Nome errado não dá erro. Sem valor reserva, a propriedade volta ao valor herdado ou ao inicial, e a declaração anterior não é usada. Confira no DevTools.

**Ponte com C#:** parece uma classe estática de constantes. Onde quebra: o navegador resolve a variável em tempo de execução, elemento por elemento. Ela herda pela árvore do HTML, pode ser redefinida num pedaço da página, e nada avisa se o nome estiver errado.

## Cores e fundos

Escreva a cor em hexadecimal (`#1b1b1b`) ou com `rgb()`, que aceita transparência depois da barra: `rgb(17 17 17 / 0.75)` é um quase preto com 75% de opacidade. O fundo tem `background-color` e `background-image`, que recebe um `url()` ou um gradiente. Para dar contraste ao texto sobre uma foto, sobreponha um `linear-gradient` escuro à imagem: a primeira camada da lista fica por cima. `background-size: cover` faz a imagem cobrir a caixa toda sem distorcer, cortando o excesso, e `background-position` escolhe que parte aparece.

```css
.cover {
  color: #fff;
  background-color: #1f2937; /* aparece enquanto a foto carrega */
  background-image:
    linear-gradient(to top, rgb(0 0 0 / 0.8), rgb(0 0 0 / 0.2)),
    url("./mountains.jpg");
  background-size: cover;
  background-position: center;
}
```

**Armadilhas**
- O atalho `background` zera as subpropriedades que você não escreveu, inclusive o `background-size`. Use as propriedades longas ou escreva o atalho primeiro.
- `opacity` deixa o elemento inteiro transparente, texto incluído. Para mexer só no fundo, use cor com alfa.
- No Vite, um caminho relativo no `url()` parte do arquivo CSS, e o Vite empacota a imagem. Um caminho que começa com `/` aponta para a pasta `public/`.

## Pseudo-classes

Uma pseudo-classe seleciona o elemento por estado ou posição: `:hover` (mouse em cima), `:focus` (tem o foco), `:first-child` (é o primeiro filho do pai) e `:not()` (não casa com o seletor de dentro).

`:focus` vale sempre que o elemento tem o foco, venha ele do teclado ou do mouse. `:focus-visible` vale quando o navegador acha que o foco precisa aparecer, em geral na navegação por teclado. Nesse caso, o navegador desenha um contorno padrão; no Navalha, o projeto define o próprio, com o token `--color-focus`.

```css
.button:hover { background-color: #1d4ed8; }

.button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.item:not(:first-child) {
  border-top: 1px solid #e5e7eb; /* linha entre os itens, menos antes do primeiro */
}
```

**Armadilhas**
- Nunca tire o contorno de foco (`outline: none`) sem pôr outro no lugar. Quem usa teclado se perde.
- No celular não há mouse: nada importante pode depender de `:hover`.
- `p:first-child` não é "o primeiro `p`". É um `p` que é o primeiro filho do pai: se o primeiro filho for um `h2`, nada casa. Para o primeiro `p`, use `p:first-of-type`.

## Para ir além

- [MDN · Cascata, especificidade e herança](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Styling_basics/Handling_conflicts)
- [MDN · Utilizando propriedades CSS personalizadas (variáveis)](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties)
- [MDN · Pseudo-classes](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Reference/Selectors/Pseudo-classes)
