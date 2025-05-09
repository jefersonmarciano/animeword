"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

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
  const [displayWord, setDisplayWord] = useState(word);
  const [displayHint, setDisplayHint] = useState(hint);

  useEffect(() => {
    if (isOpen) {
      setDisplayWord(word);
      setDisplayHint(hint);
    }
  }, [isOpen, word, hint]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md mobile-success-modal rounded-2xl overflow-hidden border-0 shadow-lg transition-all duration-300"
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
            <p className="text-3xl font-bold text-green-600">{displayWord}</p>
            <p className="text-sm text-gray-700 mt-2">{displayHint}</p>
          </div>

          <Button
            onClick={handleClose}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-lg rounded-xl transition-colors duration-200"
          >
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
