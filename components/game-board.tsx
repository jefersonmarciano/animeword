"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGame } from "@/context/game-context"
import { ArrowLeft } from "lucide-react"
import PlayerCard from "@/components/player-card"
import Keyboard from "@/components/keyboard"

// Importar os modais
import SuccessModal from "@/components/success-modal"
import GameOverModal from "@/components/game-over-modal"

export default function GameBoard({ onBackToConfig }: { onBackToConfig: () => void }) {
  const {
    players,
    currentPlayerIndex,
    currentQuestion,
    guessedLetters,
    wrongLetters,
    timeLeft,
    gameOver,
    setGameOver,
    difficulty,
    setDifficulty,
    makeGuess,
    guessWord,
    resetGame,
    showSuccessModal,
    setShowSuccessModal,
    startNewRound,
    getCurrentPlayerErrors,
  } = useGame()

  const [wordGuess, setWordGuess] = useState("")
  const [showGameOverModal, setShowGameOverModal] = useState(false)

  // Remover a palavra atual do console para evitar trapaças
  useEffect(() => {
    const originalConsoleLog = console.log
    console.log = (...args) => {
      if (args.some((arg) => typeof arg === "string" && currentQuestion && arg.includes(currentQuestion.word))) {
        return
      }
      originalConsoleLog(...args)
    }

    return () => {
      console.log = originalConsoleLog
    }
  }, [currentQuestion])

  // Renderizar os espaços para as letras da palavra
  const renderWordSpaces = () => {
    if (!currentQuestion) return null

    return (
      <div className="flex justify-center my-6">
        {currentQuestion.word.split("").map((letter, index) => (
          <div key={index} className="letter-box">
            {guessedLetters.includes(letter) ? letter : ""}
          </div>
        ))}
      </div>
    )
  }

  // Lidar com o envio do palpite da palavra completa
  const handleWordGuess = (e: React.FormEvent) => {
    e.preventDefault()
    if (wordGuess.trim()) {
      guessWord(wordGuess.toUpperCase())
      setWordGuess("")
    }
  }

  // Renderizar a dica da palavra
  const renderHint = () => {
    if (!currentQuestion) return null

    return (
      <div className="text-center my-4">
        <p className="text-lg">{currentQuestion.hint}</p>
      </div>
    )
  }

  // Renderizar o timer
  const renderTimer = () => {
    const percentage = (timeLeft / 60) * 100

    return (
      <div className="w-full bg-muted rounded-full h-2 mb-4">
        <div className="timer-bar" style={{ width: `${percentage}%` }}></div>
      </div>
    )
  }

  // Renderizar a imagem do personagem com base no número de erros
  const renderCharacterImage = () => {
    const errors = getCurrentPlayerErrors()
    const imagePath = `/images/forca_${errors}.jpeg`

    return (
      <div className="w-48 h-48 mb-4 mx-auto">
        <Image
          src={imagePath || "/placeholder.svg"}
          alt={`Personagem - ${errors} erros`}
          width={192}
          height={192}
          className="object-contain rounded-lg"
        />
      </div>
    )
  }

  // Atualizar para mostrar o modal de game over em vez de renderizar uma página diferente
  if (gameOver && !showGameOverModal) {
    setShowGameOverModal(true)
  }

  // Função para reiniciar o jogo após game over
  const handleRestart = () => {
    setShowGameOverModal(false)
    setGameOver(false)
    resetGame()
  }

  // Função para voltar às configurações após game over
  const handleBackToConfig = () => {
    setShowGameOverModal(false)
    setGameOver(false)
    onBackToConfig()
  }

  return (
    <div className="bg-card rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto">
      {/* Modal de Sucesso */}
      {currentQuestion && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={startNewRound}
          word={currentQuestion.word}
          hint={currentQuestion.hint}
        />
      )}

      {/* Modal de Game Over */}
      <GameOverModal
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        onRestart={handleRestart}
        onBackToConfig={handleBackToConfig}
      />

      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={onBackToConfig} className="flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar para Configurações
        </Button>

        <div className="flex items-center gap-2">
          <span className="font-medium">Dificuldade:</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="bg-muted rounded px-2 py-1"
          >
            <option value="Fácil">Fácil</option>
            <option value="Médio">Médio</option>
            <option value="Difícil">Difícil</option>
          </select>

          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md ml-2">52</div>
        </div>
      </div>

      {/* Timer */}
      {renderTimer()}

      {/* Área dos jogadores */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {players.map((player, index) => (
          <PlayerCard key={player.id} player={player} isCurrentPlayer={index === currentPlayerIndex} />
        ))}
      </div>

      {/* Palavra a ser adivinhada - Agora mostra apenas a dica */}
      <div className="bg-muted/30 p-4 rounded-lg mb-6">{renderHint()}</div>

      {/* Área do jogo - Mostrar a imagem do personagem baseada nos erros */}
      <div className="flex flex-col items-center mb-6">
        {currentQuestion && renderCharacterImage()}

        {/* Renderizar os espaços para as letras da palavra atual */}
        {renderWordSpaces()}
      </div>

      {/* Teclado */}
      <Keyboard onKeyPress={makeGuess} guessedLetters={guessedLetters} wrongLetters={wrongLetters} />

      {/* Letras erradas */}
      <div className="bg-red-50 p-4 rounded-lg mt-6">
        <p className="text-center text-red-500 font-medium">Caracteres errados:</p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {wrongLetters.map((letter, index) => (
            <span key={index} className="text-red-500 font-bold">
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Formulário para adivinhar a palavra completa */}
      <form onSubmit={handleWordGuess} className="mt-6 flex gap-2">
        <Input
          value={wordGuess}
          onChange={(e) => setWordGuess(e.target.value)}
          placeholder="Digite seu palpite completo aqui"
          className="flex-1"
        />
        <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
          Chutar!
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground mt-8">
        versão betinha - feita com preguiça pelo chascipto em um lapso de burnout
      </div>
    </div>
  )
}
