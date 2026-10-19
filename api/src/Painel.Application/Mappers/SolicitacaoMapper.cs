using Painel.Application.Dtos;
using Painel.Domain.Entities;

namespace Painel.Application.Mappers;

public static class SolicitacaoMapper
{
    public static SolicitacaoResponse ToResponse(this Solicitacao solicitacao)
    {
        return new SolicitacaoResponse(
            solicitacao.Id,
            solicitacao.Cliente,
            solicitacao.Valor,
            solicitacao.Status,
            solicitacao.Observacao,
            solicitacao.CriadaEm,
            solicitacao.Versao
        );
    }

    public static SolicitacoesPaginadasResponse ToPaginadasResponse(
        this IEnumerable<Solicitacao> itens,
        int total,
        int pagina,
        int tamanhoPagina)
    {
        var dtos = itens.Select(s => s.ToResponse()).ToList();
        return new SolicitacoesPaginadasResponse(dtos, total, pagina, tamanhoPagina);
    }
}
