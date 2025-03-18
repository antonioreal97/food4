using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using backend.Models;
using backend.Services;
using backend.Authentication;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JwtAuthService _jwtAuthService;

        public AuthController(UserService userService, JwtAuthService jwtAuthService)
        {
            _userService = userService;
            _jwtAuthService = jwtAuthService;
        }

        // Endpoint POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            // Validação básica: email e senha devem ser informados.
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest(new { message = "Email e senha são obrigatórios." });
            }

            // Autentica o usuário
            var user = await _userService.AuthenticateAsync(model.Email, model.Password);
            
            if (user == null)
            {
                return Unauthorized(new { message = "Credenciais inválidas." });
            }

            // Gera o token JWT
            var token = _jwtAuthService.GenerateJwtToken(user);

            // Retorna o token e informações do usuário
            return Ok(new
            {
                Token = token,
                User = new
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    UserType = user.UserType,
                    SupermercadoId = user.SupermercadoId,
                    CozinhaId = user.CozinhaId
                },
                Message = "Login realizado com sucesso."
            });
        }

        // Endpoint POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            try
            {
                // Validação básica
                if (string.IsNullOrEmpty(model.Name) || 
                    string.IsNullOrEmpty(model.Email) || 
                    string.IsNullOrEmpty(model.Password) ||
                    string.IsNullOrEmpty(model.UserType))
                {
                    return BadRequest(new { message = "Todos os campos são obrigatórios." });
                }

                // Validação de tipo de usuário
                if (model.UserType != "Supermercado" && model.UserType != "Cozinha")
                {
                    return BadRequest(new { message = "Tipo de usuário inválido. Deve ser 'Supermercado' ou 'Cozinha'." });
                }

                // Registra o novo usuário
                var user = await _userService.RegisterUserAsync(
                    model.Name,
                    model.Email,
                    model.Password,
                    model.UserType
                );

                // Gera o token JWT
                var token = _jwtAuthService.GenerateJwtToken(user);

                // Retorna o token e informações do usuário
                return Ok(new
                {
                    Token = token,
                    User = new
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Email = user.Email,
                        UserType = user.UserType
                    },
                    Message = "Usuário registrado com sucesso."
                });
            }
            catch (System.InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Endpoint GET: api/auth/me (usuário atual)
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            // Obtém o ID do usuário atual a partir dos claims
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int id))
            {
                return Unauthorized("Usuário não autenticado ou token inválido.");
            }

            // Obtém o usuário pelo ID
            var user = await _userService.GetUserByIdAsync(id);
            
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            // Retorna as informações do usuário
            return Ok(new
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                UserType = user.UserType,
                SupermercadoId = user.SupermercadoId,
                CozinhaId = user.CozinhaId,
                Supermercado = user.Supermercado != null ? new
                {
                    Id = user.Supermercado.Id,
                    Nome = user.Supermercado.Nome,
                    Endereco = user.Supermercado.Endereco
                } : null,
                Cozinha = user.Cozinha != null ? new
                {
                    Id = user.Cozinha.Id,
                    Nome = user.Cozinha.Nome,
                    Endereco = user.Cozinha.Endereco
                } : null
            });
        }
        
        // Endpoint GET: api/auth/debug (TEMPORÁRIO - apenas para depuração)
        [HttpGet("debug")]
        public async Task<IActionResult> DebugUsers()
        {
            // Lista todos os usuários para depuração
            var users = await _userService.GetAllUsersAsync();
            
            var result = users.Select(u => new {
                Id = u.Id,
                Email = u.Email,
                Name = u.Name,
                Type = u.UserType,
                CozinhaId = u.CozinhaId,
                SupermercadoId = u.SupermercadoId
            }).ToList();
            
            return Ok(result);
        }

        // Endpoint PUT: api/auth/password (alterar senha)
        [HttpPut("password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            try
            {
                // Obtém o ID do usuário atual a partir dos claims
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int id))
                {
                    return Unauthorized("Usuário não autenticado ou token inválido.");
                }

                // Validação básica
                if (string.IsNullOrEmpty(model.CurrentPassword) || string.IsNullOrEmpty(model.NewPassword))
                {
                    return BadRequest("Senha atual e nova senha são obrigatórias.");
                }

                // Altera a senha
                await _userService.ChangePasswordAsync(id, model.CurrentPassword, model.NewPassword);

                return Ok(new { Message = "Senha alterada com sucesso." });
            }
            catch (System.InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    // Modelo para os dados de registro
    public class RegisterModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserType { get; set; } // "Supermercado" ou "Cozinha"
    }

    // Modelo para alterar senha
    public class ChangePasswordModel
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
