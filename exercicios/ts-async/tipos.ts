// Dia 1 — Exercício de tipos
// Rode dentro de exercicios/: npm run typecheck
//
// Este arquivo tem 5 erros de tipo de propósito. Corrija cada um:
//   - SEM usar `any`, `as` ou `@ts-ignore` (isso é calar o compilador, não corrigir);
//   - corrigindo o DADO ou o CÓDIGO, e não os tipos `Status` e `Solicitacao`.
// Leia a mensagem do tsc com calma: ela mostra a linha, o que esperava e o que recebeu.
//
// Antes de corrigir, rode `node ts-async/tipos.ts`. Ele roda sem reclamar. Por quê?

export type Status = "aberta" | "em_analise" | "concluida" | "recusada";

export type Solicitacao = {
  id: number;
  cliente: string;
  status: Status;
  valor: number;
  criadaEm: string;
  observacao?: string | null;
};

// ERRO 1 — union type: este status não existe em `Status`.
export const primeira: Solicitacao = {
  id: 1,
  cliente: "Ana",
  status: "concluida",
  valor: 50,
  criadaEm: "2026-09-01T10:00:00Z",
};

// ERRO 2 — propriedade obrigatória faltando. O valor desta solicitação é 120.50.
export const segunda: Solicitacao = {
  id: 2,
  cliente: "Bruno",
  status: "aberta",
  valor: 120.5,
  criadaEm: "2026-09-03T09:30:00Z",
};

// ERRO 3 — opcional + null com strict ligado: `observacao` pode ser undefined ou null.
// Devolva o tamanho do texto, ou 0 quando não houver observação.
export function tamanhoDaObservacao(s: Solicitacao): number {
  if (s.observacao == null) return 0;

  return s.observacao.length;
}

// ERRO 4 — tipo de retorno: a função promete `string`, mas devolve outra coisa.
// Ela deve devolver o valor formatado, por exemplo 'R$ 50.00'. (Dica: toFixed.)
export function valorFormatado(s: Solicitacao): string {
  return `R$ ${s.valor.toFixed(2).toString()}`;
}

// ERRO 5 — generics: `primeiroOuPadrao` está certa, o erro está no USO dela.
// Queremos o id inicial de uma lista de ids (números), com 0 como padrão.
export function primeiroOuPadrao<T>(lista: T[], padrao: T): T {
  return lista.length > 0 ? lista[0] : padrao;
}
export const idInicial: number = primeiroOuPadrao([10, 20], 0);
