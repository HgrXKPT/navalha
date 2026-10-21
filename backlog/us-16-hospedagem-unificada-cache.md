# US-16 (Dia 16) — Hospedagem Unificada SPA + API na Mesma Origem e Cache

> **Fase 5: integração avançada** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 15

## História de Usuário

**Como** engenheiro de software responsável pelo deploy da solução,  
**quero** empacotar a SPA React compilada para ser servida pelo próprio processo da Minimal API .NET com cabeçalhos de cache diferenciados e rotas unificadas,  
**para** rodar a aplicação em produção em um único artefato auto-contido, eliminando a necessidade de CORS, mitigando riscos de cache do `index.html` e garantindo respostas 404 estritas em endpoints inexistentes.

---

## Aquecimento (5 min, sem consultar)

1. O que o evento do SignalR carrega, e por quê? (dia 15)
2. O que fazer depois de uma reconexão? (dia 15)
3. Por que o servidor precisa devolver o `index.html` para rotas da SPA? (dia 8)

---

## Ponte com .NET

- **`npm run build` ˜ `dotnet publish`.** O compilador do Vite gera a pasta `dist/` contendo arquivos estáticos puros (HTML, JS minificado com hash, CSS).
- **`app.UseStaticFiles()` + `app.MapFallbackToFile("index.html")`:** Faz a API .NET atender como servidor de arquivos estáticos para o frontend e resolver o fallback de rotas da SPA para qualquer URL desconhecida no backend.
- **Variáveis de ambiente em tempo de build vs. runtime:** Em C#, o `appsettings.json` é lido em tempo de execução (runtime). No frontend compilado, variáveis como `import.meta.env.VITE_*` são **substituídas e fixadas em texto estático durante o build** (`npm run build`). Mudar a variável de ambiente no servidor onde o binário roda não altera o JS já construído.

---

## Decisão Arquitetural do Dia

**Pergunta 1:** qual topologia de hospedagem adotar em produção?

| Topologia | Como Opera | Vantagens | Desvantagens | Cenário Indicado |
|---|---|---|---|---|
| **API serve a SPA (`wwwroot`)** | A pasta `dist/` vai para `wwwroot/` e é servida pelo Kestrel | Um único deploy; mesma origem estrita; zero CORS; autenticação por cookies simplificada | Deploy acoplado (front e back sobem juntos) | **Aplicações corporativas e painéis internos** (recomendado para o projeto) |
| **Front em CDN / Storage + API em subdomínio** | Ex.: `app.empresa.com` e `api.empresa.com` | Deploys 100% independentes; distribuição global via CDN | Requer CORS com credenciais; configuração de cookies cross-domain delicada | Sites públicos com alta escala global |
| **Reverse Proxy / Gateway unificado (YARP / Nginx)** | Proxy na porta 80/443 roteia `/` para o front e `/api` para o backend | Mesma origem para o navegador mantendo deploys independentes | Mais uma camada de infraestrutura para gerenciar | Ambientes distribuídos com múltiplos microserviços |

**Pergunta 2:** como configurar a política de cache HTTP?
- **Arquivos de Assets (`/assets/*.js`, `*.css`):** Possuem hash criptográfico único em seus nomes gerados pelo Vite (ex.: `index-D8x2a1.js`). Devem ser cacheados agressivamente:
  `Cache-Control: public, max-age=31536000, immutable`.
- **Arquivo `index.html`:** O arquivo de entrada **nunca** pode sofrer cache de longa duração. Se o `index.html` ficar em cache, deploys novos farão o usuário apontar para chunks antigos que foram apagados do servidor:
  `Cache-Control: no-cache`.

**A armadilha crítica de fallback:** Se você configurar `MapFallbackToFile("index.html")` sem restrições, uma requisição para uma rota de API inexistente (ex.: `GET /api/recurso-inexistente`) devolverá status **200 OK com o código HTML da página**, quebrando clientes de API. Deve-se interceptar `/api/{**rest}` respondendo `404 Not Found` **antes** do fallback da SPA.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Pipeline de Hospedagem Estática e Fallbacks
- Em `api/Program.cs`:
  - Agrupar todos os endpoints de negócio sob o prefixo `/api` via `app.MapGroup("/api")`.
  - Habilitar suporte a arquivos estáticos na pasta `wwwroot`: `app.UseDefaultFiles()` e `app.UseStaticFiles(...)`.
  - Configurar as opções de `StaticFileOptions` para injetar os cabeçalhos de cache:
    - Para o `index.html`: `Cache-Control: no-cache`.
    - Para arquivos dentro de `/assets/`: `Cache-Control: public, max-age=31536000, immutable`.
  - Configurar a ordem estrita de fallbacks no pipeline:
    1. `app.MapFallback("/api/{**rest}", () => Results.NotFound());`
    2. `app.MapFallbackToFile("index.html");`
- No mesmo dia o front passa a ser servido pela própria API; o proxy de desenvolvimento deixa de remover o prefixo `/api`.

### Frontend (`web/`) — Migração para URL Relativa e Build de Produção
- **Passo 1 — Eliminação de Variáveis Absolutas:** Remover referências a `VITE_API_URL`. Todos os serviços de API passam a utilizar URLs relativas iniciando com `/api/...` (aproveitando a mesma origem).
- **Passo 2 — Ajuste do Proxy de Desenvolvimento:** Em `vite.config.ts`, ajustar o proxy para repassar `/api` diretamente para a porta da API .NET sem remover o prefixo.
- **Passo 3 — Build e Publicação no Backend:**
  - Gerar os artefatos de produção da SPA com `npm run build` na pasta `web/`.
  - Copiar todo o conteúdo gerado em `web/dist/` para a pasta `api/wwwroot/`.
- **Passo 4 — Validação em Processo Único:**
  - Desligar completamente o servidor de desenvolvimento do Vite.
  - Executar apenas a API .NET via `dotnet run` na pasta `api/`.
  - Acessar a aplicação pela porta Kestrel da API (ex.: `http://localhost:5000`):
    - Realizar login e listagem;
    - Testar recarregamento (F5) em rota profunda (`/solicitacoes/1`);
    - Confirmar que `GET /api/nao-existe` retorna **404 Not Found** (e não HTML).
- **Passo 5 — ADR 16:** Registrar em `decisoes/16-deploy.md` a topologia unificada de deploy e a estratégia de cabeçalhos de cache.

### Referências Técnicas
- Arquivos Estáticos no ASP.NET Core: https://learn.microsoft.com/en-us/aspnet/core/fundamentals/static-files
- Vite Static Deploy: https://vite.dev/guide/static-deploy
- MDN Cache-Control: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control
- YARP (Yet Another Reverse Proxy) Overview: https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/yarp/yarp-overview

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** A Minimal API serve o frontend e a API a partir de um único processo executável.
- [ ] **CA 2 (BE):** Acessar URLs de rotas SPA diretamente no navegador (ex.: `/solicitacoes/2`) responde 200 servindo o `index.html`.
- [ ] **CA 3 (BE):** Acessar rotas `/api/...` inexistentes responde com status HTTP 404 estrito (sem retornar o documento HTML).
- [ ] **CA 4 (BE):** Os cabeçalhos de resposta HTTP contêm `Cache-Control: no-cache` para o `index.html` e `Cache-Control: public, max-age=31536000, immutable` para arquivos estáticos em `/assets/`.
- [ ] **CA 5 (FE):** O código fonte do frontend não possui referências fixas a domínios ou portas de API, utilizando chamadas relativas `/api`.
- [ ] **CA 6 (FE):** Todos os fluxos da aplicação (autenticação, paginação, formulário, detalhes e WebSockets) funcionam com o servidor de desenvolvimento Vite desligado.
- [ ] **CA 7 (ADR):** O arquivo `decisoes/16-deploy.md` está formalizado detalhando as três topologias de hospedagem e suas políticas de cache.

---

## Armadilhas Comuns

- **Fallback engolindo erros 404 da API:** Esquecer a regra `MapFallback("/api/{**rest}", () => Results.NotFound())` faz o servidor responder 200 com HTML para rotas de backend que falharam, mascarando problemas graves.
- **Cache agressivo no `index.html`:** O navegador guardará o arquivo HTML antigo e continuará tentando carregar arquivos JS com hashes que não existem mais após o deploy, deixando a aplicação quebrada para o usuário.
- **Inversão da ordem de middlewares:** Chamar `MapFallbackToFile` antes do registro dos endpoints de API impede que as rotas da Minimal API sejam alcançadas.

---

## Prompts Prontos

- "Compare as 3 topologias de deploy de SPA + API para uma empresa que usa Azure. Me dê os critérios, sem decidir por mim."

---

## Pronto quando

- [ ] Um único processo, a API, serve o painel e a API. O F5 numa rota profunda funciona, e `/api/nao-existe` devolve 404, não HTML.
- [ ] O front não usa `VITE_API_URL`, e o cache está certo nos dois tipos de arquivo.
- [ ] Você explica as 3 topologias e quando cada uma faz sentido.
- [ ] O ADR `decisoes/16-deploy.md` está registrado.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-16.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-16): api servindo a spa na mesma origem"`.
3. Próximo: [Dia 17 — Revisão e mapa de decisões](us-17-consolidacao-mapa-decisoes.md).
