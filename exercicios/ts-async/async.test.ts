// Testes das katas assíncronas (dias 1 e 6). Não precisa editar; vale ler como especificação.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buscarSolicitacao, buscarVarias, executarOrdem, ordemPrevista, comTimeout } from './async.ts';
import type { Http, RespostaHttp } from './async.ts';
import type { Solicitacao } from './tipos.ts';

const banco: Solicitacao[] = [
  { id: 1, cliente: 'Ana', status: 'aberta', valor: 50, criadaEm: '2026-09-01T10:00:00Z' },
  { id: 2, cliente: 'Bruno', status: 'concluida', valor: 120.5, criadaEm: '2026-09-03T09:30:00Z' },
  { id: 3, cliente: 'Carla', status: 'em_analise', valor: 80, criadaEm: '2026-09-02T15:00:00Z' },
];

function respostaOk(corpo: Solicitacao): RespostaHttp<Solicitacao> {
  return { ok: true, status: 200, json: async () => corpo };
}

function respostaErro(status: number): RespostaHttp<Solicitacao> {
  return {
    ok: false,
    status,
    json: async () => {
      throw new Error(`resposta ${status} não tem corpo JSON: confira response.ok antes de ler`);
    },
  };
}

const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Http falso: responde /solicitacoes/{id} com o item do "banco" ou 404, e mede a concorrência. */
function criarHttpFake() {
  const chamadas: string[] = [];
  let emAndamento = 0;
  let maxConcorrencia = 0;
  const http: Http<Solicitacao> = async (url) => {
    chamadas.push(url);
    emAndamento++;
    maxConcorrencia = Math.max(maxConcorrencia, emAndamento);
    await esperar(10);
    emAndamento--;
    const id = Number(url.split('/').pop());
    const item = banco.find((s) => s.id === id);
    return item ? respostaOk(item) : respostaErro(404);
  };
  return {
    http,
    chamadas,
    get maxConcorrencia() {
      return maxConcorrencia;
    },
  };
}

describe('1. buscarSolicitacao', () => {
  it('chama a URL /solicitacoes/{id}', async () => {
    const fake = criarHttpFake();
    await buscarSolicitacao(2, fake.http);
    assert.deepEqual(fake.chamadas, ['/solicitacoes/2']);
  });
  it('devolve o corpo quando a resposta é ok', async () => {
    const fake = criarHttpFake();
    assert.deepEqual(await buscarSolicitacao(2, fake.http), banco[1]);
  });
  it("lança 'HTTP 404' quando não encontra", async () => {
    const fake = criarHttpFake();
    await assert.rejects(buscarSolicitacao(99, fake.http), { message: 'HTTP 404' });
  });
  it("lança 'HTTP 500' em erro do servidor", async () => {
    const http: Http<Solicitacao> = async () => respostaErro(500);
    await assert.rejects(buscarSolicitacao(1, http), { message: 'HTTP 500' });
  });
});

describe('2. buscarVarias', () => {
  it('devolve na mesma ordem dos ids', async () => {
    const fake = criarHttpFake();
    assert.deepEqual(await buscarVarias([3, 1], fake.http), [banco[2], banco[0]]);
  });
  it('faz as chamadas em paralelo (todas em andamento ao mesmo tempo)', async () => {
    const fake = criarHttpFake();
    await buscarVarias([1, 2, 3], fake.http);
    assert.equal(fake.maxConcorrencia, 3, 'em sequência a concorrência máxima seria 1');
  });
  it('lista vazia devolve lista vazia', async () => {
    const fake = criarHttpFake();
    assert.deepEqual(await buscarVarias([], fake.http), []);
  });
  it('se uma falhar, a busca toda falha (como o Task.WhenAll)', async () => {
    const fake = criarHttpFake();
    await assert.rejects(buscarVarias([1, 99], fake.http), { message: 'HTTP 404' });
  });
});

describe('3. event loop', () => {
  it('ordemPrevista bate com a ordem real', async () => {
    if (ordemPrevista.length === 0) {
      throw new Error('TODO: preencha ordemPrevista em async.ts antes de rodar');
    }
    assert.deepEqual(ordemPrevista, await executarOrdem());
  });
});

describe('4. [extra] comTimeout', () => {
  it('devolve o resultado quando a promessa termina a tempo', async () => {
    const rapida = esperar(5).then(() => 'ok');
    assert.equal(await comTimeout(rapida, 100), 'ok');
  });
  it("rejeita com 'timeout' quando a promessa demora demais", async () => {
    const lenta = esperar(100).then(() => 'tarde');
    await assert.rejects(comTimeout(lenta, 10), { message: 'timeout' });
  });
  it('repassa o erro quando a promessa falha', async () => {
    const falha = Promise.reject(new Error('falhou'));
    falha.catch(() => {}); // marca a rejeição como tratada: sem isso o Node acusa "unhandled rejection" antes da kata existir
    await assert.rejects(comTimeout(falha, 100), { message: 'falhou' });
  });
});
