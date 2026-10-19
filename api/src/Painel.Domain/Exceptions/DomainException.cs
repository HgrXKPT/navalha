namespace Painel.Domain.Exceptions;

/// <summary>
/// Exceção de domínio disparada quando uma invariante de negócio é violada.
/// </summary>
public class DomainException : Exception
{
    public int StatusCode { get; }

    public DomainException(string message, int statusCode = 400) : base(message)
    {
        StatusCode = statusCode;
    }
}
