-- SCRIPT PARA CORREÇÃO DE PROBLEMAS NO SUPABASE
-- Execute este script no SQL Editor do Supabase para resolver problemas de permissões

-- 1. Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Correção da tabela game_state
DO $$
BEGIN
    -- Verificar se a tabela game_state existe
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'game_state'
    ) THEN
        -- Desativar RLS temporariamente
        ALTER TABLE game_state DISABLE ROW LEVEL SECURITY;
        
        -- Remover todas as políticas que possam estar causando problemas
        DROP POLICY IF EXISTS "Todos podem ver e modificar game_state" ON game_state;
        DROP POLICY IF EXISTS "Usuários autenticados podem modificar game_state" ON game_state;
        DROP POLICY IF EXISTS "Todos podem ver game_state" ON game_state;
        DROP POLICY IF EXISTS "Usuários autenticados podem ver game_state" ON game_state;
        DROP POLICY IF EXISTS "Usuários autenticados podem inserir em game_state" ON game_state;
        DROP POLICY IF EXISTS "Usuários autenticados podem atualizar game_state" ON game_state;
        DROP POLICY IF EXISTS "Hosts podem excluir game_state" ON game_state;
    ELSE
        -- Criar a tabela se não existir
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
        
        -- Adicionar índices
        CREATE INDEX game_state_room_id_idx ON game_state(room_id);
        
        -- Função para atualizar timestamp
        CREATE OR REPLACE FUNCTION update_game_state_timestamp()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        -- Criar trigger
        CREATE TRIGGER game_state_updated
        BEFORE UPDATE ON game_state
        FOR EACH ROW
        EXECUTE FUNCTION update_game_state_timestamp();
    END IF;
    
    -- Garantir que RLS está habilitado
    ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;
    
    -- Criar política simplificada que resolve o problema
    -- Esta é uma solução temporária que permite acesso total para usuários autenticados
    -- Você pode tornar isso mais restritivo no futuro
    CREATE POLICY "Acesso total para usuários autenticados" 
    ON game_state FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);
    
    -- 3. Adicionar colunas necessárias à tabela rooms
    ALTER TABLE rooms
    ADD COLUMN IF NOT EXISTS game_status TEXT DEFAULT 'waiting',
    ADD COLUMN IF NOT EXISTS current_player_index INTEGER DEFAULT 0;
END
$$;

-- 4. Correção de políticas na tabela room_players para evitar recursão infinita
DO $$
BEGIN
    -- Remover a política recursiva atual que está causando problemas
    DROP POLICY IF EXISTS "Jogadores podem ver jogadores na mesma sala" ON room_players;
    
    -- Criar uma nova política simplificada que permite visualizar as entradas sem recursão
    CREATE POLICY "Todos podem ver jogadores nas salas"
    ON room_players FOR SELECT USING (true);
    
    -- Política para permitir aos jogadores se juntar a salas
    CREATE POLICY "Usuários autenticados podem inserir em room_players"
    ON room_players FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());
    
    -- Política para permitir aos jogadores atualizar sua própria entrada
    CREATE POLICY "Jogadores podem atualizar seus próprios dados"
    ON room_players FOR UPDATE TO authenticated
    USING (user_id = auth.uid());
    
    -- Política para permitir aos jogadores sair de salas
    CREATE POLICY "Jogadores podem excluir seus próprios dados"
    ON room_players FOR DELETE TO authenticated
    USING (user_id = auth.uid());
END
$$;

-- 5. Criar um índice para melhorar a performance das consultas
CREATE INDEX IF NOT EXISTS room_players_room_id_idx ON room_players(room_id);
CREATE INDEX IF NOT EXISTS room_players_user_id_idx ON room_players(user_id);

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE 'Script executado com sucesso! Todas as correções foram aplicadas.';
END
$$; 