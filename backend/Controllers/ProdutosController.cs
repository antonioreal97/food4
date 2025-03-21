using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data; // Certifique-se de que este namespace corresponda ao do AppDbContext
using Microsoft.AspNetCore.Authorization;
using System.IO;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ProdutosController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // POST: api/produtos
        [HttpPost]
        [Authorize(Roles = "Supermercado")]
        public async Task<IActionResult> CriarProduto([FromForm] Produto produto, IFormFile? imagem)
        {
            try
            {
                Console.WriteLine($"Recebendo requisição para criar produto: {produto.Nome}, SupermercadoId: {produto.SupermercadoId}");
                
                // Validação manual dos campos obrigatórios
                if (string.IsNullOrEmpty(produto.Nome))
                {
                    return BadRequest(new { message = "O nome do produto é obrigatório." });
                }
    
                if (produto.SupermercadoId <= 0)
                {
                    return BadRequest(new { message = "ID do supermercado inválido." });
                }
    
                // Tenta buscar o supermercado pelo ID fornecido
                var supermercado = await _context.Supermercados.FindAsync(produto.SupermercadoId);
                if (supermercado == null)
                {
                    return BadRequest(new { message = $"Supermercado com ID {produto.SupermercadoId} não encontrado." });
                }
    
                // Associa o supermercado ao produto para satisfazer a validação
                produto.Supermercado = supermercado;
    
                // Calcula desconto automaticamente com base na data de vencimento
                if (produto.Desconto == 0)
                {
                    produto.Desconto = CalcularDesconto(produto.DataVencimento);
                }
                
                // Define o status com base no desconto (pode ser sobrescrito pelo client)
                if (string.IsNullOrEmpty(produto.Status))
                {
                    produto.Status = produto.Desconto == 100 ? "doado" : "disponível";
                }
    
                // Processa o upload da imagem se houver
                if (imagem != null && imagem.Length > 0)
                {
                    try
                    {
                        var uploadsFolder = Path.Combine(_environment.ContentRootPath, "frontend", "img", "produtos");
                        if (!Directory.Exists(uploadsFolder))
                            Directory.CreateDirectory(uploadsFolder);
    
                        var uniqueFileName = Guid.NewGuid().ToString() + "_" + imagem.FileName;
                        var filePath = Path.Combine(uploadsFolder, uniqueFileName);
    
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await imagem.CopyToAsync(stream);
                        }
    
                        produto.ImagemUrl = $"/img/produtos/{uniqueFileName}";
                        Console.WriteLine($"Imagem salva em: {produto.ImagemUrl}");
                    }
                    catch (Exception ex)
                    {
                        Console.Error.WriteLine($"Erro ao processar imagem: {ex.Message}");
                        // Continua mesmo sem a imagem
                        produto.ImagemUrl = "/img/produtos/product-placeholder.svg";
                    }
                }
                else
                {
                    // Se não houver imagem enviada, use um placeholder
                    produto.ImagemUrl = "/img/produtos/product-placeholder.svg";
                }
    
                // Se não houver endereço de retirada específico para o produto, 
                // usa o endereço do supermercado
                if (string.IsNullOrEmpty(produto.PickupAddress))
                {
                    if (!string.IsNullOrEmpty(supermercado.PickupAddress))
                    {
                        produto.PickupAddress = supermercado.PickupAddress;
                    }
                    else
                    {
                        // Se não houver pickup address, use o endereço do supermercado
                        produto.PickupAddress = supermercado.Endereco;
                    }
                    Console.WriteLine($"Usando endereço de retirada: {produto.PickupAddress}");
                }
    
                _context.Produtos.Add(produto);
                await _context.SaveChangesAsync();
                
                Console.WriteLine($"Produto ID {produto.Id} criado com sucesso");
    
                return CreatedAtAction(nameof(ObterProdutoPorId), new { id = produto.Id }, produto);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Erro ao criar produto: {ex.Message}");
                Console.Error.WriteLine(ex.StackTrace);
                return StatusCode(500, new { message = $"Erro ao criar produto: {ex.Message}" });
            }
        }

        // POST: api/produtos/upload-image
        [HttpPost]
        public async Task<IActionResult> UploadProductImage(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("Nenhuma imagem foi enviada.");
            }

            var filePath = Path.Combine("wwwroot/images/products", imageFile.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            var imageUrl = $"/images/products/{imageFile.FileName}";

            // Retorna a URL da imagem para ser salva no banco de dados
            return Ok(new { imageUrl });
        }

        // GET: api/produtos/supermercado/{supermercadoId}
        [HttpGet("supermercado/{supermercadoId}")]
        public async Task<IActionResult> ListarProdutosPorSupermercado(int supermercadoId)
        {
            try
            {
                Console.WriteLine($"Buscando produtos para supermercado/usuário ID: {supermercadoId}");
                
                // Primeiro verificamos se o ID é de um supermercado
                var supermercadoExiste = await _context.Supermercados.AnyAsync(s => s.Id == supermercadoId);
                
                // Se encontramos o supermercado, buscamos seus produtos
                if (supermercadoExiste)
                {
                    Console.WriteLine($"ID {supermercadoId} é de um supermercado");
                    var produtos = await _context.Produtos
                        .Where(p => p.SupermercadoId == supermercadoId)
                        .ToListAsync();
                    
                    Console.WriteLine($"Encontrados {produtos.Count} produtos");
                    return Ok(produtos);
                }
                
                // Se não é um ID de supermercado, talvez seja um ID de usuário
                Console.WriteLine($"ID {supermercadoId} não é de um supermercado, tentando como ID de usuário");
                var usuario = await _context.Users
                    .Where(u => u.Id == supermercadoId && u.UserType == "Supermercado")
                    .Include(u => u.Supermercado)
                    .FirstOrDefaultAsync();
                
                if (usuario != null && usuario.SupermercadoId.HasValue)
                {
                    Console.WriteLine($"Encontrado usuário com ID {supermercadoId}, associado ao supermercado ID {usuario.SupermercadoId}");
                    var produtos = await _context.Produtos
                        .Where(p => p.SupermercadoId == usuario.SupermercadoId.Value)
                        .ToListAsync();
                    
                    Console.WriteLine($"Encontrados {produtos.Count} produtos");
                    return Ok(produtos);
                }
                
                // Se não encontramos nada, retornamos lista vazia mas com status OK
                Console.WriteLine("Nenhum supermercado ou usuário encontrado com este ID");
                return Ok(new List<Produto>());
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Erro ao buscar produtos: {ex.Message}");
                return StatusCode(500, new { message = $"Erro ao buscar produtos: {ex.Message}" });
            }
        }

        // GET: api/produtos/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> ObterProdutoPorId(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            return produto == null ? NotFound("Produto não encontrado.") : Ok(produto);
        }

        // PUT: api/produtos/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Supermercado")]
        public async Task<IActionResult> AtualizarProduto(int id, [FromBody] Produto produtoAtualizado)
        {
            if (id != produtoAtualizado.Id)
                return BadRequest("ID do produto inconsistente.");

            var produtoExistente = await _context.Produtos.FindAsync(id);
            if (produtoExistente == null)
                return NotFound("Produto não encontrado.");

            // Atualiza os campos permitidos
            produtoExistente.Nome = produtoAtualizado.Nome;
            produtoExistente.DataVencimento = produtoAtualizado.DataVencimento;
            produtoExistente.Desconto = CalcularDesconto(produtoAtualizado.DataVencimento);
            produtoExistente.Status = produtoExistente.Desconto == 100 ? "doado" : "disponível";

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProdutoExists(id))
                    return NotFound("Produto não encontrado para atualização.");
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/produtos/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Supermercado")]
        public async Task<IActionResult> ExcluirProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null)
                return NotFound("Produto não encontrado.");

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProdutoExists(int id)
        {
            return _context.Produtos.Any(e => e.Id == id);
        }

        private double CalcularDesconto(DateTime dataVencimento)
        {
            int diasRestantes = (dataVencimento - DateTime.Today).Days;
            return diasRestantes switch
            {
                <= 3 => 100, // Doação total
                <= 7 => 30,  // 30% de desconto
                <= 15 => 10, // 10% de desconto
                _ => 0       // Sem desconto
            };
        }
    }
}
