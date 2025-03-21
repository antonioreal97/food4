-- Esquema do banco de dados SQLite baseado na migração InitialCreate

-- Tabela Cozinhas
CREATE TABLE "Cozinhas" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nome" TEXT NOT NULL,
    "Endereco" TEXT NOT NULL,
    "Contato" TEXT NOT NULL,
    "RegistroGoverno" TEXT NOT NULL,
    "Aprovada" INTEGER NOT NULL
);

-- Tabela Supermercados
CREATE TABLE "Supermercados" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nome" TEXT NOT NULL,
    "Endereco" TEXT NOT NULL,
    "Contato" TEXT NOT NULL
);

-- Tabela Transacoes
CREATE TABLE "Transacoes" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ProdutoId" INTEGER NOT NULL,
    "CozinhaId" INTEGER NOT NULL,
    "Tipo" TEXT NOT NULL,
    "DataTransacao" TEXT NOT NULL,
    "CodigoVerificacao" TEXT NOT NULL
);

-- Tabela Produtos
CREATE TABLE "Produtos" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nome" TEXT NOT NULL,
    "DataVencimento" TEXT NOT NULL,
    "Desconto" REAL NOT NULL,
    "Status" TEXT NOT NULL,
    "ImagemUrl" TEXT,
    "PickupAddress" TEXT,
    "SupermercadoId" INTEGER NOT NULL,
    FOREIGN KEY ("SupermercadoId") REFERENCES "Supermercados" ("Id") ON DELETE CASCADE
);

-- Tabela Users
CREATE TABLE "Users" (
    "Id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "UserType" TEXT NOT NULL,
    "SupermercadoId" INTEGER,
    "CozinhaId" INTEGER,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT NOT NULL,
    FOREIGN KEY ("CozinhaId") REFERENCES "Cozinhas" ("Id") ON DELETE SET NULL,
    FOREIGN KEY ("SupermercadoId") REFERENCES "Supermercados" ("Id") ON DELETE SET NULL
);

-- Índices
CREATE INDEX "IX_Produtos_SupermercadoId" ON "Produtos" ("SupermercadoId");
CREATE UNIQUE INDEX "IX_Users_CozinhaId" ON "Users" ("CozinhaId");
CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");
CREATE UNIQUE INDEX "IX_Users_SupermercadoId" ON "Users" ("SupermercadoId");

-- Tabela de controle de migrações EF Core
CREATE TABLE "__EFMigrationsHistory" (
    "MigrationId" TEXT NOT NULL PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);

-- Inserir a migração inicial no histórico
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20250318020057_InitialCreate', '7.0.0');