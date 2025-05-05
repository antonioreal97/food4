using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ProdutoNovo
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "O nome do produto é obrigatório")]
        public string Nome { get; set; }
        
        [Required(ErrorMessage = "A data de vencimento é obrigatória")]
        public DateTime DataVencimento { get; set; }
        
        public double Desconto { get; set; }
        
        [Required(ErrorMessage = "O status do produto é obrigatório")]
        public string Status { get; set; }
        
        [Required(ErrorMessage = "O ID do supermercado é obrigatório")]
        public int SupermercadoId { get; set; }
        
        [Required(ErrorMessage = "O endereço de retirada é obrigatório")]
        public string PickupAddress { get; set; }
        
        public string? ImagemUrl { get; set; }
        public byte[]? Imagem { get; set; }
        public Supermercado? Supermercado { get; set; }
    }
}