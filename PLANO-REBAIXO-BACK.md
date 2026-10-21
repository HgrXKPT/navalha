# Plano — Rebaixar o back para o nível do dia e alinhar com as 17 US

> Data: 2026-10-20 · Autor: IA tutora · Alvo: `api/` + `backlog/` + CI + README
> Decisão do aluno: **opção A** (rebaixar o back). Este plano detalha a A.

## Premissa de arquitetura (confirme no item 6)

O back do curso vira **um projeto Minimal API de arquivo único**, no layout que as 17 US já descrevem:

```
api/
├── Painel.Api.csproj          # projeto único
├── Program.cs                 # todos os endpoints, crescendo dia a dia
├── Contratos/
│   └── SolicitacaoContratos.cs
└── Properties/launchSettings.json
```

Motivo: as US descrevem exatamente esse layout (`backlog/us-01-fundacao-contratos.md:50`, `backlog/us-02-listagem-componentizacao.md:48-49`, `backlog/us-17-consolidacao-mapa-decisoes.md:71`), e a verba do curso é 1h/dia dividida entre front e back — Clean Architecture exigiria 5-6 arquivos por endpoint (DTO + interface + service + repositório + mapper + controller), o que não cabe em 1h.

**Alternativa (item 6.1):** manter os 4 projetos e rebaixar só as *funcionalidades*. Nesse caso os passos 1-4 mudam (viram "remover funcionalidades, não projetos") e os passos 5-8 permanecem iguais.

---

## 1. Objetivo

Deixar o back do curso no nível do **dia 2** (só `GET /solicitacoes` com os 6 registros), para que cada dia de 3 a 16 volte a ter trabalho real de backend — e fazer as 17 US descreverem o back que realmente existe no repositório.

## 2. Fora de escopo

- Não se toca em `web/` (mock, componentes, tokens, e2e): o front do dia 2 está pronto e correto.
- Não se reescrevem os Sections "História de Usuário", "Aquecimento", "Ponte com .NET", "Decisão Arquitetural do Dia", "Critérios de Aceite", "Armadilhas", "Prompts" e "Pronto quando" das US: só a subseção `### Backend (api/)` e as referências de caminho mudam.
- Não se implementa nenhum endpoint de dia 3 a 16 — a baseline é o dia 2, que o aluno já concluiu.
- Não se criam ADRs (`decisoes/`): `decisoes/_modelo.md` segue vazio, e o primeiro ADR continua sendo o do dia 4.
- Não se mexe em `exercicios/`, `guia/` nem nos `diario/dia-01.md` / `dia-02.md`.
- Não se troca stack do front (TanStack Query, react-router, zod, react-hook-form continuam chegando nos dias 6-13).
- Não se mexe no `PROGRESSO.md` no passo 7 sem a sua confirmação do texto.

## 3. Arquivos afetados

**Deletados (o código de arquitetura vai para a tag do Passo 1):**
- `api/src/Painel.Api/Program.cs:1-77` — pipeline atual (CORS, ProblemDetails, DI, 4 endpoints)
- `api/src/Painel.Api/Controllers/SolicitacoesController.cs:1-85` — ETag/If-Match/403 já resolvidos (dias 12 e 14)
- `api/src/Painel.Api/Middlewares/GlobalExceptionHandler.cs:1-62` — RFC 9457 (dia 10)
- `api/src/Painel.Api/Painel.Api.csproj:1-18` — referências aos outros 3 projetos
- `api/src/Painel.Application/Dtos/SolicitacaoDtos.cs:1-57`, `Interfaces/ISolicitacaoRepository.cs:1-18`, `Interfaces/ISolicitacaoService.cs:1-29`, `Mappers/SolicitacaoMapper.cs:1-30`, `Services/SolicitacaoService.cs:1-74` — paginação, busca, 409, 412 (dias 5, 7, 9, 14)
- `api/src/Painel.Domain/Entities/Solicitacao.cs:1-87`, `Enums/StatusSolicitacao.cs:1-12`, `Exceptions/DomainException.cs:1-14` — invariantes e regras de transição (dias 9, 12, 14)
- `api/src/Painel.Infrastructure/Persistence/InMemorySolicitacaoRepository.cs:1-121` — 40 registros, paginação, busca (dias 5, 6, 7)
- `api/tests/Painel.UnitTests/Domain/SolicitacaoDomainTests.cs:1-93` e `api/tests/Painel.UnitTests/Painel.UnitTests.csproj:1-28` — testes das regras de dia 9/12/14
- `api/Painel.slnx:1-11` — solução com 5 projetos

**Novos:**
- `api/Painel.Api.csproj` — novo; projeto único do curso (`net10.0`, `Microsoft.AspNetCore.OpenApi` 10.0.13)
- `api/Program.cs` — novo; baseline do dia 2
- `api/Contratos/SolicitacaoContratos.cs` — novo; `StatusSolicitacao`, `Solicitacao`, `CriarSolicitacaoRequest`
- `api/Properties/launchSettings.json` — novo; mantém as portas 5220/7272 de `api/src/Painel.Api/Properties/launchSettings.json:8`

**Editados:**
- `.github/workflows/ci.yml:34-39` — job `api`: apontar para `api/Painel.Api.csproj` e remover o step `dotnet test`
- `README.md:27-31` — seção "Backend em Clean Architecture" vira a descrição do back do curso
- `README.md:48` — linha da stack: `.NET 10, ASP.NET Core, Minimal APIs` (sem "Clean Architecture, xUnit")
- `README.md:61-64` — árvore `api/` do README
- `README.md:96-99` — comandos `dotnet build api/Painel.Api.csproj` / `dotnet run --project api`
- `PROGRESSO.md:9-11` e seção "Pendências" (linha 29+) — registrar o rebase e o que sobra para o dia 3
- `backlog/us-01-fundacao-contratos.md:50` — o arquivo citado passa a existir de fato
- `backlog/us-02-listagem-componentizacao.md:47-50` — dir "Minimal API"/`Results.Ok` batem com o código novo
- `backlog/us-03-filtro-totalizadores.md:54-57` — o PATCH volta a ser trabalho do aluno
- `backlog/us-04-visao-detalhe-estado.md:55-57` — idem para `GET /{id}`
- `backlog/us-05-indicador-aba-custom-hooks.md:47-49` — idem para `?status=&busca=`
- `backlog/us-06-integracao-openapi-tipado.md:51-61` — a lista dos 4 endpoints vira "consolidar o que já existe" + CORS + 40 registros
- `backlog/us-07-paginacao-tanstack-query.md:48-51` — paginação volta a ser trabalho novo
- `backlog/us-09-abertura-chamado-validacao.md:48-54` — POST + 400 + 409 voltam a ser trabalho novo
- `backlog/us-10-resiliencia-problemdetails.md:53-55` — RFC 9457 e `falha-simulada` voltam a ser trabalho novo
- `backlog/us-11-otimizacao-bundle-performance.md:58-60` — compressão volta a ser trabalho novo
- `backlog/us-12-autenticacao-cookie-perfis.md:52-61` — cookie/login/`/me` (hoje só existem DTOs, `api/src/Painel.Application/Dtos/SolicitacaoDtos.cs:47-57`)
- `backlog/us-14-concorrencia-otimista-etag.md:50-57` — ETag/428/412 voltam a ser trabalho novo
- `backlog/us-15-tempo-real-signalr.md:49-57` — SignalR (hoje não existe: `api/src/Painel.Api/Program.cs` não tem `AddSignalR`)
- `backlog/us-16-hospedagem-unificada-cache.md:51-60` — `/api` group + estáticos + cache + fallbacks
- `backlog/us-08-navegacao-rotas-url.md:46-48`, `backlog/us-13-testes-integracao-msw.md:50-51` — revisar apenas se mencionarem estrutura do back

## 4. Passos ordenados

### Passo 1 — Ponto de retorno e limpeza do back
Tag `arquitetura-completa` no commit atual (`9c5f005`), depois `git rm -r api/src api/tests api/Painel.slnx`.
**Pronto quando:** `git tag -l arquitetura-completa` retorna o nome e `git show --stat arquitetura-completa | Select-String "Painel.Domain"` lista os 4 projetos.

### Passo 2 — Baseline do curso (o back do dia 2)
Criar `api/Painel.Api.csproj`, `api/Program.cs`, `api/Contratos/SolicitacaoContratos.cs`, `api/Properties/launchSettings.json`.

Contrato da baseline (só isto existe no dia 3):
- `GET /solicitacoes` → `Results.Ok(lista)` com **6** registros, array simples (sem envelope de paginação)
- `GET /` → mensagem de saúde
- `GET /openapi/v1.json` em Development (a US do dia 2 já exige o endpoint documentado — `backlog/us-02-listagem-componentizacao.md:50`; o dia 6 passa a **refinar**, não a criar)
- JSON: `camelCase` nas propriedades + enum em `snake_case` (`JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseLower)`), para casar com `web/src/tipos.ts:1`
- **Sem**: CORS, `JsonNumberHandling.Strict`, `AddProblemDetails`, `UseExceptionHandler`, compressão, autenticação, `MapGroup("/api")`, `UseStaticFiles`, SignalR, ETag, `Versao`, paginação, busca, POST, PATCH
- **Sem** `Versao` no contrato (é do dia 14) e **sem** invariantes de cliente/valor (são do dia 9)

**Pronto quando:** `dotnet build api/Painel.Api.csproj -c Release` → "Compilação com êxito. 0 Aviso(s) 0 Erro(s)"; com `dotnet run --project api` no ar, `Invoke-RestMethod http://localhost:5220/solicitacoes` devolve 6 objetos e `Invoke-RestMethod http://localhost:5220/openapi/v1.json` contém a rota `/solicitacoes`.

### Passo 3 — Paridade da semente com o mock do front
As 6 linhas do seed em `api/Program.cs` devem ser cópia literal de `web/src/dados/solicitacoes-mock.ts:3-52` (mesmos ids 1-6, clientes, valores, status, `criadaEm` e `observacao`). Hoje divergem: a API usa "Produto com defeito" e `null` onde o front usa "Corte degradê navalhado" (`api/src/Painel.Infrastructure/Persistence/InMemorySolicitacaoRepository.cs:96-101`).
**Pronto quando:** o JSON de `GET /solicitacoes` e o array de `web/src/dados/solicitacoes-mock.ts` batem campo a campo por id (6/6 registros idênticos).

### Passo 4 — CI e README
`.github/workflows/ci.yml:34-39`: `dotnet restore api/Painel.Api.csproj`, `dotnet build api/Painel.Api.csproj --configuration Release`, remover o step de teste. `README.md`: linhas 27-31, 48, 61-64, 96-99.
**Pronto quando:** os três comandos do CI rodam localmente com sucesso e `Select-String -Path README.md, .github/workflows/ci.yml -Pattern "api/src|Painel.Domain|Clean Architecture"` retorna **0** ocorrências.

### Passo 5 — Reescrever a seção "Backend" das 17 US
Reescrever **apenas** a subseção `### Backend (api/)` de cada US e as referências de caminho, com a tabela abaixo como fonte. Formato de cada linha nova:

```
### Backend (`api/`) — <incremento do dia>
- Em `api/Program.cs`, <endpoint novo ou ajuste> ...
- <o que o front faz no mesmo dia: mock local ou chamada real>
```

| Dia | Incremento do back (a partir da baseline) | Front no mesmo dia |
|---|---|---|
| 02 (feito) | `GET /solicitacoes` (6 registros) + OpenAPI | mock local |
| 03 | `PATCH /solicitacoes/{id}/status` (Aberta→Concluida), 404 se não existe | mock local (o front simula com `.map()`) |
| 04 | `GET /solicitacoes/{id}` (200/404) | mock local |
| 05 | `GET /solicitacoes?status=&busca=` | mock local |
| 06 | CORS `:5173`, `JsonNumberHandling.Strict`, seed de 40 (6 + 34 gerados), 4 rotas consolidadas | passa a consumir a API real + tipos do OpenAPI |
| 07 | `?pagina&tamanhoPagina` + envelope `{itens,total,pagina,tamanhoPagina}` | TanStack Query |
| 08 | normalizar `pagina=0`/parâmetro inválido sem 500 | React Router |
| 09 | `POST /solicitacoes` + 400 `ValidationProblem` + 409 duplicidade | formulário (RHF + zod) |
| 10 | `AddProblemDetails` + `UseExceptionHandler` + `Results.Problem` + `GET /solicitacoes/falha-simulada` (só em Development) | resiliência + Error Boundary |
| 11 | `AddResponseCompression` + `UseResponseCompression` | — |
| 12 | `AddAuthentication(cookie)` + `POST /login` + `POST /logout` + `GET /me` + 401/403 por perfil | login + RBAC (proxy `/api` **removendo** o prefixo) |
| 13 | nenhum (revisar contratos p/ o MSW) | suíte de testes |
| 14 | `ETag` no GET, `If-Match` no PATCH, 428 se ausente, 412 se divergente | propagar ETag e tratar 412 |
| 15 | `AddSignalR` + hub `/hubs/solicitacoes` + broadcast `{ id }` | hook de tempo real |
| 16 | `MapGroup("/api")`, `UseStaticFiles`, `Cache-Control` por tipo de arquivo, `MapFallback("/api/{**rest}")` + `MapFallbackToFile` | mesma origem (o proxy passa a **não** remover o prefixo) |

**Pronto quando:** `Select-String -Path backlog/*.md -Pattern "api/src|Painel\.(Domain|Application|Infrastructure)|dotnet test api"` retorna **0** ocorrências, e cada US de dia 3 a 16 tem na subseção Backend o nome do endpoint daquele dia.

### Passo 6 — Varredura de encoding
`us-01` a `us-16` estão em Windows-1252 (decodificação UTF-8 estrita falha); `us-17` está em UTF-8. Como o Passo 5 reescreve 16 arquivos, ele já corrige o encoding — este passo só confere e repara o que sobrou.
**Pronto quando:** o script de validação (decodificação UTF-8 estrita em todos os `.md` do repo) retorna "0 arquivos com encoding inválido", e `git diff --stat` mostra só as linhas previstas (nada de texto perdido).

### Passo 7 — PROGRESSO.md
Registrar que o back foi rebaixado para o dia 2 e que o dia 3 começa com trabalho de back **novo**. Adicionar em "Pendências" (`PROGRESSO.md:29+`): `- [ ] Dia 03: PATCH /solicitacoes/{id}/status em api/Program.cs + filtro/totalizadores/Concluir no front`.
**Pronto quando:** `PROGRESSO.md:11` continua com o dia 3 em ⬜ e a pendência aparece na lista.

### Passo 8 — Verificação final
`dotnet build api/Painel.Api.csproj -c Release`; `dotnet run --project api` + smoke de contrato; `npm run check` em `web/`; varredura final de referências a `api/src` em `.md`/`.yml`.
**Pronto quando:** build com 0 erros/0 avisos, `npm run check` verde nas 4 etapas (typecheck, lint, format:check, test), e a varredura final retorna 0 ocorrências.

## 5. Riscos

1. **Perder o código de arquitetura** — mitigado pelo Passo 1 (tag) e por um commit único de rebase, revertível com `git revert`.
2. **O aluno achar que o repo quebrou** — o back encolhe de propósito; mitigation: README e PROGRESSO explicam que o back agora cresce a cada dia.
3. **Divergência entre mock e seed volta a acontecer** — hoje já aconteceu (`web/src/dados/solicitacoes-mock.ts:10` vs `api/src/Painel.Infrastructure/Persistence/InMemorySolicitacaoRepository.cs:96`); mitigation: Passo 3 fixa a paridade e o dia 6 passa a listar "6 + 34 gerados" explicitamente.
4. **Reescrever 17 US distorce o conteúdo pedagógico** — mitigation: o Passo 5 toca só a subseção Backend; revisão por `git diff` arquivo a arquivo.
5. **Quebrar o CI do main** — o caminho do projeto muda; mitigation: Passo 4 antes de qualquer push, em branch própria.
6. **Ports e CORS** — o dia 6 consome a API cross-origin em `:5220`; mitigation: manter as portas de `launchSettings.json` e o CORS `:5173` (`:43`) na configuração do dia 6.
7. **Loss of the "vitrine" (.NET Clean Architecture no README)** — mitigation: tag `arquitetura-completa` preserva o código, e a arquitetura em camadas pode virar exercício pós-curso (item 6.2).

## 6. O que preciso decidir

1. **Arquitetura do back do curso**: (a) Minimal API de arquivo único, como as 17 US já descrevem — **recomendado**; (b) manter Clean Architecture e rebaixar só as funcionalidades. Critério: a verba é 1h/dia para front **e** back, e as US já estão escritas para (a). Se escolher (b), os passos 1-4 mudam de forma e o resto do plano vale igual.
2. **Destino do código de arquitetura atual**: (a) só na tag do git — **recomendado**; (b) manter uma cópia em `api/referencia/` (peso morto que o CI passa a varrer); (c) descartar.
3. **Órfãos do roteiro antigo (T-001..T-015)**: `web/tools/shots.spec.ts:29-61` (procura `footer` e `section[id]` da landing page removida) e `web/e2e/support/axe.ts` / `viewports.ts` (sem nenhum spec). (a) reatribuir ao dia 13 como material de E2E/acessibilidade — **recomendado**; (b) remover; (c) deixar como está, registrado como dívida.
4. **Texto da pendência no PROGRESSO.md** (Passo 7): a redação sugerida acima ou outra sua.

## 7. Execução

`AGENTS.md` restringe a edição de `api/` e `backlog/` sem pedido explícito. Os Passos 1-8 dependem da sua autorização para mexer nesses diretórios. Cada passo é um commit só, na ordem, com o critério de pronto verificado antes de passar ao seguinte.
