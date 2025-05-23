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

        // POST: api/produtos/criar
        [HttpPost("criar")]
        [Authorize(Roles = "Supermercado")]
        public async Task<IActionResult> CriarProduto([FromForm] ProdutoNovo produto, IFormFile? imagem)
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
    
                if (string.IsNullOrEmpty(produto.PickupAddress))
                {
                    return BadRequest(new { message = "O endereço de retirada é obrigatório." });
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
                        Console.WriteLine($"Processando imagem: {imagem.FileName} ({imagem.Length} bytes)");
                        
                        // Verifica o tipo do arquivo
                        if (!imagem.ContentType.StartsWith("image/"))
                        {
                            Console.WriteLine($"Tipo de arquivo inválido: {imagem.ContentType}");
                            return BadRequest(new { message = "O arquivo enviado não é uma imagem válida." });
                        }
    
                        // Verifica o tamanho do arquivo (máximo 5MB)
                        if (imagem.Length > 5 * 1024 * 1024)
                        {
                            Console.WriteLine($"Arquivo muito grande: {imagem.Length} bytes");
                            return BadRequest(new { message = "A imagem deve ter no máximo 5MB." });
                        }
    
                        // Converte a imagem para bytes
                        using (var memoryStream = new MemoryStream())
                        {
                            await imagem.CopyToAsync(memoryStream);
                            produto.Imagem = memoryStream.ToArray();
                        }
    
                        // Obtém o diretório raiz do projeto (onde está o backend)
                        var projectRoot = Directory.GetParent(_environment.ContentRootPath).FullName;
                        
                        // Constrói o caminho para a pasta de imagens no frontend
                        var uploadsFolder = Path.Combine(projectRoot, "frontend", "img", "produtos");
                        Console.WriteLine($"Diretório de uploads: {uploadsFolder}");
    
                        if (!Directory.Exists(uploadsFolder))
                        {
                            Console.WriteLine($"Criando diretório de uploads: {uploadsFolder}");
                            Directory.CreateDirectory(uploadsFolder);
                        }
    
                        var uniqueFileName = Guid.NewGuid().ToString() + "_" + imagem.FileName;
                        var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                        Console.WriteLine($"Salvando imagem em: {filePath}");
    
                        // Salva a imagem no disco
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await imagem.CopyToAsync(stream);
                        }
    
                        // Define a URL da imagem com o caminho correto para o frontend
                        produto.ImagemUrl = $"/frontend/img/produtos/{uniqueFileName}";
                        Console.WriteLine($"URL da imagem definida como: {produto.ImagemUrl}");
                    }
                    catch (Exception ex)
                    {
                        Console.Error.WriteLine($"Erro ao processar imagem: {ex.Message}");
                        Console.Error.WriteLine($"Stack trace: {ex.StackTrace}");
                        // Continua mesmo sem a imagem
                        produto.ImagemUrl = "/img/produtos/product-placeholder.svg";
                        produto.Imagem = new byte[0]; // Array vazio para satisfazer a constraint
                    }
                }
                else
                {
                    Console.WriteLine("Nenhuma imagem enviada, usando placeholder");
                    produto.ImagemUrl = "/img/produtos/product-placeholder.svg";
                    produto.Imagem = new byte[0]; // Array vazio para satisfazer a constraint
                }
    
                Console.WriteLine("Salvando produto no banco de dados...");
                _context.Produtos.Add(produto);
                await _context.SaveChangesAsync();
                
                Console.WriteLine($"Produto ID {produto.Id} criado com sucesso");
    
                return CreatedAtAction(nameof(ObterProdutoPorId), new { id = produto.Id }, produto);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Erro ao criar produto: {ex.Message}");
                Console.Error.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = $"Erro ao criar produto: {ex.Message}" });
            }
        }

        // POST: api/produtos/upload-imagem
        [HttpPost("upload-imagem")]
        public async Task<IActionResult> UploadProductImage([FromForm] IFormFile imagem)
        {
            if (imagem == null || imagem.Length == 0)
            {
                return BadRequest("Nenhuma imagem foi enviada.");
            }

            var filePath = Path.Combine("wwwroot/images/products", imagem.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imagem.CopyToAsync(stream);
            }

            var imageUrl = $"/images/products/{imagem.FileName}";

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

        // DTO para atualização de produto
        public class ProdutoUpdateDTO
        {
            public int Id { get; set; }
            public string Nome { get; set; }
            public DateTime DataVencimento { get; set; }
            public double Desconto { get; set; }
            public string Status { get; set; }
            public string PickupAddress { get; set; }
            public int SupermercadoId { get; set; }
            public string? ImagemUrl { get; set; }
        }

        // PUT: api/produtos/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Supermercado")]
        public async Task<IActionResult> AtualizarProduto(int id, [FromBody] ProdutoUpdateDTO produtoAtualizado)
        {
            Console.WriteLine($"Recebendo requisição para atualizar produto ID {id}");
            Console.WriteLine($"Dados recebidos: Nome={produtoAtualizado.Nome}, Desconto={produtoAtualizado.Desconto}, Status={produtoAtualizado.Status}");

            if (id != produtoAtualizado.Id)
                return BadRequest("ID do produto inconsistente.");

            var produtoExistente = await _context.Produtos
                .FirstOrDefaultAsync(p => p.Id == id);

            if (produtoExistente == null)
                return NotFound("Produto não encontrado.");

            // Atualiza os campos permitidos
            produtoExistente.Nome = produtoAtualizado.Nome;
            produtoExistente.DataVencimento = produtoAtualizado.DataVencimento;
            produtoExistente.Desconto = produtoAtualizado.Desconto;
            produtoExistente.Status = produtoAtualizado.Status;
            produtoExistente.PickupAddress = produtoAtualizado.PickupAddress;
            produtoExistente.SupermercadoId = produtoAtualizado.SupermercadoId;

            // Mantém a imagem existente se não for fornecida uma nova
            if (!string.IsNullOrEmpty(produtoAtualizado.ImagemUrl))
            {
                produtoExistente.ImagemUrl = produtoAtualizado.ImagemUrl;
            }

            try
            {
                Console.WriteLine("Salvando alterações no banco de dados...");
                await _context.SaveChangesAsync();
                Console.WriteLine($"Produto ID {id} atualizado com sucesso. Novo desconto: {produtoExistente.Desconto}%, Novo status: {produtoExistente.Status}");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                Console.Error.WriteLine($"Erro de concorrência ao atualizar produto: {ex.Message}");
                if (!ProdutoExists(id))
                    return NotFound("Produto não encontrado para atualização.");
                else
                    throw;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Erro ao atualizar produto: {ex.Message}");
                return StatusCode(500, new { message = $"Erro ao atualizar produto: {ex.Message}" });
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
