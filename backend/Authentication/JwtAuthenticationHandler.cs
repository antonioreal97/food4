using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using Microsoft.Extensions.Primitives;
using System.Net.Http.Headers;

namespace backend.Authentication
{
    public class JwtAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly JwtAuthService _jwtAuthService;

        public JwtAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            JwtAuthService jwtAuthService)
            : base(options, logger, encoder, clock)
        {
            _jwtAuthService = jwtAuthService;
        }
        
        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.TryGetValue("Authorization", out StringValues authorizationHeader))
            {
                return Task.FromResult(AuthenticateResult.Fail("Authorization header not found."));
            }

            // Formato esperado: "Bearer {token}"
            string bearerToken = authorizationHeader.ToString();
            if (string.IsNullOrEmpty(bearerToken) || !bearerToken.StartsWith("Bearer "))
            {
                return Task.FromResult(AuthenticateResult.Fail("Bearer token not found."));
            }

            // Extrai o token
            string token = bearerToken.Substring("Bearer ".Length).Trim();

            // Valida o token
            if (_jwtAuthService.ValidateToken(token, out ClaimsPrincipal principal))
            {
                // Token válido, cria o ticket de autenticação
                var ticket = new AuthenticationTicket(principal, Scheme.Name);
                return Task.FromResult(AuthenticateResult.Success(ticket));
            }

            // Token inválido
            return Task.FromResult(AuthenticateResult.Fail("Invalid token."));
        }
    }
}