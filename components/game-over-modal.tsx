"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useGame } from "@/context/game-context"

interface GameOverModalProps {
  isOpen: boolean
  onClose: () => void
  onRestart: () => void
  onBackToConfig: () => void
}

export default function GameOverModal({ isOpen, onClose, onRestart, onBackToConfig }: GameOverModalProps) {
  const { currentQuestion } = useGame()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center gap-4 py-2">
          <h2 className="text-center text-2xl font-bold text-red-500">KKKKKKKKKKKKKK QUE IMBÉCIL!</h2>

          <p className="text-xl text-center">NAO CONSEGUE NE KKKKKKKKKKKKKKKKKK!</p>

          <div className="bg-blue-50 p-4 rounded-lg w-full text-center">
            <p className="text-sm text-muted-foreground mb-1">A palavra era:</p>
            <p className="text-3xl font-bold text-blue-600">{currentQuestion?.word || "???"}</p>
            <p className="text-sm text-muted-foreground mt-1">{currentQuestion?.hint}</p>
          </div>

          <div className="w-32 h-32 relative my-2">
            <Image src="/images/forca_5.jpeg" alt="Game Over" fill className="object-contain rounded-lg" />
          </div>

          <div className="flex gap-3 w-full mt-2">
            <Button onClick={onRestart} className="bg-pink-500 hover:bg-pink-600 text-white flex-1">
              Tentar Novamente
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
