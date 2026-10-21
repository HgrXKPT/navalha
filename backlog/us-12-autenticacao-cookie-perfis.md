# US-12 (Dia 12) — Autenticação por Cookie HttpOnly e Controle de Acesso por Perfil

> **Fase 4: qualidade de produção** · ? 1h essencial / 2h com extras · Pré-requisito: Dia 11

## História de Usuário

**Como** usuário do sistema (atendente ou supervisor),  
**quero** autenticar minha sessão via credenciais com cookies protegidos contra furto de scripts e acessar apenas as ações autorizadas para meu perfil,  
**para** operar a aplicação com segurança e receber alertas adequados caso tente executar operações restritas a supervisores.

---

## Aquecimento (5 min, sem consultar)

1. Em que ordem deixar uma página leve? (dia 11)
2. Quando CSR é a escolha certa? (dia 11)
3. Esconder o botão "Recusar" do atendente é segurança? (dia 9)

---

## Ponte com .NET

- **Cookie de Sessão do ASP.NET Core (`AddAuthentication().AddCookie()`) ˜ Cookie com flags `HttpOnly` e `SameSite`.** O navegador gerencia e transmite o cookie automaticamente em cada requisição; o JavaScript não possui acesso de leitura ou escrita a ele.
- **`[Authorize(Policy = "Supervisor")]` / `RequireAuthorization()` ˜ Rotas protegidas e botões condicionais no React.** No frontend, esconder componentes é **apenas experiência de usuário (UX)**. A barreira real de autorização é sempre imposta pelo backend.
- **`HttpContext.User` ˜ Usuário autenticado na UI.** No frontend moderno, os dados do usuário conectado são **dados do servidor** obtidos via `GET /me` e mantidos em cache com TanStack Query.

---

## Decisão Arquitetural do Dia

**Pergunta 1:** onde armazenar o estado de autenticação e sessão?

| Mecanismo | Funcionamento | Vulnerabilidade Principal | Quando Utilizar |
|---|---|---|---|
| **JWT no `localStorage`** | O script lê o token do disco e anexa no cabeçalho `Authorization` | **Vulnerável a XSS:** qualquer script malicioso ou dependência comprometida rouba o token | Evitar quando você controla a API |
| **Token em memória** | Token volátil mantido em closures | Perdido ao pressionar F5; fluxo de refresh complexo | SPAs puras consumindo provedores externos (OIDC / OAuth2) |
| **Cookie `HttpOnly` + `SameSite`** | Emitido pelo backend na resposta de login | Requer proteção CSRF (`SameSite=Lax/Strict` e antiforgery em mutações) | **Padrão recomendado** quando API e front compartilham a mesma origem |

**Pergunta 2:** o que a interface gráfica NÃO consegue proteger?
- Ocultar botões ou rotas não impede chamadas diretas via API.
- Variáveis prefixadas com `VITE_` em arquivos `.env` ficam gravadas em texto plano no bundle final do cliente; segredos de infraestrutura jamais devem ir para o frontend.
- O React protege contra XSS escapando strings por padrão no JSX. O perigo real surge ao utilizar `dangerouslySetInnerHTML`.

**Pergunta 3:** como tratar 401 versus 403 na interface?
- **HTTP 401 (Não Autenticado):** "Não sei quem você é". Redirecionar imediatamente para a tela de login.
- **HTTP 403 (Proibido):** "Sei quem você é, mas seu perfil não tem permissão para esta ação". Exibir mensagem explicativa próxima ao botão e **manter o usuário conectado**.

---

## Especificação de Entrega (Backlog Técnico)

### Backend (`api/`) — Autenticação Cookie e Políticas de Autorização
- Em `api/Program.cs`, configurar:
  - `builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options => { options.Cookie.HttpOnly = true; options.Cookie.SameSite = SameSiteMode.Lax; options.ExpireTimeSpan = TimeSpan.FromMinutes(30); })`.
  - Mapear endpoints:
    - `POST /login`: recebe `LoginRequest(usuario)`. Usuários de teste: `ana` (claim perfil = `"atendente"`) e `carlos` (claim perfil = `"supervisor"`). Realiza `HttpContext.SignInAsync()`.
    - `POST /logout`: limpa sessão com `HttpContext.SignOutAsync()`.
    - `GET /me`: protegido por `RequireAuthorization()`, retorna `UsuarioResponse(Nome, Perfil)`.
  - Aplicar `RequireAuthorization()` nos endpoints `/solicitacoes`.
  - Exigir perfil de `supervisor` para transicionar o status de uma solicitação para `recusada` (retornar `Results.Forbid()` / 403 se for atendente).
  - Garantir que a API retorne **401/403** (e nunca redirecionamento HTML 302).
- No mesmo dia o front faz login e monta o RBAC; o proxy de desenvolvimento repassa `/api` para a API **removendo** o prefixo, porque a API ainda responde nas rotas da raiz.

### Frontend (`web/`) — Proxy, Tela de Login e RBAC
- **Passo 1 — Proxy do Vite:** Configurar em `vite.config.ts` o proxy reverso encaminhando requisições de `/api` para a API .NET, viabilizando o fluxo de cookies na mesma origem (`localhost:5173`).
- **Passo 2 — Hook de Sessão do Servidor:** Criar hook `useUsuario()` consumindo `GET /me` com `useQuery(['me'])`.
- **Passo 3 — Tela de Login e Header Dinâmico:** Criar rota `/login` com seleção de usuário (`ana` ou `carlos`). Exibir no header o nome e perfil do usuário logado com botão de logout.
- **Passo 4 — Interceptação de 401 e 403:**
  - Redirecionar globalmente para `/login` quando qualquer requisição retornar 401.
  - Exibir alerta contextual caso um atendente tente recusar um chamado recebendo 403.
- **Passo 5 — Teste de Resistência a XSS:** Cadastrar chamado contendo payload malicioso `<img src=x onerror=alert(1)>` e constatar que o React neutraliza a execução de scripts.
- **Passo 6 — ADR 12:** Registrar em `decisoes/12-autenticacao.md` a decisão por Cookies `HttpOnly`, a divisão 401 vs 403 e os limites de segurança do cliente.

### Referências Técnicas
- MDN HTTP Cookies: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies
- Cookie Authentication no ASP.NET Core: https://learn.microsoft.com/en-us/aspnet/core/security/authentication/cookie
- OWASP Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP XSS Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

---

## Critérios de Aceite (CA)

- [ ] **CA 1 (BE):** O endpoint `POST /login` emite um cookie de autenticação com as flags `HttpOnly` e `SameSite=Lax`.
- [ ] **CA 2 (BE):** Chamadas sem cookie respondem estritamente 401 (sem redirect 302) e tentativas de recusa por atendente respondem 403.
- [ ] **CA 3 (FE):** A aplicação utiliza o proxy `/api` do Vite, enviando e recebendo cookies sem necessidade de CORS complexo no browser.
- [ ] **CA 4 (FE):** O cabeçalho da aplicação exibe o nome e perfil do usuário autenticado obtido do endpoint `/me`.
- [ ] **CA 5 (FE):** Ao receber um 401, a aplicação redireciona automaticamente para a rota `/login`.
- [ ] **CA 6 (FE):** Ao tentar recusar um chamado com o perfil atendente, a ação responde 403 e a tela exibe um aviso claro de restrição sem deslogar o usuário.
- [ ] **CA 7 (FE):** A inserção de tags HTML/scripts em observações é renderizada como texto inofensivo sem disparar alertas no navegador.
- [ ] **CA 8 (ADR):** O arquivo `decisoes/12-autenticacao.md` está formalizado detalhando a segurança da sessão.

---

## Armadilhas Comuns

- **Armazenar tokens em `localStorage`:** Exposição crítica a ataques de roubo de credenciais via XSS.
- **API respondendo com redirect 302:** O comportamento padrão do MVC antigo de redirecionar para `/Account/Login` quebra SPAs; a API deve responder status 401 puro.
- **Achar que esconder botão é proteção:** Qualquer usuário pode abrir o DevTools e invocar o endpoint restrito; a validação de perfil deve ocorrer no C#.

---

## Prompts Prontos

- "Compare cookie httpOnly e token no localStorage para uma SPA com back .NET próprio: riscos, mitigação e quando cada um faz sentido."

---

## Pronto quando

- [ ] Login e logout funcionam, e o usuário vem de `/me` via `useQuery`.
- [ ] Um 401 leva para o login e um 403 mostra uma mensagem, sem deslogar.
- [ ] Você provou que o back recusa uma ação sem permissão mesmo com o botão visível, e que o texto com `<img onerror>` não executa.
- [ ] O ADR `decisoes/12-autenticacao.md` está registrado.

---

## Fechamento

1. Rode `/fechar-dia`, ou preencha `diario/dia-12.md` a partir do [modelo](../diario/_modelo.md).
2. Faça o commit: `git add . && git commit -m "feat(dia-12): autenticação por cookie"`.
3. Próximo: [Dia 13 — Testes e organização](us-13-testes-integracao-msw.md).
