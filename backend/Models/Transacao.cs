using System;

namespace backend.Models
{
    public class Transacao
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public int CozinhaId { get; set; }
        public string Tipo { get; set; } = string.Empty; // 'Compra' ou 'Doacao'
        public DateTime DataTransacao { get; set; }
        public string CodigoVerificacao { get; set; } = string.Empty;
    }
}
