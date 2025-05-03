-- Script para atualizar a estrutura do banco de dados para compartilhamento em tempo real

-- 1. Garantir que a tabela game_state tenha os campos necessários
ALTER TABLE game_state 
ADD COLUMN IF NOT EXISTS guessed_letters TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN IF NOT EXISTS wrong_letters TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN IF NOT EXISTS current_question JSONB,
ADD COLUMN IF NOT EXISTS last_player_action JSONB,
ADD COLUMN IF NOT EXISTS shared_question JSONB,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2. Atualizar a tabela rooms para adicionar um campo de status do jogo
ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS game_status TEXT DEFAULT 'waiting',
ADD COLUMN IF NOT EXISTS current_player_index INTEGER DEFAULT 0;

-- 3. Adicionar trigger para atualizar o timestamp quando o estado do jogo for modificado
CREATE OR REPLACE FUNCTION update_game_state_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover o trigger se já existir para evitar erros
DROP TRIGGER IF EXISTS game_state_updated ON game_state;

-- Criar o trigger
CREATE TRIGGER game_state_updated
BEFORE UPDATE ON game_state
FOR EACH ROW
EXECUTE FUNCTION update_game_state_timestamp();

-- 4. Garantir que as políticas RLS permitam leitura/escrita em tempo real
ALTER TABLE game_state DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir acesso completo a game_state" ON game_state;
CREATE POLICY "Permitir acesso realtime a game_state" ON game_state
    USING (true)
    WITH CHECK (true);
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY; 