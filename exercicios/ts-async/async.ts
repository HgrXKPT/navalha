// Katas de código assíncrono (extra do dia 1; aquecimento obrigatório do dia 6)
// Rode dentro de exercicios/: npm run test:ts
//
// Troque cada `throw new Error('TODO')` pela implementação.
// Não altere os tipos exportados nem a função executarOrdem.

import type { Solicitacao } from './tipos.ts';

/** Resposta HTTP mínima: o mesmo formato que o `fetch` devolve. */
export type RespostaHttp<T> = {
  ok: boolean;
  status: number;
  json(): Promise<T>;
};

/**
 * Função que faz um GET numa URL. Em produção seria o `fetch`; nos testes, é um fake.
 * É injeção de dependência, como você faria com um HttpClient no .NET.
 */
export type Http<T> = (url: string) => Promise<RespostaHttp<T>>;

// 1. Em C#: var resp = await http.GetAsync($"/solicitacoes/{id}"); resp.EnsureSuccessStatusCode(); ...
//    Faça o GET em `/solicitacoes/${id}`.
//    Se a resposta não for ok, lance um Error com a mensagem `HTTP <status>` (ex.: 'HTTP 404').
//    Se for ok, devolva o corpo (json).
//    Lembre: o fetch NÃO lança erro sozinho em 404 ou 500.
export async function buscarSolicitacao(id: number, http: Http<Solicitacao>): Promise<Solicitacao> {
  throw new Error('TODO');
}

// 2. Em C#: await Task.WhenAll(ids.Select(id => BuscarAsync(id)))
//    Busque todas EM PARALELO (e não uma depois da outra) e devolva na mesma ordem dos ids.
//    Reaproveite buscarSolicitacao.
export async function buscarVarias(ids: number[], http: Http<Solicitacao>): Promise<Solicitacao[]> {
  throw new Error('TODO');
}

// 3. Event loop. NÃO altere executarOrdem: leia o código e preveja a ordem do log.
//    Preencha `ordemPrevista` ANTES de rodar o teste. Depois explique o porquê no diário.
export async function executarOrdem(): Promise<string[]> {
  const log: string[] = [];
  log.push('A');
  setTimeout(() => log.push('B'), 0);
  Promise.resolve().then(() => log.push('C'));
  log.push('D');
  await new Promise((resolve) => setTimeout(resolve, 20));
  return log;
}

export const ordemPrevista: string[] = [];

// ---- Extra (se tiver 2h) ----

// 4. Em C#: await Task.WhenAny(tarefa, Task.Delay(ms))
//    Devolva o resultado da promessa se ela terminar antes de `ms` milissegundos.
//    Se não terminar, rejeite com Error('timeout'). Se ela falhar, repasse o erro dela.
export function comTimeout<T>(promessa: Promise<T>, ms: number): Promise<T> {
  throw new Error('TODO');
}
