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
        public DbSet<User> Users { get; set; }
        public DbSet<ItemCarrinho> ItensCarrinho { get; set; }

        // Se necessário, configure o modelo aqui
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurações específicas para User
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Relacionamento 1:1 entre User e Supermercado (opcional)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Supermercado)
                .WithOne()
                .HasForeignKey<User>(u => u.SupermercadoId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);

            // Relacionamento 1:1 entre User e Cozinha (opcional)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Cozinha)
                .WithOne()
                .HasForeignKey<User>(u => u.CozinhaId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
