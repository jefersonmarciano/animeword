"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useGame } from "@/context/game-context"
import confetti from "canvas-confetti"
import { useEffect } from "react"

interface VictoryModalProps {
  isOpen: boolean
  onClose: () => void
  onRestart: () => void
  onBackToConfig: () => void
  winner: {
    name: string
    avatar: string
    score: number
  } | null
}

export default function VictoryModal({ isOpen, onClose, onRestart, onBackToConfig, winner }: VictoryModalProps) {
  const { pointsToWin } = useGame()

  // Efeito para lançar confetes quando o modal abrir
  useEffect(() => {
    if (isOpen && winner) {
      // Lançar confetes
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Lançar confetes de ambos os lados
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)
    }
  }, [isOpen, winner])

  if (!winner) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center gap-4 py-2">
          <h2 className="text-center text-2xl font-bold text-yellow-500">PARABÉNS! TEMOS UM VENCEDOR!</h2>

          <div className="relative w-32 h-32 mx-auto">
            <Image
              src={winner.avatar || "/placeholder.svg"}
              alt="Vencedor"
              fill
              className="object-contain rounded-full border-4 border-yellow-500"
            />
            <div className="absolute -top-4 -right-4 text-4xl">👑</div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg w-full text-center">
            <p className="text-lg mb-2 text-gray-800">O grande vencedor é:</p>
            <p className="text-3xl font-bold text-yellow-600">{winner.name}</p>
            <p className="text-xl font-semibold mt-2 text-gray-800">
              Pontuação: <span className="text-green-600">{winner.score}</span> / {pointsToWin}
            </p>
          </div>

          <p className="text-center text-lg">Parabéns por dominar o conhecimento em programação e vencer o desafio!</p>

          <div className="flex gap-3 w-full mt-2">
            <Button onClick={onRestart} className="bg-green-500 hover:bg-green-600 text-white flex-1">
              Jogar Novamente
            </Button>

            <Button onClick={onBackToConfig} variant="outline" className="flex-1">
              Voltar para Configurações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
