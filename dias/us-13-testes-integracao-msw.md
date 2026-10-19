# US-13 (Dia 13) — Suíte de Testes Automatizados na Borda HTTP com MSW

> **Fase 4: qualidade de produção** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 12

## História de Usuário

**Como** desenvolvedor responsável pela sustentabilidade do projeto,  
**quero** cobrir os fluxos críticos da tela com testes automatizados de integração simulando a borda de rede HTTP sem acoplamento a detalhes de implementação interna,  
**para** refatorar componentes e hooks com confiança de que a experiência do usuário e os tratamentos de erro permanecem íntegros.

---

## Aquecimento (5 min, sem consultar)

1. Onde a sessão do painel está guardada, e por quê? (dia 12)
2. Qual é a diferença entre 401 e 403 na tela? (dia 12)
3. Por que o usuário logado é dado do servidor? (dia 12)

---

## Ponte com .NET

- **Vitest ˜ xUnit / NUnit**, e **`vi.fn()` ˜ NSubstitute / Moq**.
- **React Testing Library (RTL) ˜ Testes orientados à interface pública.** Em C# você testa métodos e contratos públicos sem inspecionar campos privados. Em RTL, você nunca testa o `useState` ou a estrutura interna do DOM; você testa **o que o usuário enxerga e faz** (textos, botões, acessibilidade via roles).
- **MSW (Mock Service Worker) ˜ um `DelegatingHandler` / `HttpMessageHandler` falso.** O seu código emite chamadas HTTP reais via `fetch` e o MSW intercepta na camada de rede retornando respostas simuladas. Você faz mock na **fronteira de rede**, e não nos seus próprios componentes.

---

## Decisão Arquitetural do Dia

**Pergunta:** o que testar e em qual nível da pirâmide de testes de frontend?

| Nível | Ferramenta | O que cobre no painel | Proporção / Foco |
|---|---|---|---|
| **Unitário** (lógica pura) | Vitest puro | Funções utilitárias puras: formatação monetária, conversão de `ValidationProblem` para formulário | Poucos, rápidos e focados em regras matemáticas ou de parse |
| **Integração de Tela** | Vitest + RTL + MSW | Fluxos completos: renderização da lista com dados reais/vazio/500, validação do formulário e recusas 409 | **A grande maioria da suíte**. Alta fidelidade à experiência real e alta resiliência a refactors |
| **Ponta a Ponta (E2E)** | Playwright | Fluxo crítico completo: Login ? Abertura de chamado ? Visualização na lista | Poucos (1 a 2 testes), mais lentos, focados em smoke test de produção |

**O que NÃO deve ser testado:**
- Detalhes de implementação interna (nomes de variáveis de estado, métodos internos de hooks).
- O funcionamento de bibliotecas consolidadas (não teste se o TanStack Query faz cache ou se o Zod valida strings).
- Estilização pura ou valores de CSS específicos.

**Recomendação:** concentre a maior parte dos testes na **integração de tela com MSW**. Registre as fronteiras no ADR do dia.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Alinhamento de Contratos de Teste
- Revisar se os contratos de resposta simulados no MSW no frontend espelham com total fidelidade os schemas produzidos pelos endpoints reais da `api/` (incluindo campos camelCase e enums snake_case).

### Frontend (`web/`) — Suíte de Testes com RTL e MSW
- **Passo 1 — Setup de Testes:** Instalar `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom` e `msw`. Configurar o bloco `test` no `vite.config.ts` e adicionar o script `"test": "vitest"` no `package.json`.
- **Passo 2 — Teste Unitário Puro:** Criar `src/api/erros.test.ts` testando a função utilitária de conversão de dicionário `errors` do backend para campos do formulário.
- **Passo 3 — Teste de Integração da Lista com MSW:** Criar `src/componentes/ListaSolicitacoes.test.tsx` cobrindo 3 cenários com MSW:
  1. Sucesso com itens na lista;
  2. Sucesso com lista vazia (exibição de estado vazio amigável);
  3. Falha HTTP 500 (exibição do card de erro com opção de retry).
  *Instanciar um `new QueryClient({ defaultOptions: { queries: { retry: false } } })` por teste para evitar contaminação de cache.*
- **Passo 4 — Teste de Integração de Formulário:** Criar `src/paginas/NovaSolicitacao.test.tsx` com `user-event` validando:
  1. Erros de validação do Zod impedindo o disparo da requisição;
  2. Resposta de erro 409 da API sendo exibida no topo do formulário.
- **Passo 5 — Execução Integrada:** Garantir que `npx vitest run`, `npm run lint` e `npm run build` passem 100% verdes.
- **Passo 6 — ADR 13:** Registrar em `decisoes/13-estrategia-de-testes.md` os níveis adotados e o que se decidiu não testar.

### Referências Técnicas
- Vitest Getting Started: https://vitest.dev/guide/
- React Testing Library Intro: https://testing-library.com/docs/react-testing-library/intro/
- Guia de Prioridade de Queries da RTL: https://testing-library.com/docs/queries/about/#priority
- Mock Service Worker (MSW): https://mswjs.io/docs/
- Write tests. Not too many. Mostly integration (Kent C. Dodds): https://kentcdodds.com/blog/write-tests

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (FE):** O comando `npx vitest run` executa com sucesso todos os testes unitários e de integração.
- [ ] **CA 2 (FE):** Os testes de tela utilizam queries prioritárias baseadas em acessibilidade (`getByRole`, `findByRole`) em vez de seletores frágeis por classe ou testId.
- [ ] **CA 3 (FE):** O MSW intercepta requisições HTTP sem que seja necessário mockar internamente os hooks de API.
- [ ] **CA 4 (FE):** Cada teste com TanStack Query possui sua própria instância isolada de `QueryClient` com `retry: false`, eliminando interferências entre testes.
- [ ] **CA 5 (FE):** `npm run lint` e `npm run build` continuam passando sem erros ou warnings.
- [ ] **CA 6 (ADR):** O arquivo `decisoes/13-estrategia-de-testes.md` está formalizado detalhando o escopo dos testes.

---

## Armadilhas Comuns

- **Abuso de `getByTestId`:** Priorize sempre `getByRole('button', { name: /salvar/i })`, que valida se o elemento é acessível para tecnologias assistivas.
- **Mockar hooks próprios (`vi.mock('./useSolicitacoes')`):** Testa menos do que parece e quebra com qualquer refactor interno do componente. Prefira MSW na camada de rede.
- **`getBy*` vs. `findBy*`:** Elementos assíncronos que surgem após a resolução de Promises exigem o uso de `await screen.findBy*`.

---

## Prompts Prontos

- "Revise meus testes: estou testando comportamento ou implementação? Aponte o critério, sem reescrever."
- "Para este componente <cole>, em que nível você testaria e por quê? Não escreva o teste."

---

## Pronto quando

- [ ] O `npx vitest run` passa, com pelo menos 1 teste unitário e 2 de integração com MSW.
- [ ] `npm run lint` e `npm run build` passam.
- [ ] O ADR `decisoes/13-estrategia-de-testes.md` está registrado.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-13.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "test(dia-13): testes de integração com msw"`.
3. Próximo: [Dia 14 — Concorrência: dois usuários, mesma solicitação](us-14-concorrencia-otimista-etag.md).
