using System;

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
    }
}
