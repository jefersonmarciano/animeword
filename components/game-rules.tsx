"use client";

import { HelpCircle } from "lucide-react";

export default function GameRules() {
  return (
    <div className="gartic-rules">
      <h2 className="gartic-rules-title flex items-center justify-center gap-2">
        <HelpCircle className="w-6 h-6" />
        COMO JOGAR
      </h2>

      <div className="space-y-4">
        <div className="gartic-rules-item">
          <div className="gartic-rules-number">1</div>
          <p className="gartic-rules-text">
            Cada jogador tenta adivinhar uma letra por vez ou arriscar a palavra
            completa.
          </p>
        </div>

        <div className="gartic-rules-item">
          <div className="gartic-rules-number">2</div>
          <p className="gartic-rules-text">
            Acertar uma letra = <span className="text-green-400">+1 ponto</span>{" "}
            por ocorrência da letra.
          </p>
        </div>

        <div className="gartic-rules-item">
          <div className="gartic-rules-number">3</div>
          <p className="gartic-rules-text">
            Acertar a palavra completa ={" "}
            <span className="text-green-400">+10 pontos</span>.
          </p>
        </div>

        <div className="gartic-rules-item">
          <div className="gartic-rules-number">4</div>
          <p className="gartic-rules-text">
            Errar uma letra = <span className="text-red-400">-5 pontos</span>.
          </p>
        </div>

        <div className="gartic-rules-item">
          <div className="gartic-rules-number">5</div>
          <p className="gartic-rules-text">
            Errar um palpite de palavra completa ={" "}
            <span className="text-red-400">-50 pontos</span>!
          </p>
        </div>

        <div className="gartic-rules-item">
          <div className="gartic-rules-number">6</div>
          <p className="gartic-rules-text">
            O primeiro jogador a atingir a pontuação para vitória vence o jogo.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#7b2cbf]">
          <div className="flex justify-center">
            <img
              src="/images/puppo.png"
              alt="Mascote"
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
