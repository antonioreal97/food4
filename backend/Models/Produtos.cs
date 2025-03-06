using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Supermercado = backend.Models.Supermercado;

namespace backend.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public DateTime DataVencimento { get; set; }
        public double Desconto { get; set; }
        public string Status { get; set; } = string.Empty;
        public int SupermercadoId { get; set; }
        [ForeignKey("SupermercadoId")]
        [Required]
        public Supermercado? Supermercado { get; set; }
    }
}
