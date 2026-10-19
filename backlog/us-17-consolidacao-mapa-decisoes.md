# US-17 (Dia 17) — Consolidação Arquitetural, Tech Review Fullstack e Mapa de Decisões

> **Fase 6: consolidação** · ⏱ 1h essencial / 2h com extras · Pré-requisito: Dia 16

## História de Usuário

**Como** desenvolvedor backend consolidando conhecimentos de engenharia de frontend,  
**quero** sintetizar os 11 Registros de Decisão Arquitetural (ADRs) criados ao longo do projeto em um mapa consultivo e submeter a base de código a uma revisão técnica global,  
**para** possuir um guia de critérios reutilizáveis aplicável a projetos reais no ambiente de trabalho e garantir que a aplicação completa atenda aos padrões de qualidade de produção.

---

## Aquecimento (5 min, sem consultar)

1. Por que o fallback de SPA não pode responder às rotas `/api/*`? (dia 16)
2. Por que o `VITE_*` não serve como configuração de runtime? (dia 16)
3. O evento de tempo real leva o dado completo ou só o id? Por quê? (dia 15)

---

## Ponte com .NET

- Releia o [guia/ponte-dotnet.md](../guia/ponte-dotnet.md) em sua totalidade, com atenção especial à coluna **"Onde quebra"**.
- Assim como no backend a senioridade se traduz em saber **quando NÃO utilizar** um padrão complexo (ex.: quando não usar CQRS ou Event Sourcing), no frontend a maturidade reside em saber manter componentes puros, evitar estados desnecessários e escolher as fronteiras corretas de rede.

---

## Decisão Arquitetural do Dia

**Pergunta:** como consolidar os 11 ADRs desenvolvidos em uma matriz de decisão rápida para tomada de decisão técnica no dia a dia corporativo?

**Estrutura do Mapa de Decisões:**
Para cada decisão tomada (dias 4, 6, 7, 9, 10, 11, 12, 13, 14, 15 e 16), formalizar uma linha na tabela com 4 colunas essenciais:

| Situação / Problema Técnico | Decisão Adotada | Critério Norteador | Sinal para Rever a Escolha |
|---|---|---|---|
| *Exemplo: Listagem com volume dinâmico* | Paginar e filtrar no servidor | Volume ilimitado e autorização por registro | A base passa a ter limite fixo e reduzido de itens |

*A coluna **Critério Norteador** é o ativo principal: é ela que permite ao desenvolvedor decidir com segurança em projetos futuros onde os requisitos forem diferentes.*

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) & Frontend (`web/`) — Revisão Técnica Fim a Fim
- **Passo 1 — Construção do Mapa de Decisões:**
  - Analisar todos os ADRs armazenados em `decisoes/`.
  - Criar o arquivo `decisoes/00-mapa.md` preenchendo a tabela consolidada com as 11 decisões de engenharia e seus respectivos critérios e sinais de revisão.
- **Passo 2 — Checklist Arquitetural Sem Consulta:**
  - No arquivo `diario/dia-17.md`, responder por escrito às 15 perguntas do checklist fundamental sem recorrer aos arquivos dos dias:
    1. O que dispara um re-render, e o que é estado vs. derivado?
    2. Onde vive cada tipo de estado: servidor, URL, formulário e UI?
    3. Quando usar `useEffect`, e quando não?
    4. Tipos gerados do OpenAPI ou escritos à mão: qual o critério?
    5. Filtrar e paginar no cliente ou no servidor: qual o critério?
    6. O que vai para a URL, e o que nunca vai?
    7. Quais validações ficam só no back, e por quê?
    8. Onde tratar 400, 401, 403, 404, 409 e 5xx? E quando fazer retry?
    9. Em que ordem você deixaria uma página mais leve?
    10. Quando CSR, SSR ou SSG?
    11. Cookie `httpOnly` ou token no `localStorage`: quais os riscos de cada um?
    12. O que testar em cada nível, e por que fazer mock na borda da rede?
    13. Como o front evita o *lost update*, e qual é a diferença entre 409 e 412?
    14. Polling, SSE ou SignalR: qual o critério, e o que o evento deve carregar?
    15. Quais são as 3 topologias de deploy de SPA + API, e quando usar cada uma?
  - Validar as respostas com a IA tutora.
- **Passo 3 — Auditoria e Refatoração de Qualidade:**
  - Rodar o comando `/revisar` sobre a solução completa.
  - Corrigir apontamentos de lint, compilação ou boas práticas.
- **Passo 4 — Validação de Build Geral:**
  - Backend: `dotnet build api/Painel.Api.csproj` passa com 0 erros.
  - Frontend: `npm run lint`, `npm run build` e `npx vitest run` passam 100% verdes.
- **Passo 5 — Quiz Final:** Executar `/quiz` para encerramento do ciclo de aprendizado.

### Referências Técnicas
- React Documentation: https://react.dev
- TanStack Query Documentation: https://tanstack.com/query/latest
- React Router Documentation: https://reactrouter.com
- ASP.NET Core Minimal APIs: https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (Geral):** O arquivo `decisoes/00-mapa.md` existe e reúne os 11 ADRs preenchidos com contexto, critério e sinal de revisão.
- [ ] **CA 2 (Geral):** As respostas ao checklist no `diario/dia-17.md` demonstram domínio conceitual confirmado pela IA (mínimo de 12 respostas validadas).
- [ ] **CA 3 (BE):** A API compila sem avisos ou erros via `dotnet build`.
- [ ] **CA 4 (FE):** A suíte de testes de front `npx vitest run` executa com sucesso.
- [ ] **CA 5 (FE):** O linter `npm run lint` e o compilador de build `npm run build` executam com sucesso.
- [ ] **CA 6 (DoD):** Todos os débitos técnicos e pendências abertas no `PROGRESSO.md` foram sanados ou conscientemente justificados.

---

## Armadilhas Comuns

- **Tratar os ADRs como dogmas imutáveis:** O mapa sintetiza os critérios para o cenário atual; em projetos com outras escalas ou equipes, o sinal de revisão deve orientar a reavaliação.
- **Presumir que o aprendizado terminou:** Os 17 dias fornecem critérios sólidos de engenharia de software; a maestria plena advém da prática contínua em código produtivo.

---

## Prompts Prontos

- "Revise meu painel como tech lead de front. Aponte até 5 pontos que um dev pleno faria diferente, em ordem de impacto, com arquivo:linha. Não reescreva o código."
- "Leia o meu decisoes/00-mapa.md e me dê 3 cenários novos para eu decidir usando os meus próprios critérios."

---

## Pronto quando

- [ ] O `decisoes/00-mapa.md` tem uma linha por ADR, com o critério preenchido.
- [ ] Você responde pelo menos 12 das 15 perguntas do checklist sem consultar, e a IA confirma.
- [ ] O painel passa em lint, build e testes.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-17.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "docs(dia-17): mapa de decisões"`.
3. Escolha o primeiro item de "Depois do plano" e marque a data de início.
