using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Cozinha> Cozinhas { get; set; }
        public DbSet<Supermercado> Supermercados { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }

        // Se necessário, configure o modelo aqui
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Exemplo: Configurações adicionais, chaves, relações, etc.
        }
    }
}
