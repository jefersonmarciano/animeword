-- Script para corrigir o problema da tabela game_state
-- Primeiro, verificamos se a extensão está instalada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verificar se a tabela game_state existe
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'game_state'
    ) THEN
        -- Se a tabela existe, excluí-la para recriá-la corretamente
        DROP TABLE game_state CASCADE;
    END IF;
END
$$;

-- Criar a tabela game_state do zero
CREATE TABLE game_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  guessed_letters TEXT[] DEFAULT '{}'::TEXT[],
  wrong_letters TEXT[] DEFAULT '{}'::TEXT[],
  time_left INTEGER DEFAULT 60,
  game_over BOOLEAN DEFAULT FALSE,
  shared_question JSONB,
  last_player_action JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar índices para melhorar o desempenho
CREATE INDEX game_state_room_id_idx ON game_state(room_id);

-- Atualizar a timestamp quando o estado do jogo for modificado
CREATE OR REPLACE FUNCTION update_game_state_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar o trigger
CREATE TRIGGER game_state_updated
BEFORE UPDATE ON game_state
FOR EACH ROW
EXECUTE FUNCTION update_game_state_timestamp();

-- Configurar permissões RLS
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;

-- Criar política que permite a todos os usuários autenticados acessar e modificar o estado do jogo
CREATE POLICY "Todos podem ver e modificar game_state" 
ON game_state FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Atualizar a tabela rooms para garantir as colunas necessárias
ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS game_status TEXT DEFAULT 'waiting',
ADD COLUMN IF NOT EXISTS current_player_index INTEGER DEFAULT 0; 