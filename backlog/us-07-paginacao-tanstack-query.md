# US-07 (Dia 07) — Paginação Server-Side e Cache com TanStack Query

> **Fase 3: fronteira com o back** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 06

## História de Usuário

**Como** atendente de suporte operando um sistema com dezenas de solicitações,  
**quero** navegar por páginas de resultados paginados no servidor com cache automático e transições sem tela piscando,  
**para** consultar volumes crescentes de chamados sem degradação de tráfego de rede e atualizar dados em background após concluir ações.

---

## Aquecimento (5 min, sem consultar)

1. Tipos à mão ou gerados do OpenAPI: qual foi o seu critério? (dia 6)
2. Quem aplica o CORS: o navegador ou o servidor? (dia 6)
3. O que acontece se você não checar o `response.ok`? (dia 6)

---

## Ponte com .NET

- **TanStack Query ˜ repositório cliente com `IMemoryCache` integrado + retries + invalidação de cache.** Ele trata estados assíncronos remotos que você normalmente orquestraria manualmente.
- **Query Key ˜ chave de cache composto.** Se uma consulta depende de parâmetros (`status`, `busca`, `pagina`), todos eles devem compor a chave para evitar colisões ou leituras estagnadas.
- **Mutation ˜ Command no padrão CQS/CQRS.** Após a execução do comando (POST/PATCH), você invalida as consultas afetadas para que o frontend busque o estado atualizado.
- **Paginação no servidor ˜ `.Skip((pagina - 1) * tamanhoPagina).Take(tamanhoPagina)` no `IQueryable`.**

---

## Decisão Arquitetural do Dia

**Pergunta:** realizar filtragem e paginação no cliente ou no servidor?

| Critério de Decisão | Filtragem no Cliente | Filtragem no Servidor |
|---|---|---|
| **Volume de Dados** | Restrito e previsível (poucas dezenas/centenas de registros) | Ilimitado ou com crescimento contínuo |
| **Consumo de Banda** | Baixa a base inteira em um payload inicial pesado | Baixa apenas o lote da página solicitada |
| **Tempo de Resposta** | Instantâneo após carga inicial | Depende de requisição de rede (mitigado por cache e `placeholderData`) |
| **Atualidade dos Dados** | Alto risco de dados desatualizados (stale data) | Dados sempre sincronizados com a persistência |
| **Segurança & Permissões** | ? Vazamento: dados trafegam para o cliente antes do filtro | ? O backend só projeta os registros autorizados |

**Recomendação:** dados de negócios que crescem com o tempo devem ser filtrados e paginados **no servidor**. Registre o número de corte adotado (threshold) no ADR do dia.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Endpoint Paginado
- Em `api/Program.cs`, adequar `GET /solicitacoes` para receber os parâmetros `pagina` (default: 1) e `tamanhoPagina` (default: 10), além de `status` e `busca`.
- Retornar o contrato paginado `SolicitacoesPaginadasResponse(Itens, Total, Pagina, TamanhoPagina)`.
- Aplicar a paginação na coleção em memória com `Skip` e `Take`.

### Frontend (`web/`) — Migração para TanStack Query
- **Passo 1 — Setup do QueryClient:** Instalar `@tanstack/react-query` e envolver a aplicação no `QueryClientProvider` em `main.tsx`.
- **Passo 2 — Substituição de `useEffect` por `useQuery`:** Eliminar o controle manual de loading/error no `App` e consumir `useQuery` com a chave `['solicitacoes', { status, busca, pagina }]`.
- **Passo 3 — Paginação Fluida:** Criar controles visuais de navegação (Página anterior / Próxima / "Página X de Y"). Utilizar `placeholderData: keepPreviousData` para evitar que a tela pisque em branco durante a transição de páginas.
- **Passo 4 — Mutação e Invalidação Reativa:** Refatorar a ação de concluir para utilizar `useMutation`. No callback `onSuccess`, invocar `queryClient.invalidateQueries({ queryKey: ['solicitacoes'] })`.
- **Passo 5 — ADR 07:** Criar `decisoes/07-filtro-paginacao.md` definindo os critérios de paginação server-side vs. client-side.

### Referências Técnicas
- TanStack Query Overview: https://tanstack.com/query/latest/docs/framework/react/overview
- Queries: https://tanstack.com/query/latest/docs/framework/react/guides/queries
- Query Keys: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
- Paginated Queries: https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries
- Mutations & Invalidation: https://tanstack.com/query/latest/docs/framework/react/guides/mutations

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** O endpoint `GET /solicitacoes` retorna os metadados de paginação (`total`, `pagina`, `tamanhoPagina`) e o subconjunto exato de registros solicitados.
- [ ] **CA 2 (FE):** Nenhum `useEffect` é utilizado no frontend para busca de dados da API.
- [ ] **CA 3 (FE):** A navegação entre páginas exibe os novos dados sem piscar a interface (graças ao `placeholderData`).
- [ ] **CA 4 (FE):** A alteração de qualquer filtro de busca ou status reseta automaticamente a visualização para a página 1.
- [ ] **CA 5 (FE):** Concluir uma solicitação dispara uma mutação PATCH e, ao concluir com sucesso, atualiza a lista e os totalizadores via invalidação automática de cache.
- [ ] **CA 6 (ADR):** O arquivo `decisoes/07-filtro-paginacao.md` está formalizado contendo a regra de corte numérico para escolha de paginação.

---

## Armadilhas Comuns

- **Copiar dado do `useQuery` para `useState`:** Cria fontes concorrentes de verdade e anula o mecanismo de revalidação automática do TanStack Query.
- **Query key incompleta:** Omitir `pagina` ou `status` da chave de cache faz o TanStack reutilizar resultados da página 1 quando o usuário navegar para a página 2.
- **Não resetar a página ao filtrar:** Filtrar por um status específico estando na página 4 pode levar o usuário a uma página vazia inexistente.
- **Diferenças entre v4 e v5:** Na versão v5 do TanStack Query, os parâmetros corretos são `isPending` (em vez de `isLoading`) e `placeholderData: keepPreviousData`.

---

## Prompts Prontos

- "Explique server state vs. client state e por que o TanStack Query não é um 'Redux para API'."
- "Minha lista tem <N> itens hoje e cresce <X> por mês. Me ajude a decidir entre filtro no cliente e no servidor usando critérios, sem decidir por mim."

---

## Pronto quando

- [ ] Nenhum `useEffect` busca dados. Lista, filtro e página vêm do servidor via `useQuery`, e a mudança de status usa `useMutation` com invalidação.
- [ ] Trocar de página não pisca a lista, e mudar o filtro volta para a página 1.
- [ ] O ADR `decisoes/07-filtro-paginacao.md` está registrado, com o seu critério e o seu número de corte.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-07.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-07): tanstack query e paginação no servidor"`.
3. Próximo: [Dia 08 — Rotas e URL como estado](us-08-navegacao-rotas-url.md).
