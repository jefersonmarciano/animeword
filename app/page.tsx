"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { AuthProvider, useAuth } from "@/context/auth-context"
import { RoomProvider, useRoom } from "@/context/room-context"
import { GameProvider } from "@/context/game-context"
import LoginScreen from "@/components/login-screen"
import RoomSelection from "@/components/room-selection"
import GameSetup from "@/components/game-setup"
import GameBoard from "@/components/game-board"

function GameApp() {
  const { isAuthenticated } = useAuth()
  const { currentRoom, leaveRoom } = useRoom()
  const [gameStarted, setGameStarted] = useState(false)
  const [showLogo, setShowLogo] = useState(true)

  // Update logo visibility based on game state
  useEffect(() => {
    // Only show logo on login and room selection screens
    setShowLogo(!currentRoom || (!gameStarted && !currentRoom))
  }, [currentRoom, gameStarted])

  // Renderizar a tela apropriada com base no estado de autenticação e sala
  const renderContent = () => {
    if (!isAuthenticated) {
      return <LoginScreen />
    }

    if (!currentRoom) {
      return <RoomSelection />
    }

    if (!gameStarted) {
      return <GameSetup onStartGame={() => setGameStarted(true)} onBack={() => leaveRoom()} />
    }

    return <GameBoard onBackToConfig={() => setGameStarted(false)} />
  }

  return (
    <main className="gartic-container full-height-container">
      <div className="w-full max-w-7xl mx-auto content-container">
        {/* Logo - only visible on certain screens */}
        {showLogo && (
          <div className="flex justify-center mb-6 logo-container">
            <Image
              src="/images/logo.png"
              alt="DevWord Logo"
              width={240}
              height={120}
              className="object-contain max-w-full sm:max-w-[240px] h-auto"
            />
          </div>
        )}

        {renderContent()}

        <div className="text-center text-sm text-foreground/70 mt-8 md:block hidden">
          versão betinha - feita com preguiça pelo Cria e Ettym em um lapso de burnout
        </div>
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <RoomProvider>
        <GameProvider>
          <GameApp />
        </GameProvider>
      </RoomProvider>
    </AuthProvider>
  )
}
