-- Script para corrigir a restrição de chave estrangeira na tabela rooms

-- 1. Desativar temporariamente RLS para realizar alterações
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE room_players DISABLE ROW LEVEL SECURITY;

-- 2. Remover a restrição de chave estrangeira que está causando o problema
-- Primeiro, precisamos encontrar o nome exato da restrição
-- A mensagem de erro mencionou 'rooms_host_id_fkey', então usaremos esse nome
ALTER TABLE rooms DROP CONSTRAINT IF EXISTS rooms_host_id_fkey;

-- 3. Modificar a coluna host_id para ser apenas um UUID sem restrição de chave estrangeira
-- Isso permitirá que qualquer UUID seja usado como host_id, sem necessidade de existir na tabela users
ALTER TABLE rooms ALTER COLUMN host_id TYPE UUID; -- Certifique-se de que é UUID

-- 4. Adicionar a coluna host_nickname se ainda não existir
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS host_nickname TEXT;

-- 5. Reativar RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;

-- Se necessário, faça o mesmo para a tabela room_players
ALTER TABLE room_players DROP CONSTRAINT IF EXISTS room_players_user_id_fkey;
ALTER TABLE room_players ALTER COLUMN user_id TYPE UUID; 