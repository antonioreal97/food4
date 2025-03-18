using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        // Registra um novo usuário
        public async Task<User> RegisterUserAsync(string name, string email, string password, string userType)
        {
            // Verifica se o email já está em uso
            if (await _context.Users.AnyAsync(u => u.Email == email))
            {
                throw new InvalidOperationException("Este email já está em uso.");
            }

            // Cria o hash da senha
            string passwordHash = HashPassword(password);

            // Cria o novo usuário
            var user = new User
            {
                Name = name,
                Email = email,
                PasswordHash = passwordHash,
                UserType = userType,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        // Autentica um usuário
        public async Task<User> AuthenticateAsync(string email, string password)
        {
            var user = await _context.Users
                .Include(u => u.Supermercado)
                .Include(u => u.Cozinha)
                .FirstOrDefaultAsync(u => u.Email == email);

            // Usuário não encontrado
            if (user == null)
                return null;

            // Verifica se a senha está correta
            if (!VerifyPassword(password, user.PasswordHash))
                return null;

            return user;
        }

        // Verifica a senha
        private bool VerifyPassword(string password, string passwordHash)
        {
            return HashPassword(password) == passwordHash;
        }

        // Cria um hash da senha
        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                
                // Converte o hash para string hexadecimal
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        // Obtém um usuário pelo ID
        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.Supermercado)
                .Include(u => u.Cozinha)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        // Associa um usuário a um supermercado
        public async Task AssociateSupermarketAsync(int userId, int supermarketId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new InvalidOperationException("Usuário não encontrado.");

            if (user.UserType != "Supermercado")
                throw new InvalidOperationException("Este usuário não é do tipo Supermercado.");

            var supermarket = await _context.Supermercados.FindAsync(supermarketId);
            if (supermarket == null)
                throw new InvalidOperationException("Supermercado não encontrado.");

            user.SupermercadoId = supermarketId;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        // Associa um usuário a uma cozinha solidária
        public async Task AssociateKitchenAsync(int userId, int kitchenId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new InvalidOperationException("Usuário não encontrado.");

            if (user.UserType != "Cozinha")
                throw new InvalidOperationException("Este usuário não é do tipo Cozinha.");

            var kitchen = await _context.Cozinhas.FindAsync(kitchenId);
            if (kitchen == null)
                throw new InvalidOperationException("Cozinha não encontrada.");

            user.CozinhaId = kitchenId;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        // Atualiza os dados de um usuário
        public async Task UpdateUserAsync(int id, string name, string email)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                throw new InvalidOperationException("Usuário não encontrado.");

            // Verifica se o novo email já está em uso por outro usuário
            if (email != user.Email && await _context.Users.AnyAsync(u => u.Email == email))
                throw new InvalidOperationException("Este email já está em uso.");

            user.Name = name;
            user.Email = email;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        // Altera a senha de um usuário
        public async Task ChangePasswordAsync(int id, string currentPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                throw new InvalidOperationException("Usuário não encontrado.");

            // Verifica se a senha atual está correta
            if (!VerifyPassword(currentPassword, user.PasswordHash))
                throw new InvalidOperationException("Senha atual incorreta.");

            // Atualiza a senha
            user.PasswordHash = HashPassword(newPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
        
        // Obtém todos os usuários (para depuração)
        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .Include(u => u.Supermercado)
                .Include(u => u.Cozinha)
                .ToListAsync();
        }
    }
}