using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Services;
using backend.Authentication;
using backend.Data; // AppDbContext is in the backend.Data namespace

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly backend.Authentication.JwtAuthService _jwtAuthService;
        private readonly AppDbContext _context;

        public AuthController(UserService userService, backend.Authentication.JwtAuthService jwtAuthService, AppDbContext context)
        {
            _userService = userService;
            _jwtAuthService = jwtAuthService;
            _context = context;
        }

        // Endpoint POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                // Verifica se o modelo foi desserializado corretamente
                if (model == null)
                {
                    return BadRequest(new { message = "Dados de login inválidos." });
                }
                
                // Validação básica: email e senha devem ser informados.
                if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                {
                    return BadRequest(new { message = "Email e senha são obrigatórios." });
                }

                // Log para depuração
                Console.WriteLine($"Tentativa de login: Email={model.Email}");

                Console.WriteLine($"Iniciando autenticação no controller para: {model.Email}");
                
                // Autentica o usuário, capturando exceções específicas
                User user = null;
                try {
                    user = await _userService.AuthenticateAsync(model.Email, model.Password);
                    
                    if (user == null)
                    {
                        Console.WriteLine($"Usuário não encontrado ou senha inválida: {model.Email}");
                        return Unauthorized(new { message = "Credenciais inválidas." });
                    }
                    
                    Console.WriteLine($"Usuário autenticado com sucesso: ID={user.Id}, Type={user.UserType}, " +
                                     $"SupermercadoId={user.SupermercadoId}, CozinhaId={user.CozinhaId}");
                }
                catch (Exception authEx)
                {
                    Console.Error.WriteLine($"Erro durante autenticação no controller: {authEx.Message}");
                    return BadRequest(new { message = $"Erro na autenticação: {authEx.Message}" });
                }

                // Pulando a associação automática para resolver o erro 500
                Console.WriteLine($"Status atual do usuário: ID={user.Id}, UserType={user.UserType}, " +
                                 $"SupermercadoId={user.SupermercadoId}, CozinhaId={user.CozinhaId}");
                                 
                // Verificamos apenas se o Supermercado já existe, mas NÃO criamos um novo
                if (user.UserType == "Supermercado" && user.SupermercadoId.HasValue && user.Supermercado == null)
                {
                    try
                    {
                        // Tenta carregar o supermercado se o ID já existir
                        var supermercado = await _context.Supermercados.FindAsync(user.SupermercadoId.Value);
                        if (supermercado != null)
                        {
                            user.Supermercado = supermercado;
                            Console.WriteLine($"Carregado supermercado existente: {supermercado.Id} - {supermercado.Nome}");
                        }
                        else
                        {
                            Console.WriteLine($"Supermercado com ID {user.SupermercadoId.Value} não encontrado.");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.Error.WriteLine($"Erro ao carregar supermercado: {ex.Message}");
                        // Continua mesmo sem o supermercado
                    }
                }

                // Gera o token JWT
                var token = _jwtAuthService.GenerateJwtToken(user);

                // Log do usuário antes de montar a resposta
                Console.WriteLine($"Montando resposta para o usuário: ID={user.Id}, Email={user.Email}");
                
                // Resposta simplificada para evitar exceções com propriedades nulas
                var response = new
                {
                    Token = token,
                    User = new
                    {
                        Id = user.Id,
                        Name = user.Name ?? "Usuário",
                        Email = user.Email,
                        UserType = user.UserType ?? "Supermercado",
                        SupermercadoId = user.SupermercadoId,
                        CozinhaId = user.CozinhaId
                    },
                    Message = "Login realizado com sucesso."
                };
                
                Console.WriteLine("Resposta preparada com sucesso. Retornando ao cliente.");
                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log do erro
                Console.Error.WriteLine($"Erro no login: {ex.Message}");
                Console.Error.WriteLine(ex.StackTrace);
                
                // Retorna erro 500 com mensagem amigável
                return StatusCode(500, new { message = "Ocorreu um erro no servidor. Por favor, tente novamente mais tarde." });
            }
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
            try
            {
                // Obtém o ID do usuário atual a partir dos claims
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int id))
                {
                    return Unauthorized("Usuário não autenticado ou token inválido.");
                }
    
                Console.WriteLine($"Obtendo informações do usuário ID: {id}");
    
                // Obtém o usuário pelo ID
                var user = await _userService.GetUserByIdAsync(id);
                
                if (user == null)
                {
                    return NotFound("Usuário não encontrado.");
                }
    
                // Se o usuário é um supermercado mas não tem um supermercado associado,
                // vamos verificar se existe um supermercado com o mesmo contato
                if (user.UserType == "Supermercado" && !user.SupermercadoId.HasValue)
                {
                    Console.WriteLine($"Usuário {id} é Supermercado mas não tem SupermercadoId. Buscando ou criando...");
                    
                    // Tenta encontrar supermercado existente
                    var supermercado = await _context.Supermercados
                        .FirstOrDefaultAsync(s => s.Contato == user.Email);
                    
                    if (supermercado != null)
                    {
                        // Associa ao supermercado existente
                        user.SupermercadoId = supermercado.Id;
                        user.Supermercado = supermercado;
                        await _context.SaveChangesAsync();
                        
                        Console.WriteLine($"Supermercado existente ID {supermercado.Id} associado ao usuário {id}");
                    }
                    else
                    {
                        // Cria um novo supermercado
                        var novoSupermercado = new Supermercado
                        {
                            Nome = user.Name + " Supermercado",
                            Endereco = "Endereço não informado",
                            Contato = user.Email,
                            PickupAddress = "Mesmo endereço do estabelecimento"
                        };
                        
                        _context.Supermercados.Add(novoSupermercado);
                        await _context.SaveChangesAsync();
                        
                        user.SupermercadoId = novoSupermercado.Id;
                        user.Supermercado = novoSupermercado;
                        await _context.SaveChangesAsync();
                        
                        Console.WriteLine($"Novo supermercado ID {novoSupermercado.Id} criado e associado ao usuário {id}");
                    }
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
                        Endereco = user.Supermercado.Endereco,
                        PickupAddress = user.Supermercado.PickupAddress
                    } : null,
                    Cozinha = user.Cozinha != null ? new
                    {
                        Id = user.Cozinha.Id,
                        Nome = user.Cozinha.Nome,
                        Endereco = user.Cozinha.Endereco
                    } : null
                });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Erro ao obter informações do usuário: {ex.Message}");
                Console.Error.WriteLine(ex.StackTrace);
                return StatusCode(500, new { message = $"Erro ao obter informações do usuário: {ex.Message}" });
            }
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
