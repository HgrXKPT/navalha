export type Status = "aberta" | "em_analise" | "concluida" | "recusada";

export type Solicitacao = {
  id: number;
  cliente: string;
  status: Status;
  valor: number;
  criadaEm: string;
  observacao: string | null;
};
