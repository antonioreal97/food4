using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models;
using backend.Data;
using System;
using Microsoft.EntityFrameworkCore;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CozinhasController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserService _userService;

        public CozinhasController(AppDbContext context, UserService userService = null)
        {
            _context = context;
            _userService = userService;
        }

        // POST: api/cozinhas/cadastrar (mantido para compatibilidade)
        [HttpPost("cadastrar")]
        public async Task<IActionResult> Cadastrar([FromBody] Cozinha cozinha)
        {
            return await CriarCozinha(cozinha);
        }
        
        // POST: api/cozinhas
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CriarCozinha([FromBody] Cozinha cozinha)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Console.WriteLine($"[DEBUG] Criando cozinha: {cozinha.Nome}, RegistroGoverno: {cozinha.RegistroGoverno}");

            // Realiza validações ou lógica adicional se necessário.
            // Exemplo: definir que a cozinha é automaticamente aprovada após validação.
            cozinha.Aprovada = true;

            // Adiciona a cozinha ao contexto e salva as alterações no banco de dados.
            _context.Cozinhas.Add(cozinha);
            await _context.SaveChangesAsync();
            
            Console.WriteLine($"[DEBUG] Cozinha criada com ID: {cozinha.Id}");
            
            // Obtém o ID do usuário do token JWT (se disponível)
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                Console.WriteLine($"[DEBUG] userId do token: {userId}");
                
                // Busca o usuário
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    Console.WriteLine($"[DEBUG] Usuário encontrado: {user.Name}, UserType: {user.UserType}");
                    
                    if (user.UserType == "Cozinha")
                    {
                        // Associa o usuário à cozinha
                        user.CozinhaId = cozinha.Id;
                        await _context.SaveChangesAsync();
                        Console.WriteLine($"[DEBUG] Usuário associado à cozinha com sucesso.");
                    }
                    else
                    {
                        Console.WriteLine($"[DEBUG] Tipo de usuário incorreto: {user.UserType}");
                    }
                }
                else
                {
                    Console.WriteLine($"[DEBUG] Usuário não encontrado com ID: {userId}");
                }
            }
            else
            {
                Console.WriteLine("[DEBUG] Claim de ID do usuário não encontrada no token");
            }

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