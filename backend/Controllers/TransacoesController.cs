using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransacoesController : ControllerBase
    {
        // POST: api/transacoes
        [HttpPost]
        public ActionResult<Transacao> CriarTransacao([FromBody] Transacao transacao)
        {
            // Simulação de criação de transação
            transacao.Id = 1;
            transacao.DataTransacao = DateTime.Now;
            transacao.CodigoVerificacao = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
            return Ok(transacao);
        }
    }
}
