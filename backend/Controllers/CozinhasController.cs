using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using backend.Models;
using System;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CozinhasController : ControllerBase
    {
        // POST: api/cozinhas/cadastrar
        [HttpPost("cadastrar")]
        public ActionResult<Cozinha> Cadastrar([FromBody] Cozinha cozinha)
        {
            // Simulação de cadastro e validação
            cozinha.Id = 1; // Exemplo
            cozinha.Aprovada = true; // Após validação do registro do programa social
            return Ok(cozinha);
        }

        // GET: api/cozinhas/{id}/produtos
        [HttpGet("{id}/produtos")]
        public ActionResult<IEnumerable<Produto>> ProdutosDisponiveis(int id)
        {
            // Simulação: lista de produtos disponíveis para doação
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
