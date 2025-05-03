"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string;
  hint: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  word,
  hint,
}: SuccessModalProps) {
  // Função para lidar com o click no botão Continuar
  const handleContinue = () => {
    // Chama onClose para fechar o modal e iniciar nova rodada
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-green-500">
            PARABÉNS! VOCÊ ACERTOU!
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/images/forca_0.jpeg"
            alt="Personagem Feliz"
            width={150}
            height={150}
            className="mx-auto rounded-lg"
          />

          <div className="bg-green-50 p-4 rounded-lg w-full text-center">
            <p className="text-lg mb-2">A palavra era:</p>
            <p className="text-3xl font-bold text-green-600">{word}</p>
            <p className="text-sm text-muted-foreground mt-2">{hint}</p>
          </div>

          <Button
            onClick={handleContinue}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-lg"
          >
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
