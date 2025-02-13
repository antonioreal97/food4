using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupermercadosController : ControllerBase
    {
        // GET: api/supermercados
        [HttpGet]
        public ActionResult<IEnumerable<Supermercado>> Get()
        {
            // Exemplo: lista estática. Em um cenário real, os dados seriam extraídos do banco.
            var supermercados = new List<Supermercado>
            {
                new Supermercado 
                { 
                    Id = 1, 
                    Nome = "Supermercado Exemplo", 
                    Endereco = "Rua Exemplo, 123", 
                    Contato = "(11) 1234-5678" 
                }
            };

            return Ok(supermercados);
        }
        
        // Outros endpoints (POST, PUT, DELETE) podem ser implementados conforme necessário.
    }
}
