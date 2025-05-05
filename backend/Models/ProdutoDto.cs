using Microsoft.AspNetCore.Http;
using System;

namespace backend.Models
{
    public class ProdutoDto
    {
        public string Nome { get; set; } = string.Empty;
        public DateTime DataVencimento { get; set; }
        public int Desconto { get; set; }
        public string Status { get; set; } = string.Empty;
        public int SupermercadoId { get; set; }
        public string PickupAddress { get; set; } = string.Empty;
        public IFormFile Imagem { get; set; } = null!;
    }
}