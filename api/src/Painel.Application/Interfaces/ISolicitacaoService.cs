using Painel.Application.Dtos;
using Painel.Domain.Enums;

namespace Painel.Application.Interfaces;

public interface ISolicitacaoService
{
    Task<SolicitacoesPaginadasResponse> ListarAsync(
        StatusSolicitacao? status = null,
        string? busca = null,
        int pagina = 1,
        int tamanhoPagina = 10,
        CancellationToken ct = default);

    Task<SolicitacaoResponse?> ObterPorIdAsync(
        int id,
        CancellationToken ct = default);

    Task<SolicitacaoResponse> CriarAsync(
        CriarSolicitacaoRequest request,
        CancellationToken ct = default);

    Task<SolicitacaoResponse?> AlterarStatusAsync(
        int id,
        AlterarStatusRequest request,
        int? versaoEsperada = null,
        bool ehSupervisor = false,
        CancellationToken ct = default);
}
