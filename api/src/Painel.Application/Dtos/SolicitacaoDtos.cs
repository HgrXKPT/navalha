using Painel.Domain.Enums;

namespace Painel.Application.Dtos;

/// <summary>
/// Contrato de leitura de Solicitacao (compatível com a interface do frontend).
/// </summary>
public record SolicitacaoResponse(
    int Id,
    string Cliente,
    decimal Valor,
    StatusSolicitacao Status,
    string? Observacao,
    DateTimeOffset CriadaEm,
    int Versao
);

/// <summary>
/// Payload para criação de nova solicitação (POST /solicitacoes).
/// </summary>
public record CriarSolicitacaoRequest(
    string Cliente,
    decimal Valor,
    string? Observacao
);

/// <summary>
/// Payload para alteração de status (PATCH /solicitacoes/{id}/status).
/// </summary>
public record AlterarStatusRequest(
    StatusSolicitacao Status
);

/// <summary>
/// Schema paginado da lista de solicitações (GET /solicitacoes).
/// </summary>
public record SolicitacoesPaginadasResponse(
    IReadOnlyList<SolicitacaoResponse> Itens,
    int Total,
    int Pagina,
    int TamanhoPagina
);

/// <summary>
/// Payload para login simulado (POST /login).
/// </summary>
public record LoginRequest(
    string Usuario
);

/// <summary>
/// Dados do usuário autenticado (GET /me).
/// </summary>
public record UsuarioResponse(
    string Nome,
    string Perfil
);
