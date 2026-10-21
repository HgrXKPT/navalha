# US-14 (Dia 14) — Controle de Concorrência Otimista com ETag e If-Match

> **Fase 5: integração avançada** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 13 (e o 409 tratado no dia 10)

## História de Usuário

**Como** atendente de suporte em um ambiente multiusuário,  
**quero** ser avisado quando outro colega já tiver alterado a solicitação que estou visualizando antes que eu envie uma atualização obsoleta,  
**para** evitar a sobreposição acidental de dados (lost update) e ter a oportunidade de recarregar as informações mais recentes daquele chamado.

---

## Aquecimento (5 min, sem consultar)

1. Qual é a diferença entre 401 e 403? (dia 12)
2. Em que nível de teste vai a maior parte do esforço? (dia 13)
3. Por que uma mutation não deve ter retry automático? (dia 10)

---

## Ponte com .NET

- **`[Timestamp] RowVersion` / `IsConcurrencyToken()` no EF Core ˜ Cabeçalho HTTP `ETag`.** Ambos representam a versão atômica do registro.
- **`DbUpdateConcurrencyException` no ASP.NET Core ˜ Resposta HTTP 412 (Precondition Failed) no frontend.**
- **Cabeçalho `If-Match: "7"` ˜ `"UPDATE Solicitacoes SET ... WHERE Id = @id AND RowVersion = @versaoOriginal"`**. Se a versão no banco mudou, zero linhas são afetadas e a exceção é lançada.
- **Onde quebra:** No EF Core, a concorrência é gerenciada no `SaveChanges()` da mesma requisição. No protocolo HTTP, **o frontend precisa reter a versão obtida no GET e propagá-la explicitamente no cabeçalho do PATCH**. Se a versão se perder no caminho, o controle de concorrência é violado.

---

## Decisão Arquitetural do Dia

**Pergunta 1:** qual estratégia utilizar para prevenção de concorrência de escrita?

| Abordagem | Funcionamento | Vantagens | Desvantagens |
|---|---|---|---|
| **Last-Write-Wins (Último a gravar vence)** | Nenhuma checagem | Complexidade zero | Sobrescreve alterações de colegas silenciosamente, gerando perda irrecuperável de histórico |
| **Versão em Payload JSON** | GET devolve `{ versao }` e PATCH envia `{ versao, status }` | Fácil de inspecionar no corpo | Mistura controle de infraestrutura com domínio de negócio e gera ambiguidade com erros 409 |
| **Padrão HTTP com ETag + `If-Match`** | GET devolve cabeçalho `ETag: "1"`. PATCH envia `If-Match: "1"`. Se divergir, API devolve **412**; se ausente, **428** | Padrão oficial da RFC HTTP; separa claramente conflito de concorrência (412) de regra de domínio (409) | Exige expor o cabeçalho no CORS caso as origens sejam distintas |

**Pergunta 2:** mutação otimista na UI ou aguardar confirmação do servidor?
- **Aguardar Confirmação do Servidor:** Recomendado para alterações com chance real de rejeição concorrente (412/409) ou com impacto financeiro/operacional relevante.
- **Mutação Otimista (com Rollback):** Indicado para operações quase 100% garantidas e com foco em percepção de agilidade imediata (ex.: marcar como lido, curtir).

**Recomendação:** implemente **ETag + `If-Match`** com espera de resposta do servidor na transição de status. Ao ocorrer um 412, **nunca sobrescreva automaticamente**; informe o conflito ao usuário e ofereça um botão de recarregar.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Versão e Cabeçalhos Condicionais HTTP
- Na API (`api/`):
  - Adicionar um controle de versão atômico para cada `Solicitacao` (propriedade interna `Versao: int`, incrementada a cada modificação).
  - No endpoint `GET /solicitacoes/{id}`: emitir o cabeçalho de resposta `ETag: "\"{solicitacao.Versao}\""`.
  - No endpoint `PATCH /solicitacoes/{id}/status`:
    - Validar a presença do cabeçalho de requisição `If-Match`. Se não fornecido, responder status **428 Precondition Required**.
    - Se a versão fornecida no `If-Match` for diferente da versão atual no servidor, responder status **412 Precondition Failed** com `ProblemDetails`.
    - Se for idêntica, atualizar o status, incrementar a versão e retornar a solicitação com o novo `ETag`.
- No mesmo dia o front propaga o `ETag` lido na listagem e trata 412/428 na transição de status.

### Frontend (`web/`) — Propagação do ETag e Tratamento de 412
- **Passo 1 — Extração do ETag no GET:** No cliente de API (`src/api/solicitacoes.ts`), extrair o cabeçalho `ETag` da resposta do `fetch` e retornar um objeto composto `{ dados: Solicitacao, etag: string }`.
- **Passo 2 — Envio do `If-Match` no PATCH:** Atualizar a função e a mutation de alteração de status para receber `{ id, novoStatus, etag }` e anexar o cabeçalho `If-Match: etag` na requisição.
- **Passo 3 — Simulação e Validação de Conflito Concorrente:**
  - Abrir o mesmo chamado em duas janelas do navegador (Aba A e Aba B).
  - Na Aba A, alterar o status da solicitação.
  - Na Aba B (que ainda retém a versão anterior), tentar alterar o status. Constatar na aba Network a recusa HTTP 412.
- **Passo 4 — Feedback Visual e Ação de Recarga:** Tratar o erro 412 renderizando a mensagem: *"Esta solicitação foi alterada por outro usuário"* acompanhada de um botão **Recarregar Dados**, que invalida a query e obtém o estado mais recente.
- **Passo 5 — ADR 14:** Registrar em `decisoes/14-concorrencia.md` as decisões de concorrência com ETag e a política de espera do servidor.

### Referências Técnicas
- MDN ETag: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag
- MDN If-Match: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/If-Match
- MDN 412 Precondition Failed: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/412
- MDN 428 Precondition Required: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/428
- Concorrência no Entity Framework Core: https://learn.microsoft.com/en-us/ef/core/saving/concurrency

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** O endpoint `GET /solicitacoes/{id}` inclui o cabeçalho de resposta `ETag` com o número da versão entre aspas.
- [ ] **CA 2 (BE):** O endpoint `PATCH /solicitacoes/{id}/status` responde 428 se o cabeçalho `If-Match` for omitido.
- [ ] **CA 3 (BE):** O endpoint `PATCH` responde 412 com `ProblemDetails` se o `If-Match` contiver versão divergente daquela em memória.
- [ ] **CA 4 (FE):** A query de detalhe armazena a `ETag` recebida e a repassa com fidelidade no cabeçalho `If-Match` da mutação.
- [ ] **CA 5 (FE):** Em um cenário de edição concorrente em abas paralelas, a segunda aba recebe 412 e exibe alerta amigável de conflito sem perda do aplicativo.
- [ ] **CA 6 (FE):** O botão "Recarregar Dados" invalida o cache da solicitação e reflete o status gravado pela outra aba sem necessidade de F5 manual na página inteira.
- [ ] **CA 7 (ADR):** O arquivo `decisoes/14-concorrencia.md` está formalizado detalhando a comparação entre ETag vs. JSON e a prevenção de lost updates.

---

## Armadilhas Comuns

- **Omitir aspas no ETag:** O protocolo HTTP exige que ETags contenham aspas (ex.: `"1"`, não `1`).
- **Não persistir a ETag com os dados no cache:** Se a ETag for perdida após um refetch de segundo plano, a mutation enviará um cabeçalho obsoleto gerando falsos positivos de 412.
- **Confundir 409 com 412:** 409 indica que a regra de negócio do domínio rejeitou a operação; 412 indica estritamente que a versão da pré-condição de concorrência falhou.

---

## Prompts Prontos

- "Explique lost update com um exemplo de dois atendentes e como o If-Match resolve. Compare com o RowVersion do EF Core."

---

## Pronto quando

- [ ] Com duas abas, a segunda alteração no mesmo item recebe 412, e a tela explica o conflito sem sobrescrever.
- [ ] Você explica 409 vs. 412 e por que o front precisa carregar a versão do GET até o PATCH.
- [ ] O ADR `decisoes/14-concorrencia.md` está registrado.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-14.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-14): controle de concorrência com etag"`.
3. Próximo: [Dia 15 — Tempo real com SignalR](us-15-tempo-real-signalr.md).
