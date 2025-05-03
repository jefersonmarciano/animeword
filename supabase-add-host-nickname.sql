-- Este script SQL adiciona uma coluna host_nickname à tabela rooms
-- Execute no console SQL do Supabase quando quiser adicionar esta funcionalidade

-- Adicionar a coluna host_nickname à tabela rooms
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS host_nickname TEXT;

-- Comentário na coluna para explicar seu propósito
COMMENT ON COLUMN rooms.host_nickname IS 'Apelido do criador da sala para facilitar identificação'; 