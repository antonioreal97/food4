using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    Nome = u.Name,
                    u.Email,
                    Tipo = u.UserType,
                    Ativo = true, // TODO: Adicionar campo IsActive no modelo User
                    DataCadastro = u.CreatedAt,
                    UltimoAcesso = u.UpdatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("transacoes")]
        public async Task<ActionResult<IEnumerable<object>>> GetTransacoes()
        {
            // TODO: Implementar modelo de Transação
            return Ok(new { message = "Funcionalidade em desenvolvimento" });
        }

        [HttpGet("feedbacks")]
        public async Task<ActionResult<IEnumerable<object>>> GetFeedbacks()
        {
            // TODO: Implementar modelo de Feedback
            return Ok(new { message = "Funcionalidade em desenvolvimento" });
        }

        [HttpPost("relatorios/doacoes")]
        public async Task<IActionResult> GerarRelatorioDoacoes()
        {
            // TODO: Implementar modelo de Doação
            return Ok(new { message = "Funcionalidade em desenvolvimento" });
        }

        [HttpPost("relatorios/usuarios")]
        public async Task<IActionResult> GerarRelatorioUsuarios()
        {
            var usuarios = await _context.Users
                .OrderBy(u => u.Name)
                .ToListAsync();

            // TODO: Implementar geração do relatório em PDF
            return Ok(usuarios);
        }
    }
} 