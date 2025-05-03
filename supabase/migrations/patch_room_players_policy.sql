-- Remover políticas existentes que estão causando recursão infinita
DROP POLICY IF EXISTS "Jogadores podem ver jogadores na mesma sala" ON room_players;

-- Criar nova política sem recursão
CREATE POLICY "Todos podem ver jogadores nas salas" 
ON room_players FOR SELECT USING (true);

-- Alternativa: política mais restritiva mas sem recursão
-- CREATE POLICY "Jogadores podem ver jogadores na mesma sala" 
-- ON room_players FOR SELECT USING (
--   room_id IN (
--     SELECT room_id FROM room_players 
--     WHERE user_id = auth.uid()
--   )
-- ); 