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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md mobile-success-modal rounded-2xl overflow-hidden border-0 shadow-lg"
        style={{ borderRadius: "1rem" }}
      >
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-center text-2xl font-bold text-green-500">
            PARABÉNS! VOCÊ ACERTOU!
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 px-6 pb-6">
          <Image
            src="/images/forca_0.jpeg"
            alt="Personagem Feliz"
            width={150}
            height={150}
            className="mx-auto rounded-xl"
          />

          <div className="bg-green-50 p-4 rounded-xl w-full text-center">
            <p className="text-lg mb-2 text-gray-800">A palavra era:</p>
            <p className="text-3xl font-bold text-green-600">{word}</p>
            <p className="text-sm text-gray-700 mt-2">{hint}</p>
          </div>

          <Button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-lg rounded-xl"
          >
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
