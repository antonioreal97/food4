namespace backend.Models
{
    public class Cozinha
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Contato { get; set; } = string.Empty;
        public string RegistroGoverno { get; set; } = string.Empty;
        public bool Aprovada { get; set; }
    }
}
