using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data; // Certifique-se de que este namespace corresponda ao do AppDbContext
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProdutosController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/produtos
        [HttpPost]
        [Authorize(Roles = "Supermercado")]
        public async Task<IActionResult> CriarProduto([FromBody] Produto produto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Calcula desconto automaticamente com base na data de vencimento
            produto.Desconto = CalcularDesconto(produto.DataVencimento);
            produto.Status = produto.Desconto == 100 ? "doado" : "disponível";

            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ObterProdutoPorId), new { id = produto.Id }, produto);
        }

        // GET: api/produtos/supermercado/{supermercadoId}
        [HttpGet("supermercado/{supermercadoId}")]
        public async Task<IActionResult> ListarProdutosPorSupermercado(int supermercadoId)
        {
            var produtos = await _context.Produtos
                .Where(p => p.SupermercadoId == supermercadoId)
                .ToListAsync();

            return Ok(produtos);
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
