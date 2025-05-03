"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import GameConfig from "@/components/game-config";
import GameBoard from "@/components/game-board";
import LoginScreen from "@/components/login-screen";
import RoomManager from "@/components/room-manager";
import LogoutButton from "@/components/logout-button";
import { GameProvider } from "@/context/game-context";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { OnlineGameProvider } from "@/context/online-game-context";
import OnlineGameBoard from "@/components/online-game-board";

function GameApp() {
  const [gameStarted, setGameStarted] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { user, loading } = useAuth();

  // Desabilitar o menu de contexto para evitar inspeção
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Desabilitar teclas de desenvolvedor

  // Mostra tela de login se não estiver autenticado
  if (loading) {
    return (
      <main className="gartic-container">
        <div className="w-full max-w-6xl mx-auto flex justify-center items-center min-h-screen">
          <p className="text-white">Carregando...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="gartic-container">
        <div className="w-full max-w-6xl mx-auto py-8">
          <LoginScreen />
        </div>
      </main>
    );
  }

  // Se estiver em uma sala, exibir o jogo online
  if (roomId) {
    return (
      <main className="gartic-container">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Image
              src="/images/logo.png"
              alt="AnimeWord Logo"
              width={240}
              height={120}
              className="object-contain"
              priority
            />
            <div className="flex items-center gap-2">
              <div className="text-white mr-3">Olá, {user.nickname}</div>
              <LogoutButton />
            </div>
          </div>

          <OnlineGameProvider roomId={roomId}>
            <OnlineGameBoard onBackToLobby={() => setRoomId(null)} />
          </OnlineGameProvider>

          <div className="text-center text-sm text-white/70 mt-8">
            versão online - feita com preguiça pelo Cria e Ettym em um lapso de
            burnout
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="gartic-container">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Image
            src="/images/logo.png"
            alt="AnimeWord Logo"
            width={240}
            height={120}
            className="object-contain"
            priority
          />
          <div className="flex items-center gap-2">
            <div className="text-white mr-3">Olá, {user.nickname}</div>
            <LogoutButton />
          </div>
        </div>

        {!roomId ? (
          <RoomManager
            onJoinRoom={(id) => {
              setRoomId(id);
            }}
          />
        ) : gameStarted ? (
          <GameBoard
            onBackToConfig={() => {
              setRoomId(null);
              setGameStarted(false);
            }}
          />
        ) : (
          <GameConfig onStartGame={() => setGameStarted(true)} />
        )}

        <div className="text-center text-sm text-white/70 mt-8">
          versão online - feita com preguiça pelo Cria e Ettym em um lapso de
          burnout
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <GameProvider>
        <GameApp />
      </GameProvider>
    </AuthProvider>
  );
}
