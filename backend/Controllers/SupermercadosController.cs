using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;

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
            // Recupera a lista de supermercados do banco de dados
            var supermercados = await _context.Supermercados.ToListAsync();
            return Ok(supermercados);
        }
        
        // Outros endpoints (POST, PUT, DELETE) podem ser implementados conforme necessário.
    }
}
