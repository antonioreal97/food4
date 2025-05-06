using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
} 