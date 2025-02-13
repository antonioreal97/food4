using backend.Data;
using backend.Authentication; // Necessário para utilizar o FakeAuthenticationHandler
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

// Configura o DbContext com SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Adiciona a autenticação com um esquema fake para testes
builder.Services.AddAuthentication("FakeScheme")
    .AddScheme<AuthenticationSchemeOptions, FakeAuthenticationHandler>("FakeScheme", options => { });

// Registra os controllers e o Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configura o middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Coloque a autenticação ANTES da autorização
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
