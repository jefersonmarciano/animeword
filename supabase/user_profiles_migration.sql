-- Criar tabela de perfis de usuário para armazenar informações adicionais
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nickname TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar índice para buscas por email
CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles (email);

-- Adicionar RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para perfis de usuário
CREATE POLICY "Qualquer usuário pode ver perfis"
ON user_profiles FOR SELECT
USING (true);

CREATE POLICY "Usuários podem criar seus próprios perfis"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Adicionar função de trigger para atualizar o timestamp
CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Adicionar trigger para atualizar o timestamp
CREATE TRIGGER update_profile_timestamp
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_timestamp(); 