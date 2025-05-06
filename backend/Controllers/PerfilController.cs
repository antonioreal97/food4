using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class PerfilController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
} 