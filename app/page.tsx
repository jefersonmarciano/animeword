"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import GameConfig from "@/components/game-config";
import GameBoard from "@/components/game-board";
import { GameProvider } from "@/context/game-context";

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Desabilitar F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          (e.key === "I" ||
            e.key === "i" ||
            e.key === "J" ||
            e.key === "j" ||
            e.key === "C" ||
            e.key === "c"))
      ) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <GameProvider>
      <main className="gartic-container">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo.png"
              alt="DevWord Logo"
              width={240}
              height={120}
              className="object-contain"
            />
          </div>

          {!gameStarted ? (
            <GameConfig onStartGame={() => setGameStarted(true)} />
          ) : (
            <GameBoard onBackToConfig={() => setGameStarted(false)} />
          )}

          <div className="text-center text-sm text-white/70 mt-8">
            versão betinha - feita com preguiça pelo Cria e Ettym em um lapso de
            burnout
          </div>
        </div>
      </main>
    </GameProvider>
  );
}
