using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class MarketController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
} 