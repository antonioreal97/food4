namespace backend.Models
{
    public class ItemCarrinho
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public int Quantidade { get; set; }
        public double Preco { get; set; }
        public string ImagemUrl { get; set; }
    }
}