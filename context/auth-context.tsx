"use client";

import { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  user: { id: string; nickname: string } | null;
  loading: boolean;
  loginError: string | null;
  simpleLogin: (nickname: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Verificar se o nickname já está em uso (simula verificação)
const USED_NICKNAMES: string[] = [];

// Função para gerar um ID de usuário único no formato UUID válido
function generateUserId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; nickname: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Tentar recuperar o usuário do localStorage ao iniciar
  useEffect(() => {
    try {
      const savedNickname = localStorage.getItem("animeword-nickname");
      const savedUserId = localStorage.getItem("animeword-userid");
      if (savedNickname && savedUserId) {
        console.log("Usuário recuperado do localStorage:", {
          id: savedUserId,
          nickname: savedNickname,
        });
        setUser({ id: savedUserId, nickname: savedNickname });
      }
    } catch (e) {
      // Ignorar erros de localStorage
      console.error("Erro ao recuperar usuário do localStorage:", e);
    }
  }, []);

  // Login simples apenas com nickname
  const simpleLogin = (nickname: string) => {
    if (!nickname.trim()) {
      setLoginError("Digite um apelido para continuar.");
      return;
    }

    setLoading(true);
    setLoginError(null);

    // Verificar se o nickname já está em uso (simples)
    if (USED_NICKNAMES.includes(nickname)) {
      setLoginError("Este apelido já está em uso. Escolha outro.");
      setLoading(false);
      return;
    }

    try {
      // Gerar um ID único para o usuário
      const userId = generateUserId();
      console.log("Novo usuário criado:", { id: userId, nickname });

      // "Autenticar" o usuário
      setUser({ id: userId, nickname });
      USED_NICKNAMES.push(nickname);

      // Armazenar no localStorage para persistência básica
      try {
        localStorage.setItem("animeword-nickname", nickname);
        localStorage.setItem("animeword-userid", userId);
      } catch (e) {
        // Ignorar erros de localStorage
        console.error("Erro ao salvar usuário no localStorage:", e);
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      setLoginError("Falha ao entrar no jogo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      // Remover o nickname da lista de usados
      const index = USED_NICKNAMES.indexOf(user?.nickname || "");
      if (index > -1) {
        USED_NICKNAMES.splice(index, 1);
      }

      // Limpar o usuário
      setUser(null);

      // Limpar localStorage
      try {
        localStorage.removeItem("animeword-nickname");
        localStorage.removeItem("animeword-userid");
      } catch (e) {
        // Ignorar erros de localStorage
      }
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginError, simpleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
