# Instruções para Implementar Login Direto sem Email de Verificação

Para implementar o login direto sem necessidade de envio de email, siga estas etapas:

## 1. Executar o SQL para criar a tabela de perfis de usuário

Primeiro, execute o SQL no Supabase para criar a tabela de perfis de usuário:

1. Acesse o painel do Supabase (https://app.supabase.com)
2. Selecione seu projeto
3. Vá para a seção **"SQL Editor"**
4. Cole o conteúdo do arquivo `supabase/user_profiles_migration.sql`
5. Execute o código SQL

## 2. Atualizar as políticas de segurança do Supabase Auth

Configure as políticas de autenticação no Supabase:

1. No painel do Supabase, vá para **"Authentication"** > **"Providers"**
2. Certifique-se de que o Email Auth está ativado
3. Desative a opção "Confirm email" para permitir login sem confirmação
4. Salve as alterações

## 3. Verifique o código atualizado

Os seguintes arquivos foram atualizados:

- `context/auth-context.tsx`: Implementa o novo método `directLogin` para autenticação direta
- `components/login-screen.tsx`: Adiciona campo de apelido e usa o novo método de login

## 4. Como o novo sistema funciona

O novo sistema de login:

1. Solicita email e apelido (nickname) do usuário
2. Verifica se o usuário já existe no sistema
3. Se não existir, cria uma nova conta com o email e apelido fornecidos
4. Se existir, faz login na conta existente
5. Não envia emails de verificação
6. Armazena o apelido e outras informações de perfil na tabela `user_profiles`

Esse sistema simplifica o processo de login, permitindo que os usuários comecem a jogar imediatamente, sem necessidade de verificar o email.

## 5. Teste o novo login

Depois de fazer todas as atualizações:

1. Reinicie o servidor Next.js
2. Tente fazer login com um novo email e apelido
3. O sistema deve criar a conta e fazer login automaticamente sem enviar emails

## Observações de segurança

Este sistema prioriza a facilidade de uso sobre a segurança. Como não há verificação de email, qualquer pessoa pode criar uma conta com qualquer endereço de email. Para aplicações que necessitam de maior segurança, considere implementar alguma forma de verificação adicional.
