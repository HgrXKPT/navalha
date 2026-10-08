# Tokens do design system

Os tokens ficam em `web/src/styles/tokens.css`, como variáveis CSS no `:root`.

**Regra do projeto:** o CSS dos componentes usa só tokens. Nada de cor em hexadecimal, `px` solto ou fonte digitada à mão. Se faltar um token, ele entra neste arquivo primeiro.

## Cores

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#111111` | fundo da página |
| `--color-surface` | `#1b1b1b` | fundo de cards e blocos |
| `--color-surface-raised` | `#252525` | elementos sobre um card, como os chips de especialidade |
| `--color-border` | `#343434` | bordas e divisórias |
| `--color-text` | `#f4efe6` | texto principal |
| `--color-text-muted` | `#b5ad9f` | texto secundário, como descrições e legendas |
| `--color-primary` | `#c9a45c` | latão: links, preços e botão principal |
| `--color-primary-strong` | `#e0bd73` | botão principal com o mouse em cima |
| `--color-on-primary` | `#111111` | texto sobre `--color-primary` |
| `--color-focus` | `#f2d38a` | contorno de foco do teclado |
| `--color-overlay` | `rgb(17 17 17 / 0.75)` | camada escura sobre a imagem do hero |

## Tipografia

| Token | Valor | Uso |
|---|---|---|
| `--font-display` | Oswald, com Arial Narrow de reserva | títulos (`h1` a `h3`), sempre em caixa-alta |
| `--font-body` | Inter Variable, com Segoe UI e system-ui de reserva | todo o resto |
| `--text-sm` | 0.875rem (14px) | links do menu, selos e legendas |
| `--text-base` | 1rem (16px) | texto corrido |
| `--text-lg` | 1.125rem (18px) | nome nos cards de barbeiro |
| `--text-xl` | 1.5rem (24px) | nome nos cards de serviço |
| `--text-2xl` | 2rem (32px) | `h2` e `h1` no celular |
| `--text-3xl` | 2.75rem (44px) | `h1` no desktop |
| `--leading-tight` | 1.15 | altura de linha dos títulos |
| `--leading-normal` | 1.6 | altura de linha do texto |
| `--tracking-wide` | 0.06em | espaço entre letras em caixa-alta |

## Espaço

A escala é de 4 em 4px. Margin, padding e gap usam sempre um destes valores:

| Token | Valor |
|---|---|
| `--space-1` | 0.25rem (4px) |
| `--space-2` | 0.5rem (8px) |
| `--space-3` | 0.75rem (12px) |
| `--space-4` | 1rem (16px) |
| `--space-5` | 1.5rem (24px) |
| `--space-6` | 2rem (32px) |
| `--space-7` | 3rem (48px) |
| `--space-8` | 4rem (64px) |

## Forma e layout

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 0.375rem | botões |
| `--radius-md` | 0.75rem | cards |
| `--radius-full` | 999px | fotos redondas, selos e chips |
| `--shadow-card` | duas sombras escuras | cards em destaque |
| `--container-max` | 72rem (1152px) | largura máxima do conteúdo no desktop |
| `--scroll-offset` | 7.5rem | `scroll-margin-top` das seções, para o cabeçalho fixo não cobrir o título |

## Breakpoints

| Nome | Largura | Quando muda |
|---|---|---|
| tablet | `min-width: 640px` | o cabeçalho fica numa linha só e os barbeiros passam para 4 colunas |
| desktop | `min-width: 1024px` | os depoimentos viram grade, e o contato fica em duas colunas |

O site é **mobile-first**: o CSS sem `@media` é o do celular, e as media queries só acrescentam o que muda nas telas maiores.

Variável CSS **não funciona** dentro de `@media`. Escreva o número direto: `@media (min-width: 640px)`.

## Contraste

Os valores abaixo foram calculados com a fórmula do WCAG 2.1. O mínimo é 4,5:1 para texto e 3:1 para o contorno de foco.

| Par | Contraste | Mínimo | Resultado |
|---|---|---|---|
| `--color-text` sobre `--color-bg` | 16,49:1 | 4,5:1 | ok |
| `--color-text` sobre `--color-surface` | 15,04:1 | 4,5:1 | ok |
| `--color-text` sobre `--color-surface-raised` | 13,38:1 | 4,5:1 | ok |
| `--color-text-muted` sobre `--color-bg` | 8,49:1 | 4,5:1 | ok |
| `--color-text-muted` sobre `--color-surface` | 7,75:1 | 4,5:1 | ok |
| `--color-text-muted` sobre `--color-surface-raised` | 6,89:1 | 4,5:1 | ok |
| `--color-primary` sobre `--color-bg` | 8,05:1 | 4,5:1 | ok |
| `--color-primary` sobre `--color-surface` | 7,34:1 | 4,5:1 | ok |
| `--color-on-primary` sobre `--color-primary` | 8,05:1 | 4,5:1 | ok |
| `--color-on-primary` sobre `--color-primary-strong` | 10,52:1 | 4,5:1 | ok |
| `--color-focus` sobre `--color-bg` | 13,00:1 | 3:1 | ok |
| `--color-focus` sobre `--color-surface` | 11,86:1 | 3:1 | ok |
| `--color-primary` contra `--color-text` | 2,05:1 | — | só registro |

A última linha explica uma regra: **um link no meio de um texto continua sublinhado**. O latão tem só 2,05:1 contra o texto, e quem não enxerga bem a diferença de cor precisa do sublinhado para saber que ali tem um link.

## Arquivos

- `logo.svg`: o logo horizontal, a navalha mais "NAVALHA". No app, ele é importado de `web/src/assets/logo.svg`.
- `favicon.svg`: só a navalha, para o ícone da aba (T-001).
- `m1/`: as telas de referência do marco 1.
- `desafio-m1/`: o layout do desafio do marco 1.
