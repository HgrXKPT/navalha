# CSS Modules
> Para: T-005 em diante · Leitura: ~4 min

## Por que módulos

No CSS comum, toda classe é global: vale para a página inteira. Se dois componentes usam `.title`, as duas regras disputam os mesmos elementos, e a que carregar por último vence nos dois. Com dezenas de componentes, isso vira um bug difícil de achar.

Com CSS Modules, o Vite troca cada nome de classe por um nome único, gerado por arquivo. O `.title` de um componente não enxerga o `.title` do outro.

```css
/* ProfileCard.css */
.title {
  font-size: 1.5rem;
}

/* TaskList.css: outro componente, mesmo nome */
.title {
  font-size: 1rem; /* se carregar depois, vence nos DOIS componentes */
}
```

**Ponte com C#:** o CSS comum é um projeto inteiro no namespace global, e o módulo dá a cada arquivo o seu namespace. Onde quebra: só os nomes de classe, de id e de `@keyframes` ganham escopo. A herança (cor, fonte) continua passando do pai para o filho, e um seletor de elemento, como `h2`, continua global.

## Como usar

1. Crie o arquivo com o final `.module.css`, ao lado do componente. No Navalha, cada componente de `web/src/site/` tem o seu: `PascalCase.tsx` com `PascalCase.module.css`.
2. Importe o objeto de classes: `import styles from "./ProfileCard.module.css"`.
3. Use a classe como propriedade do objeto: `className={styles.card}`.

O valor de `styles.card` é a string com o nome gerado, algo como `_card_fbjc3_1`. É esse nome que aparece no DevTools.

```tsx
import styles from "./ProfileCard.module.css";

type Props = { name: string; bio: string };

export function ProfileCard({ name, bio }: Props) {
  return (
    <article className={styles.card}>
      <h2 className={styles.name}>{name}</h2>
      <p className={styles.bio}>{bio}</p>
    </article>
  );
}
```

**Armadilhas**
- Nome de classe errado não dá erro de compilação, porque o tipo do Vite aceita qualquer nome. `styles.nmae` vale `undefined`, e o elemento fica sem classe. Confira no DevTools.
- Prefira camelCase no CSS (`.cardTitle`). Com hífen, você precisa de colchetes: `styles["card-title"]`.
- No JSX é `className`, não `class`.

## Várias classes e estados

O `className` recebe uma string só. Para aplicar duas classes, junte-as numa template string, separadas por espaço. Para uma classe condicional, use um ternário que devolve a classe ou `""`.

```tsx
import styles from "./FilterButton.module.css";

type Props = { label: string; isActive: boolean; onClick: () => void };

export function FilterButton({ label, isActive, onClick }: Props) {
  const className = `${styles.button} ${isActive ? styles.active : ""}`;
  return (
    <button className={className} aria-pressed={isActive} onClick={onClick}>
      {label}
    </button>
  );
}
```

Os estados do CSS, como `:hover` e `:focus-visible`, ficam no próprio módulo, do jeito de sempre: `.button:hover { … }`. O Vite troca só o nome da classe e mantém a pseudo-classe, que vira algo como `._button_fbjc3_1:hover`. O `aria-pressed` conta ao leitor de tela que o botão está ligado; a classe `active` só muda a aparência.

**Armadilhas**
- Com `+`, os nomes colam: `styles.button + styles.active` vira uma classe só. Use a template string, com o espaço.
- `${styles.nmae}` numa template string vira o texto `"undefined"`.

## Estilo global ou de módulo

**Global**, em `web/src/styles/` e importado uma vez no `main.tsx`: os tokens (`tokens.css`, no `:root`), o `reset.css` e o `base.css`, com os estilos de elemento que valem para a página toda, como `body`, `h1` e `a`.

**Módulo**, importado pelo componente: tudo o que é daquele componente, sempre por classe.

Na dúvida, pergunte: o estilo vale para todo elemento daquele tipo, em qualquer lugar? Então é global. Depende de onde o elemento está (este card, esta lista)? Então é do módulo.

```tsx
// main.tsx: o CSS global entra uma vez, na raiz do app
import "./styles/reset.css";
import "./styles/tokens.css";

// TaskList.tsx: o módulo entra só no componente que o usa
import styles from "./TaskList.module.css";
```

**Armadilhas**
- Seletor de elemento solto num módulo, como `h2 { … }`, continua global e pega todos os `h2` da página. No módulo, comece todo seletor por uma classe: `.list h2`.
- Importar um `.css` comum (sem `.module`) dentro de um componente não o torna local. Ele vale para a página inteira.
- `:global(.nome)` existe e desliga a troca de nome dentro do módulo. Evite: se você precisou dele, o estilo provavelmente é global e mora no `base.css`.

## Para ir além

- [vite.dev · CSS Modules](https://vite.dev/guide/features#css-modules)
- [vite.dev · CSS](https://vite.dev/guide/features#css) (como o Vite trata `@import` e `url()`)
