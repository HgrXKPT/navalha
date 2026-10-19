import type { Solicitacao } from "../tipos";

export const solicitacoesMock: Solicitacao[] = [
  {
    id: 1,
    cliente: "Ana Souza",
    status: "aberta",
    valor: 50,
    criadaEm: "2026-09-01T10:00:00Z",
    observacao: "Corte degradê navalhado",
  },
  {
    id: 2,
    cliente: "Bruno Lima",
    status: "concluida",
    valor: 120.5,
    criadaEm: "2026-09-03T09:30:00Z",
    observacao: "Corte + Barboterapia completa",
  },
  {
    id: 3,
    cliente: "Carla Dias",
    status: "em_analise",
    valor: 80,
    criadaEm: "2026-09-02T15:00:00Z",
    observacao: "Coloração e barba",
  },
  {
    id: 4,
    cliente: "Diego Alves",
    status: "concluida",
    valor: 30,
    criadaEm: "2026-09-05T08:00:00Z",
    observacao: "Acabamento e pezinho",
  },
  {
    id: 5,
    cliente: "Elisa Rocha",
    status: "aberta",
    valor: 200,
    criadaEm: "2026-09-04T18:45:00Z",
    observacao: "Pacote especial / Dia de noivo",
  },
  {
    id: 6,
    cliente: "Fábio Nunes",
    status: "recusada",
    valor: 75.9,
    criadaEm: "2026-09-06T11:20:00Z",
    observacao: "Horário indisponível / Barbeiro em folga",
  },
];
