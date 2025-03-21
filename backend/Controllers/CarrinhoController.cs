using Microsoft.AspNetCore.Mvc;
using backend.Data; // Certifique-se de que este namespace está correto
using backend.Models;
using System.Collections.Generic;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarrinhoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CarrinhoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/carrinho
        [HttpGet]
        public ActionResult<IEnumerable<ItemCarrinho>> ObterItensCarrinho()
        {
            var itensCarrinho = _context.ItensCarrinho.ToList();
            return Ok(itensCarrinho);
        }
    }
}