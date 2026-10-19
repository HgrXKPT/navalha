# US-10 (Dia 10) — Resiliência, ProblemDetails e Isolamento de Falhas

> **Fase 4: qualidade de produção** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 09

## História de Usuário

**Como** atendente de suporte,  
**quero** que falhas inesperadas na API ou erros de renderização em componentes sejam contidos na região afetada com opções de tentar novamente,  
**para** não perder a aplicação inteira em uma tela branca e compreender com clareza o motivo de recusas do sistema.

---

## Aquecimento (5 min, sem consultar)

1. Quais validações ficam só no back? (dia 9)
2. Qual é a diferença de tratamento entre um 400 e um 409 no formulário? (dia 9)
3. Por que um id inexistente na URL não pode quebrar a tela? (dia 8)

---

## Ponte com .NET

- **Error Boundary ˜ Middleware global de tratamento de exceções (`UseExceptionHandler`)**, só que segmentado **por região da tela**. Ele intercepta exceções durante a fase de renderização do React e renderiza uma UI de fallback.
- **Onde quebra:** Error Boundary **não captura falhas assíncronas nem eventos de clique**. Exceções em `onClick` ou falhas em Promises devem ser tratadas em blocos `try/catch` ou no callback `onError` das mutations.
- **Políticas de retry do TanStack Query ˜ Polly no ecossistema .NET.** Por padrão, o TanStack tenta novamente 3 vezes com backoff exponencial.

---

## Decisão Arquitetural do Dia

**Pergunta 1:** em qual camada e como tratar cada tipo de falha HTTP?

| Código / Tipo | Cenário Típico | Nível de Tratamento | Comportamento Esperado |
|---|---|---|---|
| **400 (Bad Request)** | Validação de formato falhou | No campo afetado | Mapear mensagem para o input correspondente via `setError` |
| **409 (Conflict)** | Transição de status proibida | Próximo ao botão de ação | Exibir toast/alerta contextual sem derrubar o restante da tela |
| **404 (Not Found)** | Chamado inexistente ou excluído | Na rota específica | Exibir card de "Não Encontrado" com botão de navegação para a listagem |
| **401 (Unauthorized)** | Sessão expirou ou token ausente | Global no interceptor HTTP | Redirecionar usuário para a tela de login |
| **403 (Forbidden)** | Atendente tentando recusar chamado | Próximo à ação | Mensagem clara de permissão negada (sem deslogar o usuário) |
| **Rede / 5xx** | Servidor fora do ar | No contêiner de dados | Estado visual de erro com botão "Tentar Novamente" |
| **Bug de Renderização** | Exceção não tratada em componente | Error Boundary da região | UI de fallback com botão de recuperação e log de telemetria |

**Pergunta 2:** quando realizar novas tentativas (retries) automáticas?
- Em **consultas (Queries):** Sim para falhas de rede e erros 5xx (transitórios). **Nunca para erros 4xx** (tentar de novo um 404 ou 403 só gera atraso inútil).
- Em **comandos (Mutations):** **Não automático**. Sem cabeçalhos de idempotência no backend, repetir um POST às cegas pode gerar lançamentos duplicados no banco.

**A regra dos 4 estados fundamentais de tela:** toda visualização assíncrona deve prever **Carregando (loading)**, **Erro**, **Vazio (empty)** e **Com Dados**. *Vazio não é erro*: zero solicitações para um filtro é um retorno de sucesso.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Padronização de ProblemDetails e Rota de Teste de Falha
- Em `api/Program.cs`, garantir que todas as respostas de erro adotem o formato padrão RFC 9457 (`Results.Problem(...)`).
- Criar um endpoint de diagnóstico `GET /solicitacoes/falha-simulada` retornando `Results.Problem(statusCode: 500, detail: "Falha transitória simulada")` para testar os retries do cliente.

### Frontend (`web/`) — Resiliência, Retries Inteligentes e Error Boundary
- **Passo 1 — Classe de Erro HTTP Customizada:** Criar em `src/api/` a classe `class ErroHttp extends Error { status: number; body?: unknown; }` e lançá-la no `fetch` quando `!response.ok`.
- **Passo 2 — Política de Retry no QueryClient:** Configurar no `main.tsx` a regra do `QueryClient` para abortar tentativas adicionais quando `error.status >= 400 && error.status < 500`.
- **Passo 3 — Cobertura dos 4 Estados de Tela:** Garantir visualmente os estados de carregamento, erro, vazio e lista populada na tela principal.
- **Passo 4 — Error Boundary Regional:** Instalar `react-error-boundary` e proteger as rotas com `<ErrorBoundary FallbackComponent={...}>`, impedindo que uma falha no painel lateral desmonte a barra de navegação superior.
- **Passo 5 — ADR 10:** Registrar em `decisoes/10-tratamento-de-erros.md` a matriz de erros e a política de retry do projeto.

### Referências Técnicas
- Query Retries: https://tanstack.com/query/latest/docs/framework/react/guides/query-retries
- React Query Error Handling (TkDodo): https://tkdodo.eu/blog/react-query-error-handling
- Catching Rendering Errors with Error Boundaries: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
- react-error-boundary: https://github.com/bvaughn/react-error-boundary

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** O backend responde erros com o Content-Type `application/problem+json` seguindo a RFC 9457.
- [ ] **CA 2 (FE):** Ao receber status 404 em uma query, a aplicação não dispara novas tentativas de requisição (zero retries desnecessários).
- [ ] **CA 3 (FE):** A listagem diferencia com clareza visual uma resposta vazia ("Nenhuma solicitação encontrada") de uma indisponibilidade de rede ("Erro ao conectar com a API").
- [ ] **CA 4 (FE):** Uma exceção proposital disparada dentro de um componente filho é isolada pelo `ErrorBoundary`, renderizando o fallback apenas na área do componente com opção de reiniciar o estado.
- [ ] **CA 5 (FE):** Um erro 409 disparado ao tentar uma transição inválida no `PATCH` é exibido em um alerta próximo ao botão de ação sem desmontar a tela.
- [ ] **CA 6 (ADR):** O arquivo `decisoes/10-tratamento-de-erros.md` está registrado com a matriz completa de tratamento de códigos HTTP e estratégia de retry.

---

## Armadilhas Comuns

- **Error Boundary único na raiz:** Colocar um único Error Boundary na raiz da aplicação substitui o sistema inteiro por uma tela cinza por causa de um detalhe quebrado.
- **Exibir stack traces para o usuário final:** Mensagens de erro de infraestrutura cruas devem ir para logs; o usuário precisa de instruções de ação claras.
- **Repetir mutations automaticamente:** Pode causar efeitos colaterais graves (duplo débito ou duplicidade de chamados).

---

## Prompts Prontos

- "Monte comigo a tabela de 'onde tratar cada erro' para o meu painel: me pergunte caso a caso, sem preencher por mim."
- "Por que repetir automaticamente um POST é perigoso? Relacione com idempotência no backend."

---

## Pronto quando

- [ ] Lista e detalhe têm os 4 estados, e o vazio é diferente do erro.
- [ ] 4xx não sofre retry, e um erro de render derruba só a região, com opção de tentar de novo.
- [ ] O 409 aparece perto da ação, sem perder a tela.
- [ ] O ADR `decisoes/10-tratamento-de-erros.md` está registrado.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-10.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-10): erros e estados de tela"`.
3. Próximo: [Dia 11 — Página leve](us-11-otimizacao-bundle-performance.md).
