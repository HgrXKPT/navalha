# US-04 (Dia 04) — Visão de Detalhe e Arquitetura de Onde Vive o Estado

> **Fase 2: núcleo do React** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 03

## História de Usuário

**Como** atendente de suporte,  
**quero** selecionar uma solicitação na lista e visualizar os detalhes completos do chamado em um painel lateral,  
**para** consultar informações aprofundadas como data de criação e observações sem perder o contexto da listagem.

---

## Aquecimento (5 min, sem consultar)

1. Quais são as 3 perguntas para saber se algo é estado? (dia 3)
2. Por que `setCount(count + 1)` três vezes soma só 1? (dia 3)
3. O que é um componente puro? (dia 2)

---

## Ponte com .NET

- **No backend, o estado vive no banco de dados e cada requisição HTTP é stateless.** No frontend, a interface é **stateful e de longa duração**. O mesmo dado pode coexistir no servidor, no cache de rede, na rota e em componentes.
- **Levantar o estado (Lifting State Up) ˜ mover a responsabilidade para o serviço/classe ancestral comum**, evitando acoplamento direto entre dois consumidores independentes.
- **Componente de apresentação puro ˜ Partial View ou ViewModel somente leitura.**

---

## Decisão Arquitetural do Dia

**Pergunta:** onde deve residir cada tipo de estado da aplicação?

| Tipo de estado | Exemplo no painel | Onde vive | Abordagem / Ferramenta |
|---|---|---|---|
| **Dado do servidor** | Lista de solicitações e dados do chamado | Cache cliente de servidor | TanStack Query (dia 7) |
| **Estado de URL** | Filtro de status, termo de busca, página | Parâmetros de rota e query string | React Router (dia 8) |
| **Estado de formulário** | Valores digitados na nova solicitação | Gerenciador de formulário | react-hook-form (dia 9) |
| **UI local** | Menu colapsável, aba ativa | Componente isolado | `useState` |
| **UI compartilhada** | Id da solicitação selecionada para detalhe | Ancestral comum mais próximo | `useState` no pai + props |
| **Global de aplicação** | Sessão de usuário autenticado, tema | Topo da árvore de componentes | Context API / Dado do servidor (`/me`, dia 12) |
| **Persistido local** | Preferências visuais salvas | Armazenamento do navegador | `localStorage` + hook customizado |

Matriz de 4 perguntas para classificar o estado:
1. Quais componentes precisam ler essa informação?
2. Quais componentes disparam alterações sobre ela?
3. O estado precisa sobreviver ao recarregamento (F5) ou ser compartilhado por link? (Se sim, pertence à URL).
4. A fonte primária da verdade pertence ao banco de dados? (Se sim, é dado de servidor, não `useState`).

**Recomendação:** mantenha o estado o mais **local** possível. Suba o estado apenas quando dois ou mais componentes irmãos precisarem do dado. Registre essa taxonomia no ADR do dia.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Endpoint de Detalhe da Solicitação
- Em `api/Program.cs`, mapear `GET /solicitacoes/{id:int}` utilizando `TypedResults`.
- Buscar o registro na lista em memória: se encontrado, retornar `TypedResults.Ok(solicitacao)`; caso contrário, retornar `TypedResults.NotFound()`.

### Frontend (`web/`) — Elevação de Estado e Componente de Detalhe
- **Passo 1 — Modelagem da Árvore de Componentes:** Definir a hierarquia `App` ? `FiltroStatus`, `ListaSolicitacoes` ? `ItemSolicitacao`, e `DetalheSolicitacao`.
- **Passo 2 — Extração e Lifting State Up:** Mover componentes para `src/componentes/`. Deixar `FiltroStatus` e `ItemSolicitacao` sem `useState` próprio, recebendo dados e callbacks por props.
- **Passo 3 — Detalhe por Identificador:** Armazenar no `App` apenas o `idSelecionado: number | null` (nunca o objeto completo). No render, derivar a solicitação ativa via `lista.find(s => s.id === idSelecionado)`.
- **Passo 4 — ADR 04:** Criar o arquivo `decisoes/04-onde-vive-cada-estado.md` mapeando a classificação dos estados do projeto conforme a decisão arquitetural.

### Referências Técnicas
- Thinking in React: https://react.dev/learn/thinking-in-react
- Sharing State Between Components: https://react.dev/learn/sharing-state-between-components
- Choosing the State Structure: https://react.dev/learn/choosing-the-state-structure
- Preserving and Resetting State: https://react.dev/learn/preserving-and-resetting-state

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** O endpoint `GET /solicitacoes/{id}` responde 200 com a solicitação para ids existentes e 404 para ids não cadastrados.
- [ ] **CA 2 (FE):** Clicar em um item da lista exibe os detalhes completos (incluindo observação e data de criação) no componente `DetalheSolicitacao`.
- [ ] **CA 3 (FE):** O componente pai armazena exclusivamente o identificador numérico (`idSelecionado`), sem duplicar o objeto completo em memória.
- [ ] **CA 4 (FE):** Ao concluir uma solicitação que está aberta no painel de detalhes, o detalhe reflete o novo status (`concluida`) imediatamente sem inconsistência.
- [ ] **CA 5 (FE):** Componentes de apresentação (`ItemSolicitacao`, `FiltroStatus`, `DetalheSolicitacao`) são livres de `useState` interno desnecessário.
- [ ] **CA 6 (ADR):** O arquivo `decisoes/04-onde-vive-cada-estado.md` está registrado com justificativas claras, opções avaliadas e critérios de revisão.

---

## Armadilhas Comuns

- **Duplicação de objeto em estado:** Guardar o objeto inteiro selecionado no estado faz com que alterações na listagem (ex.: Concluir) deixem o painel de detalhes desatualizado.
- **Lifting prematuro:** Subir estado globalmente sem necessidade provoca renderizações supérfluas em cascata por toda a árvore da aplicação.
- **Inversão de controle:** Componentes filhos devem notificar eventos (`onSelecionar(id)`, `onConcluir(id)`), cabendo ao componente pai decidir o que executar.

---

## Prompts Prontos

- "Revise a classificação de estados do meu ADR: <cole>. Algum está no lugar errado? Me dê o critério, não a resposta pronta."
- "Explique 'lifting state up' comparando com algum padrão de backend. Onde a analogia quebra?"

---

## Pronto quando

- [ ] Lista, filtro e detalhe estão em componentes separados, e os de apresentação não têm `useState`.
- [ ] O item selecionado é guardado como `id`.
- [ ] O ADR `decisoes/04-onde-vive-cada-estado.md` classifica cada estado do painel com o seu porquê.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-04.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-04): componentes e estado no lugar certo"`.
3. Próximo: [Dia 05 — Efeitos e hooks próprios](us-05-indicador-aba-custom-hooks.md).
