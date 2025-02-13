using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace backend.Authentication
{
    public class FakeAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public FakeAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
        }
        
        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // Cria uma identidade falsa com os claims desejados
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1"),
                new Claim(ClaimTypes.Name, "TestUser"),
                new Claim(ClaimTypes.Role, "Supermercado") // Role para atender o [Authorize(Roles = "Supermercado")]
            };
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);
            
            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}
