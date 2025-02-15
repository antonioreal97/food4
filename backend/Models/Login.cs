using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "O email é obrigatório.")]
        public string Email { get; set; }
        
        [Required(ErrorMessage = "A senha é obrigatória.")]
        public string Password { get; set; }
    }
}
