using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models;
using backend.Data;
using System;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CozinhasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CozinhasController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/cozinhas/cadastrar
        [HttpPost("cadastrar")]
        public async Task<IActionResult> Cadastrar([FromBody] Cozinha cozinha)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Realiza validações ou lógica adicional se necessário.
            // Exemplo: definir que a cozinha é automaticamente aprovada após validação.
            cozinha.Aprovada = true;

            // Adiciona a cozinha ao contexto e salva as alterações no banco de dados.
            _context.Cozinhas.Add(cozinha);
            await _context.SaveChangesAsync();

            return Ok(cozinha);
        }

        // GET: api/cozinhas/{id}/produtos
        [HttpGet("{id}/produtos")]
        public ActionResult<IEnumerable<Produto>> ProdutosDisponiveis(int id)
        {
            // Simulação: lista de produtos disponíveis para doação.
            var produtos = new List<Produto>
            {
                new Produto 
                { 
                    Id = 1, 
                    Nome = "Produto Exemplo", 
                    DataVencimento = DateTime.Now.AddDays(5), 
                    Desconto = 30,       // Exemplo de desconto
                    Status = "disponível",
                    SupermercadoId = 1
                }
            };

            return Ok(produtos);
        }
    }
}
