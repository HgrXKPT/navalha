# HTML semântico
> Para: T-001, T-003, T-009, T-010, T-011 · Leitura: ~7 min

HTML semântico é escolher o elemento pelo **significado**, não pela aparência. O leitor de tela, o buscador e os testes de aceite (com `getByRole`) leem esse significado. Os exemplos estão em HTML; no JSX, `class` vira `className`, `for` vira `htmlFor` e `tabindex` vira `tabIndex`.

## O head do documento

O `head` fica no `web/index.html`, fora do React. O `lang` do `html` diz o idioma, e o leitor de tela escolhe a pronúncia por ele. Sem a meta `viewport`, o celular desenha a página como se tivesse uns 980px de largura e encolhe tudo. O `title` é o texto da aba, dos favoritos e do resultado de busca. O `link rel="icon"` aponta o favicon; no Vite, o que está em `public/` é servido na raiz, e `public/favicon.svg` vira `/favicon.svg`.

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>Livraria Página Aberta · Livros novos e usados</title>
  </head>
</html>
```

**Armadilhas**
- Não bloqueie o zoom com `user-scalable=no` ou `maximum-scale=1`. Quem enxerga mal precisa dele, e o axe do projeto acusa.
- Com `lang="en"` numa página em português, o leitor de tela lê o texto com a pronúncia do inglês.

## Landmarks

Landmarks são as regiões que o leitor de tela lista para o usuário pular direto até elas. Cada elemento tem um papel (role): `header` é o topo do site, `nav` um bloco de navegação principal, `main` o conteúdo principal (só um por página), `section` um bloco temático com título e `footer` o rodapé.

```html
<header>                                       <!-- banner -->
  <nav aria-label="Categorias">…</nav>         <!-- navigation -->
</header>
<main>                                         <!-- main -->
  <section aria-labelledby="releases-title">   <!-- region, porque tem nome -->
    <h2 id="releases-title">Lançamentos</h2>
  </section>
</main>
<footer>                                       <!-- contentinfo -->
  <nav aria-label="Institucional">…</nav>      <!-- navigation -->
</footer>
```

**Armadilhas**
- Com mais de um `nav`, dê um `aria-label` a cada um. Não ponha a palavra "navegação" no rótulo: o leitor de tela já anuncia o papel.
- `section` sem nome não vira landmark. E `header` e `footer` só viram `banner` e `contentinfo` fora de `article`, `section`, `aside`, `main` e `nav`; o `<div id="root">` do Vite não atrapalha.

## Hierarquia de títulos

Os títulos formam o sumário da página, e quem usa leitor de tela navega pulando de título em título. Use um único `h1` por página, com o assunto dela. Desça um nível por vez, sem pular de `h2` para `h4`. Escolha o nível pela estrutura, não pelo tamanho, que é do CSS. Texto que só merece destaque é `strong`, não título.

```html
<!-- O recuo é só para mostrar os níveis. -->
<h1>Livraria Página Aberta</h1>
  <h2>Lançamentos</h2>
    <h3>Dom Casmurro</h3>
    <h3>Vidas Secas</h3>
  <h2>Autores</h2>
```

**Armadilhas**
- O axe dos testes do projeto roda só as regras WCAG. A ordem dos títulos fica nas boas práticas, e ele não a confere: o cuidado é seu.

## Listas

Use uma lista para um conjunto de itens do mesmo tipo: o leitor de tela anuncia que é uma lista e quantos itens ela tem. `ul` serve quando a ordem não importa (gêneros, links de um menu), e `ol` quando ela faz parte do conteúdo (passos, ranking). Cada item é um `li`. O `aria-label` dá nome à lista, o que ajuda quando a página tem várias parecidas. No React, o `map` devolve os `li`, e o `key` vai no `li`.

```html
<ul aria-label="Gêneros">
  <li>Romance</li>
  <li>Realismo</li>
</ul>
<ol>
  <li>Escolha o livro.</li>
  <li>Pague.</li>
</ol>
```

**Armadilhas**
- O `li` é sempre filho direto do `ul` ou do `ol`. Um `div` no meio quebra a lista, e o axe do projeto acusa.

## Citações

Para uma citação em destaque, use `figure`. O `blockquote` guarda só o texto citado; o autor vai no `figcaption`, fora do `blockquote`, senão vira parte da citação. Para uma citação curta no meio da frase, use `q`: o navegador põe as aspas.

```html
<figure>
  <blockquote>
    <p>No meio do caminho tinha uma pedra</p>
  </blockquote>
  <figcaption>Carlos Drummond de Andrade, em <cite>No meio do caminho</cite></figcaption>
</figure>
```

**Armadilhas**
- `cite` é para o título de uma obra (livro, poema, filme), não para o nome de uma pessoa.

## Tabelas

Use `table` para dados em linhas e colunas, nunca para montar layout. O `caption` é o primeiro filho do `table` e dá nome à tabela. `thead` e `tbody` separam o cabeçalho do corpo. O `th` é um cabeçalho, com `scope="col"` na coluna e `scope="row"` na linha; o `td` é o dado. Com o `scope`, o leitor de tela lê cada nota junto com o nome do aluno e o título da coluna.

```html
<table>
  <caption>Notas do 1º bimestre</caption>
  <thead>
    <tr><th scope="col">Aluno</th><th scope="col">Nota</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Ana</th><td>8,5</td></tr>
    <tr><th scope="row">Bruno</th><td>7,0</td></tr>
  </tbody>
</table>
```

**Armadilhas**
- No React, escreva sempre o `tbody`. O navegador o cria sozinho quando lê HTML, mas o React não, e avisa no console.

## Endereço e links especiais

O `address` marca o contato de quem responde pela página: endereço, telefone e e-mail. `tel:` abre o discador no celular; no `href`, use o número completo, com o código do país e sem espaços, e deixe a versão formatada no texto. `mailto:` abre o programa de e-mail. O link que abre em outra aba leva `target="_blank"` e `rel="noopener noreferrer"`: o `rel` impede a página nova de mexer na sua (pelo `window.opener`) e não envia a ela o endereço de origem.

```html
<address>
  Rua das Acácias, 120 · Centro · Campinas, SP<br />
  <a href="tel:+551940000000">(19) 4000-0000</a><br />
  <a href="mailto:contato@example.com">contato@example.com</a><br />
  <a href="https://example.com/mapa" target="_blank" rel="noopener noreferrer">
    Ver no mapa (abre em outra aba)
  </a>
</address>
```

**Armadilhas**
- `address` não serve para qualquer endereço, como o de entrega de um pedido. E dentro dele não entram títulos nem `section`.
- Avise no texto que o link abre outra aba. Quem usa leitor de tela pode não perceber a troca.

## Div ou elemento semântico

`div` e `span` não dizem nada sobre o conteúdo. Antes de usar um deles, pergunte: leva para outro endereço? `a`, com `href`. Executa uma ação? `button`. Faz sentido sozinho, fora da página (um post, um produto, um comentário)? `article`. É um bloco temático com título? `section`. É um conjunto de itens? `ul` ou `ol`. Se nada disso serve e o motivo é só o layout (uma linha de flex, um invólucro de grid), aí sim é `div`.

```tsx
// Evite: o div não recebe foco nem responde a Enter e Espaço
<div onClick={addTask}>Adicionar</div>

// Prefira: o button já vem com foco, teclado e papel de botão
<button type="button" onClick={addTask}>Adicionar</button>
```

**Armadilhas**
- O `type="button"` importa: dentro de um `form`, o `button` sem `type` envia o formulário.
- Um `a` sem `href` não recebe foco pelo teclado. Se o elemento navega, é `a` com `href`; se executa uma ação, é `button`.

**Ponte com C#:** usar `div` para tudo é como tipar tudo como `object`: compila, mas ninguém sabe o que tem dentro. Onde quebra: no HTML, o tipo certo também traz comportamento de graça, como o foco e o teclado do `button`.

## Para ir além

- [MDN · Estrutura de documento e sites](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Structuring_content/Structuring_documents)
- [MDN · Tabelas em HTML](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics)
- [MDN · Elementos HTML](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Reference/Elements)
