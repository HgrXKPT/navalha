# US-08 (Dia 08) — Navegação Multi-telas e Deep Linking via URL

> **Fase 3: fronteira com o back** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 07

## História de Usuário

**Como** atendente de suporte,  
**quero** navegar entre telas distintas (listagem com filtros, detalhe do chamado e placeholder de novo cadastro) com URLs amigáveis e compartilháveis,  
**para** poder favoritar links diretos para chamados específicos, recarregar a página (F5) sem perder os filtros aplicados e usar os botões de voltar e avançar do navegador.

---

## Aquecimento (5 min, sem consultar)

1. Por que filtro e página precisam estar na query key? (dia 7)
2. Quando filtrar no cliente é aceitável? (dia 7)
3. O que o `invalidateQueries` faz? (dia 7)

---

## Ponte com .NET

- **Rotas declarativas lembram o roteamento de Minimal APIs (`MapGet("/solicitacoes/{id}")`)**, com a diferença de que na SPA quem resolve as telas é o roteador JavaScript no navegador.
- **Query String no front ˜ `[FromQuery]` no controller/endpoint**, só que no frontend ela atua como **estado persistente de tela**, não apenas parâmetro de transporte de uma requisição.
- **Onde quebra:** Em SPA, o servidor web entrega o mesmo `index.html` estático para qualquer rota acessada. Em produção, se o servidor não tiver configuração de fallback para o `index.html`, o acesso direto a uma URL profunda (ex.: `/solicitacoes/12`) responde 404 no servidor.

---

## Decisão Arquitetural do Dia

**Pergunta:** quais dados devem ir para a URL e quais devem permanecer em memória interna?

| O que DEVE ir para a URL | O que NÃO DEVE ir para a URL |
|---|---|
| Identificador de rota e recurso (`/solicitacoes/42`) | Estados efêmeros de animação ou interação (hover, dropdown aberto) |
| Filtros de listagem, termos de busca, ordenação e página ativa | Dados confidenciais ou sensíveis (senhas, CPFs, tokens JWT) |
| Aba visual ativa que o usuário espera manter ao retornar | Dados volumosos em si (a lista inteira; na URL vai só o ponteiro de busca) |
| Parâmetros de contexto que viabilizam link compartilhável | Rascunhos inacabados de formulários complexos |

**Critério de decisão:** *"Se o usuário copiar o link e colar em outra aba ou pressionar F5, ele espera ver exatamente o mesmo recorte de tela?"* Se sim, o estado pertence à URL.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Suporte e Tolerância a Parâmetros Inválidos
- Na API (`api/`), garantir que o endpoint `GET /solicitacoes/{id:int}` retorne status `404 Not Found` quando o id não for encontrado.
- Tratar parâmetros de query inválidos em `GET /solicitacoes` (ex.: `pagina=0` ou valores não numéricos) caindo com segurança para a primeira página sem disparar erro 500.
- O front do dia 08 adota o React Router: a rota da listagem lê os parâmetros da URL e repete a consulta à API.

### Frontend (`web/`) — Roteamento com React Router
- **Passo 1 — Configuração do Roteador:** Instalar `react-router` e envolver a aplicação no `BrowserRouter` no `main.tsx`.
- **Passo 2 — Rotas e Layout:** Configurar as rotas:
  - `/solicitacoes`: listagem principal;
  - `/solicitacoes/:id`: tela de detalhes;
  - `/solicitacoes/nova`: placeholder para a criação de chamada;
  - `/`: redirecionamento declarativo para `/solicitacoes`;
  - `*`: rota de captura para página "Não Encontrado".
  - Criar um Layout base contendo header fixo e `<Outlet />` para renderizar as telas filhas.
- **Passo 3 — Detalhe Conectado ao `:id`:** Fazer o componente de detalhe ler o parâmetro da rota via `useParams` e buscar os dados da API usando `useQuery(['solicitacao', id])`, tratando respostas 404 com mensagem amigável.
- **Passo 4 — URL como Estado Primário:** Substituir o `useState` de filtro, busca e página por `useSearchParams`. As chaves do TanStack Query devem consumir diretamente os valores extraídos da URL.
- **Passo 5 — Links de Navegação:** Substituir tags `<a href>` por componentes `<Link to="...">` e `<NavLink>` para navegação SPA sem recarregar a página inteira.

### Referências Técnicas
- React Router Declarative Installation: https://reactrouter.com/start/declarative/installation
- Routing and Layouts: https://reactrouter.com/start/declarative/routing
- URL Values (useParams, useSearchParams): https://reactrouter.com/start/declarative/url-values
- Navigating (Link, NavLink, useNavigate): https://reactrouter.com/start/declarative/navigating

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** O backend responde 404 padronizado para IDs inexistentes e normaliza parâmetros anômalos de query string.
- [ ] **CA 2 (FE):** A navegação entre lista e detalhes ocorre instantaneamente via `<Link>`, sem recarregamento completo da página (sem F5).
- [ ] **CA 3 (FE):** Ao aplicar filtros e navegar para a página 2, o recarregamento manual (F5) mantém os filtros e a página selecionada intactos.
- [ ] **CA 4 (FE):** Copiar a URL com filtros e abri-la em uma nova janela carrega exatamente a mesma visualização de chamados.
- [ ] **CA 5 (FE):** Acesso a rotas com id inexistente (`/solicitacoes/99999`) ou parâmetros malformados exibe mensagem de recurso não encontrado com botão de retorno, sem estourar exceções na tela.

---

## Armadilhas Comuns

- **Parâmetros da URL são strings:** `useParams` e `useSearchParams` sempre retornam strings. Converta para número (`Number(id)`) e trate cenários onde o resultado é `NaN`.
- **Tags `<a href>` comuns:** Usar `<a>` provoca uma requisição HTTP completa para o servidor, destruindo todo o cache em memória do TanStack Query. Utilize sempre `<Link to>`.
- **Importação incorreta de pacotes:** Na versão moderna unificada, instale e importe diretamente de `react-router` (evite imports do legado `react-router-dom`).

---

## Prompts Prontos

- "Explique como uma SPA resolve rotas no navegador e por que o servidor precisa de fallback para index.html em produção."
- "Estou pensando em colocar <X> na URL. Me faça as perguntas do critério para eu decidir."

---

## Pronto quando

- [ ] As 3 telas funcionam pela URL, e o F5 e o botão voltar funcionam em todas.
- [ ] O F5 mantém filtro, busca e página, e um link copiado abre a mesma lista.
- [ ] Um id inexistente e uma query string inválida não quebram a tela.
- [ ] Você explica o que vai e o que não vai para a URL, e por que um CPF não vai.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-08.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-08): rotas e filtros na url"`.
3. Próximo: [Dia 09 — Validação: front vs. back](us-09-abertura-chamado-validacao.md).
