"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { LogIn, UserPlus } from "lucide-react";

export default function LoginScreen() {
  const { login, loginAsGuest } = useAuth();
  const [nickname, setNickname] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      login(nickname.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="gartic-card p-6 w-full max-w-md">
        <h2 className="text-center text-xl font-bold text-white mb-6">
          ENTRAR NO AnimeWord
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="nickname" className="block text-foreground">
              Seu apelido:
            </label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Digite seu apelido"
              className="gartic-input w-full"
              required
            />
          </div>

          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              className="gartic-button-primary w-full flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" /> ENTRAR
            </Button>

            <Button
              type="button"
              onClick={loginAsGuest}
              className="gartic-button-primary-secondary w-full flex items-center justify-center gap-2 w-full bg-secondary"
            >
              <UserPlus className="w-5 h-5" /> ENTRAR COMO CONVIDADO
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
