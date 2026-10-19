using Painel.Domain.Entities;
using Painel.Domain.Enums;

namespace Painel.Application.Interfaces;

/// <summary>
/// Contrato do repositório de persistência de solicitações.
/// </summary>
public interface ISolicitacaoRepository
{
    Task<IReadOnlyList<Solicitacao>> ObterTodasAsync(CancellationToken cancellationToken = default);
    Task<(IReadOnlyList<Solicitacao> Itens, int Total)> ObterPaginadoAsync(StatusSolicitacao? status, string? busca, int pagina, int tamanhoPagina, CancellationToken cancellationToken = default);
    Task<Solicitacao?> ObterPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> ExisteAbertaParaClienteAsync(string cliente, CancellationToken cancellationToken = default);
    Task AdicionarAsync(Solicitacao solicitacao, CancellationToken cancellationToken = default);
    Task AtualizarAsync(Solicitacao solicitacao, CancellationToken cancellationToken = default);
    int ObterProximoId();
}
