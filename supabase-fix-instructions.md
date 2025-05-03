# Instruções para correção no Supabase

Para resolver o erro de "recursão infinita" no Supabase, siga estas instruções:

1. Acesse o painel do Supabase em: https://app.supabase.com
2. Selecione seu projeto (`gqeijzyqgeztgjkqofwl`)
3. Vá para a seção **"SQL Editor"**
4. Crie uma nova consulta SQL e cole o seguinte código:

```sql
-- Remover a política recursiva atual que está causando problemas
DROP POLICY IF EXISTS "Jogadores podem ver jogadores na mesma sala" ON room_players;

-- Criar uma nova política simplificada que permite visualizar as entradas da tabela sem causar recursão
CREATE POLICY "Todos podem ver jogadores nas salas"
ON room_players FOR SELECT USING (true);

-- Limpeza de eventuais dados corrompidos ou problemas (opcional)
-- DELETE FROM room_players WHERE id IS NULL;
-- Verificar se há referências corrompidas
-- DELETE FROM room_players WHERE room_id NOT IN (SELECT id FROM rooms);
```

5. Execute o código SQL clicando no botão "Run" (Executar)
6. Verifique se a execução foi bem-sucedida

## Explicação do problema

O erro "infinite recursion detected in policy for relation room_players" ocorre porque a política de segurança original está criando um loop infinito ao verificar permissões.

A política original verifica se o usuário tem acesso verificando se ele é um jogador na sala, mas para verificar isso, o Supabase precisa acessar a tabela `room_players`, o que por sua vez aciona a mesma política, criando um loop infinito.

A nova política simplificada resolve isso permitindo que qualquer usuário visualize os registros da tabela `room_players`. Se precisar de mais segurança no futuro, você pode implementar uma política mais restritiva, mas sem a verificação recursiva.

## Próximos passos

Depois de aplicar essa correção:

1. Reinicie o aplicativo Next.js
2. Teste a criação de salas e a entrada em salas existentes
3. Verifique se os erros 500 desapareceram
