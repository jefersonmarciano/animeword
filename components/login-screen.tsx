"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function LoginScreen() {
  const [nickname, setNickname] = useState("");
  const { simpleLogin, loading, loginError } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    simpleLogin(nickname);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 gartic-card">
      <div className="text-center mb-8">
        <Image
          src="/images/logo.png"
          alt="AnimeWord Logo"
          width={200}
          height={100}
          className="mx-auto mb-4"
          priority
        />
        <h1 className="gartic-title">Bem-vindo ao AnimeWord Online!</h1>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {loginError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {loginError}
          </div>
        )}

        <div>
          <label className="block text-white mb-2">Seu Apelido:</label>
          <Input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="gartic-input"
            placeholder="Como quer ser chamado no jogo?"
            required
            autoFocus
            maxLength={20}
          />
        </div>

        <Button
          type="submit"
          className="gartic-button-primary w-full"
          disabled={loading || !nickname.trim()}
        >
          {loading ? "Entrando..." : "Entrar no Jogo"}
        </Button>

        <p className="text-sm text-center text-white/70 mt-2">
          Entre com seu apelido para começar a jogar!
        </p>
      </form>
    </div>
  );
}
