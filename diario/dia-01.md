# Dia 01 — JS/TS que o React usa

- **Data:** 2026-09-30
- **Tempo:** 1h
- **Confiança (1–5):** 3,5

## Em uma frase, o que aprendi hoje

O início da lógica em JS: a semelhança com LINQ e a criação de tipos.

## Explicando para um colega de backend

<!-- O conceito central do dia, nas suas palavras e sem consultar. -->

O conceito central do dia 01 foi o início da lógica em JS. Entendo a semelhança com LINQ e a criação de tipos.

**Por que `node ts-async/tipos.ts` rodava com erros de tipo:** não tenho certeza, porém vejo que o TS não tem um runtime igual ao do C#, ou seja, as validações só são feitas quando chama, ou pode ser pelo `undefined`.

**Por que a kata 7 mantém a referência dos itens que não mudaram:** porque o React trabalha com estados e renderiza a tela de acordo com o que tem. Eu entendo que a geração de uma nova lista... não sei, na verdade.

### Correção da IA

<!-- Preenchida no /fechar-dia: o que está certo, o que falta e o que está errado. -->

**Conceito central**

- **Certo:** a ponte com o LINQ existe e você vai usá-la todo dia: `filter` ↔ `Where`, `map` ↔ `Select`, `find` ↔ `FirstOrDefault`, `some` ↔ `Any` e `reduce` ↔ `Sum`/`Aggregate`.
- **Falta:**
  - Onde a analogia quebra: os métodos de array executam na hora e devolvem um array novo. Eles não são preguiçosos como o `IEnumerable`.
  - A decisão do dia, que era o centro: mutar o objeto ou criar um novo. A resposta é tratar a imutabilidade como contrato.
  - Sobre tipos: o TS é estrutural (vale o formato do objeto, não o nome do tipo), e os tipos somem em runtime.
- **Errado:** nada está errado. Mas "início da lógica" e "criação de tipos" são genéricos demais para um colega sair sabendo algo novo.

**Por que o `tipos.ts` rodava**

- **Certo:** a intuição de que "o TS não tem um runtime igual ao do C#" vai na direção certa.
- **Errado:**
  - "As validações só são feitas quando chama": não existe validação de tipo em runtime em nenhum momento.
  - O `undefined` não tem relação com isso.
- **O que acontece:** o Node 24 roda o `.ts` **apagando** as anotações de tipo (*type stripping*) e executa o JS que sobra, sem checar nada. Quem checa os tipos é o `tsc` (`npm run typecheck`), e esse é um passo separado, que você precisa rodar.
- **Onde a analogia quebra:** em C# não dá para rodar sem passar pelo compilador. E um cast inválido estoura `InvalidCastException`, porque o CLR conhece os tipos em runtime. Em TS ninguém confere nada em runtime: um dado da API tipado como `Solicitacao` pode chegar em qualquer formato. É isso que o zod resolve no dia 9.

**Por que a kata 7 mantém as referências**

- **Certo:** o React desenha a tela a partir do estado.
- **Falta, e é o ponto principal:** como o React descobre que o estado mudou. Ele não compara o conteúdo, compara a **referência** com `Object.is` (pense em `ReferenceEquals`).
  - Se você muta (`s.status = 'concluida'`), a referência continua a mesma. Para o React nada mudou, então a tela não atualiza.
  - Se você copia todos os itens, todos parecem ter mudado. O React e o `memo` refazem o trabalho até nos itens que estavam iguais.
  - Se você copia só o item alterado e reaproveita os outros, uma comparação de referência, que é O(1), mostra exatamente qual item mudou.
- **Onde a analogia com `record` quebra:** em C#, o `record` tem igualdade por **valor**, porque o `Equals` compara os campos. O React ignora isso: dois objetos com o mesmo conteúdo, mas em instâncias diferentes, contam como "mudou".
- Isso volta na prática no dia 3, com o botão **Concluir** sem mutação.

## Onde travei e como saí

Kata 7.

## Dúvida em aberto

Kata 7: por que manter a referência dos itens que não mudaram, e por que o React se importa com isso.

## Erros do quiz

<!-- Formato: conceito, o que eu achava, o que é de verdade. Os mais importantes vão para "Conceitos que errei" no PROGRESSO. -->
