-- Script para corrigir as políticas de segurança no Supabase

-- 1. Desativar temporariamente RLS para realizar alterações
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE room_players DISABLE ROW LEVEL SECURITY;
ALTER TABLE game_state DISABLE ROW LEVEL SECURITY;

-- 2. Remover políticas existentes que estão causando problemas
DROP POLICY IF EXISTS "Qualquer um pode ver salas disponíveis" ON rooms;
DROP POLICY IF EXISTS "Jogadores podem ver suas salas" ON rooms;
DROP POLICY IF EXISTS "Hosts podem criar salas" ON rooms;
DROP POLICY IF EXISTS "Hosts podem atualizar suas salas" ON rooms;
DROP POLICY IF EXISTS "Hosts podem deletar suas salas" ON rooms;

DROP POLICY IF EXISTS "Usuários autenticados podem inserir jogadores" ON room_players;
DROP POLICY IF EXISTS "Jogadores podem ver jogadores na mesma sala" ON room_players;
DROP POLICY IF EXISTS "Jogadores podem atualizar seus próprios dados" ON room_players;
DROP POLICY IF EXISTS "Jogadores podem remover-se de salas" ON room_players;
DROP POLICY IF EXISTS "Todos podem ver jogadores nas salas" ON room_players;

DROP POLICY IF EXISTS "Jogadores podem ver estado do jogo de suas salas" ON game_state;
DROP POLICY IF EXISTS "Jogadores podem atualizar estado do jogo de suas salas" ON game_state;
DROP POLICY IF EXISTS "Todos podem ver o estado do jogo" ON game_state;

-- 3. Criar novas políticas simplificadas que permitem todas as operações
-- Políticas para rooms (salas)
CREATE POLICY "Acesso total a rooms" ON rooms
    USING (true)
    WITH CHECK (true);

-- Políticas para room_players (jogadores em salas)
CREATE POLICY "Acesso total a room_players" ON room_players
    USING (true)
    WITH CHECK (true);

-- Políticas para game_state (estado do jogo)
CREATE POLICY "Acesso total a game_state" ON game_state
    USING (true)
    WITH CHECK (true);

-- 4. Reativar RLS com as novas políticas
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;

-- 5. Opcionalmente adicionar a coluna host_nickname se necessário
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS host_nickname TEXT; 