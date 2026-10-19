# Ponte .NET → Front

Use estas tabelas como mapa, não como verdade absoluta. Toda analogia quebra em algum ponto, e a coluna **"Onde quebra"** é a mais importante.

## Ferramentas

| .NET | Front | Onde quebra |
|---|---|---|
| NuGet | npm | Os pacotes vão para `node_modules/`, dentro do projeto, não para um cache global. É normal essa pasta ter centenas de MB. |
| `.csproj` | `package.json` | O `package.json` também guarda os **scripts** (`npm run dev`, `npm test`). |
| `packages.lock.json` | `package-lock.json` | Faça commit do lock. |
| `dotnet restore` | `npm install` | — |
| `dotnet watch run` | `npm run dev` (Vite) | O Vite atualiza o navegador na hora (HMR) e mantém o estado da tela quando consegue. |
| `dotnet publish` | `npm run build` | O resultado (`dist/`) é só HTML, JS e CSS estáticos. Não existe runtime no servidor: quem executa tudo é o navegador. |
| Compilador C# | `tsc` (TypeScript) | Os tipos **somem** em runtime. O TS não valida o dado que chega da API. |
| Roslyn analyzers | oxlint (ESLint em projetos mais antigos) | — |
| `dotnet format` | Prettier | — |
| xUnit | Vitest | A API é parecida com a do Jest: `describe`, `it`, `expect`. |
| NSubstitute | `vi.fn()`, `vi.mock()`, MSW | O MSW funciona como um `HttpMessageHandler` falso: o seu código faz a chamada HTTP de verdade e o MSW responde. |

## Linguagem

| C# | JS/TS | Onde quebra |
|---|---|---|
| `var` / tipo explícito | `const` (padrão) / `let` | `const` impede reatribuir a variável, mas **não** impede mutar o objeto. |
| `==` | `===` | O `==` do JS converte tipos (`0 == ''` é `true`). Use sempre `===`. |
| `null` | `null` **e** `undefined` | São dois "vazios". Propriedade ausente vale `undefined`. |
| `?.` e `??` | `?.` e `??` | São iguais. Mas o `\|\|` trata `0` e `''` como vazios, e o `??` não. |
| Lambda `x => x * 2` | Arrow `x => x * 2` | A sintaxe é idêntica. |
| LINQ `Select` | `map` | Executa na hora. Não é preguiçoso como o `IEnumerable`. |
| LINQ `Where` | `filter` | Também executa na hora. |
| `FirstOrDefault` | `find` | Devolve `undefined`, não `null`. |
| `Any` / `All` | `some` / `every` | — |
| `Sum` / `Aggregate` | `reduce` | Não existe `sum`. Use `reduce`, **sempre** com valor inicial. |
| `GroupBy` | `Object.groupBy` ou `reduce` | — |
| `OrderBy` | `toSorted` | O **`sort` muta o array original**. O `toSorted` devolve uma cópia. |
| `record` + `with` | spread `{ ...obj, campo: valor }` | A cópia é **rasa**: objetos aninhados continuam compartilhados. |
| `interface` / DTO | `type` / `interface` do TS | A tipagem é **estrutural**: dois tipos com o mesmo formato são compatíveis, mesmo com nomes diferentes. |
| `enum` | union de strings `'aberta' \| 'concluida'` | Prefira union. O `enum` do TS gera código em runtime. |
| `List<T>` | `T[]` / `Array<T>` | Os tipos genéricos também somem em runtime. |
| `Task<T>` | `Promise<T>` | — |
| `async` / `await` | `async` / `await` | O JS tem **uma thread só**. O `await` libera a thread para outras tarefas. Não existe `.Result`, `lock` nem deadlock de contexto. |
| `Task.WhenAll` | `Promise.all` | — |
| `Task.WhenAny` | `Promise.race` | — |
| `try` / `catch` | `try` / `catch` | No TS, o `catch` recebe `unknown`, e não há filtro por tipo de exceção. |
| `using` / namespaces | `import` / `export` | Cada arquivo é um módulo. O que não tem `export` é privado ao arquivo. |
| `HttpClient` | `fetch` | O **`fetch` não lança erro em 404 ou 500**. Confira o `response.ok`. |

## React e ecossistema

| .NET | React | Onde quebra |
|---|---|---|
| Componente Blazor / partial view | Componente (função que devolve JSX) | A função roda **de novo a cada render**. Variável local não sobrevive de um render para o outro. |
| Parâmetros do componente | Props | São somente leitura. O filho nunca altera uma prop. |
| Campo + `INotifyPropertyChanged` | `useState` | Você não altera o valor. Você chama o `set`, e o React renderiza de novo. |
| Propriedade calculada (`=> A + B`) | Variável calculada no render | Não guarde em estado o que dá para calcular. |
| Assinar evento (`+=`) | Handler `onClick={...}` | Passe a função, não a chame: `onClick={salvar}`, e não `onClick={salvar()}`. |
| Assinar/desassinar algo externo (`+=` / `-=`) | `useEffect` com cleanup | Serve para **sincronizar com algo de fora do React** (API, timer, DOM). Não é um "OnInit". |
| Método auxiliar reaproveitável | Custom hook `useAlgo` | Hooks só podem ser chamados no topo do componente, nunca dentro de `if` ou de loop. |
| `IMemoryCache` + retry | TanStack Query | Ele cuida de cache, loading, erro, retry e revalidação por você. |
| Roteamento de endpoints | React Router | Roda no navegador. O servidor sempre entrega o mesmo `index.html`. |
| DataAnnotations / FluentValidation | zod | A validação no front é UX. **A do back continua obrigatória.** |
| Escopo de DI | Context | O Context passa um valor para uma subárvore de componentes. Não é um container de DI, e todos os consumidores renderizam de novo quando o valor muda. |
| `appsettings.json` | `.env` + `import.meta.env.VITE_*` | Tudo que vai para o front é **público**. Nunca coloque segredo aí. |
| NSwag / cliente gerado do OpenAPI | `openapi-typescript` | Gera **só tipos**. Nada valida o JSON em runtime, e o tipo gerado reflete a configuração do servidor (ex.: `NumberHandling`). |
| ProblemDetails / ValidationProblem | Erro por campo no formulário | O front traduz o `errors` do 400 para cada campo. O 409 vira uma mensagem geral, não um erro de campo. |
| Cookie auth (`AddCookie`) | Cookie `httpOnly` + proxy do Vite ou `credentials: 'include'` | O navegador envia o cookie sozinho e o JS não lê. CORS com credenciais exige origem explícita, nunca `*`. |
| `[Authorize]` / `RequireAuthorization()` | Rota protegida e botão escondido | No front é **só UX**. Quem protege é o back, em cada endpoint. |
| Polly (retry) | Opção `retry` do TanStack Query | Por padrão ele repete a query 3 vezes. Não repita 4xx, nem mutation sem idempotência. |
| `RowVersion` + `DbUpdateConcurrencyException` | `ETag` + `If-Match` → 412 | O front precisa **carregar a versão do GET até o PATCH**. Se ela se perder no cache, o controle some. |
| Hub do SignalR / `IHubContext` | `@microsoft/signalr` + `invalidateQueries` | A conexão dura a sessão, cai e reconecta. Evento perdido na queda exige invalidar tudo depois do `onreconnected`. |
| `UseStaticFiles` + `MapFallbackToFile` | Fallback de rotas da SPA | Sozinho, ele devolve `index.html` até para `/api/nao-existe`. Mapeie um 404 para `/api/**` antes. |

## Armadilhas de quem vem do backend

1. **Mutar estado.** `lista.push(x); setLista(lista)` não renderiza de novo, porque a referência continua a mesma. Crie um array novo.
2. **Usar `useEffect` para tudo.** Se dá para calcular no render ou fazer no handler do evento, não é caso de efeito.
3. **Duplicar estado ou guardar estado derivado.** Guardar `listaFiltrada` em estado, além de `lista` e `filtro`, faz os valores saírem de sincronia.
4. **Confiar no tipo do TS para o dado da API.** O TS só confia no que você declarou. A API pode mandar outra coisa.
5. **Esperar exceção do `fetch` num 404.** Ela não vem. Confira o `response.ok`.
6. **Pensar em threads.** No código de UI não existe paralelismo de CPU, só concorrência de I/O.
7. **Validar só no front.** Qualquer pessoa consegue chamar a sua API sem passar pela tela.
8. **Pôr segredo no front.** Chave de API no bundle é chave pública.
