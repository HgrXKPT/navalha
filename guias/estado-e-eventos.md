# Estado e eventos
> Para: T-007, T-013 · Leitura: ~6 min

## Estado com useState

Um componente é uma função que o React chama a cada render. A cada chamada, as variáveis locais nascem de novo: um valor guardado numa variável comum volta ao valor inicial no render seguinte, e mudar essa variável não atualiza a tela. Para um valor sobreviver entre renders, use estado:

```tsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0); // 0 é o valor inicial

  function handleClick() {
    setCount(count + 1); // agenda um novo render com count + 1
    console.log(count); // ainda o valor antigo: count é o retrato deste render
  }

  return <button onClick={handleClick}>Cliques: {count}</button>;
}
```

- O `useState` devolve o valor atual e a função `set`.
- O `set` não muda a variável na hora: ele **agenda um novo render**. O novo valor só existe na próxima chamada do componente.
- Vai mudar o mesmo estado duas vezes no mesmo clique? Passe uma função: `setCount((c) => c + 1)`. Ela recebe o valor mais novo.

**Armadilhas**

- `useState([])` vira `never[]` no TypeScript, e nada cabe nele. Diga o tipo: `useState<Todo[]>([])`.
- Hook só no topo do componente, nunca dentro de `if`, de loop ou de função interna. O oxlint reprova com a regra `react-hooks(rules-of-hooks)`.
- Não guarde em estado o que dá para calcular a partir de outro estado ou das props. Calcule no render.

**Ponte com C#:** lembra uma propriedade com `INotifyPropertyChanged`: o valor muda e a tela acompanha. Onde quebra: no WPF, você altera a propriedade, e o binding atualiza só o controle ligado a ela. No React, você não altera nada: chama o `set`, e o React roda o componente inteiro de novo (e os filhos dele), compara o resultado e muda na tela só a diferença.

## Eventos

- Eventos são props em camelCase: `onClick`, `onChange`, `onSubmit`, `onKeyDown`.
- **Passe a função, não a chame:** `onClick={handleClick}`. Com `onClick={handleClick()}`, a função roda durante o render; se ela chama um `set`, o React entra em loop e mostra o erro `Too many re-renders`.
- Precisa de um argumento? Embrulhe numa arrow function: `onClick={() => onRemove(todo.id)}`.
- O handler recebe o evento. O `e.preventDefault()` cancela a ação padrão do navegador, como seguir um link ou enviar um formulário.
- Quem tem o estado é quem muda o estado. O filho só avisa, chamando uma função que recebeu por prop:

```tsx
type Todo = { id: number; title: string };
type Props = { todos: Todo[]; onRemove: (id: number) => void };

export function TodoList({ todos, onRemove }: Props) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.title}
          <button type="button" onClick={() => onRemove(todo.id)}>Remover</button>
        </li>
      ))}
    </ul>
  );
}
```

**Armadilhas**

- Para tipar o evento num handler separado, passe o mouse sobre o `onClick` no VS Code: ele mostra o tipo (`MouseEventHandler<HTMLButtonElement>`), e o evento é um `MouseEvent<HTMLButtonElement>`. Importe com `import type { MouseEvent } from "react"`: o projeto usa `verbatimModuleSyntax`, e importar tipo sem o `type` dá o erro TS1484.

**Ponte com C#:** lembra assinar um evento (`button.Click += Handler`). Onde quebra: você não assina nem desassina; passa a função como prop, e o React cuida do resto. Não existe `sender`: o elemento do handler é o `e.currentTarget`. E cada prop aceita uma função só.

## Renderização condicional

Dentro das chaves do JSX só cabe expressão, e não `if`. Há três formas de mostrar ou não um trecho:

```tsx
type Todo = { id: number; title: string; done: boolean };

export function Summary({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) return <p>Nada por aqui.</p>; // 1. retorno antecipado

  const pending = todos.filter((todo) => !todo.done).length;

  return (
    <p>
      {pending > 0 ? `${pending} pendentes` : "Tudo feito"} {/* 2. ternário: um ou outro */}
      {pending > 5 && <strong> Atenção!</strong>} {/* 3. &&: mostra ou nada */}
    </p>
  );
}
```

- `cond && <X />` desenha o `<X />` quando `cond` é verdadeiro, e nada quando é falso.
- `cond ? <A /> : <B />` desenha um ou outro.
- `null` não desenha nada: `return null` esconde o componente inteiro.

**Armadilhas**

- **O `0 &&`:** o `&&` devolve o valor da esquerda quando ele é falsy. `false`, `null` e `undefined` não aparecem na tela, mas o `0` aparece. Com a lista vazia, `{todos.length && <List />}` mostra um `0` solto. Escreva `{todos.length > 0 && <List />}`.
- Renderizar condicionalmente tira o elemento do DOM, e o estado dos componentes de dentro se perde junto. Esconder com CSS ou com o atributo `hidden` mantém o elemento na página, só invisível.

**Ponte com C#:** é o `@if` do Razor. Onde quebra: no meio do JSX não cabe `if`. O `if` fica antes do `return`, e dentro do JSX entram o ternário e o `&&`.

## Por que não mutar

O React decide se renderiza de novo comparando o estado novo com o antigo por `Object.is`. Para objeto e array, isso compara a **referência**, e não o conteúdo. Se você muta o array e passa o mesmo array para o `set`, a referência não mudou, e o React ignora a atualização.

```tsx
// dentro do componente
const [todos, setTodos] = useState<Todo[]>([]);

// Errado: muda o array existente e passa a mesma referência
todos.push(newTodo);
setTodos(todos); // o React vê o mesmo array e não renderiza

// Certo: cada mudança cria um array novo
setTodos([...todos, newTodo]); // adicionar
setTodos(todos.filter((t) => t.id !== id)); // remover
setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))); // trocar um
```

- **Array:** `[...arr, item]` adiciona, `filter` remove e `map` troca um item. `push`, `splice`, `sort` e `reverse` mutam o original; prefira `toSpliced`, `toSorted` e `toReversed`, que devolvem uma cópia.
- **Objeto:** `{ ...obj, field: value }` copia e troca um campo. O spread copia só o primeiro nível: objeto dentro de objeto precisa de spread também.

**Armadilhas**

- Mutar e ver a tela mudar porque outro estado mudou junto esconde o bug. A próxima mudança isolada não vai aparecer.
- `const` não é `readonly`: `const todos` impede reatribuir, mas não impede `todos.push`. Para o TypeScript barrar a mutação, tipe como `readonly Todo[]`, parecido com o `IReadOnlyList<T>`.

**Ponte com C#:** o `Object.is` com objeto funciona como o `ReferenceEquals`: só dá igual se for a mesma instância. O spread lembra o `record` com `with`: cria uma cópia com um campo trocado, e as duas cópias são rasas. Onde quebra: o `record` compara por valor, e o React não. Um objeto novo com os mesmos dados conta como diferente e renderiza de novo; o mesmo objeto mutado conta como igual e não renderiza.

## Para ir além

- [react.dev · State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [react.dev · Responding to Events](https://react.dev/learn/responding-to-events)
- [react.dev · Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)
