"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGame } from "@/context/game-context";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import PlayerCard from "@/components/player-card";
import Keyboard from "@/components/keyboard";
import GameRules from "./game-rules";
import CountdownTimer from "./countdown-timer";
import { useSound } from "@/hooks/use-sound";

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

  const { isMuted, toggleMute, playSound } = useSound();
  const [wordGuess, setWordGuess] = useState("");
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [winner, setWinner] = useState<{
    name: string;
    avatar: string;
    score: number;
  } | null>(null);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [remainingTime, setRemainingTime] = useState(timeLeft);
  const [showCountdown, setShowCountdown] = useState(false);
  const [feedbackLetter, setFeedbackLetter] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

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

  // Verificar se algum jogador atingiu a pontuação para vitória
  useEffect(() => {
    if (gameOver) {
      // Verificar se algum jogador atingiu a pontuação para vitória
      const victoriousPlayer = players.find(
        (player) => player.score >= pointsToWin
      );
      if (victoriousPlayer) {
        setWinner({
          name: victoriousPlayer.name,
          avatar: victoriousPlayer.avatar,
          score: victoriousPlayer.score,
        });
        setShowVictoryModal(true);
        setShowGameOverModal(false); // Garantir que o modal de game over não apareça
      } else {
        setShowGameOverModal(true);
        setShowVictoryModal(false); // Garantir que o modal de vitória não apareça
        playSound("defeat");
      }
    }
  }, [gameOver, players, pointsToWin, playSound]);

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

  // Mostrar o contador regressivo ao iniciar o jogo
  useEffect(() => {
    setShowCountdown(true);
    const timer = setTimeout(() => {
      setShowCountdown(false);
    }, 5000); // 5 segundos para o contador

    return () => clearTimeout(timer);
  }, []);

  // Renderizar os espaços para as letras da palavra
  const renderWordSpaces = () => {
    if (!currentQuestion) return null;

    // Contar o número de palavras
    const wordCount = currentQuestion.word.split(" ").length;
    const wordCountText =
      wordCount > 1 ? `${wordCount} palavras` : "uma palavra";

    return (
      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center md:my-6 gap-1">
          {currentQuestion.word.split("").map((letter, index) => {
            // If it's a space, render a space instead of a letter box
            if (letter === " ") {
              return (
                <div key={index} className="w-6 h-6 md:w-8 md:h-8 rounded-md" />
              );
            }

            // Otherwise render the letter box
            return (
              <div
                key={index}
                className={`letter-box rounded-md ${
                  letter === feedbackLetter ? "correct-feedback" : ""
                }`}
              >
                {guessedLetters.includes(letter) ? (
                  <span className="letter-reveal">{letter}</span>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-400 mt-2">{wordCountText}</p>
      </div>
    );
  };

  // Lidar com o envio do palpite da palavra completa
  const handleWordGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (wordGuess.trim()) {
      const isCorrect =
        currentQuestion && wordGuess.toUpperCase() === currentQuestion.word;

      if (isCorrect) {
        playSound("success");
      } else {
        playSound("error");
        setErrorFeedback(true);
        setTimeout(() => setErrorFeedback(false), 500);
      }

      guessWord(wordGuess.toUpperCase());
      setWordGuess("");
    }
  };

  // Função para lidar com o clique no teclado
  const handleKeyPress = (key: string) => {
    const isCorrect = currentQuestion && currentQuestion.word.includes(key);

    if (isCorrect) {
      playSound("success");
      setFeedbackLetter(key);
      setTimeout(() => setFeedbackLetter(null), 500);
    } else {
      playSound("error");
    }

    makeGuess(key);
  };

  // Renderizar a dica da palavra
  const renderHint = () => {
    if (!currentQuestion) return null;

    return (
      <div className="text-center my-2 md:my-4">
        <p className="text-base md:text-lg text-white">
          {currentQuestion.hint}
        </p>
      </div>
    );
  };

  // Renderizar o timer
  const renderTimer = () => {
    const percentage = (remainingTime / 60) * 100;

    return (
      <div className="w-full bg-card-highlight rounded-full h-2 mb-2 md:mb-4">
        <div className="timer-bar" style={{ width: `${percentage}%` }}></div>
      </div>
    );
  };

  // Renderizar a imagem do personagem com base no número de erros
  const renderCharacterImage = () => {
    // Obter o número de erros com segurança
    const errors = getCurrentPlayerErrors();
    // Obter o número máximo de erros baseado na dificuldade
    const maxErrors =
      difficulty === "Fácil" ? 8 : difficulty === "Médio" ? 6 : 4;
    // Calcular o índice da imagem (0 a 5) baseado na proporção de erros
    const imageIndex = Math.min(5, Math.floor((errors / maxErrors) * 5));
    const imagePath = `/images/forca_${imageIndex}.jpeg`;

    return (
      <div className="w-24 h-24 md:w-48 md:h-48 mb-2 md:mb-4 mx-auto">
        <Image
          src={imagePath || "/placeholder.svg"}
          alt={`Personagem - ${errors} erros`}
          width={0}
          height={0}
          sizes="100vw"
          style={{
            borderRadius: "10px",
          }}
          className="w-full h-full object-contain rounded-lg"
        />
      </div>
    );
  };

  // Função para reiniciar o jogo após game over ou vitória
  const handleRestart = () => {
    setShowGameOverModal(false);
    setShowVictoryModal(false);
    setWinner(null);
    setGameOver(false);
    startNewRound(); // Iniciar uma nova rodada ao invés de resetar o jogo
    setShowCountdown(true);
    setTimeout(() => setShowCountdown(false), 5000);
  };

  // Função para voltar às configurações após game over ou vitória
  const handleBackToConfig = () => {
    setShowGameOverModal(false);
    setShowVictoryModal(false);
    setWinner(null);
    setGameOver(false);
    onBackToConfig();
  };

  // Renderizar os jogadores em uma linha no topo
  const renderPlayersRow = () => {
    return (
      <div className="players-row">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`player-card-small bg-card shadow-md ${
              index === currentPlayerIndex &&
              currentPlayerIndex < players.length
                ? "border-2 border-yellow-500 rounded-lg"
                : "border border-border"
            }`}
            style={{ borderRadius: "10px" }}
          >
            <div className="relative w-12 h-12 mx-auto mb-1">
              <Image
                src={player.avatar || "/placeholder.svg"}
                alt={player.name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              {index === currentPlayerIndex &&
                currentPlayerIndex < players.length && (
                  <div className="crown-small">👑</div>
                )}
            </div>
            <div className="text-xs font-medium truncate">{player.name}</div>
            <div className="text-xs bg-primary/20 rounded-full px-2 py-0.5 mt-1 mx-auto w-fit">
              {player.score}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mobile-game-layout">
      {/* Contador regressivo */}
      {showCountdown && <CountdownTimer />}

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

      {/* Modal de Vitória */}
      <VictoryModal
        isOpen={showVictoryModal}
        onClose={() => setShowVictoryModal(false)}
        onRestart={handleRestart}
        onBackToConfig={handleBackToConfig}
        winner={winner}
      />

      {/* Layout para desktop */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna da esquerda - Jogadores */}
        <div className="gartic-card p-5">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onBackToConfig}
              className="gartic-button flex items-center gap-1 text-sm py-2"
            >
              <ArrowLeft className="w-4 h-4" /> VOLTAR
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-card-highlight hover:bg-muted"
              aria-label={isMuted ? "Ativar som" : "Desativar som"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Timer */}
          {renderTimer()}

          {/* Dificuldade */}
          <div className="mb-4 flex items-center justify-between">
            <span>Dificuldade:</span>
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
          <div className="space-y-3">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`p-3 ${
                  index === currentPlayerIndex
                    ? "gartic-card-highlight border-yellow-500"
                    : "gartic-card-highlight"
                } rounded-lg`}
              >
                <PlayerCard
                  player={player}
                  isCurrentPlayer={index === currentPlayerIndex}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Coluna do meio - Jogo */}
        <div className="gartic-card p-5 lg:col-span-2">
          {/* Palavra a ser adivinhada - Agora mostra apenas a dica */}
          <div className="bg-card-highlight p-4 rounded-lg mb-6">
            {renderHint()}
          </div>

          {/* Área do jogo - Mostrar a imagem do personagem baseada nos erros */}
          <div className="flex flex-col items-center mb-6">
            {currentQuestion && renderCharacterImage()}

            {/* Renderizar os espaços para as letras da palavra atual */}
            {renderWordSpaces()}
          </div>

          {/* Teclado */}
          <Keyboard
            onKeyPress={handleKeyPress}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            correctLetters={correctLetters}
          />

          {/* Formulário para adivinhar a palavra completa */}
          <div
            className={`mt-6 flex flex-col gap-2 ${
              errorFeedback ? "error-feedback" : ""
            }`}
          >
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
        <div className="hidden lg:block">
          <GameRules />
        </div>
      </div>

      {/* Layout otimizado para mobile */}
      <div className="md:hidden flex flex-col h-[90vh]">
        {/* Header fixo com jogadores e timer */}
        <div className="mobile-header">
          {/* Botão voltar e som */}
          <div className="flex justify-between items-center px-2 py-1">
            <button
              onClick={onBackToConfig}
              className="text-sm py-1 px-2 rounded-full bg-card-highlight"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMute}
              className="p-1 rounded-full bg-card-highlight"
              aria-label={isMuted ? "Ativar som" : "Desativar som"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Timer */}
          {renderTimer()}

          {/* Jogadores em linha */}
          {renderPlayersRow()}
        </div>

        {/* Conteúdo principal com scroll */}
        <div
          className="mobile-content rounded-xl"
          style={{
            overflowY: "auto",
            height: "calc(100vh - 180px)",
            paddingBottom: "110px",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255, 255, 255, 0.3) transparent",
          }}
        >
          {/* Dica da palavra */}
          <div className="bg-card-highlight p-2 rounded-xl md:mb-3">
            {renderHint()}
          </div>

          {/* Imagem do personagem */}
          <div className="flex flex-col items-center md:mb-3">
            {currentQuestion && renderCharacterImage()}

            {/* Espaços para as letras */}
            {renderWordSpaces()}
          </div>

          {/* Formulário para adivinhar a palavra completa */}
          <div
            className={`flex gap-2 mt-6 md:mt-0 md:mb-4 ${
              errorFeedback ? "error-feedback" : ""
            }`}
          >
            <Input
              value={wordGuess}
              onChange={(e) => setWordGuess(e.target.value)}
              placeholder="Digite seu palpite"
              className="gartic-input flex-1 rounded-xl"
            />
            <Button
              type="submit"
              onClick={handleWordGuess}
              className="gartic-button whitespace-nowrap rounded-xl"
            >
              Chutar!
            </Button>
          </div>
        </div>

        {/* Footer fixo com teclado */}
        <div
          className="mobile-footer rounded-t-xl"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            backgroundColor: "hsl(var(--card))",
            borderTop: "1px solid hsl(var(--border))",
            padding: "0.5rem",
          }}
        >
          <Keyboard
            onKeyPress={handleKeyPress}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            correctLetters={correctLetters}
          />
        </div>
      </div>
    </div>
  );
}
