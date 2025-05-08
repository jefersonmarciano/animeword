"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGame } from "@/context/game-context";
import { useState, useEffect } from "react";

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  onBackToConfig: () => void;
}

export default function GameOverModal({
  isOpen,
  onClose,
  onRestart,
  onBackToConfig,
}: GameOverModalProps) {
  const { currentQuestion } = useGame();
  const [displayQuestion, setDisplayQuestion] = useState(currentQuestion);

  useEffect(() => {
    if (isOpen && currentQuestion) {
      setDisplayQuestion(currentQuestion);
    }
  }, [isOpen, currentQuestion]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md max-h-[90vh] overflow-y-auto mobile-gameover-modal rounded-2xl shadow-lg border-0 w-full max-w-xs p-2 sm:p-0"
        style={{ borderRadius: "1rem" }}
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4 px-2 sm:px-6 py-4 sm:py-6 w-full">
          <h2 className="text-center text-lg sm:text-2xl font-bold text-red-500 w-full">
            KKKKKKKKKKKKKK QUE IMBÉCIL!
          </h2>

          <p className="text-base sm:text-xl text-center w-full">
            NAO CONSEGUE NE KKKKKKKKKKKKKKKKKK!
          </p>

          <div className="bg-blue-50 p-2 sm:p-4 rounded-xl w-full text-center">
            <p className="text-xs sm:text-sm text-gray-700 mb-1">
              A palavra era:
            </p>
            <p className="text-xl sm:text-3xl font-bold text-blue-600 break-words">
              {displayQuestion?.word || "???"}
            </p>
            <p className="text-xs sm:text-sm text-gray-700 mt-1 break-words">
              {displayQuestion?.hint}
            </p>
          </div>

          <div className="w-24 h-24 sm:w-32 sm:h-32 relative my-2 rounded-xl overflow-hidden">
            <Image
              src="/images/forca_5.jpeg"
              alt="Game Over"
              fill
              className="object-contain"
            />
          </div>

          <div className="flex flex-row gap-2 sm:gap-3 w-full mt-2 justify-center items-center">
            <Button
              onClick={onRestart}
              className="bg-pink-500 hover:bg-pink-600 text-white w-1/2 sm:flex-1 rounded-xl"
            >
              Tentar
            </Button>

            <Button
              onClick={onBackToConfig}
              variant="outline"
              className="w-1/2 sm:flex-1 rounded-xl"
            >
              Voltar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
