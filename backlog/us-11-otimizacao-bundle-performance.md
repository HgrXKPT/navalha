# US-11 (Dia 11) — Otimização de Bundle, Latência e Performance de Renderização

> **Fase 4: qualidade de produção** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 10

## História de Usuário

**Como** usuário acessando o painel em conexões com latência ou dispositivos móveis,  
**quero** que a aplicação carregue com o menor pacote inicial de JavaScript possível e não congele a interface durante a digitação de buscas,  
**para** obter uma navegação ágil e fluida sem desperdício de banda de rede.

---

## Aquecimento (5 min, sem consultar)

1. Por que 4xx não deve sofrer retry? (dia 10)
2. O que o Error Boundary não captura? (dia 10)
3. Por que paginar no servidor deixa a página mais leve? (dia 7)

---

## Ponte com .NET

- **Medir antes de otimizar:** Assim como você utiliza o dotTrace, BenchmarkDotNet ou Application Insights para identificar gargalos em C#, no frontend utilizamos o Lighthouse e o React Profiler. Otimizar sem evidência numérica gera complexidade inútil.
- **Code Splitting ˜ Carregamento dinâmico de Assemblies sob demanda (`Assembly.Load`).** O navegador baixa apenas os scripts da rota atual; os scripts das demais telas só são transferidos quando o usuário clica nelas.
- **`memo` / `useMemo` ˜ Cache em memória de computações puras.** Possui custo de alocação de memória e comparação superficial de dependências a cada ciclo.

---

## Decisão Arquitetural do Dia

**Pergunta 1:** qual a ordem prioritária de ações para otimizar a performance de uma página web?

1. **Medir Primeiro:**
   - Analisar o relatório do `npm run build` (peso dos chunks com gzip).
   - Executar auditoria do Lighthouse via `npm run preview` (**nunca** no servidor de dev `npm run dev`).
   - Monitorar as Core Web Vitals: LCP (Largest Contentful Paint) = 2,5s; INP (Interaction to Next Paint) = 200ms; CLS (Cumulative Layout Shift) = 0,1.
2. **Transferir Menos Código (Bundle Splitting):**
   - Aplicar Code Splitting por rota usando `React.lazy` + `Suspense`. O formulário pesado com Zod não deve onerar quem só acessa a lista.
3. **Buscar Menos e Mais Rápido:**
   - Paginar no servidor (dia 7) e implementar `prefetchQuery` do TanStack Query ao passar o cursor sobre links (`onMouseEnter`).
4. **Renderizar Menos:**
   - Manter o estado o mais próximo possível de quem usa. Aplicar `memo` ou `useMemo` apenas em nós com alto custo computacional comprovado via Profiler.

**Pergunta 2:** quando escolher CSR, SSR ou SSG?

| Modelo | Funcionamento | Cenário Indicado | Trade-off / Custo |
|---|---|---|---|
| **CSR** (SPA Vite atual) | O navegador baixa o bundle JS e renderiza o HTML via DOM | Painéis corporativos, intranets, ferramentas ricas atrás de login | Carga inicial depende do download do JS; SEO público fraco |
| **SSR** (Next.js / Remix) | O servidor Node renderiza o HTML dinamicamente a cada request | Páginas públicas que exigem SEO e primeira pintura ultrarrápida | Complexidade operacional e infraestrutura de servidores Node |
| **SSG** (Astro / Next estático) | HTML pré-compilado integralmente durante a etapa de build | Documentações, blogs e páginas institucionais com pouca mutação | Mudanças no conteúdo exigem novo deploy/build |

**Recomendação:** para aplicações corporativas internas com autenticação e alta interatividade, **CSR com Code Splitting** é a solução arquitetural ideal. Registre os números no ADR do dia.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Compressão e Auditoria de Payloads
- Em `api/Program.cs`, habilitar compressão de resposta HTTP nativa do ASP.NET Core (`builder.Services.AddResponseCompression()` e `app.UseResponseCompression()`).
- Inspecionar na aba Network os cabeçalhos `Content-Encoding: gzip` ou `br` emitidos pela Minimal API.
- O mesmo dia o front atua no bundle (divisão de código) e a medição de payload usa a resposta comprimida da API.

### Frontend (`web/`) — Code Splitting e Diagnóstico com Profiler
- **Passo 1 — Linha de Base (Baseline):** Rodar `npm run build` e anotar o peso do chunk inicial em gzip. Executar `npm run preview` e rodar uma auditoria do Lighthouse no modo Mobile.
- **Passo 2 — Code Splitting por Rota:** Substituir a importação síncrona das telas secundárias (`NovaSolicitacao` e `Detalhe`) por `const NovaSolicitacao = React.lazy(() => import('./paginas/NovaSolicitacao'))` envolvidas por `<Suspense fallback={<Carregando />}>`.
- **Passo 3 — Auditoria Pós-Otimização:** Rodar `npm run build` novamente e comprovar a divisão em múltiplos chunks (`assets/`). Abrir a aba Network no `preview` e verificar que o chunk da nova solicitação só é baixado ao navegar para `/solicitacoes/nova`.
- **Passo 4 — Profiler de Interação:** Usar a aba Profiler do React DevTools para gravar uma sessão de digitação na busca e constatar que apenas os nós necessários atualizam.
- **Passo 5 — ADR 11:** Registrar em `decisoes/11-pagina-leve.md` os números antes e depois do code splitting e a justificativa arquitetural do CSR para o painel.

### Referências Técnicas
- Web Vitals (LCP, INP, CLS): https://web.dev/articles/vitals
- React.lazy & Code Splitting: https://react.dev/reference/react/lazy
- React memo: https://react.dev/reference/react/memo
- Rendering on the Web (CSR vs SSR vs SSG): https://web.dev/articles/rendering-on-the-web

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** A Minimal API serve payloads JSON comprimidos com gzip/brotli quando solicitado pelo cliente.
- [ ] **CA 2 (FE):** O bundle inicial da aplicação no `npm run build` foi reduzido através de code splitting com `lazy` e `Suspense`.
- [ ] **CA 3 (FE):** Ao acessar a rota `/solicitacoes`, o navegador não transfere os arquivos de script da rota `/solicitacoes/nova`.
- [ ] **CA 4 (FE):** A navegação entre rotas assíncronas exibe um fallback de carregamento suave sem congelar a interface.
- [ ] **CA 5 (FE):** O aluno consegue explicar a diferença entre medir performance em `preview` versus ambiente de desenvolvimento `dev`.
- [ ] **CA 6 (ADR):** O arquivo `decisoes/11-pagina-leve.md` está registrado com a tabela comparativa de métricas (tamanho do bundle, LCP e score do Lighthouse).

---

## Armadilhas Comuns

- **Medir métricas no servidor de desenvolvimento (`npm run dev`):** O ambiente de desenvolvimento inclui ferramentas de debug e código não minificado, distorcendo completamente os resultados.
- **Usar `React.lazy` em componentes microscópicos:** Gera uma cascata de pequenas requisições HTTP adicionais (waterfall de rede) que atrasa a renderização.
- **Usar `memo` de forma preventiva em tudo:** A comparação superficial de props a cada ciclo adiciona sobrecarga de CPU desnecessária caso as props mudem frequentemente.

---

## Prompts Prontos

- "Meu build mostra <cole a saída>. O que você investigaria primeiro para reduzir o JS inicial, e por quê? Não altere o código."
- "Explique LCP, INP e CLS para um dev backend, relacionando com latência, tempo de resposta e estabilidade."

---

## Pronto quando

- [ ] O JS inicial diminuiu com o code splitting, e você tem os números de antes e depois.
- [ ] Você sabe dizer o que renderiza a cada tecla na busca e por quê.
- [ ] Você explica a ordem "medir ? menos código ? buscar menos ? renderizar menos", e quando CSR, SSR e SSG fazem sentido.
- [ ] O ADR `decisoes/11-pagina-leve.md` está registrado com números.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-11.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "perf(dia-11): code splitting e medições"`.
3. Próximo: [Dia 12 — Segurança e autenticação](us-12-autenticacao-cookie-perfis.md).
