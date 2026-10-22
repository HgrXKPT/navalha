namespace Painel.Api.Contratos;

public enum StatusSolicitacao
{
    Aberta,
    EmAnalise,
    Concluida,
    Recusada,
}

public record Solicitacao(
    int Id,
    string Cliente,
    StatusSolicitacao Status,
    decimal Valor,
    DateTime CriadaEm,
    string? Observacao);

public record CriarSolicitacaoRequest(
    string Cliente,
    decimal Valor,
    string? Observacao);
