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
            var supermercados = await _context.Supermercados.ToListAsync();
            return Ok(supermercados);
        }

        // POST: api/supermercados
        [HttpPost]
        public async Task<ActionResult<Supermercado>> PostSupermercado([FromBody] Supermercado supermercado)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Supermercados.Add(supermercado);
            await _context.SaveChangesAsync();

            // Retorna o supermercado criado, com status 201 (Created)
            return CreatedAtAction(nameof(GetById), new { id = supermercado.Id }, supermercado);
        }

        // GET: api/supermercados/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Supermercado>> GetById(int id)
        {
            var supermercado = await _context.Supermercados.FindAsync(id);
            if (supermercado == null)
                return NotFound();
            return Ok(supermercado);
        }
    }
}
