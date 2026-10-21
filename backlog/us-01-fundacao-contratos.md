# US-01 (Dia 01) — Fundação e Contratos Imutáveis

> **Fase 1: base** · ? 1h essencial / 2h com extras · Pré-requisito: nenhum

## História de Usuário

**Como** desenvolvedor backend iniciando no ecossistema React,  
**quero** dominar manipulação imutável de coleções em JavaScript/TypeScript e compreender como contratos estruturais se comportam frente ao C#,  
**para** evitar bugs de renderização no frontend e garantir consistência na troca de dados com a API .NET.

---

## Aquecimento (5 min, sem consultar)

Ainda não há dia anterior, então responda com o que você já sabe:

1. Em C#, como você descobre se um objeto mudou?
2. Em C#, o que acontece quando você altera um item de uma `List` que outra variável também referencia?
3. Onde roda o código de um app React: no servidor ou no navegador?

---

## Ponte com .NET

Veja as seções **Linguagem** e **Ferramentas** do [guia/ponte-dotnet.md](../guia/ponte-dotnet.md). Hoje importam quatro pontos:

- **LINQ ? métodos de array:** `Where` ? `filter`, `Select` ? `map`, `FirstOrDefault` ? `find`, `Any` ? `some`, `Sum` ? `reduce`.
- **`record` + `with` ? spread:** `{ ...s, status: 'concluida' }` cria uma cópia com um campo trocado. No backend, `SolicitacaoContratos.cs` usa `record` exatamente pelo mesmo princípio de imutabilidade.
- **Tipagem estrutural:** no TS vale o formato do objeto, não o nome do tipo (diferente da tipagem nominal do C#).
- **Onde quebra:** os tipos **somem em runtime** (type erasure), e os métodos de array executam na hora (não são preguiçosos/lazy como o `IEnumerable`).

---

## Decisão Arquitetural do Dia

**Pergunta:** mutar o objeto existente ou criar um novo objeto com a alteração?

| Opção | Custo | O que quebra |
|---|---|---|
| Mutar (`s.status = 'x'`, `lista.push(x)`) | Nenhum na hora | O React, o TanStack Query e o `memo` detectam mudança **por referência** (`Object.is`). Com mutação a referência não muda, então para eles "nada mudou" e a tela não atualiza. |
| Criar um novo com o que mudou e reaproveitar o resto (kata 7) | Uma cópia rasa em memória | Nada. Comparar referência é O(1), e comparar o conteúdo inteiro de objetos profundos seria inviável para performance de UI. |

**Recomendação:** trate imutabilidade como **contrato arquitetural**, não como preferência de estilo. Copie o que mudou e reaproveite a referência do que não mudou. É a mesma premissa dos `records` em C#.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Contratos de Referência (já na baseline)
- Em `api/Contratos/SolicitacaoContratos.cs`, os tipos imutáveis (`record Solicitacao`, `record CriarSolicitacaoRequest`, `enum StatusSolicitacao`) já existem na baseline do curso.
- Revisar essa modelagem e relacionar cada tipo com o que o frontend precisa: `status` como união de strings, `criadaEm` como string ISO e `observacao` como `string | null`.
- O dia 01 não muda a API: o front trabalha só com katas em `exercicios/`, sem chamada real.

### Frontend (`exercicios/`) — Katas de Imutabilidade e Tipagem Estrutural
- **Katas Essenciais:** Resolver katas 1 a 7 em `exercicios/js/katas.js` focando em `map`, `filter`, `reduce`, `find` e retorno de novos objetos preservando referências inalteradas.
- **TypeScript:** Rodar `npm run typecheck` e corrigir os 5 erros em `exercicios/ts-async/tipos.ts` sem utilizar `any`, `as` ou `@ts-ignore`.
- **Extra:** Resolver katas 8 a 10 de JS e as katas assíncronas 1 e 2 em `exercicios/ts-async/async.ts` (`response.ok` e `Promise.all`).

### Referências Técnicas
- Métodos de array: https://javascript.info/array-methods
- Destructuring: https://javascript.info/destructuring-assignment
- Spread e rest: https://javascript.info/rest-parameters-spread
- TypeScript for C#/Java Programmers: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html
- Everyday Types (union, opcional, type vs interface): https://www.typescriptlang.org/docs/handbook/2/everyday-types.html

---

## Critérios de Aceite (CA)

- [ ] **CA 1:** Todos os testes unitários das katas essenciais 1 a 7 em `exercicios/js/katas.js` executam com sucesso via `npm run test:js`.
- [ ] **CA 2:** A kata 7 preserva estritamente a mesma referência em memória (`===`) para itens que não sofreram alteração.
- [ ] **CA 3:** A validação estática de tipos `npm run typecheck` passa sem nenhum erro e sem calar o compilador com `any` ou type assertion `as`.
- [ ] **CA 4:** O aluno compreende por que `node ts-async/tipos.ts` executa mesmo contendo erros de tipo (apagamento de tipos em tempo de execução).

---

## Armadilhas Comuns

- **`reduce` sem valor inicial quebra em lista vazia.** Sempre passe o segundo argumento.
- **`sort()` muta o array original** e compara texto por padrão. Em JS moderno, prefira `toSorted()`.
- **`const` não congela o objeto.** `const lista = []; lista.push(1)` é permitido pela linguagem, mas quebra o ciclo reativo do React.
- **Arrow function com chaves precisa de `return`.** Para devolver um objeto literal direto, envolva em parênteses: `x => ({ id: x })`.
- **O `||` troca `0` e `''` pelo valor padrão, enquanto o `??` não.** Use `??` para valor nulo ou indefinido.

---

## Prompts Prontos

- "Traduza esta query LINQ para métodos de array em JS e explique a diferença de execução, preguiçosa vs. imediata: <cole>"
- "Explique a tipagem estrutural do TypeScript com um exemplo que compila em TS mas não compilaria em C#."
- `/dica kata 7, o teste "os outros são os mesmos objetos" falha`

---

## Pronto quando

- [ ] `npm run test:js` mostra as katas 1 a 7 verdes, e `npm run typecheck` não mostra erros.
- [ ] Você explica por que `node ts-async/tipos.ts` rodava mesmo com erros de tipo.
- [ ] Você explica por que a kata 7 mantém a referência dos itens que não mudaram, e por que o React se importa com isso.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-01.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-01): katas de js e ts"`.
3. Próximo: [Dia 02 — Componentes e props](us-02-listagem-componentizacao.md).
