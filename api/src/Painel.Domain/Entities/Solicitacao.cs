using Painel.Domain.Enums;
using Painel.Domain.Exceptions;

namespace Painel.Domain.Entities;

/// <summary>
/// Entidade rica de Solicitação com encapsulamento de invariantes de negócio e controle de concorrência.
/// </summary>
public class Solicitacao
{
    public int Id { get; private set; }
    public string Cliente { get; private set; } = string.Empty;
    public decimal Valor { get; private set; }
    public StatusSolicitacao Status { get; private set; }
    public string? Observacao { get; private set; }
    public DateTimeOffset CriadaEm { get; private set; }
    public int Versao { get; private set; }

    // Construtor sem parâmetros para frameworks/desserializadores
    private Solicitacao() { }

    public Solicitacao(int id, string cliente, decimal valor, StatusSolicitacao status, string? observacao, DateTimeOffset? criadaEm = null, int versao = 1)
    {
        ValidarInvariantes(cliente, valor, observacao);

        Id = id;
        Cliente = cliente;
        Valor = valor;
        Status = status;
        Observacao = observacao;
        CriadaEm = criadaEm ?? DateTimeOffset.UtcNow;
        Versao = versao;
    }

    public static Solicitacao CriarNova(int id, string cliente, decimal valor, string? observacao)
    {
        return new Solicitacao(id, cliente, valor, StatusSolicitacao.Aberta, observacao);
    }

    /// <summary>
    /// Transiciona o status da solicitação validando regras de negócio e incrementando a versão.
    /// Transições permitidas:
    /// - Aberta -> EmAnalise
    /// - Aberta -> Concluida
    /// - Aberta -> Recusada
    /// - EmAnalise -> Concluida
    /// - EmAnalise -> Recusada
    /// </summary>
    public void AlterarStatus(StatusSolicitacao novoStatus, bool ehSupervisor = false)
    {
        if (Status == novoStatus)
        {
            return;
        }

        if (Status == StatusSolicitacao.Concluida || Status == StatusSolicitacao.Recusada)
        {
            throw new DomainException($"Solicitações com status '{Status.ToString().ToLowerInvariant()}' são finais e não podem ser alteradas.", statusCode: 409);
        }

        if (novoStatus == StatusSolicitacao.Recusada && !ehSupervisor)
        {
            throw new DomainException("Apenas usuários com perfil de supervisor podem recusar solicitações.", statusCode: 403);
        }

        Status = novoStatus;
        Versao++;
    }

    private static void ValidarInvariantes(string cliente, decimal valor, string? observacao)
    {
        if (string.IsNullOrWhiteSpace(cliente) || cliente.Trim().Length < 3 || cliente.Trim().Length > 100)
        {
            throw new DomainException("O nome do cliente deve conter entre 3 e 100 caracteres.", statusCode: 400);
        }

        if (valor <= 0 || valor > 10000)
        {
            throw new DomainException("O valor da solicitação deve ser maior que 0 e no máximo 10.000.", statusCode: 400);
        }

        if (observacao is not null && observacao.Length > 200)
        {
            throw new DomainException("A observação deve conter no máximo 200 caracteres.", statusCode: 400);
        }
    }
}
