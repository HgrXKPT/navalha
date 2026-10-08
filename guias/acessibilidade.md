# Acessibilidade
> Para: T-003, T-009, T-010, T-013, T-014 · Leitura: ~8 min

## Por que importa

Muita gente usa a web sem mouse ou sem enxergar bem a tela: quem navega só pelo teclado, quem usa leitor de tela (NVDA, Narrador, VoiceOver), quem tem baixa visão ou não distingue algumas cores, e quem está com o celular no sol.

- O leitor de tela não lê pixels. Ele lê a **árvore de acessibilidade**, que o navegador monta a partir do HTML: o papel (botão, link, título), o nome e o estado de cada elemento. HTML semântico entrega quase tudo de graça. No DevTools, a aba **Accessibility** do Elements mostra essa árvore.
- No Brasil, a Lei Brasileira de Inclusão (Lei 13.146/2015, art. 63) obriga os sites de empresas com sede ou representação no país a serem acessíveis. A referência técnica é a WCAG, e os testes de aceite usam a WCAG 2.1, níveis A e AA.

**Ponte com C#:** a árvore de acessibilidade é como a árvore de UI Automation do Windows, que o Narrador lê e que, no WPF, você ajusta com `AutomationProperties.Name`. Onde quebra: na web, o navegador monta a árvore sozinho a partir das tags. O ARIA muda o que é anunciado, mas não o comportamento: `role="button"` num `div` não faz o Enter funcionar. Por isso, se existe uma tag com o comportamento que você quer, use a tag.

## Texto alternativo

- Todo `img` tem `alt`. O texto diz o que a imagem comunica naquele contexto, numa frase curta, sem repetir o texto que já está ao lado.
- Imagem decorativa (enfeite, textura, ícone ao lado de um texto que já diz tudo) leva `alt=""`: vazio, mas presente. O leitor de tela pula.
- Se a imagem é o único conteúdo de um link, o `alt` vira o nome do link: descreva o destino.

```html
<!-- Informativa: o alt diz o que a foto mostra -->
<img src="/galeria/ponte.jpg" alt="Ponte estaiada iluminada à noite" />
<!-- Decorativa: alt vazio, e o leitor de tela pula -->
<img src="/galeria/divisor.svg" alt="" />
```

**Armadilhas**

- Sem `alt`, o leitor de tela pode ler o nome do arquivo, como "IMG_2041.jpg". O TypeScript não reclama; quem acusa é o axe, com a regra `image-alt`.
- Imagem de fundo do CSS (`background-image`) não tem `alt`. Use só para decoração; o que informa vai no HTML.

## Contraste

Contraste é a razão entre a luminância de duas cores, de 1:1 (cores iguais) a 21:1 (preto no branco). A WCAG 2.1, nível AA, pede no mínimo **4,5:1** para texto, **3:1** para texto grande (a partir de 24px, ou de cerca de 18,7px em negrito) e **3:1** para elementos de interface que você precisa enxergar, como a borda de um campo, um ícone que é botão e o contorno de foco. E contraste não resolve tudo: informação só por cor (erro em vermelho, disponível em verde) não chega a quem não distingue a cor. Some um texto ou um ícone.

Um **link no meio do texto** precisa se destacar do texto em volta, e não só do fundo. Quando a cor do link tem menos de 3:1 contra a cor do texto, a cor sozinha não diferencia: mantenha o sublinhado. A regra do axe para isso é a `link-in-text-block`.

```css
:root {
  --text: #222222; /* 15,91:1 sobre o branco */
  --muted: #767676; /* 4,54:1 sobre o branco: passa, no limite */
  --faded: #999999; /* 2,85:1 sobre o branco: reprova para texto */
  --link: #1d4ed8; /* 6,70:1 sobre o branco, mas só 2,37:1 contra o --text */
}

p a {
  color: var(--link);
  text-decoration: underline; /* é o padrão do navegador: não tire */
}
```

Para medir, ligue a inspeção (Ctrl+Shift+C) e passe o mouse sobre o texto: o balão mostra o contraste, com um aviso quando reprova. No Styles, clique no quadradinho de cor da propriedade `color`: o seletor mostra a seção **Contrast ratio**, com AA e AAA, e sugere uma cor que passa.

## Teclado e foco

- **Tab** vai para o próximo elemento focável, e **Shift+Tab** volta. **Enter** ativa link e botão; **Espaço** ativa botão. Recebem foco sozinhos o `a` com `href`, o `button` e os campos de formulário; `div` e `span`, não.
- **A ordem do Tab segue a ordem do HTML**, e não a posição na tela. CSS que muda a ordem visual (`order`, `flex-direction: row-reverse`, posicionamento) deixa o foco pulando de um lado para o outro.
- **Foco visível:** estilize com `:focus-visible`. O navegador aplica quando o foco deve aparecer: com o teclado, sim; com o clique do mouse num botão, em geral não. **Nunca tire o contorno sem colocar outro no lugar:** `outline: none` sozinho apaga o foco de quem usa teclado.
- **tabindex** (no React, o atributo se escreve `tabIndex`):
  - `tabindex="0"` põe na ordem do Tab, na posição em que está no HTML, algo que não recebe foco sozinho. Exemplo: uma região rolável só com texto, para o teclado conseguir rolar. Dê um nome a ela com `aria-label`.
  - `tabindex="-1"` deixa o elemento receber foco só por código (`element.focus()`) ou quando ele é o alvo de uma âncora (`href="#id"`). O Tab passa reto.
  - **Nunca use valor positivo:** ele fura a ordem natural da página inteira.

```css
:root { --focus-ring: #1d4ed8; } /* 6,70:1 sobre o branco: passa dos 3:1 */

a:focus-visible,
button:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px; /* afasta o contorno da borda do elemento */
}
```

**Armadilhas**

- Use `outline`, e não `border`, para o foco: o `outline` não ocupa espaço, e a `border` pode mudar o tamanho do elemento e fazer a página pular.
- Teste com as mãos: clique na barra de endereço e vá apertando Tab até o fim da página. Em cada parada, você precisa ver onde está o foco.

## Pular para o conteúdo

Quem usa teclado passa por todos os links do cabeçalho antes de chegar ao conteúdo, em toda página. Um link de atalho resolve:

1. O link é o **primeiro elemento** do `body`, antes do cabeçalho, e aponta para o `id` do `main`.
2. Ele fica **fora da tela** com `transform` e volta quando recebe foco. Assim, só aparece para quem navega com o teclado. Dê a ele fundo e espaçamento, para ficar legível quando aparecer.
3. O `main` recebe **`tabindex="-1"`**. Ao seguir a âncora, o foco vai de fato para o `main`, e o próximo Tab continua de dentro do conteúdo.

```html
<style>
  .bypass-link { position: absolute; top: 0; left: 0; transform: translateY(-100%); }
  .bypass-link:focus { transform: translateY(0); }
</style>

<body>
  <a class="bypass-link" href="#artigo">Ir direto para o artigo</a>
  <header>…</header>
  <main id="artigo" tabindex="-1">…</main>
</body>
```

**Armadilhas**

- Não esconda o link com `display: none` nem com `visibility: hidden`: elemento assim não recebe foco, e o link nunca apareceria.
- Com o foco no `main`, o navegador pode desenhar o contorno em volta da região inteira. Como o `main` não é interativo, ele é a exceção à regra do contorno e pode ficar sem.
- Para testar: recarregue, aperte Tab (o link aparece), Enter (a URL ganha o `#id`) e Tab de novo. O foco precisa cair no primeiro elemento focável do conteúdo.

## Botões que abrem e fecham

**Botão ou link?** O `button` faz uma ação na página: abrir, fechar, mostrar mais, enviar. O `a` com `href` navega: leva para outra página ou para uma âncora (`#id`). Nunca use `div` com `onClick`: ele não recebe foco, não responde ao Enter nem ao Espaço, e o leitor de tela não anuncia que é um botão.

Num botão que mostra e esconde um conteúdo, como um acordeão de perguntas ou um "mostrar detalhes":

- `aria-expanded` fica no botão e diz se o conteúdo está aberto (`"true"`) ou fechado (`"false"`);
- `aria-controls` aponta para o `id` do conteúdo;
- o nome do botão não muda: quem muda é o `aria-expanded`, e o leitor de tela anuncia se está expandido ou recolhido.

```html
<h3>
  <button type="button" aria-expanded="false" aria-controls="faq-entrega">
    Qual é o prazo de entrega?
  </button>
</h3>
<div id="faq-entrega" hidden>
  <p>Até 5 dias úteis nas capitais.</p>
</div>
<!-- Aberto: aria-expanded="true" no botão, e o painel sem o hidden -->
```

No React, o estado vira atributo: `aria-expanded={open}` e `hidden={!open}`, com o `open` vindo de um `useState` (veja [Estado e eventos](estado-e-eventos.md#estado-com-usestate)).

**Armadilhas**

- Sem `type="button"`, um botão dentro de um `form` é do tipo `submit`, e o clique envia o formulário.
- Conteúdo fechado precisa sair da ordem do Tab. O atributo `hidden` e o `display: none` tiram; `opacity: 0`, altura zero e posição fora da tela não tiram, e o Tab entra em links invisíveis.
- O `hidden` funciona por um `display: none` padrão do navegador. Um `display: flex` (ou `grid`, ou `block`) na sua classe vence, e o conteúdo aparece mesmo fechado.

## axe e Lighthouse

O `npm run e2e -- T-0xx` roda o **axe** (pelo `@axe-core/playwright`) na página ou numa região dela, com as regras da WCAG 2.0 e 2.1, níveis A e AA. Quando ele acha problema, o caso falha com uma lista de linhas no formato `id: descrição (Nx)`, em que N é o número de elementos afetados. Exemplo: `color-contrast: Elements must meet minimum color contrast ratio thresholds (2x)`. Os ids mais comuns:

| id | O que quer dizer |
|---|---|
| `color-contrast` | texto abaixo do contraste mínimo |
| `image-alt` | imagem sem `alt` |
| `button-name`, `link-name` | botão ou link sem nome (sem texto, sem `alt`, sem `aria-label`) |
| `scrollable-region-focusable` | região rolável que o teclado não alcança |
| `aria-valid-attr-value` | valor de ARIA inválido, como um botão com `aria-expanded="true"` cujo `aria-controls` aponta para um `id` que não existe |

O **Lighthouse** usa o axe por baixo, com algumas regras de boas práticas a mais, como a do `tabindex` positivo (que o axe do e2e deixa passar) e a da ordem dos títulos, e mostra os elementos de cada falha. Para rodar e ler a nota, veja [DevTools › Lighthouse](devtools.md#lighthouse).

**Armadilhas**

- Passar no axe não é ser acessível. Ele não percebe um `div` com `onClick` no lugar de um botão, nem um `alt` que descreve errado. Faça o teste do teclado.
- O axe confere só o estado atual da página: o que está escondido não é analisado. Por isso o e2e abre o que precisa antes de rodar o axe.

**Ponte com C#:** o axe é como um analisador do Roslyn para acessibilidade: acusa violação de regra sem você pedir. Onde quebra: ele roda na página renderizada, em tempo de execução, e não no código-fonte. Só confere o estado que o teste mostrou a ele.

## Para ir além

- [web.dev · Learn Accessibility](https://web.dev/learn/accessibility)
- [MDN · Acessibilidade](https://developer.mozilla.org/pt-BR/docs/Web/Accessibility)
- [Chrome for Developers · Lighthouse accessibility score](https://developer.chrome.com/docs/lighthouse/accessibility/scoring)
