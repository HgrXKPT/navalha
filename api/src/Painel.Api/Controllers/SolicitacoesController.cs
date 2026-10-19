using Microsoft.AspNetCore.Mvc;
using Painel.Application.Dtos;
using Painel.Application.Interfaces;
using Painel.Domain.Enums;

namespace Painel.Api.Controllers;

[ApiController]
[Route("solicitacoes")]
public class SolicitacoesController(ISolicitacaoService service) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<SolicitacoesPaginadasResponse>(StatusCodes.Status200OK)]
    public async Task<ActionResult<SolicitacoesPaginadasResponse>> Listar(
        [FromQuery] StatusSolicitacao? status = null,
        [FromQuery] string? busca = null,
        [FromQuery] int pagina = 1,
        [FromQuery] int tamanhoPagina = 10,
        CancellationToken ct = default)
    {
        var response = await service.ListarAsync(status, busca, pagina, tamanhoPagina, ct);
        return Ok(response);
    }

    [HttpGet("{id:int}")]
    [ActionName(nameof(ObterPorId))]
    [ProducesResponseType<SolicitacaoResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SolicitacaoResponse>> ObterPorId(int id, CancellationToken ct = default)
    {
        var response = await service.ObterPorIdAsync(id, ct);
        if (response is null)
        {
            return NotFound();
        }

        Response.Headers.ETag = $"\"{response.Versao}\"";
        return Ok(response);
    }

    [HttpPost]
    [ProducesResponseType<SolicitacaoResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<SolicitacaoResponse>> Criar(
        [FromBody] CriarSolicitacaoRequest request,
        CancellationToken ct = default)
    {
        var response = await service.CriarAsync(request, ct);
        Response.Headers.ETag = $"\"{response.Versao}\"";
        return CreatedAtAction(nameof(ObterPorId), new { id = response.Id }, response);
    }

    [HttpPatch("{id:int}/status")]
    [ProducesResponseType<SolicitacaoResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
    public async Task<ActionResult<SolicitacaoResponse>> AlterarStatus(
        int id,
        [FromBody] AlterarStatusRequest request,
        CancellationToken ct = default)
    {
        int? versaoEsperada = null;
        if (Request.Headers.TryGetValue("If-Match", out var ifMatchValue))
        {
            var ifMatchLimpo = ifMatchValue.ToString().Trim('\"', ' ');
            if (int.TryParse(ifMatchLimpo, out var parsedVersao))
            {
                versaoEsperada = parsedVersao;
            }
        }

        bool ehSupervisor = User.IsInRole("supervisor");

        var response = await service.AlterarStatusAsync(id, request, versaoEsperada, ehSupervisor, ct);
        if (response is null)
        {
            return NotFound();
        }

        Response.Headers.ETag = $"\"{response.Versao}\"";
        return Ok(response);
    }
}
