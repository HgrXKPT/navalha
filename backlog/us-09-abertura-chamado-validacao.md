# US-09 (Dia 09) — Abertura de Solicitação com Validação de Formato e Regras de Negócio

> **Fase 3: fronteira com o back** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 08

## História de Usuário

**Como** atendente de suporte,  
**quero** cadastrar uma nova solicitação de atendimento através de um formulário com validação imediata nos campos e mensagens claras caso o backend recuse o registro,  
**para** registrar chamados de clientes garantindo a integridade dos dados e prevenindo duplicidades de solicitações abertas.

---

## Aquecimento (5 min, sem consultar)

1. O que vai para a URL e o que não vai? (dia 8)
2. Por que filtrar no cliente dados que o usuário não pode ver é um vazamento? (dia 7)
3. Que status HTTP o contrato usa para regra de negócio violada? (dia 6)

---

## Ponte com .NET

- **Zod ˜ FluentValidation no C#**, com uma grande vantagem: `z.infer<typeof schema>` deriva o tipo TypeScript diretamente da regra de validação (como se o validator gerasse o DTO C# automaticamente).
- **ValidationProblem (400) com dicionário de `errors` e ProblemDetails (409)** produzidos pelo ASP.NET Core viram erros de campo e mensagens globais na UI.
- **Onde quebra:** No backend, a validação é **fronteira de segurança e integridade**. No frontend, a validação é **apenas experiência do usuário (UX)** — qualquer agente externo pode contornar a tela e disparar requisições diretamente para a API via cURL ou Postman.

---

## Decisão Arquitetural do Dia

**Pergunta:** onde deve residir cada tipo de validação da aplicação?

| Tipo de Regra | Exemplo no Painel | Front | Back | Justificativa Arquitetural |
|---|---|:---:|:---:|---|
| **Formato e Obrigatoriedade** | `cliente` (3 a 100 caracteres); `valor` > 0 | ? UX | ? Proteção | O frontend orienta a digitação; o backend protege a integridade |
| **Limite de Domínio Simples** | `valor` = 10.000 | ? Espelha | ? Verdade | Regra mantida no backend; front espelha para feedback rápido |
| **Regra Dependente de Persistência** | Cliente não pode ter 2 solicitações `aberta` simultâneas | ? | ? (409) | Apenas o servidor enxerga concorrência e estado global do banco |
| **Validação de Transições de Estado** | Status `concluida` não transiciona para `aberta` | Desabilita botão | ? (409) | Telas concorrentes podem tentar transições inválidas |
| **Permissões de Acesso** | Somente supervisor pode recusar chamada | Oculta botão | ? (403) | Ocultar UI é apenas UX; a segurança reside nos endpoints |
| **Cálculos Financeiros** | Valor final e descontos | Prévia visual | ? Recalcula | Jamais confie em valores monetários calculados no navegador |

**Regra de ouro:** o frontend valida para **ajudar o usuário**; o backend valida para **proteger a integridade do sistema**.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Endpoint POST e Regras de Negócio
- Na API (`api/`, via Controller ou Minimal API à sua escolha), implementar o endpoint `POST /solicitacoes` recebendo `CriarSolicitacaoRequest`.
- **Validações de Formato (HTTP 400):**
  - Retornar status 400 (`ValidationProblemDetails`) caso `cliente` tenha menos de 3 ou mais de 100 caracteres, ou se `valor <= 0` ou `valor > 10000`.
- **Regras de Negócio (HTTP 409):**
  - Retornar status 409 (`ProblemDetails` com detail `"Cliente já possui uma solicitação aberta."`) se já existir chamado com status `Aberta` para o mesmo cliente.
- Ao salvar com sucesso, persistir o chamado e retornar status `201 Created` com cabeçalho `Location: /solicitacoes/{id}` e a entidade criada no corpo.
- No mesmo dia o front envia o formulário (react-hook-form + zod) para a API real.

### Frontend (`web/`) — Formulário com React Hook Form e Zod
- **Passo 1 — Schema de Validação:** Instalar `react-hook-form`, `zod` e `@hookform/resolvers`. Criar em `src/paginas/NovaSolicitacao.tsx` o schema Zod espelhando as regras de formato do backend.
- **Passo 2 — Feedback por Campo:** Integrar `useForm` com `zodResolver(schema)`. Renderizar mensagens de erro logo abaixo de cada input que falhar na validação.
- **Passo 3 — Envio e Invalidação:** Enviar os dados via `useMutation` (POST). No sucesso, invalidar `['solicitacoes']` e navegar via `useNavigate` para a tela de detalhes do item criado.
- **Passo 4 — Mapeamento de Erros da API:**
  - Se a API retornar **400 ValidationProblem**: mapear o dicionário `errors` para os respectivos campos do formulário usando `setError`.
  - Se a API retornar **409 Conflict**: exibir alerta de negócio no topo do formulário sem limpar os dados preenchidos.
- **Passo 5 — ADR 09:** Registrar em `decisoes/09-validacao-front-back.md` a matriz de validação distribuída entre camadas.

### Referências Técnicas
- React Hook Form Getting Started: https://react-hook-form.com/get-started
- Zod Documentation: https://zod.dev/basics
- Hookform Resolvers: https://github.com/react-hook-form/resolvers
- RFC 9457 Problem Details for HTTP APIs: https://datatracker.ietf.org/doc/html/rfc9457

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** O endpoint `POST /solicitacoes` retorna 400 com `ValidationProblem` para payloads com cliente ou valor inválidos.
- [ ] **CA 2 (BE):** O backend responde 409 com `ProblemDetails` ao tentar cadastrar uma solicitação para um cliente que já possui solicitação aberta.
- [ ] **CA 3 (FE):** Erros de formato (ex.: nome curto ou valor negativo) são sinalizados em vermelho abaixo dos campos antes de qualquer disparo de requisição de rede.
- [ ] **CA 4 (FE):** Erros 400 retornados pelo backend são mapeados automaticamente para os campos correspondentes via `setError`.
- [ ] **CA 5 (FE):** O erro de negócio 409 é renderizado como um alerta geral de topo, mantendo o formulário preenchido.
- [ ] **CA 6 (FE):** Ao cadastrar com sucesso, o sistema redireciona para a tela de detalhes do chamado recém-criado.
- [ ] **CA 7 (ADR):** O arquivo `decisoes/09-validacao-front-back.md` está formalizado contendo a classificação de todas as regras do domínio.

---

## Armadilhas Comuns

- **Validação de frontend não é barreira de segurança:** Nunca assuma que os dados recebidos pelo backend são válidos só porque o frontend implementa validação com Zod.
- **Tratar 409 como erro de campo:** Viola a semântica de ProblemDetails; regras de negócio globais não devem ser amarradas a um input específico de texto.
- **Inputs numéricos em HTML:** O elemento `<input type="number">` entrega valores no formato string para o JavaScript. Use `z.coerce.number()` no Zod.

---

## Prompts Prontos

- "Classifiquei estas regras entre front e back: <cole>. Alguma está no lugar errado? Me dê o critério, não a resposta."
- "Como mapear os errors de um ValidationProblem do ASP.NET para os campos do react-hook-form? Me dê o conceito, sem o código completo."

---

## Pronto quando

- [ ] Criar uma solicitação funciona de ponta a ponta, e os erros de formato aparecem por campo antes do envio.
- [ ] O 400 do back aparece no campo certo, e o 409 aparece como mensagem geral.
- [ ] Você mostrou que o back recusa um POST inválido feito sem a tela.
- [ ] O ADR `decisoes/09-validacao-front-back.md` classifica cada regra do contrato.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-09.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-09): formulário e validação front/back"`.
3. Próximo: [Dia 10 — Erros e estados de tela](us-10-resiliencia-problemdetails.md).
