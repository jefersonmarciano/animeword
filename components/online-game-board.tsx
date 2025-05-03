"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import PlayerCard from "@/components/player-card";
import Keyboard from "@/components/keyboard";
import { useOnlineGame } from "@/context/online-game-context";
import { useAuth } from "@/context/auth-context";
import OnlineGameStart from "@/components/online-game-start";

// Importar os modais se existirem
import SuccessModal from "@/components/success-modal";
import GameOverModal from "@/components/game-over-modal";

export default function OnlineGameBoard({
  onBackToLobby,
}: {
  onBackToLobby: () => void;
}) {
  const {
    players,
    currentPlayerIndex,
    currentQuestion,
    guessedLetters,
    wrongLetters,
    timeLeft,
    gameOver,
    isHost,
    makeGuess,
    guessWord,
    leaveRoom,
    getCurrentPlayerErrors,
    isMyTurn,
    getLastPlayerAction,
    playerActions,
  } = useOnlineGame();

  const { user } = useAuth();
  const [wordGuess, setWordGuess] = useState("");
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastActionMessage, setLastActionMessage] = useState("");

  // Atualizar mensagem da última ação
  useEffect(() => {
    const lastAction = getLastPlayerAction();
    if (lastAction) {
      let message = "";
      if (lastAction.action === "guess_letter") {
        message = `${lastAction.playerName} tentou a letra "${
          lastAction.content
        }" e ${lastAction.isCorrect ? "acertou!" : "errou!"}`;
      } else if (lastAction.action === "guess_word") {
        message = `${lastAction.playerName} tentou adivinhar "${
          lastAction.content
        }" e ${lastAction.isCorrect ? "acertou a palavra!" : "errou!"}`;
      }
      setLastActionMessage(message);

      // Esconder a mensagem após 5 segundos
      const timer = setTimeout(() => {
        setLastActionMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [playerActions, getLastPlayerAction]);

  // Verificar se o jogo já iniciou
  if (!currentQuestion) {
    return <OnlineGameStart />;
  }

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
    const percentage = (timeLeft / 60) * 100;

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

  // Renderizar a seção de quem está jogando agora
  const renderCurrentTurn = () => {
    if (
      !players ||
      players.length === 0 ||
      currentPlayerIndex >= players.length
    ) {
      return null;
    }

    const currentPlayer = players[currentPlayerIndex];
    const isMyCurrentTurn = isMyTurn();

    return (
      <div className="text-center mb-6">
        <div
          className={`bg-opacity-20 p-4 rounded-lg ${
            isMyCurrentTurn ? "bg-green-500" : "bg-purple-500"
          }`}
        >
          <p className="text-white text-lg font-bold">
            {isMyCurrentTurn
              ? "É a sua vez de jogar!"
              : `Vez de ${currentPlayer.name} jogar`}
          </p>

          {!isMyCurrentTurn && (
            <p className="text-white/70 text-sm mt-2">
              Aguarde sua vez para escolher uma letra ou adivinhar a palavra.
            </p>
          )}
        </div>
      </div>
    );
  };

  // Renderizar ações recentes
  const renderRecentActions = () => {
    if (!lastActionMessage) return null;

    return (
      <div className="text-center my-4">
        <div className="bg-blue-500 bg-opacity-20 p-2 rounded-lg">
          <p className="text-white">{lastActionMessage}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#1e1b2e] min-h-screen p-4">
      {/* Logo e navegação superior */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center space-x-2">
          <Button
            onClick={onBackToLobby}
            variant="ghost"
            className="text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Sair
          </Button>
          <h1 className="text-xl font-bold text-white">Jogo Online</h1>
        </div>
        <Button
          onClick={() => setSoundEnabled(!soundEnabled)}
          variant="ghost"
          className="text-white"
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Corpo principal do jogo */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Card de jogadores à esquerda */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-purple-900 bg-opacity-90 rounded-lg p-4">
            <h2 className="text-white font-bold mb-4">Jogadores</h2>
            <div className="space-y-4">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className={`${
                    index === currentPlayerIndex
                      ? "border border-yellow-400"
                      : ""
                  } 
                             rounded-lg overflow-hidden`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white">{player.name}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-pink-300 font-bold">
                      {player.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conteúdo principal do jogo (centro) */}
        <div className="flex-grow flex flex-col items-center">
          {/* Dica da palavra */}
          <div className="text-center mb-8 max-w-xl">
            <p className="text-white text-lg">{currentQuestion?.hint}</p>
          </div>

          {/* Palavra para adivinhar */}
          <div className="flex justify-center flex-wrap gap-4 mb-8">
            {currentQuestion &&
              currentQuestion.word.split("").map((letter, index) => {
                if (letter === " ")
                  return <div key={index} className="w-8 h-1"></div>;
                return (
                  <div
                    key={index}
                    className="w-8 border-b-2 border-white flex items-center justify-center"
                  >
                    {guessedLetters &&
                    guessedLetters.includes(letter.toUpperCase()) ? (
                      <span className="text-white text-xl uppercase">
                        {letter}
                      </span>
                    ) : null}
                  </div>
                );
              })}
          </div>

          {/* Imagem do personagem */}
          <div className="mb-8">
            <Image
              src={`/images/forca_${getCurrentPlayerErrors()}.jpeg`}
              alt="Personagem"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>

          {/* Campo para tentar adivinhar palavra */}
          <div className="w-full max-w-xl mb-6">
            <form onSubmit={handleWordGuess} className="flex gap-2">
              <Input
                type="text"
                placeholder="Adivinhe a palavra completa"
                className="bg-purple-700 bg-opacity-50 text-white border-none flex-grow"
                value={wordGuess}
                onChange={(e) => setWordGuess(e.target.value)}
                disabled={!isMyTurn()}
              />
              <Button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white"
                disabled={!isMyTurn() || !wordGuess.trim()}
              >
                Tentar
              </Button>
            </form>
          </div>

          {/* Letras erradas */}
          <div className="w-full max-w-xl mb-8">
            <h3 className="text-white font-bold mb-2">Letras erradas:</h3>
            <div>
              {wrongLetters && wrongLetters.length > 0 ? (
                wrongLetters.map((letter) => (
                  <span key={letter} className="text-red-400 mr-2">
                    {letter}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">
                  Nenhuma letra errada ainda.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Teclado virtual (abaixo) */}
      <div className="mt-6">
        <h3 className="text-white font-bold mb-2">Escolha uma letra:</h3>
        <Keyboard
          onKeyPress={!isMyTurn() ? () => {} : makeGuess}
          guessedLetters={guessedLetters || []}
          wrongLetters={wrongLetters || []}
          correctLetters={[]}
        />
      </div>
    </div>
  );
}
