using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class CadastroController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
} 