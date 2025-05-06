using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
} 