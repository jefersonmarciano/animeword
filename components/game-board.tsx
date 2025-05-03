"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGame } from "@/context/game-context";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import PlayerCard from "@/components/player-card";
import Keyboard from "@/components/keyboard";
import GameRules from "./game-rules";

// Importar os modais
import SuccessModal from "@/components/success-modal";
import GameOverModal from "@/components/game-over-modal";
import VictoryModal from "@/components/victory-modal";

export default function GameBoard({
  onBackToConfig,
}: {
  onBackToConfig: () => void;
}) {
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
    pointsToWin,
  } = useGame();

  const [wordGuess, setWordGuess] = useState("");
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [remainingTime, setRemainingTime] = useState(timeLeft);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentCorrectWord, setCurrentCorrectWord] = useState<{
    word: string;
    hint: string;
  } | null>(null);

  // Atualizar o tempo restante quando timeLeft mudar
  useEffect(() => {
    setRemainingTime(timeLeft);
  }, [timeLeft]);

  // Atualizar as letras corretas quando a palavra ou letras adivinhadas mudarem
  useEffect(() => {
    if (currentQuestion) {
      const correct = guessedLetters.filter((letter) =>
        currentQuestion.word.includes(letter)
      );
      setCorrectLetters(correct);
    }
  }, [currentQuestion, guessedLetters]);

  // Remover a palavra atual do console para evitar trapaças
  useEffect(() => {
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      if (
        args.some(
          (arg) =>
            typeof arg === "string" &&
            currentQuestion &&
            arg.includes(currentQuestion.word)
        )
      ) {
        return;
      }
      originalConsoleLog(...args);
    };

    return () => {
      console.log = originalConsoleLog;
    };
  }, [currentQuestion]);

  // Atualizar para mostrar o modal de game over ou vitória quando o jogo acabar
  useEffect(() => {
    if (gameOver) {
      // Verificar se algum jogador atingiu a pontuação para vitória
      const winner = players.find((player) => player.score >= pointsToWin);
      if (winner) {
        setShowVictoryModal(true);
      } else {
        setShowGameOverModal(true);
      }
    }
  }, [gameOver, players, pointsToWin]);

  // Quando o modal de sucesso é aberto, vamos armazenar a palavra atual
  useEffect(() => {
    if (showSuccessModal && currentQuestion) {
      setCurrentCorrectWord({
        word: currentQuestion.word,
        hint: currentQuestion.hint,
      });
    }
  }, [showSuccessModal, currentQuestion]);

  // Renderizar os espaços para as letras da palavra
  const renderWordSpaces = () => {
    if (!currentQuestion) return null;

    return (
      <div className="flex flex-wrap justify-center my-6 gap-1">
        {currentQuestion.word.split("").map((letter, index) => {
          // If it's a space, render a space instead of a letter box
          if (letter === " ") {
            return <div key={index} className="w-8 h-8" />;
          }

          // Otherwise render the letter box
          return (
            <div key={index} className="letter-box">
              {guessedLetters.includes(letter) ? (
                <span className="letter-reveal">{letter}</span>
              ) : (
                ""
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Lidar com o envio do palpite da palavra completa
  const handleWordGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (wordGuess.trim()) {
      guessWord(wordGuess.toUpperCase());
      setWordGuess("");
    }
  };

  // Renderizar a dica da palavra
  const renderHint = () => {
    if (!currentQuestion) return null;

    return (
      <div className="text-center my-4">
        <p className="text-lg text-white">{currentQuestion.hint}</p>
      </div>
    );
  };

  // Renderizar o timer
  const renderTimer = () => {
    const percentage = (remainingTime / 60) * 100;

    return (
      <div className="w-full bg-[#7b2cbf] rounded-full h-2 mb-4">
        <div className="timer-bar" style={{ width: `${percentage}%` }}></div>
      </div>
    );
  };

  // Renderizar a imagem do personagem com base no número de erros
  const renderCharacterImage = () => {
    const errors = getCurrentPlayerErrors();
    const imagePath = `/images/forca_${errors}.jpeg`;

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
    );
  };

  // Função para reiniciar o jogo após game over
  const handleRestart = () => {
    setShowGameOverModal(false);
    setGameOver(false);
    resetGame();
  };

  // Função para voltar às configurações após game over
  const handleBackToConfig = () => {
    setShowGameOverModal(false);
    setGameOver(false);
    onBackToConfig();
  };

  // Função para reiniciar o jogo após vitória
  const handleVictoryRestart = () => {
    setShowVictoryModal(false);
    setGameOver(false);
    resetGame();
  };

  // Função para voltar às configurações após vitória
  const handleVictoryBackToConfig = () => {
    setShowVictoryModal(false);
    setGameOver(false);
    onBackToConfig();
  };

  // Função para trocar o avatar de um jogador
  const handleChangeAvatar = (playerId: number, avatar: string) => {
    // Esta função seria implementada no contexto do jogo
    // Por enquanto, apenas um placeholder
    console.log(`Trocar avatar do jogador ${playerId} para ${avatar}`);
  };

  return (
    <>
      <div className="game-layout">
        {/* Modal de Sucesso - Agora usando currentCorrectWord que não muda */}
        {currentCorrectWord && (
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={startNewRound}
            word={currentCorrectWord.word}
            hint={currentCorrectWord.hint}
          />
        )}

        {/* Modal de Game Over */}
        <GameOverModal
          isOpen={showGameOverModal}
          onClose={() => setShowGameOverModal(false)}
          onRestart={handleRestart}
          onBackToConfig={handleBackToConfig}
        />

        {/* Modal de Vitória */}
        <VictoryModal
          isOpen={showVictoryModal}
          onClose={() => setShowVictoryModal(false)}
          onRestart={handleVictoryRestart}
          onBackToConfig={handleVictoryBackToConfig}
          winner={players.find((player) => player.score >= pointsToWin)}
        />

        {/* Coluna da esquerda - Jogadores */}
        <div className="game-column gartic-card p-5">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onBackToConfig}
              className="gartic-button flex items-center gap-1 text-sm py-2"
            >
              <ArrowLeft className="w-4 h-4" /> VOLTAR
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full bg-[#7b2cbf] hover:bg-[#9d4edd]"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Timer */}
          {renderTimer()}

          {/* Dificuldade - Movida para cima dos jogadores */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-white">Dificuldade:</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="gartic-select"
            >
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>

          {/* Área dos jogadores */}
          <div className="mobile-players">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`player-card p-3 ${
                  index === currentPlayerIndex
                    ? "gartic-card-highlight border-[#4cc9f0]"
                    : "gartic-card-highlight"
                } rounded-lg`}
              >
                <PlayerCard
                  player={player}
                  isCurrentPlayer={index === currentPlayerIndex}
                  onChangeAvatar={handleChangeAvatar}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Coluna do meio - Jogo (mais larga) */}
        <div className="game-column gartic-card p-5">
          {/* Palavra a ser adivinhada - Agora mostra apenas a dica */}
          <div className="bg-[#7b2cbf] p-4 rounded-lg mb-6">{renderHint()}</div>

          {/* Área do jogo - Mostrar a imagem do personagem baseada nos erros */}
          <div className="flex flex-col items-center mb-6">
            {currentQuestion && renderCharacterImage()}

            {/* Renderizar os espaços para as letras da palavra atual */}
            {renderWordSpaces()}
          </div>

          {/* Teclado */}
          <Keyboard
            onKeyPress={makeGuess}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            correctLetters={correctLetters}
          />

          {/* Letras erradas */}
          <div className="bg-[#7b2cbf]/50 p-4 rounded-lg mt-6">
            <p className="text-center text-red-400 font-medium">
              Caracteres errados:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {wrongLetters.map((letter, index) => (
                <span key={index} className="text-red-400 font-bold">
                  {letter}
                </span>
              ))}
            </div>
          </div>

          {/* Formulário para adivinhar a palavra completa */}
          <div className="mt-6 flex flex-col gap-2">
            <Input
              value={wordGuess}
              onChange={(e) => setWordGuess(e.target.value)}
              placeholder="Digite seu palpite completo aqui"
              className="gartic-input w-full"
            />
            <Button
              type="submit"
              onClick={handleWordGuess}
              className="gartic-button w-full"
            >
              Chutar!
            </Button>
          </div>
        </div>

        {/* Coluna da direita - Regras */}
        <div className="game-column">
          <GameRules />
        </div>
      </div>
    </>
  );
}
