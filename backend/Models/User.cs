using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required(ErrorMessage = "O nome é obrigatório.")]
        public string Name { get; set; }
        
        [Required(ErrorMessage = "O email é obrigatório.")]
        [EmailAddress(ErrorMessage = "Formato de email inválido.")]
        public string Email { get; set; }
        
        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string PasswordHash { get; set; }
        
        [Required(ErrorMessage = "O tipo de usuário é obrigatório.")]
        public string UserType { get; set; } // "Supermercado" ou "Cozinha"
        
        // Relacionamentos
        public int? SupermercadoId { get; set; }
        public int? CozinhaId { get; set; }
        
        [ForeignKey("SupermercadoId")]
        public Supermercado Supermercado { get; set; }
        
        [ForeignKey("CozinhaId")]
        public Cozinha Cozinha { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}