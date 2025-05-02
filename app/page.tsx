"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import GameConfig from "@/components/game-config"
import GameBoard from "@/components/game-board"
import { GameProvider } from "@/context/game-context"

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)

  // Desabilitar o menu de contexto para evitar inspeção
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener("contextmenu", handleContextMenu)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [])

  // Desabilitar teclas de desenvolvedor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Desabilitar F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c"))
      ) {
        e.preventDefault()
        return false
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <GameProvider>
      <main className="min-h-screen flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex justify-center mb-4">
            <Image src="/images/logo.png" alt="DevWord Logo" width={200} height={100} className="object-contain" />
          </div>

          <div className="twisted-container bg-blue-500 text-white py-2 px-4 rounded-full text-center mb-6 max-w-md mx-auto">
            <p>eae vai encarar!!! kkkkkkkkkkkkkkkkkkkkk</p>
          </div>

          {!gameStarted ? (
            <GameConfig onStartGame={() => setGameStarted(true)} />
          ) : (
            <GameBoard onBackToConfig={() => setGameStarted(false)} />
          )}

          <div className="text-center text-sm text-muted-foreground mt-8">
            versão betinha - feita com preguiça pelo chascipto em um lapso de burnout
          </div>
        </div>
      </main>
    </GameProvider>
  )
}
