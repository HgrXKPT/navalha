namespace Painel.Domain.Enums;

/// <summary>
/// Status da solicitação, serializado em snake_case (aberta, em_analise, concluida, recusada).
/// </summary>
public enum StatusSolicitacao
{
    Aberta,
    EmAnalise,
    Concluida,
    Recusada
}
