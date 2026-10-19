// Testes das katas de JavaScript (dia 1). Não precisa editar este arquivo, mas vale ler:
// cada teste é uma especificação do que a função deve fazer.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  filtrarPorStatus,
  nomesDosClientes,
  buscarPorId,
  totalReembolsado,
  existeAberta,
  contarPorStatus,
  atualizarStatus,
  ordenarPorDataDesc,
  resumo,
  textoDaObservacao,
} from './katas.js';

// Uma lista nova a cada chamada: assim um teste não contamina o outro.
const criarLista = () => [
  { id: 1, cliente: 'Ana', status: 'aberta', valor: 50, criadaEm: '2026-09-01T10:00:00Z', observacao: 'Produto com defeito' },
  { id: 2, cliente: 'Bruno', status: 'concluida', valor: 120.5, criadaEm: '2026-09-03T09:30:00Z', observacao: null },
  { id: 3, cliente: 'Carla', status: 'em_analise', valor: 80, criadaEm: '2026-09-02T15:00:00Z' },
  { id: 4, cliente: 'Diego', status: 'concluida', valor: 30, criadaEm: '2026-09-05T08:00:00Z', observacao: '  Troca por tamanho  ' },
  { id: 5, cliente: 'Elisa', status: 'aberta', valor: 200, criadaEm: '2026-09-04T18:45:00Z', observacao: '' },
];

describe('1. filtrarPorStatus (Where)', () => {
  it('devolve só as solicitações com o status pedido', () => {
    assert.deepEqual(filtrarPorStatus(criarLista(), 'aberta').map((s) => s.id), [1, 5]);
  });
  it('devolve lista vazia quando nenhuma bate', () => {
    assert.deepEqual(filtrarPorStatus(criarLista(), 'recusada'), []);
  });
  it('não altera a lista original', () => {
    const lista = criarLista();
    filtrarPorStatus(lista, 'aberta');
    assert.deepEqual(lista, criarLista());
  });
});

describe('2. nomesDosClientes (Select)', () => {
  it('devolve os nomes na mesma ordem', () => {
    assert.deepEqual(nomesDosClientes(criarLista()), ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa']);
  });
  it('lista vazia devolve lista vazia', () => {
    assert.deepEqual(nomesDosClientes([]), []);
  });
});

describe('3. buscarPorId (FirstOrDefault)', () => {
  it('encontra pelo id', () => {
    assert.equal(buscarPorId(criarLista(), 3)?.cliente, 'Carla');
  });
  it('devolve undefined quando não existe', () => {
    assert.equal(buscarPorId(criarLista(), 99), undefined);
  });
});

describe('4. totalReembolsado (Where + Sum)', () => {
  it('soma o valor só das concluídas', () => {
    assert.equal(totalReembolsado(criarLista()), 150.5);
  });
  it('lista vazia soma 0 (reduce sem valor inicial quebra aqui)', () => {
    assert.equal(totalReembolsado([]), 0);
  });
});

describe('5. existeAberta (Any)', () => {
  it('true quando existe pelo menos uma aberta', () => {
    assert.equal(existeAberta(criarLista()), true);
  });
  it('false quando não existe nenhuma', () => {
    assert.equal(existeAberta(filtrarPorStatusManual(criarLista(), 'concluida')), false);
  });
});

describe('6. contarPorStatus (GroupBy + Count)', () => {
  it('conta quantas existem de cada status', () => {
    assert.deepEqual({ ...contarPorStatus(criarLista()) }, { aberta: 2, concluida: 2, em_analise: 1 });
  });
  it('lista vazia devolve objeto vazio', () => {
    assert.deepEqual({ ...contarPorStatus([]) }, {});
  });
});

describe('7. atualizarStatus (record + with)', () => {
  it('devolve uma lista nova com o status trocado', () => {
    const lista = criarLista();
    const nova = atualizarStatus(lista, 3, 'concluida');
    assert.notEqual(nova, lista, 'precisa ser um array novo, não o mesmo');
    assert.equal(nova.length, 5);
    assert.equal(nova[2].status, 'concluida');
    assert.equal(nova[2].cliente, 'Carla', 'os outros campos precisam ser preservados');
  });
  it('não altera a lista nem o objeto originais', () => {
    const lista = criarLista();
    atualizarStatus(lista, 3, 'concluida');
    assert.equal(lista[2].status, 'em_analise');
    assert.deepEqual(lista, criarLista());
  });
  it('o item alterado é um objeto novo; os outros são os mesmos objetos', () => {
    const lista = criarLista();
    const nova = atualizarStatus(lista, 3, 'concluida');
    assert.notEqual(nova[2], lista[2], 'o item alterado precisa ser um objeto novo');
    for (const i of [0, 1, 3, 4]) {
      assert.equal(nova[i], lista[i], `o item ${i} não mudou: deveria ser o mesmo objeto`);
    }
  });
  it('id inexistente devolve uma lista nova com os mesmos itens', () => {
    const lista = criarLista();
    const nova = atualizarStatus(lista, 99, 'concluida');
    assert.notEqual(nova, lista);
    nova.forEach((item, i) => assert.equal(item, lista[i]));
  });
});

describe('8. [extra] ordenarPorDataDesc (OrderByDescending)', () => {
  it('ordena da mais nova para a mais antiga', () => {
    assert.deepEqual(ordenarPorDataDesc(criarLista()).map((s) => s.id), [4, 5, 2, 3, 1]);
  });
  it('não altera a ordem da lista original', () => {
    const lista = criarLista();
    ordenarPorDataDesc(lista);
    assert.deepEqual(lista.map((s) => s.id), [1, 2, 3, 4, 5]);
  });
});

describe('9. [extra] resumo (destructuring + template string)', () => {
  it("formata como '#id · cliente · status'", () => {
    assert.equal(resumo(criarLista()[2]), '#3 · Carla · em_analise');
  });
});

describe('10. [extra] textoDaObservacao (?? vs ||)', () => {
  const lista = criarLista();
  it('devolve o texto quando existe', () => {
    assert.equal(textoDaObservacao(lista[0]), 'Produto com defeito');
  });
  it('tira os espaços das pontas', () => {
    assert.equal(textoDaObservacao(lista[3]), 'Troca por tamanho');
  });
  it('null vira (sem observação)', () => {
    assert.equal(textoDaObservacao(lista[1]), '(sem observação)');
  });
  it('propriedade ausente vira (sem observação)', () => {
    assert.equal(textoDaObservacao(lista[2]), '(sem observação)');
  });
  it("string vazia continua '' (é aqui que o || te engana)", () => {
    assert.equal(textoDaObservacao(lista[4]), '');
  });
});

// Auxiliar do teste 5, escrito à mão de propósito para não depender da kata 1.
function filtrarPorStatusManual(lista, status) {
  const resultado = [];
  for (const s of lista) if (s.status === status) resultado.push(s);
  return resultado;
}
