# T-003 · Esqueleto semântico da página

| Tipo | Tamanho | Marco | Depende de |
|---|---|---|---|
| feature | M (até 1h) | 1 · Site público | T-001 |

**Conceito novo:** HTML semântico; hierarquia de títulos.

## Contexto

O designer entregou as telas do site. Antes de qualquer cor ou espaçamento, a página precisa da estrutura certa, porque é ela que o leitor de tela, o Google e os testes enxergam. Neste ticket, tudo fica no `App.tsx`, ainda sem CSS.

## Critérios de aceite

- [ ] **Dado** a página, **então** existe um `header` com o logo como link para `#inicio`. O logo é um `<img>` com `alt="Barbearia Navalha"`, importado com `import logo from "./assets/logo.svg"`.
- [ ] **Dado** o `header`, **então** ele tem um `nav` com `aria-label="Principal"` e uma lista com 4 links:
  - **Serviços**, para `#servicos`;
  - **Barbeiros**, para `#barbeiros`;
  - **Depoimentos**, para `#depoimentos`;
  - **Contato**, para `#contato`.
- [ ] **Dado** o `main`, **então** ele tem 5 `section`, nesta ordem e com estes `id`: `inicio`, `servicos`, `barbeiros`, `depoimentos` e `contato`.
- [ ] **Dado** as seções, **então** a `#inicio` tem o único `h1` da página, com o texto **Seu corte com hora marcada**, e cada uma das outras tem um `h2` com o próprio nome: **Serviços**, **Barbeiros**, **Depoimentos** e **Contato**.
- [ ] **Dado** a página, **então** existe um `footer` com o texto **© 2026 Barbearia Navalha**.
- [ ] Nenhuma `div` foi usada onde existe um elemento semântico, e a página passa no axe.

## Layout

A estrutura, de cima para baixo:

```
header
├── a (para #inicio) > img (alt "Barbearia Navalha")
└── nav (aria-label "Principal") > ul > li > a   ×4
main
├── section#inicio       > h1
├── section#servicos     > h2
├── section#barbeiros    > h2
├── section#depoimentos  > h2
└── section#contato      > h2
footer > p
```

Para ver aonde a página vai chegar: [pagina-375.png](../design/m1/pagina-375.png).

## Fora do escopo

- CSS de qualquer tipo. A página vai ficar crua, e está certo assim.
- Separar em componentes, o que começa no T-005.
- O conteúdo das seções, porque cada uma ganha o próprio ticket.

## Guia rápido

- [HTML semântico › Landmarks](../guias/html-semantico.md#landmarks)
- [HTML semântico › Hierarquia de títulos](../guias/html-semantico.md#hierarquia-de-títulos)
- [HTML semântico › Div ou elemento semântico](../guias/html-semantico.md#div-ou-elemento-semântico)
- [Acessibilidade › Texto alternativo](../guias/acessibilidade.md#texto-alternativo)
- Oficial: [MDN · Semântica](https://developer.mozilla.org/pt-BR/docs/Glossary/Semantics)

## Como conferir

`npm run check` · `npm run e2e -- T-003` · `/revisar`
