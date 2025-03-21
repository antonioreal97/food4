-- Este script cria um usuário de recuperação para garantir acesso em caso de problemas
PRAGMA foreign_keys=off;

BEGIN TRANSACTION;

-- Cria um usuário de recuperação se ele não existir
INSERT INTO Users (Name, Email, PasswordHash, UserType, CreatedAt, UpdatedAt)
SELECT 
    'Admin Recuperação', 
    'admin@food4all.com', 
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', -- senha: admin
    'Supermercado',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM Users WHERE Email = 'admin@food4all.com'
);

-- Obtém o ID do usuário de recuperação
SELECT Id FROM Users WHERE Email = 'admin@food4all.com';

-- Cria um supermercado para o usuário de recuperação se ele não tiver
INSERT INTO Supermercados (Nome, Endereco, Contato)
SELECT 
    'Supermercado Admin', 
    'Rua da Administração, 123', 
    'admin@food4all.com'
WHERE NOT EXISTS (
    SELECT 1 
    FROM Users u
    JOIN Supermercados s ON u.SupermercadoId = s.Id
    WHERE u.Email = 'admin@food4all.com'
);

-- Associa o supermercado ao usuário de recuperação
UPDATE Users
SET SupermercadoId = (
    SELECT Id FROM Supermercados WHERE Nome = 'Supermercado Admin' OR Contato = 'admin@food4all.com' LIMIT 1
)
WHERE Email = 'admin@food4all.com' AND SupermercadoId IS NULL;

-- Verifica se o usuário de recuperação foi criado corretamente
SELECT 
    u.Id,
    u.Name,
    u.Email,
    u.UserType,
    u.SupermercadoId,
    s.Nome AS SupermercadoNome
FROM Users u
LEFT JOIN Supermercados s ON u.SupermercadoId = s.Id
WHERE u.Email = 'admin@food4all.com';

COMMIT;

PRAGMA foreign_keys=on;

-- INSTRUÇÕES:
-- Este script cria um usuário de recuperação com as seguintes credenciais:
-- Email: admin@food4all.com
-- Senha: admin
-- 
-- Use este usuário em caso de problemas de acesso com outros usuários.