using System.Text.Json;
using System.Text.Json.Serialization;
using Painel.Api.Middlewares;
using Painel.Application.Interfaces;
using Painel.Application.Services;
using Painel.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Configuração de Controllers e serialização JSON estrita
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.NumberHandling = JsonNumberHandling.Strict;
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseLower)
        );
    });

// Serialização JSON estrita para endpoints mínimos (ex: "/")
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.NumberHandling = JsonNumberHandling.Strict;
    options.SerializerOptions.Converters.Add(
        new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseLower)
    );
});

// Tratamento global de exceções via ProblemDetails (RFC 9457)
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Documentação OpenAPI (.NET 10)
builder.Services.AddOpenApi();

// CORS para desenvolvimento integrado com o painel Vite
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("ETag");
    });
});

// Camada de Persistência (Singleton em memória para persistir entre requests)
builder.Services.AddSingleton<ISolicitacaoRepository, InMemorySolicitacaoRepository>();

// Serviços de Aplicação
builder.Services.AddScoped<ISolicitacaoService, SolicitacaoService>();

var app = builder.Build();

app.UseExceptionHandler();
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

app.MapGet("/", () => Results.Ok(new
{
    mensagem = "Painel API ativa (.NET 10 Clean Architecture).",
    documentacao = "/openapi/v1.json"
}));

app.Run();

// Tornar classe Program acessível para testes de integração
public partial class Program { }
