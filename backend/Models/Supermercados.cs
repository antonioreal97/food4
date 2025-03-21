using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Supermercado
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Nome { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Contato { get; set; } = string.Empty;
        public string? PickupAddress { get; set; }
    }
}