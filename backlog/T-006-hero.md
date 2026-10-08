# T-006 · Hero com chamada para agendar

| Tipo | Tamanho | Marco | Depende de |
|---|---|---|---|
| feature | M (até 1h) | 1 · Site público | T-005 |

**Conceito novo:** backgrounds; `:hover` e `:focus-visible`.

## Contexto

A primeira dobra precisa vender: um título grande, uma frase curta e um botão para agendar, sobre uma imagem escura. O agendamento de verdade só chega no marco 2, então por enquanto o botão leva até a lista de serviços.

## Critérios de aceite

- [ ] A seção de início vira o componente `Hero`, com `src/site/Hero.tsx` e `Hero.module.css`.
- [ ] **Dado** o hero, **então** ele mostra:
  - o `h1`;
  - o parágrafo **"Barbearia clássica no coração de Pinheiros. Escolha o serviço, o barbeiro e o horário, sem fila e sem espera."**;
  - o link **Agendar horário**, que leva para `#servicos`.
- [ ] **Dado** o fundo, **então** a própria `section` usa a imagem `src/assets/hero.svg` com uma camada de `--color-overlay` por cima (dois fundos na mesma regra) e `background-size: cover`.
- [ ] **Dado** o link, **então** ele tem cara de botão: `inline-block`, `padding: var(--space-3) var(--space-5)`, fundo `--color-primary`, texto `--color-on-primary`, `--radius-sm`, peso 600, caixa-alta e sem sublinhado.
- [ ] **Dado** o mouse em cima, **então** o fundo do botão muda para `--color-primary-strong`.
- [ ] **Dado** a navegação pelo teclado, **então** o botão mostra `outline: 3px solid var(--color-focus)` com `outline-offset: 3px`.
- [ ] O hero passa no axe.

## Layout

![Hero em 375px](../design/m1/hero-375.png)

Medidas:
- a seção tem `padding-block: var(--space-8)`;
- o título tem `--space-4` de espaço abaixo;
- o parágrafo usa `--text-lg` e `--color-text-muted`, com `--space-6` de espaço abaixo.

## Fora do escopo

- A versão desktop do hero (T-012).
- A página de agendamento (marco 2).

## Guia rápido

- [Fundamentos de CSS › Cores e fundos](../guias/css-fundamentos.md#cores-e-fundos)
- [Fundamentos de CSS › Pseudo-classes](../guias/css-fundamentos.md#pseudo-classes)
- [Acessibilidade › Teclado e foco](../guias/acessibilidade.md#teclado-e-foco)
- Oficial: [MDN · background](https://developer.mozilla.org/pt-BR/docs/Web/CSS/background)

## Como conferir

`npm run check` · `npm run e2e -- T-006` · `/revisar`
