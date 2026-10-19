# US-15 (Dia 15) — Sincronização em Tempo Real entre Atendentes com SignalR

> **Fase 5: integração avançada** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 14 (e o login por cookie do dia 12 funcionando)

## História de Usuário

**Como** atendente de suporte em um ambiente colaborativo,  
**quero** que a listagem e os detalhes de chamados sejam atualizados automaticamente no momento exato em que outro usuário conclui ou abre uma solicitação,  
**para** visualizar sempre os dados em tempo real sem precisar teclar F5 e diminuir drasticamente a probabilidade de conflitos de concorrência 412.

---

## Aquecimento (5 min, sem consultar)

1. Qual é a diferença entre 409 e 412? (dia 14)
2. Por que a ETag precisa viajar junto com o dado no cache? (dia 14)
3. Em uma frase, quando usar `useEffect`? (dia 5)

---

## Ponte com .NET

- **SignalR Hub no ASP.NET Core (`IHubContext<T>`):** Você dispara notificações em broadcast para os clientes conectados a partir de qualquer endpoint após a persistência bem-sucedida.
- **Cliente JavaScript (`@microsoft/signalr`) é um subsistema externo:** Por manter uma conexão de socket contínua durante a sessão, seu ciclo de vida no React deve residir obrigatoriamente dentro de um `useEffect` dotado de função de limpeza (`connection.stop()`).
- **Onde quebra:** No backend, as chamadas a controllers são pontuais e efêmeras. No frontend, o socket permanece aberto indefinidamente; se a rede oscilar, a conexão cai, reconecta e **todos os eventos emitidos durante a queda são perdidos**. A aplicação deve tratar explicitamente a reconexão.

---

## Decisão Arquitetural do Dia

**Pergunta 1:** qual tecnologia adotar para comunicação reativa com o cliente?

| Tecnologia | Como opera | Vantagens | Desvantagens | Quando Escolher |
|---|---|---|---|---|
| **Short/Long Polling** (`refetchInterval`) | O frontend dispara requisições HTTP a cada N segundos | Zero infraestrutura adicional | Sobrecarga constante de rede; atraso proporcional ao intervalo de poll | Poucos clientes onde delay de 30s é irrelevante |
| **Server-Sent Events (SSE)** | Fluxo HTTP unidirecional (Servidor ? Cliente) | Leve e com reconexão nativa do navegador | Apenas unidirecional; suporte legado limitado | Feeds de notícias, logs e notificações passivas |
| **ASP.NET Core SignalR** (WebSockets) | Canal bidirecional persistente full-duplex com fallback | Integração nativa com o backend .NET, grupos e autorização | Requer backplane (Redis / Azure SignalR) ao escalar instâncias | Aplicações colaborativas e painéis corporativos dinâmicos |

**Pergunta 2:** o que o evento de tempo real deve carregar em seu payload?
- **O Payload Completo do Objeto:** Elimina uma requisição HTTP subsequente, mas **duplica lógica de autorização e serialização** e cria risco de vazamento de dados para perfis não autorizados que interceptem o WebSocket.
- **Apenas Sinalizador de Invalidação (`{ id }`):** A mensagem avisa: *"A solicitação 42 foi alterada"*. O frontend recebe o sinal e delega ao TanStack Query a decisão de revalidar via REST as queries que estiverem ativas na tela.

**Recomendação:** utilize **SignalR com sinalização leve de invalidação**. Trate a reconexão (`onreconnected`) invalidando todas as consultas ativas para recuperar o estado atualizado do banco.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Hub SignalR e Disparo de Eventos
- Em `api/Program.cs`:
  - Registrar SignalR: `builder.Services.AddSignalR()`.
  - Criar e mapear a classe `SolicitacoesHub : Hub` na rota `/hubs/solicitacoes`, exigindo autenticação (`RequireAuthorization()`).
  - No `POST /solicitacoes` e no `PATCH /solicitacoes/{id}/status`: injetar `IHubContext<SolicitacoesHub>` e, após persistir, disparar em broadcast para todos os conectados:
    ```csharp
    await hubContext.Clients.All.SendAsync("SolicitacaoAlterada", new { id = solicitacao.Id });
    ```
  - *Nunca enviar a entidade inteira pelo canal do WebSocket.*

### Frontend (`web/`) — Conexão Reativa e Invalidação de Cache
- **Passo 1 — Proxy de WebSockets no Vite:** Em `vite.config.ts`, configurar a rota `/hubs/solicitacoes` com a flag `ws: true` para que o proxy repasse o handshake do WebSocket.
- **Passo 2 — Custom Hook de Conexão:** Instalar `@microsoft/signalr` e implementar o hook `src/hooks/useAtualizacoesAoVivo.ts`:
  - Instanciar a conexão com `HubConnectionBuilder.withUrl('/hubs/solicitacoes').withAutomaticReconnect().build()`.
  - No `useEffect`, iniciar a conexão (`connection.start()`).
  - Escutar o evento `SolicitacaoAlterada` com payload `{ id: number }`:
    - Invalidar `['solicitacoes']` (atualiza listagem).
    - Invalidar `['solicitacao', id]` (atualiza detalhes se abertos).
  - Configurar `connection.onreconnected(() => queryClient.invalidateQueries({ queryKey: ['solicitacoes'] }))`.
  - No retorno de cleanup do efeito, invocar obrigatoriamente `connection.stop()`.
- **Passo 3 — Ativação Global:** Invocar `useAtualizacoesAoVivo()` uma única vez próximo à raiz da árvore autenticada.
- **Passo 4 — Validação em Múltiplos Navegadores:** Abrir a aplicação em dois navegadores logados (ex.: Ana e Carlos). Concluir uma solicitação em um navegador e constatar a atualização imediata no outro sem recarregar a página.
- **Passo 5 — ADR 15:** Registrar em `decisoes/15-tempo-real.md` a decisão por SignalR com payload mínimo de invalidação.

### Referências Técnicas
- Autenticação e Autorização no SignalR: https://learn.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz
- Segurança no SignalR (CORS e Origem): https://learn.microsoft.com/en-us/aspnet/core/signalr/security
- Cliente JavaScript do SignalR: https://learn.microsoft.com/en-us/aspnet/core/signalr/javascript-client
- Using WebSockets with React Query (TkDodo): https://tkdodo.eu/blog/using-web-sockets-with-react-query

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** O hub `/hubs/solicitacoes` exige sessão autenticada e aceita conexões WebSockets com credenciais.
- [ ] **CA 2 (BE):** Alterações de status e novas solicitações emitem o evento `SolicitacaoAlterada` contendo estritamente `{ id }`.
- [ ] **CA 3 (FE):** A aba Network (com filtro WS) exibe uma única conexão de WebSocket ativa e estável.
- [ ] **CA 4 (FE):** A conexão é encerrada de forma limpa (`connection.stop()`) caso o componente raiz seja desmontado.
- [ ] **CA 5 (FE):** Ao alterar uma solicitação na janela A, a janela B reflete a atualização do status em tempo real sem intervenção do usuário.
- [ ] **CA 6 (FE):** Caso o servidor seja reiniciado temporariamente, a reconexão automática (`onreconnected`) dispara a revalidação global das queries pendentes.
- [ ] **CA 7 (ADR):** O arquivo `decisoes/15-tempo-real.md` está formalizado justificando a escolha de SignalR versus Polling e SSE.

---

## Armadilhas Comuns

- **Cleanup ausente em `useEffect`:** Em desenvolvimento com `StrictMode`, o efeito roda duas vezes; sem `connection.stop()`, duas conexões permanentes de WebSocket são abertas e cada evento será processado em duplicidade.
- **Instanciar a conexão dentro de componentes de apresentação:** Faz com que um novo socket seja aberto a cada renderização da lista.
- **Negligenciar o `onreconnected`:** Se a internet oscilar e restabelecer, a tela exibirá dados velhos até que o usuário manualmente tecle F5.

---

## Prompts Prontos

- "Compare polling, SSE e SignalR para um painel interno com 20 atendentes. Me dê os critérios, sem decidir por mim."

---

## Pronto quando

- [ ] Com duas abas, uma mudança numa aparece na outra sem F5, por invalidação.
- [ ] Depois de uma reconexão a lista é invalidada, e na aba Network (filtro WS) existe uma conexão só.
- [ ] Você explica polling vs. SSE vs. SignalR, e por que o evento leva só o id.
- [ ] O ADR `decisoes/15-tempo-real.md` está registrado.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-15.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-15): atualização em tempo real com signalr"`.
3. Próximo: [Dia 16 — Deploy e mesma origem](us-16-hospedagem-unificada-cache.md).
