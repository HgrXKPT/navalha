using Painel.Application.Dtos;
using Painel.Application.Interfaces;
using Painel.Application.Mappers;
using Painel.Domain.Entities;
using Painel.Domain.Enums;
using Painel.Domain.Exceptions;

namespace Painel.Application.Services;

public class SolicitacaoService(ISolicitacaoRepository repository) : ISolicitacaoService
{
    public async Task<SolicitacoesPaginadasResponse> ListarAsync(
        StatusSolicitacao? status = null,
        string? busca = null,
        int pagina = 1,
        int tamanhoPagina = 10,
        CancellationToken ct = default)
    {
        if (pagina < 1) pagina = 1;
        if (tamanhoPagina < 1 || tamanhoPagina > 50) tamanhoPagina = 10;

        var (itens, total) = await repository.ObterPaginadoAsync(status, busca, pagina, tamanhoPagina, ct);
        return itens.ToPaginadasResponse(total, pagina, tamanhoPagina);
    }

    public async Task<SolicitacaoResponse?> ObterPorIdAsync(int id, CancellationToken ct = default)
    {
        var solicitacao = await repository.ObterPorIdAsync(id, ct);
        return solicitacao?.ToResponse();
    }

    public async Task<SolicitacaoResponse> CriarAsync(CriarSolicitacaoRequest request, CancellationToken ct = default)
    {
        if (await repository.ExisteAbertaParaClienteAsync(request.Cliente, ct))
        {
            throw new DomainException("Cliente já possui uma solicitação aberta.", statusCode: 409);
        }

        int novoId = repository.ObterProximoId();
        var novaSolicitacao = Solicitacao.CriarNova(
            novoId,
            request.Cliente?.Trim() ?? string.Empty,
            request.Valor,
            request.Observacao?.Trim()
        );

        await repository.AdicionarAsync(novaSolicitacao, ct);
        return novaSolicitacao.ToResponse();
    }

    public async Task<SolicitacaoResponse?> AlterarStatusAsync(
        int id,
        AlterarStatusRequest request,
        int? versaoEsperada = null,
        bool ehSupervisor = false,
        CancellationToken ct = default)
    {
        var solicitacao = await repository.ObterPorIdAsync(id, ct);
        if (solicitacao is null)
        {
            return null;
        }

        if (versaoEsperada.HasValue && versaoEsperada.Value != solicitacao.Versao)
        {
            throw new DomainException("Esta solicitação foi alterada por outro usuário.", statusCode: 412);
        }

        solicitacao.AlterarStatus(request.Status, ehSupervisor);
        await repository.AtualizarAsync(solicitacao, ct);

        return solicitacao.ToResponse();
    }
}
