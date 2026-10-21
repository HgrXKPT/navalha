# US-05 (Dia 05) — Indicador de Pendências na Aba, Busca e Custom Hooks

> **Fase 2: núcleo do React** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 04

## História de Usuário

**Como** atendente de suporte com múltiplas abas abertas no navegador,  
**quero** visualizar a contagem de chamados pendentes no título da aba do navegador e pesquisar solicitações pelo nome do cliente com filtros combinados,  
**para** ser alertado visualmente sobre demandas não resolvidas e encontrar rapidamente chamados específicos através de uma lógica reutilizável.

---

## Aquecimento (5 min, sem consultar)

1. Quais são as 4 perguntas para decidir onde vive um estado? (dia 4)
2. Por que guardar o id selecionado em vez do objeto? (dia 4)
3. O que dispara um re-render? (dia 3)

---

## Ponte com .NET

- **`useEffect` ˜ assinar e desassinar recursos externos não gerenciados (`+=` / `-=`)**, ou o ciclo de um `IHostedService` com `StartAsync` e `StopAsync`. O setup executa após o paint no navegador, e a função de cleanup executa antes da próxima execução ou quando o componente é desmontado.
- **Onde quebra:** `useEffect` **não** é um método de inicialização (`OnInit`). Se a operação não está sincronizando com uma API ou subsistema **externo ao React**, ela não deve residir em um efeito.
- **Custom Hook ˜ método utilitário encapsulado**, com a capacidade especial de compor estados (`useState`) e efeitos de ciclo de vida internamente.

---

## Decisão Arquitetural do Dia

**Pergunta:** esta computação deve ir no corpo da renderização, em um handler de eventos ou em um `useEffect`?

| Cenário | Onde colocar | Exemplo de Aplicação |
|---|---|---|
| Cálculo derivável de props ou de estado | **No render** (com `useMemo` apenas se comprovadamente caro) | Filtragem de listas, somatórios e agregações |
| Ação disparada diretamente por interação do usuário | **No handler de evento** | Submeter formulário, clique de concluir, redirecionamento após ação |
| Sincronização com sistema externo ao React | **`useEffect` com cleanup** | Atualizar `document.title`, timers (`setInterval`), WebSockets, integração com SDKs DOM |
| Sincronização de busca de dados remotos | **TanStack Query** (dia 7) | Dados remotos de API (no Dia 06 usaremos `useEffect` apenas para expor suas limitações) |
| Resetar estado interno quando prop muda | **Propriedade `key`** | Forçar remount de componente filho quando o id selecionado altera |

**Recomendação:** antes de redigir qualquer `useEffect`, pergunte-se: *"Com qual subsistema externo estou sincronizando?"*. Se não for um sistema externo (DOM global, conexões, eventos de janela), o efeito é desnecessário.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Suporte a Filtro por Termo de Busca
- Em `api/Program.cs`, enriquecer o endpoint `GET /solicitacoes` para aceitar parâmetros de query: `status` e `busca`.
- Filtrar os itens verificando se `string.IsNullOrWhiteSpace(busca)` ou se o nome do cliente contém o termo digitado (case-insensitive).
- O front do dia 05 segue no mock local: o filtro e a busca do indicador rodam sobre a lista que já está no estado do React.

### Frontend (`web/`) — Efeito de DOM, Eliminação de Efeitos e Custom Hook
- **Passo 1 — Efeito Legítimo de DOM:** Criar um `useEffect` que sincroniza o `document.title` com `"Painel (N abertas)"`, reagindo a alterações nas solicitações.
- **Passo 2 — Caça ao Efeito Redundante:** Evitar anti-pattern de calcular listas filtradas dentro de `useEffect` com `setVisiveis`. Garantir que o linter (`npm run lint`) passe limpo sem avisos de `set-state-in-effect` ou `exhaustive-deps`.
- **Passo 3 — Custom Hook Reutilizável:** Extrair a lógica de filtro e campo de busca para `src/hooks/useFiltroSolicitacoes.ts`. O hook deve encapsular os termos de busca, o status selecionado e expor a coleção filtrada pronta para consumo.
- **Passo 4 — Inspeção de Ciclo de Vida:** Utilizar o React DevTools Profiler para checar as renderizações decorrentes da extração do hook.

### Referências Técnicas
- Synchronizing with Effects: https://react.dev/learn/synchronizing-with-effects
- You Might Not Need an Effect: https://react.dev/learn/you-might-not-need-an-effect
- Reusing Logic with Custom Hooks: https://react.dev/learn/reusing-logic-with-custom-hooks
- React Developer Tools: https://react.dev/learn/react-developer-tools

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** O endpoint `GET /solicitacoes?busca=ana&status=aberta` filtra corretamente os registros combinando os parâmetros de busca.
- [ ] **CA 2 (FE):** O título da aba do navegador (`document.title`) reflete o número exato de solicitações com status `aberta` e atualiza reativamente ao concluir um chamado.
- [ ] **CA 3 (FE):** O código não utiliza `useEffect` para recalcular dados derivados e o comando `npm run lint` executa sem erros ou avisos de dependências exaustivas.
- [ ] **CA 4 (FE):** O hook `useFiltroSolicitacoes` está isolado em `src/hooks/`, é consumido pelo `App` e cumpre rigorosamente as Regras dos Hooks (Rules of Hooks).
- [ ] **CA 5 (Conceitual):** O aluno consegue explicar a finalidade do array de dependências e a função de limpeza (cleanup) do `useEffect`.

---

## Armadilhas Comuns

- **Mentir no array de dependências:** Omitir variáveis usadas no efeito para "evitar que rode de novo" resulta em valores defasados (stale closures).
- **`useEffect` + `setState` em dados calculáveis:** Desencadeia um ciclo adicional de renderização inútil e mantém a interface descompassada por um frame.
- **Execução duplicada em desenvolvimento:** O `StrictMode` propositalmente monta, desmonta e remonta efeitos para garantir que a função de cleanup desfaça completamente assinaturas ativas.
- **Invocação condicional:** Hooks nunca podem ser posicionados dentro de blocos `if`, loops ou após `return`.

---

## Prompts Prontos

- "Este useEffect é necessário? <cole>. Responda com base em 'You Might Not Need an Effect' e me explique o critério, sem reescrever o código."
- "Explique o setup e o cleanup do useEffect comparando com assinar e desassinar eventos em C#."

---

## Pronto quando

- [ ] O `useFiltroSolicitacoes` está extraído e em uso, e o `document.title` é atualizado por um efeito.
- [ ] O `npm run lint` não acusa `set-state-in-effect` nem `exhaustive-deps`.
- [ ] Você diz em uma frase quando usar `useEffect` e dá 2 exemplos de quando **não** usar.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-05.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-05): efeitos e custom hook"`.
3. Próximo: [Dia 06 — API .NET e contrato](us-06-integracao-openapi-tipado.md).
