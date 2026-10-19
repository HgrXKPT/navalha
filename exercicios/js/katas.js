// Dia 1 — Katas de JavaScript pela ótica do C#
// Rode dentro de exercicios/: npm run test:js
//
// Toda função começa lançando 'TODO'. Troque o throw pela implementação.
// Regras:
//   - Sem for/while: use os métodos de array (map, filter, find, reduce, some...).
//   - Nunca altere a lista nem os objetos recebidos.
//
// Formato de cada solicitação (aqui é só JS; os tipos vêm em ts-async/tipos.ts):
//   { id: number, cliente: string,
//     status: 'aberta' | 'em_analise' | 'concluida' | 'recusada',
//     valor: number, criadaEm: string (data ISO 8601), observacao?: string | null }

// 1. LINQ: lista.Where(s => s.Status == status)
export function filtrarPorStatus(lista, status) {
  let users = lista.filter((item) => item.status === status);

  return users;
}

// 2. LINQ: lista.Select(s => s.Cliente)
export function nomesDosClientes(lista) {
  let cliente = lista.map((c) => c.cliente);

  return cliente;
}

// 3. LINQ: lista.FirstOrDefault(s => s.Id == id)
//    Atenção: quando não encontra nada, o JS devolve undefined (e não null).
export function buscarPorId(lista, id) {
  var result = lista.find((r) => r.id === id);

  return result;
}

// 4. LINQ: lista.Where(s => s.Status == "concluida").Sum(s => s.Valor)
//    Não existe .sum() em JS: encadeie filter e reduce.
export function totalReembolsado(lista) {
  return lista
    .filter((item) => item.status === "concluida")
    .reduce((total, item) => total + item.valor, 0);
}

// 5. LINQ: lista.Any(s => s.Status == "aberta")
export function existeAberta(lista) {
  return lista.some((item) => item.status === "aberta");
}

// 6. LINQ: lista.GroupBy(s => s.Status).ToDictionary(g => g.Key, g => g.Count())
//    Devolve um objeto, por exemplo { aberta: 2, concluida: 1 }.
//    Status que não aparece na lista não entra no objeto.
export function contarPorStatus(lista) {
  return lista.reduce(
    (contagem, item) => ({
      ...contagem,
      [item.status]: (contagem[item.status] ?? 0) + 1,
    }),
    {},
  );
}

// 7. C#: record + with.
//    Devolve uma NOVA lista em que a solicitação `id` passa a ter `novoStatus`.
//    - Não altere a lista original nem o objeto original.
//    - Os itens que não mudaram devem ser os MESMOS objetos (mesma referência).
//    É exatamente isso que o React vai exigir de você no dia 5.
export function atualizarStatus(lista, id, novoStatus) {
  var result = lista.map((u) =>
    u.id === id
      ? {
          ...u,
          status: novoStatus,
        }
      : u,
  );

  return result;
}

// ---- Extras (se tiver 2h) ----

// 8. LINQ: lista.OrderByDescending(s => s.CriadaEm)
//    Não mute a lista original. O `sort` muta; procure a alternativa que devolve uma cópia.
export function ordenarPorDataDesc(lista) {
  throw new Error("TODO");
}

// 9. Destructuring + template string. Formato: '#3 · Carla · em_analise'
//    Faça o destructuring direto no parâmetro da função.
export function resumo(solicitacao) {
  throw new Error("TODO");
}

// 10. ?? vs ||
//     Devolve a observação sem espaços nas pontas (trim).
//     Se a observação for null, undefined ou não existir, devolve '(sem observação)'.
//     Cuidado: string vazia '' É uma observação válida e deve voltar ''.
export function textoDaObservacao(solicitacao) {
  throw new Error("TODO");
}
