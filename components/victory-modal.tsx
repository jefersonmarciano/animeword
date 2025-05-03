"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGame, type Player } from "@/context/game-context";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  onBackToConfig: () => void;
  winner: Player | undefined;
}

export default function VictoryModal({
  isOpen,
  onClose,
  onRestart,
  onBackToConfig,
  winner,
}: VictoryModalProps) {
  const { pointsToWin } = useGame();

  // Efeito para lançar confetti quando o modal abrir
  useEffect(() => {
    if (isOpen && winner) {
      // Lançar confetti em cores festivas
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Lançar mais confetti após um pequeno atraso
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 750);
    }
  }, [isOpen, winner]);

  if (!winner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="gartic-modal">
        <div className="p-6 text-center">
          <div className="text-4xl font-bold text-yellow-400 mb-6 victory-title">
            VITÓRIA!
          </div>

          <div className="mb-6">
            <div className="text-center mb-4">
              <div className="inline-block relative">
                <Image
                  src={winner.avatar || "/placeholder.svg"}
                  alt={`Avatar de ${winner.name}`}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-yellow-400"
                />
                <div className="absolute -top-4 -right-4 text-4xl">👑</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">{winner.name}</h2>
            <p className="text-green-400 font-bold text-xl">
              Pontuação: {winner.score} / {pointsToWin}
            </p>
          </div>

          <p className="mb-6 text-lg">
            Parabéns! Você venceu o desafio de palavras.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onRestart} className="gartic-button">
              Jogar Novamente
            </Button>
            <Button onClick={onBackToConfig} className="gartic-button-outline">
              Voltar às Configurações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
