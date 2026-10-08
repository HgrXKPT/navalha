# T-002 · Deploy contínuo na Vercel

| Tipo | Tamanho | Marco | Depende de |
|---|---|---|---|
| feature | P (até 30 min) | 0 · Primeiro dia | T-001 |

**Conceito novo:** build de produção; deploy contínuo.

## Contexto

O site precisa de um endereço público desde o primeiro dia, porque é o link do seu portfólio. A partir deste ticket, cada merge na `main` publica o site sozinho.

## Passo a passo

1. Rode `git switch main` e `git pull`, e crie a branch `feature/T-002-deploy`.
2. Gere o build de produção e veja o resultado:

   ```powershell
   cd web
   npm run build
   npm run preview
   ```

   O `build` cria a pasta `web/dist/` só com HTML, CSS e JS estáticos. O `preview` serve essa pasta em http://localhost:4173.
3. Crie uma conta na Vercel entrando com o GitHub e importe o repositório `navalha`:
   - **Root Directory:** `web`
   - **Framework Preset:** Vite (a Vercel detecta sozinha)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Clique em Deploy e abra a URL que a Vercel gerar.
5. No `README.md` da raiz, troque a linha "Demo: o link entra no T-002" pelo link do site.
6. Faça o commit, abra o PR, espere o CI ficar verde e faça o merge. Depois, confira na aba Deployments da Vercel que o merge gerou um deploy novo sozinho.

## Critérios de aceite

- [ ] **Dado** o projeto, **quando** rodo `npm run build`, **então** a pasta `web/dist/` é gerada sem erro.
- [ ] **Dado** a URL da Vercel, **quando** abro no celular e no computador, **então** a página carrega com o título e o ícone do T-001.
- [ ] O `README.md` tem o link da demo.
- [ ] Depois do merge, a Vercel publicou sozinha: aparece um deploy novo na aba Deployments.

## Layout

Não há tela nova.

## Fora do escopo

- Domínio próprio.
- Variáveis de ambiente.
- Deploy da API, que fica para o marco 3.

## Guia rápido

- [Fluxo de trabalho › Deploy na Vercel](../guias/fluxo-de-trabalho.md#deploy-na-vercel)
- Oficial: [Vite · Deploy de site estático](https://vite.dev/guide/static-deploy)

## Como conferir

`npm run build` · abrir a URL da Vercel · `/revisar`
