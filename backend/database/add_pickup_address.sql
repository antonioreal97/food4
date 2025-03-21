-- Adiciona coluna PickupAddress às tabelas Produtos e Supermercados se elas não existirem
PRAGMA foreign_keys=off;

BEGIN TRANSACTION;

-- Verifica se a coluna PickupAddress já existe na tabela Produtos
SELECT CASE 
    WHEN EXISTS (
        SELECT 1 FROM pragma_table_info('Produtos') WHERE name='PickupAddress'
    )
    THEN 'Column PickupAddress in Produtos already exists'
    ELSE (
        -- Adiciona a coluna se não existir
        ALTER TABLE "Produtos" ADD COLUMN "PickupAddress" TEXT;
        SELECT 'Column PickupAddress added to Produtos successfully'
    )
END;

-- Verifica se a coluna ImagemUrl já existe na tabela Produtos
SELECT CASE 
    WHEN EXISTS (
        SELECT 1 FROM pragma_table_info('Produtos') WHERE name='ImagemUrl'
    )
    THEN 'Column ImagemUrl in Produtos already exists'
    ELSE (
        -- Adiciona a coluna se não existir
        ALTER TABLE "Produtos" ADD COLUMN "ImagemUrl" TEXT;
        SELECT 'Column ImagemUrl added to Produtos successfully'
    )
END;

-- Verifica se a coluna PickupAddress já existe na tabela Supermercados
SELECT CASE 
    WHEN EXISTS (
        SELECT 1 FROM pragma_table_info('Supermercados') WHERE name='PickupAddress'
    )
    THEN 'Column PickupAddress in Supermercados already exists'
    ELSE (
        -- Adiciona a coluna se não existir
        ALTER TABLE "Supermercados" ADD COLUMN "PickupAddress" TEXT;
        SELECT 'Column PickupAddress added to Supermercados successfully'
    )
END;

COMMIT;

PRAGMA foreign_keys=on;