using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // Endpoint POST: api/auth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            // Validação básica: email e senha devem ser informados.
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest("Email e senha são obrigatórios.");
            }

            // Lógica simulada: se a senha for "password", consideramos o login válido.
            if (model.Password == "password")
            {
                // Retorne um token de teste e outras informações que desejar.
                return Ok(new 
                {
                    Token = "TestToken", // Token fixo para testes
                    Message = "Login realizado com sucesso."
                });
            }
            else
            {
                // Caso a senha não seja a esperada, retorna 401 Unauthorized.
                return Unauthorized("Credenciais inválidas.");
            }
        }
    }

    // Modelo para os dados de login
    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
