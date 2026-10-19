# US-02 (Dia 02) — Listagem Inicial de Solicitações e Componentização

> **Fase 2: núcleo do React** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 01

## História de Usuário

**Como** atendente de suporte ao cliente,  
**quero** visualizar uma listagem inicial com os chamados de atendimento com valores formatados em moeda nacional,  
**para** consultar as solicitações de clientes registradas no sistema.

---

## Aquecimento (5 min, sem consultar)

1. Por que o React precisa de um objeto novo para perceber que algo mudou? (dia 1) porque o React é reativo, entao ele so percebe quando algo novo existe
2. O que o `find` devolve quando não encontra nada? (dia 1) undefined
3. Por que os tipos do TS não protegem você contra um JSON errado vindo da API? (dia 1) porque nao existe validacao runtime, somente quando chega a requisicao

---

## Ponte com .NET

- **Componente ˜ componente Blazor ou partial view com parâmetros fortemente tipados.** Props são parâmetros de entrada e são somente leitura (`readonly`).
- **JSX ˜ Razor, mas compilado para JavaScript puro.** Por isso escrevemos `className` em vez de `class` e usamos `{}` para expressões dinâmicas.
- **Onde quebra:** o componente é uma função invocada **novamente a cada render**. Não existe uma instância com ciclo de vida contínuo retendo variáveis locais na memória entre renderizações.

---

## Decisão Arquitetural do Dia

**Pergunta:** quando quebrar um componente em outros menores?

| Sinal | Quebrar? | Por quê |
|---|---|---|
| O bloco possui um **nome de domínio** claro (`ItemSolicitacao`, `FiltroStatus`) | Sim | O nome vira contrato explícito, e as props definem sua interface pública. |
| Partes que **mudam por motivos diferentes** (a lista muda com os dados, o filtro com o clique) | Sim | Aplicação direta do Princípio de Responsabilidade Única (SRP) na tela. |
| O componente recebe **flags de modo** (`isCompact`, `isAdmin`, `variant="x"`) trocando metade do JSX | Sim, em dois | Múltiplas ramificações condicionais extensas em JSX representam componentes distintos disfarçados. |
| "Está grande" ou "talvez eu vá reutilizar algum dia" | Não | Reuso hipotético gera abstração prematura e acoplamento indevido, exatamente como no backend. |
| Bloco trivial de 3 linhas sem semântica própria | Não | Apenas espalha o código sem ganho arquitetural. |

**Recomendação:** inicie com um componente único e extraia apenas quando houver semântica de domínio clara e props bem delimitadas. Mantenha componentes de apresentação **puros** (mesmas props produzem sempre o mesmo JSX).

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Estruturação do Endpoint Inicial
- Em `api/Program.cs`, organizar a base de dados em memória inicial (ex.: `List<Solicitacao>` ou repositório simples) carregando os 6 registros padrão da aplicação.
- Mapear o endpoint `GET /solicitacoes` que retorna `Results.Ok(lista)` utilizando os tipos de `api/Contratos/SolicitacaoContratos.cs`.
- Garantir que o endpoint esteja acessível e visível na documentação `/openapi/v1.json`.

### Frontend (`web/`) — Inicialização da SPA e Renderização da Lista
- **Passo 1 — Scaffold do Projeto:** Inicializar a aplicação com `npm create vite@latest painel -- --template react-ts`.
- **Passo 2 — Contratos e Mock Inicial:** Configurar `src/tipos.ts` com o tipo `Solicitacao` e carregar o mock `src/dados/solicitacoes-mock.ts` espelhando os dados do backend.
- **Passo 3 — Componente Atômico:** Criar `ItemSolicitacao` recebendo a solicitação via `Props` e formatando o valor monetário com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- **Passo 4 — Lista e Reconciliação:** Criar `ListaSolicitacoes` recebendo `Solicitacao[]` e iterando com `.map()` passando chave estável obrigatória `key={s.id}`.
- **Passo 5 — Pureza e StrictMode:** Entender por que o `StrictMode` do React executa funções de renderização duas vezes em ambiente de desenvolvimento.

### Referências Técnicas
- Vite Getting Started: https://vite.dev/guide/
- Your First Component: https://react.dev/learn/your-first-component
- Writing Markup with JSX: https://react.dev/learn/writing-markup-with-jsx
- Passing Props to a Component: https://react.dev/learn/passing-props-to-a-component
- Rendering Lists & Keys: https://react.dev/learn/rendering-lists
- Keeping Components Pure: https://react.dev/learn/keeping-components-pure

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** O backend responde `GET /solicitacoes` retornando status 200 e um array JSON com as 6 solicitações base documentadas no OpenAPI.
- [ ] **CA 2 (FE):** A aplicação Vite executa sem erros em `http://localhost:5173`.
- [ ] **CA 3 (FE):** O componente `ItemSolicitacao` renderiza cliente, status e o valor monetário formatado corretamente em moeda brasileira (R$).
- [ ] **CA 4 (FE):** A renderização da lista não gera warnings no console do navegador e utiliza `key={s.id}` (sem uso do índice do array como key).
- [ ] **CA 5 (FE):** Os componentes `ItemSolicitacao` e `ListaSolicitacoes` são funções puras (sem efeitos colaterais durante o render).

---

## Armadilhas Comuns

- **Nomes em JSX:** Atributos HTML reservados mudam: `class` vira `className` e `onclick` vira `onClick`.
- **Convenção de nomenclatura:** Nomes de componentes React devem iniciar com letra maiúscula (`ItemSolicitacao`, nunca `itemSolicitacao`).
- **`key={index}`:** Usar índice como chave quebra a reconciliação e o foco de elementos quando itens são filtrados ou reordenados.
- **`npm run dev` não bloqueia por tipagem:** A checagem de tipos estrita do TypeScript deve ser validada com o editor ou com `npm run build`.

---

## Prompts Prontos

- "Explique o papel de cada arquivo de um projeto Vite react-ts para um dev .NET, comparando com Program.cs, .csproj etc."
- "Minha árvore de componentes é <cole>. Algum componente está grande demais ou pequeno demais? Use os critérios de responsabilidade única, sem reescrever o código."

---

## Pronto quando

- [ ] O `web/` roda, com a lista montada em `ListaSolicitacoes` ? `ItemSolicitacao`, props tipadas e `key={s.id}`.
- [ ] Você explica componente, JSX e props com as suas palavras.
- [ ] Você explica o que é um componente puro e por que o StrictMode renderiza 2 vezes em desenvolvimento.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-02.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-02): painel com componentes"`.
3. Próximo: [Dia 03 — Estado e re-render](us-03-filtro-totalizadores.md).
