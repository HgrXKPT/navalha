using FluentAssertions;
using Painel.Domain.Entities;
using Painel.Domain.Enums;
using Painel.Domain.Exceptions;

namespace Painel.UnitTests.Domain;

public class SolicitacaoDomainTests
{
    [Fact]
    public void CriarNova_ComDadosValidos_DeveInstanciarComStatusAbertaEVersaoUm()
    {
        // Act
        var solicitacao = Solicitacao.CriarNova(1, "Cliente Valido", 150.0m, "Observacao teste");

        // Assert
        solicitacao.Id.Should().Be(1);
        solicitacao.Cliente.Should().Be("Cliente Valido");
        solicitacao.Valor.Should().Be(150.0m);
        solicitacao.Status.Should().Be(StatusSolicitacao.Aberta);
        solicitacao.Versao.Should().Be(1);
    }

    [Theory]
    [InlineData("")]
    [InlineData("ab")] // menos de 3 chars
    public void CriarNova_ComClienteInvalido_DeveLancarDomainException(string clienteInvalido)
    {
        // Act
        Action act = () => Solicitacao.CriarNova(1, clienteInvalido, 100m, null);

        // Assert
        act.Should().Throw<DomainException>()
            .Which.StatusCode.Should().Be(400);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-10)]
    [InlineData(10001)] // acima do limite
    public void CriarNova_ComValorInvalido_DeveLancarDomainException(decimal valorInvalido)
    {
        // Act
        Action act = () => Solicitacao.CriarNova(1, "Cliente Teste", valorInvalido, null);

        // Assert
        act.Should().Throw<DomainException>()
            .Which.StatusCode.Should().Be(400);
    }

    [Fact]
    public void AlterarStatus_DeAbertaParaConcluida_DeveAtualizarStatusEIncrementarVersao()
    {
        // Arrange
        var solicitacao = Solicitacao.CriarNova(1, "Cliente Teste", 100m, null);

        // Act
        solicitacao.AlterarStatus(StatusSolicitacao.Concluida);

        // Assert
        solicitacao.Status.Should().Be(StatusSolicitacao.Concluida);
        solicitacao.Versao.Should().Be(2);
    }

    [Fact]
    public void AlterarStatus_TentandoAlterarSolicitacaoJaConcluida_DeveLancarDomainException409()
    {
        // Arrange
        var solicitacao = Solicitacao.CriarNova(1, "Cliente Teste", 100m, null);
        solicitacao.AlterarStatus(StatusSolicitacao.Concluida);

        // Act
        Action act = () => solicitacao.AlterarStatus(StatusSolicitacao.Aberta);

        // Assert
        act.Should().Throw<DomainException>()
            .Which.StatusCode.Should().Be(409);
    }

    [Fact]
    public void AlterarStatus_ParaRecusadaSemSerSupervisor_DeveLancarDomainException403()
    {
        // Arrange
        var solicitacao = Solicitacao.CriarNova(1, "Cliente Teste", 100m, null);

        // Act
        Action act = () => solicitacao.AlterarStatus(StatusSolicitacao.Recusada, ehSupervisor: false);

        // Assert
        act.Should().Throw<DomainException>()
            .Which.StatusCode.Should().Be(403);
    }
}
