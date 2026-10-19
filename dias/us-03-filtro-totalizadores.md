# US-03 (Dia 03) — Filtro por Status, Totalizadores e Transição de Conclusão

> **Fase 2: núcleo do React** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 02

## História de Usuário

**Como** atendente de suporte,  
**quero** filtrar os chamados pelo status, visualizar a contagem e a soma dos valores em aberto e concluir solicitações pendentes,  
**para** priorizar os atendimentos e atualizar o ciclo de vida dos chamados sem recarregar a tela.

---

## Aquecimento (5 min, sem consultar)

1. O componente filho pode alterar as props que recebeu? Nao, Prop vem do componente pai
2. Por que `key={index}` é problemático? (dia 2)
3. Como a kata `atualizarStatus` evitava mutação? (dia 1)

---

## Ponte com .NET

- **`useState` ˜ propriedade que dispara notificação reativa (`INotifyPropertyChanged`).** Invocar a função modificadora (`setX`) avisa o React que um novo render deve ser agendado.
- **Onde quebra 1: o estado é imutável.** Em C# você pode mutar um objeto existente na lista; no React, você **substitui** o objeto por uma nova instância clonada com as alterações.
- **Onde quebra 2: re-render é a execução completa da função.** Dentro do escopo da renderização atual, as variáveis de estado são **snapshots** estáticos (como parâmetros passados por valor em C#) que permanecem inalterados até o próximo ciclo.

---

## Decisão Arquitetural do Dia

**Pergunta:** este valor deve ser armazenado em estado (`useState`) ou calculado em tempo de renderização (derivado)?

Faça o teste das 3 perguntas do *Thinking in React*:
1. O valor permanece estático o tempo todo?
2. Ele é fornecido pelo componente pai através de props?
3. É possível computá-lo a partir de outros estados ou props já existentes?

Se responder "sim" a qualquer uma, **não é estado**.

| Dado no painel | Estado? | Justificativa |
|---|---|---|
| Lista de solicitações | Sim (temporariamente) | É alterada pela ação de concluir. (No dia 7 passará a ser gerenciada como cache do servidor). |
| Filtro selecionado | Sim | É mutável pelo clique do usuário e não pode ser derivado de outros dados. |
| Lista filtrada | **Não** | Calculada em tempo de render via `lista.filter(...)`. |
| Quantidade visível | **Não** | Derivado diretamente via `visiveis.length`. |
| Total monetário | **Não** | Derivado diretamente via `visiveis.reduce(...)`. |

**Recomendação:** mantenha o estado **mínimo e indispensável**. Derive todo o restante no corpo do render. Estado duplicado é a causa primária de dessincronização de telas em React.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Endpoint de Transição de Status
- Em `api/Program.cs`, implementar o endpoint `PATCH /solicitacoes/{id}/status` recebendo `AlterarStatusRequest`.
- Validar se a solicitação existe (retornar `Results.NotFound()` caso contrário).
- Permitir a transição do status `Aberta` para `Concluida`, atualizando a coleção em memória e retornando `Results.Ok(solicitacaoAtualizada)`.

### Frontend (`web/`) — Reatividade, Filtros e Conclusão sem Mutação
- **Passo 1 — Estado Reativo de Filtro:** Adicionar botões de filtro por status (`todas`, `aberta`, `em_analise`, `concluida`, `recusada`) e armazenar a seleção atual em `useState`.
- **Passo 2 — Dados Derivados:** Computar a lista filtrada, a quantidade de itens e o valor total acumulado no render, sem criar variáveis de estado redundantes.
- **Passo 3 — Estado como Snapshot:** Compreender o comportamento de atualizações em lote e entender por que `setCount(count + 1)` disparado 3 vezes consecutivas no mesmo evento resulta em incremento único.
- **Passo 4 — Ação de Conclusão Imutável:** Adicionar o botão "Concluir" para solicitações abertas, gerando um novo array imutável através de `.map()` e clonagem (`{ ...s, status: 'concluida' }`).

### Referências Técnicas
- State: A Component's Memory: https://react.dev/learn/state-a-components-memory
- Responding to Events: https://react.dev/learn/responding-to-events
- Render and Commit: https://react.dev/learn/render-and-commit
- State as a Snapshot: https://react.dev/learn/state-as-a-snapshot
- Updating Arrays in State: https://react.dev/learn/updating-arrays-in-state
- Conditional Rendering: https://react.dev/learn/conditional-rendering

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** O endpoint `PATCH /solicitacoes/{id}/status` atualiza o status de uma solicitação existente para `concluida` e retorna 404 para id inexistente.
- [ ] **CA 2 (FE):** A seleção de um filtro por status atualiza instantaneamente a lista exibida em tela.
- [ ] **CA 3 (FE):** Os totalizadores (contador de solicitações e valor total acumulado) atualizam dinamicamente com o filtro, sem uso de `useState` próprio.
- [ ] **CA 4 (FE):** O botão "Concluir" é renderizado condicionalmente apenas em itens com status `aberta`.
- [ ] **CA 5 (FE):** Ao clicar em "Concluir", a solicitação tem seu status alterado para `concluida`, o botão desaparece e os totalizadores são recalculados sem mutação do array original.
- [ ] **CA 6 (Conceitual):** O aluno sabe explicar o motivo pelo qual `setCount(count + 1)` executado 3 vezes no mesmo handler soma apenas 1.

---

## Armadilhas Comuns

- **Mutação direta:** Métodos que mutam arrays (`push`, `splice`, `s.status = ...`) não alteram a referência do objeto, impedindo o React de agendar novo render.
- **Leitura imediata de estado:** Após executar `setFiltro(novo)`, a variável `filtro` ainda reflete o valor antigo durante a execução do handler atual.
- **Passagem de handlers:** `onClick={handleClick}` vincula a referência da função; `onClick={handleClick()}` executa a função durante a renderização gerando loop infinito.

---

## Prompts Prontos

- "Explique 'state as a snapshot' do React com um exemplo, comparando com passar parâmetro por valor em C#."
- "Tenho estes estados no componente: <cole>. Algum deles é derivado? Me ajude a decidir, sem reescrever o código."
- `/dica o botão Concluir não atualiza a tela`

---

## Pronto quando

- [ ] Filtro, contador, total e Concluir funcionam, sem nenhuma mutação.
- [ ] Nenhum `useState` guarda algo que dá para calcular.
- [ ] Você explica por que `setCount(count + 1)` três vezes no mesmo clique soma só 1.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-03.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-03): estado e filtro"`.
3. Próximo: [Dia 04 — Onde vive cada estado](us-04-visao-detalhe-estado.md).
