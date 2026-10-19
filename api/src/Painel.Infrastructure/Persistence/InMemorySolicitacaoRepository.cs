using System.Collections.Concurrent;
using Painel.Application.Interfaces;
using Painel.Domain.Entities;
using Painel.Domain.Enums;

namespace Painel.Infrastructure.Persistence;

/// <summary>
/// Implementação de repositório em memória thread-safe baseada em ConcurrentDictionary.
/// Pré-carregada com 40 registros para viabilizar testes de paginação.
/// </summary>
public class InMemorySolicitacaoRepository : ISolicitacaoRepository
{
    private readonly ConcurrentDictionary<int, Solicitacao> _dados = new();
    private int _proximoId;

    public InMemorySolicitacaoRepository()
    {
        CarregarSeed();
    }

    public Task<IReadOnlyList<Solicitacao>> ObterTodasAsync(CancellationToken cancellationToken = default)
    {
        IReadOnlyList<Solicitacao> lista = _dados.Values
            .OrderByDescending(s => s.CriadaEm)
            .ToList();

        return Task.FromResult(lista);
    }

    public Task<(IReadOnlyList<Solicitacao> Itens, int Total)> ObterPaginadoAsync(
        StatusSolicitacao? status,
        string? busca,
        int pagina,
        int tamanhoPagina,
        CancellationToken cancellationToken = default)
    {
        var query = _dados.Values.AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(s => s.Status == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(busca))
        {
            var termo = busca.Trim();
            query = query.Where(s => s.Cliente.Contains(termo, StringComparison.OrdinalIgnoreCase));
        }

        var total = query.Count();

        var itens = query
            .OrderByDescending(s => s.CriadaEm)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .ToList();

        return Task.FromResult(((IReadOnlyList<Solicitacao>)itens, total));
    }

    public Task<Solicitacao?> ObterPorIdAsync(int id, CancellationToken cancellationToken = default)
    {
        _dados.TryGetValue(id, out var solicitacao);
        return Task.FromResult(solicitacao);
    }

    public Task<bool> ExisteAbertaParaClienteAsync(string cliente, CancellationToken cancellationToken = default)
    {
        var existe = _dados.Values.Any(s =>
            s.Status == StatusSolicitacao.Aberta &&
            string.Equals(s.Cliente.Trim(), cliente.Trim(), StringComparison.OrdinalIgnoreCase));

        return Task.FromResult(existe);
    }

    public Task AdicionarAsync(Solicitacao solicitacao, CancellationToken cancellationToken = default)
    {
        _dados[solicitacao.Id] = solicitacao;
        return Task.CompletedTask;
    }

    public Task AtualizarAsync(Solicitacao solicitacao, CancellationToken cancellationToken = default)
    {
        _dados[solicitacao.Id] = solicitacao;
        return Task.CompletedTask;
    }

    public int ObterProximoId() => Interlocked.Increment(ref _proximoId);

    private void CarregarSeed()
    {
        // 6 itens base do mock original do front
        var baseSeed = new[]
        {
            new Solicitacao(1, "Ana Souza", 50.0m, StatusSolicitacao.Aberta, "Produto com defeito", DateTimeOffset.Parse("2026-09-01T10:00:00Z")),
            new Solicitacao(2, "Bruno Lima", 120.5m, StatusSolicitacao.Concluida, null, DateTimeOffset.Parse("2026-09-03T09:30:00Z")),
            new Solicitacao(3, "Carla Dias", 80.0m, StatusSolicitacao.EmAnalise, null, DateTimeOffset.Parse("2026-09-02T15:00:00Z")),
            new Solicitacao(4, "Diego Alves", 30.0m, StatusSolicitacao.Concluida, "Troca por tamanho", DateTimeOffset.Parse("2026-09-05T08:00:00Z")),
            new Solicitacao(5, "Elisa Rocha", 200.0m, StatusSolicitacao.Aberta, null, DateTimeOffset.Parse("2026-09-04T18:45:00Z")),
            new Solicitacao(6, "Fábio Nunes", 75.9m, StatusSolicitacao.Recusada, "Fora do prazo de troca", DateTimeOffset.Parse("2026-09-06T11:20:00Z"))
        };

        foreach (var item in baseSeed)
        {
            _dados[item.Id] = item;
        }

        // 34 itens adicionais para somar 40 registros
        var statusPossiveis = new[] { StatusSolicitacao.Aberta, StatusSolicitacao.EmAnalise, StatusSolicitacao.Concluida, StatusSolicitacao.Recusada };
        for (int i = 7; i <= 40; i++)
        {
            var status = statusPossiveis[i % statusPossiveis.Length];
            var valor = Math.Round((decimal)(25 + (i * 12.35)), 2);
            var data = DateTimeOffset.UtcNow.AddDays(-40 + i);
            _dados[i] = new Solicitacao(i, $"Cliente {i}", valor, status, i % 3 == 0 ? $"Observação da solicitação {i}" : null, data);
        }

        _proximoId = 40;
    }
}
