"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useOnlineGame } from "@/context/online-game-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Crown } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function OnlineGameStart() {
  const { players, isHost, startGame, leaveRoom } = useOnlineGame();
  const { user } = useAuth();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forceInitOption, setForceInitOption] = useState(false);

  // Debug para verificar status de anfitrião
  useEffect(() => {
    console.log("OnlineGameStart - Debug:", {
      isHost,
      playersCount: players.length,
      players: players.map((p) => ({
        id: p.id,
        name: p.name,
        userId: p.userId,
      })),
      currentUser: user?.id,
    });
  }, [isHost, players, user?.id]);

  // Após 10 segundos, se ninguém conseguir iniciar o jogo, oferecemos a opção de forçar início
  useEffect(() => {
    if (!isHost && players.length > 0) {
      const timer = setTimeout(() => {
        setForceInitOption(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isHost, players.length]);

  const handleStartGame = async () => {
    setStarting(true);
    setError(null);

    try {
      await startGame();
    } catch (err: any) {
      console.error("Erro ao iniciar jogo:", err);

      // Extrair mensagem de erro para exibir ao usuário
      const errorMessage = err?.message || "Ocorreu um erro ao iniciar o jogo";
      setError(errorMessage);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="gartic-card p-6">
      <h2 className="gartic-title text-center mb-6">Sala de Espera</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Debug info */}
      <div className="mb-4 p-2 bg-gray-800 rounded text-xs text-white/70">
        <p>Debug: isHost = {isHost ? "true" : "false"}</p>
        {players.length > 0 && (
          <p>
            Primeiro jogador: {players[0].name} (ID: {players[0].userId})
          </p>
        )}
        <p>Seu ID: {user?.id}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-white text-lg mb-2">Jogadores na Sala:</h3>
        <ul className="space-y-2">
          {players.map((player, index) => (
            <li
              key={player.id}
              className="bg-purple-900 bg-opacity-30 p-3 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-white">{player.name}</span>
              </div>
              {index === 0 && (
                <div className="flex items-center text-yellow-300">
                  <Crown className="w-4 h-4 mr-1" />
                  <span className="text-sm">Anfitrião</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        {isHost ? (
          <div className="space-y-4">
            <Button
              onClick={handleStartGame}
              className="gartic-button-primary"
              disabled={starting || players.length < 1}
            >
              {starting ? "Iniciando..." : "Iniciar Jogo"}
            </Button>

            <div>
              <Button
                onClick={leaveRoom}
                className="gartic-button-secondary"
                variant="destructive"
              >
                Fechar Sala
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-white text-sm mb-2">
              Aguardando o anfitrião iniciar o jogo...
            </p>

            {forceInitOption && (
              <div className="mt-2 mb-4">
                <p className="text-yellow-300 text-xs mb-2">
                  O anfitrião parece estar indisponível. Você pode iniciar o
                  jogo:
                </p>
                <Button
                  onClick={handleStartGame}
                  className="gartic-button-primary"
                  disabled={starting}
                  size="sm"
                >
                  {starting ? "Iniciando..." : "Forçar Início do Jogo"}
                </Button>
              </div>
            )}

            <Button
              onClick={leaveRoom}
              className="gartic-button-secondary"
              variant="outline"
            >
              Sair da Sala
            </Button>
          </div>
        )}
      </div>

      {isHost && players.length < 2 && (
        <p className="text-yellow-300 text-sm mt-4 text-center">
          Recomendado: Pelo menos 2 jogadores para uma melhor experiência.
        </p>
      )}
    </div>
  );
}
