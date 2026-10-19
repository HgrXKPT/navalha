# Navalha — Painel Operacional Fullstack

<div align="center">

[![Demo Vercel](https://img.shields.io/badge/Demo-Vercel-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://navalha-theta.vercel.app/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript%20Strict-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://navalha-theta.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-.NET%2010%20%7C%20Clean%20Architecture-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](#arquitetura-backend-net-10)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](#)

<p align="center">
  Plataforma de gestão operacional e agendamento para barbearias, desenvolvida com foco em <strong>decisões de engenharia front↔back</strong>, tipagem estrita de ponta a ponta, concorrência otimista e arquitetura desacoplada.
</p>

</div>

---

## 🚀 Demonstração

- **Frontend ao vivo:** [https://navalha-theta.vercel.app/](https://navalha-theta.vercel.app/)
- **Deploy contínuo:** integrado via Vercel e GitHub Actions a cada merge na branch principal.

---

## ⚡ Destaques de Engenharia & Arquitetura

### 1. Backend em Clean Architecture (.NET 10 / C# moderno)
- **Domain Rico e Invariantes:** entidade `Solicitacao` com validação de regras de negócio, proteção contra transições ilegais de status e versionamento atômico.
- **Tratamento Centralizado de Erros:** middleware global emitindo `ProblemDetails` padronizado conforme **RFC 9457**.
- **Concorrência Otimista com ETag:** suporte a headers `ETag` e validação de `If-Match`, prevenindo *lost updates* com resposta `412 Precondition Failed`.
- **Testes Automatizados:** suíte de testes de unidade em **xUnit** cobrindo cenários de borda e regras de negócio.

### 2. Frontend Reativo e Tipado (React 19 + TypeScript)
- **Estado Mínimo e Dados Derivados:** eliminação de `useState` redundante para totais e filtros, prevenindo dessincronização de tela.
- **Lógica Plana & Imutabilidade:** atualizações de coleções orientadas a substituição imutável e guard clauses.
- **Qualidade Estrita:** linting com **oxlint**, formatação padronizada com **Prettier** e tipagem estrita com TypeScript.

### 3. Decisões Arquiteturais Documentadas (ADRs)
As escolhas técnicas de design de software são registradas formalmente em `decisoes/` (Architecture Decision Records), detalhando contexto, alternativas avaliadas, critérios de decisão e métricas de validação.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias |
| :--- | :--- |
| **Frontend (`web/`)** | React 19, TypeScript strict, Vite 8, CSS Modules, Tokens de Design |
| **Backend (`api/`)** | .NET 10, ASP.NET Core, Minimal APIs, Clean Architecture, xUnit |
| **Qualidade & CI** | oxlint, Prettier, Vitest, GitHub Actions (build do front e testes .NET em paralelo) |
| **Infra & Deploy** | Vercel (Frontend), Docker Compose (PostgreSQL em roadmap) |

---

## 📁 Estrutura do Repositório

```
navalha/
├── web/              # Aplicação React 19 + Vite (deploy Vercel)
│   ├── src/          # Componentes, mocks, tipos e design tokens
│   └── package.json  # Scripts de dev, build, check e format
├── api/              # Solução .NET 10 em Clean Architecture
│   ├── Painel.slnx   # Solution file (.slnx)
│   ├── src/          # Painel.Api, Painel.Application, Painel.Domain, Painel.Infrastructure
│   └── tests/        # Painel.UnitTests (xUnit)
├── backlog/          # Roteiro das 17 User Stories (US-01 a US-17)
├── decisoes/         # ADRs de engenharia front↔back
├── diario/           # Diário de bordo da evolução técnica
├── exercicios/       # Katas práticos de JavaScript e TypeScript
├── guia/             # Metodologia de estudo e ponte conceitual .NET ↔ React
├── PROGRESSO.md      # Painel de acompanhamento de User Stories e pendências
└── AGENTS.md         # Regras do modo tutor para IA assistente
```

---

## 💻 Como Rodar o Projeto

### Pré-requisitos
- Node.js 22+ e npm
- .NET 10 SDK

### Frontend (`web/`)
```powershell
cd web
npm install
npm run dev
```
O app estará acessível em `http://localhost:5173`.

Para rodar todos os checks de qualidade (tipos, lint, formatação e testes):
```powershell
npm run check
```

### Backend (`api/`)
```powershell
dotnet test api/Painel.slnx
dotnet run --project api/src/Painel.Api
```
A API estará disponível com documentação OpenAPI ativa em desenvolvimento.

### Katas e Exercícios (`exercicios/`)
```powershell
cd exercicios
npm install
npm run test:js
npm run typecheck
```

---

## 📋 Roadmap de User Stories

O progresso é monitorado continuamente através do [`PROGRESSO.md`](PROGRESSO.md):
- [x] **US-01:** Fundação, tipagem e contratos imutáveis
- [x] **US-02:** Listagem de solicitações e componentização
- [ ] **US-03:** Filtro por status, totalizadores e transição de conclusão
- [ ] **US-04:** Visão de detalhe e onde vive o estado (ADR)
- [ ] **US-05:** Indicador na aba, busca e custom hooks
- [ ] **US-06:** Integração fim a fim e OpenAPI tipado (ADR)
- [ ] **US-07:** Paginação server-side e TanStack Query (ADR)
- [ ] **US-08 a US-17:** Concorrência otimista (ETag), SignalR, resiliência e deploy unificado
