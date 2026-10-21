# US-06 (Dia 06) — Integração Fim a Fim e Contrato OpenAPI Tipado

> **Fase 3: fronteira com o back** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 05

## História de Usuário

**Como** desenvolvedor frontend consumindo uma API em evolução,  
**quero** que a listagem do painel seja carregada diretamente da API .NET com tipagem estrita gerada a partir do documento OpenAPI,  
**para** eliminar dados mockados do cliente e garantir que alterações contratuais no backend quebrem a compilação do TypeScript de forma previsível antes de subirem para produção.

---

## Aquecimento (5 min, sem consultar)

1. Em uma frase, quando usar `useEffect`? (dia 5)
2. Dados do servidor devem ir para `useState`? Por quê? (dia 4)
3. Por que os tipos do TS não validam o JSON em runtime? (dia 1)

---

## Ponte com .NET

- **`fetch` ˜ `HttpClient` em C#.** Atenção à diferença fundamental: o `fetch` **não lança exceção em códigos HTTP 404 ou 500**. Ele só rejeita a Promise em caso de falha física de rede.
- **`openapi-typescript` ˜ NSwag / OpenAPI Generator gerando contratos C#**, com uma particularidade: no frontend ele produz **apenas declarações de tipos (`.d.ts`)**, que desaparecem na compilação final.
- **CORS:** No servidor você configura as políticas permitidas; no navegador, é o **motor de segurança do browser que bloqueia** o JavaScript de ler a resposta caso o cabeçalho `Access-Control-Allow-Origin` não autorize a origem da aplicação.

---

## Decisão Arquitetural do Dia

**Pergunta 1:** escrever os contratos da API manualmente em TS ou gerá-los a partir da especificação OpenAPI do backend?

| Abordagem | Vantagens | Desvantagens |
|---|---|---|
| **Manual** (`src/tipos.ts`) | Setup inicial imediato sem dependência externa | Diverge silenciosamente quando o backend altera propriedades ou enums; falhas só aparecem em runtime |
| **Gerada** (`openapi-typescript` a partir de `/openapi/v1.json`) | Single Source of Truth: alterações na API quebram o `tsc` no frontend imediatamente | Exige que o backend mantenha uma documentação OpenAPI rigorosa e tipada |

**Pergunta 2:** no ambiente de desenvolvimento local, utilizar CORS ou Proxy reverso do Vite?

| Opção | Funcionamento | Cenário de Produção Equivalente |
|---|---|---|
| **CORS** | O frontend (`:5173`) requisita diretamente a API (`:5xxx`), que emite cabeçalhos liberando a origem | Frontend e Backend em domínios ou portas separadas |
| **Proxy do Vite** | O frontend chama caminhos relativos `/api/...` na mesma porta e o Vite redireciona para a API | Frontend e API unificados sob o mesmo domínio (Reverse Proxy ou BFF) |

**Recomendação:** gere sempre os tipos via OpenAPI quando o backend estiver sob seu controle. Para este dia, configure CORS na API para compreender o comportamento de bloqueio do navegador. No Dia 12 evoluiremos para o Proxy do Vite para simplificar autenticação por cookies.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Endpoints e Contrato OpenAPI Consolidado
- Configurar na API (`api/`):
  - Serialização JSON: `JsonNumberHandling.Strict`, propriedades em camelCase e serialização de enums em snake_case com `JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseLower)`.
  - CORS habilitado para a origem `http://localhost:5173`.
  - Especificação OpenAPI ativa (documento `/openapi/v1.json` exposto com schemas tipados para 200, 201, 400, 404 e 409).
- Consolidar as 4 rotas do domínio (via Controllers ou Minimal APIs à sua escolha):
  - `GET /solicitacoes?status=&busca=`
  - `GET /solicitacoes/{id}`
  - `POST /solicitacoes`
  - `PATCH /solicitacoes/{id}/status`
- Inicializar a coleção de solicitações com 40 registros (os 6 itens base, idênticos ao mock do front, mais 34 gerados).
- No mesmo dia o front passa a consumir a API real e a tipar o cliente com o OpenAPI gerado.

### Frontend (`web/`) — Geração de Tipos e Consumo HTTP
- **Passo 1 — Geração Contratual:** Executar `npx openapi-typescript http://localhost:<porta>/openapi/v1.json -o src/api/schema.d.ts` e criar aliases em `src/tipos.ts` apontando para os schemas gerados.
- **Passo 2 — Serviço de Integração:** Criar `src/api/solicitacoes.ts` contendo função de requisição com `fetch`, checando explicitamente `if (!response.ok) throw new Error(...)`.
- **Passo 3 — Tratamento de Estados no Consumo:** Substituir os dados estáticos do mock por chamada assíncrona da API, implementando visualmente os estados de **Carregando (loading)**, **Erro de comunicação** e **Visualização dos dados**.
- **Passo 4 — ADR 06:** Registrar em `decisoes/06-contrato-e-integracao.md` os critérios adotados para geração de tipos e comunicação entre origens.

### Referências Técnicas
- OpenAPI no ASP.NET Core: https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/aspnetcore-openapi
- openapi-typescript: https://openapi-ts.dev/introduction
- MDN Using the Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- Fetching Data with Effects: https://react.dev/learn/synchronizing-with-effects#fetching-data
- CORS no ASP.NET Core: https://learn.microsoft.com/en-us/aspnet/core/security/cors

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** O endpoint `/openapi/v1.json` expõe com precisão os schemas e contratos das 4 rotas da aplicação, tipando `id` estritamente como `number`.
- [ ] **CA 2 (BE):** A API responde às requisições com os cabeçalhos adequados de CORS para `http://localhost:5173`.
- [ ] **CA 3 (FE):** Os tipos do frontend são importados de `src/api/schema.d.ts`, assegurando que `Solicitacao['id']` seja `number` (não union com `string`).
- [ ] **CA 4 (FE):** A aplicação exibe feedback visual explícito durante o carregamento dos dados e uma mensagem de erro compreensível caso a API esteja indisponível.
- [ ] **CA 5 (FE):** A listagem renderiza os dados reais retornados pela API .NET.
- [ ] **CA 6 (ADR):** O arquivo `decisoes/06-contrato-e-integracao.md` está formalizado detalhando tipagem gerada vs. manual e CORS vs. Proxy.

---

## Armadilhas Comuns

- **`fetch` não lança exceção em 4xx/5xx:** Sempre valide `response.ok` antes de invocar `response.json()`.
- **CORS não afeta ferramentas de teste:** O fato de uma requisição responder no Postman, cURL ou Swagger UI não garante conformidade de CORS, pois o bloqueio é implementado exclusivamente pelo motor dos navegadores.
- **Ordem de middleware:** No ASP.NET Core, `app.UseCors()` deve ser invocado antes do mapeamento dos endpoints.
- **Tipos com union relaxada:** A falta de `JsonNumberHandling.Strict` no .NET 10 pode gerar tipos `number | string` indesejados no OpenAPI.

---

## Prompts Prontos

- "Explique CORS do ponto de vista do navegador: quem bloqueia, por que existe e o que é o preflight."
- "Como o openapi-typescript lida com enums gerados como snake_case pelo ASP.NET Core?"

---

## Pronto quando

- [ ] A lista vem da API, com carregando e erro visíveis. Para testar o erro, desligue a API.
- [ ] Os tipos vêm do OpenAPI, e o `id` é `number`, não `number | string`.
- [ ] Você explica por que o navegador bloqueou a chamada antes do CORS e por que o Postman não bloquearia.
- [ ] O ADR `decisoes/06-contrato-e-integracao.md` está registrado.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-06.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-06): api e contrato gerado"`.
3. Próximo: [Dia 07 — TanStack Query, filtro e paginação](us-07-paginacao-tanstack-query.md).
