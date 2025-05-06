using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class CartController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
} 