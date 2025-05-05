using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.Services;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminSetupController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly AppDbContext _context;

        public AdminSetupController(UserService userService, AppDbContext context)
        {
            _userService = userService;
            _context = context;
        }

        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdminUser([FromBody] AdminSetup model)
        {
            try
            {
                // Verifica se já existe um usuário admin
                var existingAdmin = await _context.Users.AnyAsync(u => u.UserType == "Admin");
                if (existingAdmin)
                {
                    return BadRequest(new { message = "Já existe um usuário administrador no sistema." });
                }

                // Cria o usuário admin
                var admin = await _userService.RegisterUserAsync(
                    model.Name,
                    model.Email,
                    model.Password,
                    "Admin"
                );

                return Ok(new { message = "Usuário administrador criado com sucesso." });
            }
            catch (System.InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class AdminSetupModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
} 