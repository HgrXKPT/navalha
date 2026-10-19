using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Painel.Domain.Exceptions;

namespace Painel.Api.Middlewares;

/// <summary>
/// Handler global de exceções que mapeia DomainException para ProblemDetails (RFC 9457).
/// </summary>
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is DomainException domainEx)
        {
            _logger.LogWarning("Violação de regra de negócio: {Message}", domainEx.Message);

            var problem = new ProblemDetails
            {
                Status = domainEx.StatusCode,
                Title = domainEx.StatusCode switch
                {
                    400 => "Requisição Inválida",
                    403 => "Acesso Proibido",
                    409 => "Conflito de Negócio",
                    412 => "Pré-condição Falhou",
                    _ => "Erro de Domínio"
                },
                Detail = domainEx.Message,
                Instance = httpContext.Request.Path
            };

            httpContext.Response.StatusCode = domainEx.StatusCode;
            await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken);
            return true;
        }

        _logger.LogError(exception, "Erro não tratado capturado pelo GlobalExceptionHandler");

        var genericProblem = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "Erro Interno do Servidor",
            Detail = "Ocorreu uma falha inesperada ao processar sua solicitação.",
            Instance = httpContext.Request.Path
        };

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await httpContext.Response.WriteAsJsonAsync(genericProblem, cancellationToken);
        return true;
    }
}
