using System.Text.Json;
using System.Text.Json.Serialization;
using Painel.Api.Contratos;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.Converters.Add(
        new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseLower)
    );
});

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

var solicitacoes = new List<Solicitacao>
{
    new(1, "Ana Souza", StatusSolicitacao.Aberta, 50.0m, new DateTime(2026, 9, 1, 10, 0, 0, DateTimeKind.Utc), "Produto com defeito"),
    new(2, "Bruno Lima", StatusSolicitacao.Concluida, 120.5m, new DateTime(2026, 9, 3, 9, 30, 0, DateTimeKind.Utc), null),
    new(3, "Carla Dias", StatusSolicitacao.EmAnalise, 80.0m, new DateTime(2026, 9, 2, 15, 0, 0, DateTimeKind.Utc), null),
    new(4, "Diego Alves", StatusSolicitacao.Concluida, 30.0m, new DateTime(2026, 9, 5, 8, 0, 0, DateTimeKind.Utc), "Troca por tamanho"),
    new(5, "Elisa Rocha", StatusSolicitacao.Aberta, 200.0m, new DateTime(2026, 9, 4, 18, 45, 0, DateTimeKind.Utc), null),
    new(6, "Fábio Nunes", StatusSolicitacao.Recusada, 75.9m, new DateTime(2026, 9, 6, 11, 20, 0, DateTimeKind.Utc), "Fora do prazo de troca"),
};

app.MapGet("/", () => Results.Ok(new
{
    mensagem = "Painel API ativa (.NET 10).",
    documentacao = "/openapi/v1.json"
}));

app.MapGet("/solicitacoes", () => Results.Ok(solicitacoes));

app.Run();
