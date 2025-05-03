import { createClient } from "@supabase/supabase-js";

// Obtenha as variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Verifica se as variáveis de ambiente estão disponíveis
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_ANON_KEY não definidas."
  );
}

// Cria o cliente Supabase com opções para desabilitar persistência automática
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Desativa a persistência automática de sessão
    autoRefreshToken: false, // Desativa a renovação automática de token
    storageKey: "animeword-temp-session", // Chave personalizada para armazenamento temporário
  },
});

export { supabase };
