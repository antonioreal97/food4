using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ProdutoNovo> Produtos { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Supermercado> Supermercados { get; set; }
        public DbSet<ItemCarrinho> ItensCarrinho { get; set; }
        public DbSet<Cozinha> Cozinhas { get; set; }
    }
}
