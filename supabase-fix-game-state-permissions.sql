-- Script para corrigir as permissões da tabela game_state
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verificar se a tabela game_state existe
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'game_state'
    ) THEN
        -- Desativar RLS temporariamente para fazer alterações
        ALTER TABLE game_state DISABLE ROW LEVEL SECURITY;
        
        -- Remover todas as políticas existentes que possam estar causando problemas
        DROP POLICY IF EXISTS "Todos podem ver e modificar game_state" ON game_state;
        DROP POLICY IF EXISTS "Usuários autenticados podem modificar game_state" ON game_state;
        DROP POLICY IF EXISTS "Todos podem ver game_state" ON game_state;
        
        -- Reativar RLS
        ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;
        
        -- Criar políticas mais específicas e seguras
        -- Política para SELECT - qualquer usuário autenticado pode ver todos os registros
        CREATE POLICY "Usuários autenticados podem ver game_state"
        ON game_state FOR SELECT
        TO authenticated
        USING (true);
        
        -- Política para INSERT - usuários só podem inserir registros para suas próprias salas
        CREATE POLICY "Usuários autenticados podem inserir em game_state"
        ON game_state FOR INSERT
        TO authenticated
        WITH CHECK (
            room_id IN (
                SELECT id FROM rooms WHERE host_id = auth.uid()
                UNION
                SELECT room_id FROM room_players WHERE user_id = auth.uid()
            )
        );
        
        -- Política para UPDATE - usuários só podem atualizar registros para suas próprias salas
        CREATE POLICY "Usuários autenticados podem atualizar game_state"
        ON game_state FOR UPDATE
        TO authenticated
        USING (
            room_id IN (
                SELECT id FROM rooms WHERE host_id = auth.uid()
                UNION
                SELECT room_id FROM room_players WHERE user_id = auth.uid()
            )
        );
        
        -- Política para DELETE - apenas o host pode excluir registros
        CREATE POLICY "Hosts podem excluir game_state"
        ON game_state FOR DELETE
        TO authenticated
        USING (
            room_id IN (
                SELECT id FROM rooms WHERE host_id = auth.uid()
            )
        );
    ELSE
        -- Se a tabela não existir, criá-la do zero
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
        
        -- Aplicar as políticas
        -- Política para SELECT - qualquer usuário autenticado pode ver todos os registros
        CREATE POLICY "Usuários autenticados podem ver game_state"
        ON game_state FOR SELECT
        TO authenticated
        USING (true);
        
        -- Política para INSERT - usuários só podem inserir registros para suas próprias salas
        CREATE POLICY "Usuários autenticados podem inserir em game_state"
        ON game_state FOR INSERT
        TO authenticated
        WITH CHECK (
            room_id IN (
                SELECT id FROM rooms WHERE host_id = auth.uid()
                UNION
                SELECT room_id FROM room_players WHERE user_id = auth.uid()
            )
        );
        
        -- Política para UPDATE - usuários só podem atualizar registros para suas próprias salas
        CREATE POLICY "Usuários autenticados podem atualizar game_state"
        ON game_state FOR UPDATE
        TO authenticated
        USING (
            room_id IN (
                SELECT id FROM rooms WHERE host_id = auth.uid()
                UNION
                SELECT room_id FROM room_players WHERE user_id = auth.uid()
            )
        );
        
        -- Política para DELETE - apenas o host pode excluir registros
        CREATE POLICY "Hosts podem excluir game_state"
        ON game_state FOR DELETE
        TO authenticated
        USING (
            room_id IN (
                SELECT id FROM rooms WHERE host_id = auth.uid()
            )
        );
    END IF;
    
    -- Atualizar a tabela rooms para garantir as colunas necessárias
    ALTER TABLE rooms
    ADD COLUMN IF NOT EXISTS game_status TEXT DEFAULT 'waiting',
    ADD COLUMN IF NOT EXISTS current_player_index INTEGER DEFAULT 0;
END
$$; 