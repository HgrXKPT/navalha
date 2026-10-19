# Progresso

Legenda: ⬜ não iniciado · 🟦 em andamento · 🟨 feito com pendência · ✅ pronto

**Dia atual:** 3

| Dia | Demanda FE + BE (User Story) | Status | Data | Tempo | Confiança (1–5) |
|---|---|---|---|---|---|
| 01 | [US-01: Fundação e contratos imutáveis](dias/us-01-fundacao-contratos.md) | 🟨 | 2026-09-30 | 1h | 3,5 |
| 02 | [US-02: Listagem inicial e componentização](dias/us-02-listagem-componentizacao.md) | 🟨 | 2026-10-06 | 1h | 4 |
| 03 | [US-03: Filtro por status, totalizadores e transição](dias/us-03-filtro-totalizadores.md) | ⬜ | | | |
| 04 | [US-04: Visão de detalhe e onde vive o estado](dias/us-04-visao-detalhe-estado.md) · ADR | ⬜ | | | |
| 05 | [US-05: Indicador na aba, busca e custom hooks](dias/us-05-indicador-aba-custom-hooks.md) | ⬜ | | | |
| 06 | [US-06: Integração fim a fim e OpenAPI tipado](dias/us-06-integracao-openapi-tipado.md) · ADR | ⬜ | | | |
| 07 | [US-07: Paginação server-side e TanStack Query](dias/us-07-paginacao-tanstack-query.md) · ADR | ⬜ | | | |
| 08 | [US-08: Navegação multi-telas e rotas na URL](dias/us-08-navegacao-rotas-url.md) | ⬜ | | | |
| 09 | [US-09: Abertura de chamado e validação front/back](dias/us-09-abertura-chamado-validacao.md) · ADR | ⬜ | | | |
| 10 | [US-10: Resiliência, ProblemDetails e erros](dias/us-10-resiliencia-problemdetails.md) · ADR | ⬜ | | | |
| 11 | [US-11: Otimização de bundle e performance](dias/us-11-otimizacao-bundle-performance.md) · ADR | ⬜ | | | |
| 12 | [US-12: Autenticação por cookie e perfis](dias/us-12-autenticacao-cookie-perfis.md) · ADR | ⬜ | | | |
| 13 | [US-13: Testes de integração com MSW](dias/us-13-testes-integracao-msw.md) · ADR | ⬜ | | | |
| 14 | [US-14: Concorrência otimista com ETag](dias/us-14-concorrencia-otimista-etag.md) · ADR | ⬜ | | | |
| 15 | [US-15: Tempo real com SignalR](dias/us-15-tempo-real-signalr.md) · ADR | ⬜ | | | |
| 16 | [US-16: Hospedagem unificada e cache](dias/us-16-hospedagem-unificada-cache.md) · ADR | ⬜ | | | |
| 17 | [US-17: Consolidação e mapa de decisões](dias/us-17-consolidacao-mapa-decisoes.md) | ⬜ | | | |

## Pendências

<!-- Cada item do "Pronto quando" que não bateu. Formato: - [ ] Dia NN: o que faltou -->

- [ ] Dia 01: explicar por que `node ts-async/tipos.ts` rodava mesmo com erros de tipo
- [ ] Dia 01: explicar por que a kata 7 mantém a referência dos itens que não mudaram, e por que o React se importa com isso
- [x] Dia 02: formatar o valor monetário com `Intl.NumberFormat` em `ItemSolicitacao`
- [x] Dia 02: limpar os dois itens mockados avulsos renderizados no topo de `App.tsx`

## Conceitos que errei

<!-- Alimenta o /quiz. Formato: - Dia NN: conceito, o que eu achava vs. o que é de verdade -->

## Dúvidas em aberto

<!-- Perguntas que ficaram sem resposta. Leve para a IA ou para o aquecimento do dia seguinte. -->

- Dia 01: travei na kata 7. Por que o React compara por referência, e não pelo conteúdo do objeto?
