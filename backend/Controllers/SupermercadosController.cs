using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupermercadosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SupermercadosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/supermercados
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Supermercado>>> Get()
        {
            var supermercados = await _context.Supermercados.ToListAsync();
            return Ok(supermercados);
        }

        // POST: api/supermercados
        [HttpPost]
        [Authorize] // Requer autenticação para criar supermercado
        public async Task<ActionResult<Supermercado>> PostSupermercado([FromBody] Supermercado supermercado)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Log para depuração
                Console.WriteLine($"Iniciando criação de supermercado: {supermercado.Nome}");
                
                // Obtém o ID do usuário autenticado
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int id))
                {
                    return Unauthorized("Usuário não autenticado ou token inválido.");
                }
                
                // Log do ID do usuário
                Console.WriteLine($"Usuário autenticado: ID={id}");
                
                // Adiciona o supermercado ao contexto
                _context.Supermercados.Add(supermercado);
                await _context.SaveChangesAsync();
                
                // Busca o usuário para associar ao supermercado
                var user = await _context.Users.FindAsync(id);
                if (user != null)
                {
                    // Associa o supermercado ao usuário
                    user.SupermercadoId = supermercado.Id;
                    await _context.SaveChangesAsync();
                    
                    Console.WriteLine($"Supermercado ID={supermercado.Id} associado ao usuário ID={user.Id}");
                }
                else
                {
                    Console.Error.WriteLine($"Usuário ID={id} não encontrado para associação com o supermercado.");
                }

                // Retorna o supermercado criado, com status 201 (Created)
                return CreatedAtAction(nameof(GetById), new { id = supermercado.Id }, supermercado);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Erro ao criar supermercado: {ex.Message}");
                Console.Error.WriteLine(ex.StackTrace);
                return StatusCode(500, new { message = $"Erro ao criar supermercado: {ex.Message}" });
            }
        }

        // GET: api/supermercados/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Supermercado>> GetById(int id)
        {
            try
            {
                Console.WriteLine($"Buscando supermercado com ID: {id}");
                
                // Verificamos primeiro se é um ID de supermercado
                var supermercado = await _context.Supermercados.FindAsync(id);
                
                // Se encontramos pelo ID diretamente, retornamos
                if (supermercado != null)
                {
                    Console.WriteLine($"Supermercado encontrado diretamente: {supermercado.Nome}");
                    return Ok(supermercado);
                }
                
                // Se não, talvez seja um ID de usuário
                Console.WriteLine("Supermercado não encontrado pelo ID direto, tentando buscar pelo ID do usuário");
                var usuarioComSupermercado = await _context.Users
                    .Where(u => u.Id == id && u.UserType == "Supermercado")
                    .Include(u => u.Supermercado)
                    .FirstOrDefaultAsync();
                
                if (usuarioComSupermercado != null && usuarioComSupermercado.Supermercado != null)
                {
                    Console.WriteLine($"Supermercado encontrado via usuário: {usuarioComSupermercado.Supermercado.Nome}");
                    return Ok(usuarioComSupermercado.Supermercado);
                }
                
                // Se chegamos aqui, não encontramos o supermercado
                Console.WriteLine("Supermercado não encontrado nem pelo ID direto nem pelo ID do usuário");
                return NotFound(new { message = "Supermercado não encontrado." });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Erro ao buscar supermercado: {ex.Message}");
                return StatusCode(500, new { message = $"Erro ao buscar supermercado: {ex.Message}" });
            }
        }
        
        // GET: api/supermercados/usuario/{userId}
        [HttpGet("usuario/{userId}")]
        public async Task<ActionResult<Supermercado>> GetByUserId(int userId)
        {
            try
            {
                Console.WriteLine($"Buscando supermercado para o usuário ID: {userId}");
                
                var usuario = await _context.Users
                    .Where(u => u.Id == userId && u.UserType == "Supermercado")
                    .Include(u => u.Supermercado)
                    .FirstOrDefaultAsync();
                
                if (usuario == null)
                {
                    Console.WriteLine($"Usuário ID {userId} não encontrado ou não é supermercado");
                    return NotFound(new { message = "Usuário não encontrado ou não é do tipo Supermercado." });
                }
                
                // Se o usuário não tem supermercado associado, vamos criar um automaticamente
                if (usuario.Supermercado == null)
                {
                    Console.WriteLine($"Usuário ID {userId} não tem supermercado associado. Criando um novo...");
                    
                    try 
                    {
                        // Cria um novo supermercado com base nos dados do usuário
                        var novoSupermercado = new Supermercado
                        {
                            Nome = usuario.Name + " Supermercado",
                            Endereco = "Endereço não informado",
                            Contato = usuario.Email,
                            PickupAddress = "Mesmo endereço do estabelecimento"
                        };
                        
                        // Adiciona ao contexto
                        _context.Supermercados.Add(novoSupermercado);
                        await _context.SaveChangesAsync();
                        
                        // Associa ao usuário
                        usuario.SupermercadoId = novoSupermercado.Id;
                        usuario.Supermercado = novoSupermercado;
                        await _context.SaveChangesAsync();
                        
                        Console.WriteLine($"Novo supermercado criado com ID {novoSupermercado.Id} e associado ao usuário {userId}");
                        
                        return Ok(novoSupermercado);
                    }
                    catch (Exception ex)
                    {
                        Console.Error.WriteLine($"Erro ao criar supermercado para usuário {userId}: {ex.Message}");
                        return StatusCode(500, new { message = $"Erro ao criar supermercado: {ex.Message}" });
                    }
                }
                
                Console.WriteLine($"Supermercado encontrado: {usuario.Supermercado.Nome}");
                return Ok(usuario.Supermercado);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Erro ao buscar supermercado por usuário: {ex.Message}");
                return StatusCode(500, new { message = $"Erro ao buscar supermercado: {ex.Message}" });
            }
        }

        // PUT: api/supermercados/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Supermercado")]
        public async Task<ActionResult<Supermercado>> UpdateSupermercado(int id, [FromBody] UpdateSupermercadoDTO updateDTO)
        {
            var supermercado = await _context.Supermercados.FindAsync(id);
            if (supermercado == null)
                return NotFound("Supermercado não encontrado.");

            // Atualiza o endereço de retirada se fornecido
            if (!string.IsNullOrEmpty(updateDTO.PickupAddress))
            {
                supermercado.PickupAddress = updateDTO.PickupAddress;
            }

            try
            {
                await _context.SaveChangesAsync();
                return Ok(supermercado);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SupermercadoExists(id))
                    return NotFound("Supermercado não encontrado para atualização.");
                else
                    throw;
            }
        }

        private bool SupermercadoExists(int id)
        {
            return _context.Supermercados.Any(e => e.Id == id);
        }
    }

    // DTO para atualização parcial do supermercado
    public class UpdateSupermercadoDTO
    {
        public string? PickupAddress { get; set; }
    }
}