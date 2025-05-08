"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useGame, type GameMode, type Theme } from "@/context/game-context";
import { useRoom } from "@/context/room-context";
import { useAuth } from "@/context/auth-context";
import { ArrowLeft, Cog, Users, Play, Copy, Check } from "lucide-react";
import PlayerCard from "./player-card";
import GameRules from "./game-rules";
import { copyToClipboard } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GameSetupProps {
  onStartGame: () => void;
  onBack: () => void;
}

export default function GameSetup({ onStartGame, onBack }: GameSetupProps) {
  const {
    players,
    setPlayers,
    pointsToWin,
    setPointsToWin,
    gameMode,
    setGameMode,
    visualTheme,
    setVisualTheme,
    getRandomQuestion,
    setCurrentQuestion,
    resetGame,
    getRandomAvatar,
    setUsedQuestions,
    setNumberOfPlayers,
  } = useGame();

  const { currentRoom } = useRoom();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"config" | "rules">("config");

  // Opções para os selects
  const gameModeOptions: GameMode[] = [
    "Padrão (Erro = Próximo Jogador)",
    "Fixo (cada jogador joga uma rodada inteira)",
    "Contínuo (acerto = continua jogando)",
  ];
  const themeOptions: Theme[] = ["Padrão", "Modo Escuro", "Neon", "Retrô"];

  // Atualizar nome do jogador
  const updatePlayerName = (id: number, name: string) => {
    const updatedPlayers = players.map((player) =>
      player.id === id ? { ...player, name } : player
    );
    setPlayers(updatedPlayers);
  };

  // Trocar avatar do jogador
  const changePlayerAvatar = (id: number, newAvatar?: string) => {
    const updatedPlayers = players.map((player) =>
      player.id === id
        ? { ...player, avatar: newAvatar || getRandomAvatar() }
        : player
    );
    setPlayers(updatedPlayers);
  };

  // Iniciar o jogo
  const handleStartGame = () => {
    setUsedQuestions([]); // Limpar perguntas usadas ao iniciar novo jogo
    setCurrentQuestion(getRandomQuestion());
    resetGame();
    onStartGame();
  };

  // Copiar código da sala
  const handleCopyRoomCode = async () => {
    if (!currentRoom) return;

    const success = await copyToClipboard(currentRoom.id);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header com botão voltar e código da sala */}
      <div className="flex justify-between items-center">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          style={{ borderRadius: "10px" }}
        >
          <ArrowLeft className="w-4 h-4" /> VOLTAR
        </Button>

        {currentRoom && (
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ marginLeft: "15px" }}>
              Código da sala: {currentRoom.id}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopyRoomCode}
              style={{ borderRadius: "5px" }}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      <div>
        {/* Mobile-only tabs */}
        <div className="block lg:hidden mb-4">
          <Tabs
            defaultValue="config"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "config" | "rules")}
          >
            <TabsList
              className="grid grid-cols-2 w-full"
              style={{ borderRadius: "10px" }}
            >
              <TabsTrigger value="config" style={{ borderRadius: "10px" }}>
                Configurações
              </TabsTrigger>
              <TabsTrigger value="rules" style={{ borderRadius: "10px" }}>
                Como Jogar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="mt-4 mobile-tabs-content">
              <div className="gartic-card p-5">
                <h2 className="gartic-subtitle flex items-center gap-2 mb-4">
                  <Cog className="w-5 h-5" />
                  CONFIGURAÇÕES
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block mb-2">Pontos para Vitória:</label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[pointsToWin]}
                        min={50}
                        max={500}
                        step={10}
                        onValueChange={(value) => setPointsToWin(value[0])}
                        className="flex-1"
                      />
                      <div
                        className="bg-primary text-primary-foreground px-3 py-1 rounded-md font-bold"
                        style={{ borderRadius: "10px" }}
                      >
                        {pointsToWin}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">Modo de Jogo:</label>
                    <Select
                      value={gameMode}
                      onValueChange={(value) => setGameMode(value as GameMode)}
                    >
                      <SelectTrigger className="gartic-select w-full">
                        <SelectValue placeholder={gameMode} />
                      </SelectTrigger>
                      <SelectContent>
                        {gameModeOptions.map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block mb-2">Tema Visual:</label>
                    <Select
                      value={visualTheme}
                      onValueChange={(value) => setVisualTheme(value as Theme)}
                    >
                      <SelectTrigger className="gartic-select w-full">
                        <SelectValue placeholder={visualTheme} />
                      </SelectTrigger>
                      <SelectContent>
                        {themeOptions.map((theme) => (
                          <SelectItem key={theme} value={theme}>
                            {theme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 mt-6">
                    <button
                      onClick={handleStartGame}
                      className="gartic-button-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
                    >
                      <Play className="w-5 h-5" /> INICIAR DESAFIO
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rules" className="mt-4 mobile-tabs-content">
              <GameRules />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop layout - unchanged */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {/* Coluna da esquerda - Jogadores */}
          <div className="gartic-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="gartic-subtitle flex items-center gap-2">
                <Users className="w-5 h-5" />
                JOGADORES {players.length}/5
              </h2>
              <Select
                value={players.length.toString()}
                onValueChange={(value) => {
                  const numPlayers = Number.parseInt(value);
                  setNumberOfPlayers(numPlayers);
                }}
              >
                <SelectTrigger className="gartic-select w-40">
                  <SelectValue placeholder={`${players.length} Jogadores`} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Jogador" : "Jogadores"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 p-3 gartic-card-highlight rounded-lg"
                >
                  <PlayerCard
                    player={player}
                    isCurrentPlayer={false}
                    onChangeAvatar={changePlayerAvatar}
                  />
                  <div className="flex-1">
                    <Input
                      value={player.name}
                      onChange={(e) =>
                        updatePlayerName(player.id, e.target.value)
                      }
                      className="gartic-input"
                      placeholder={`Jogador ${player.id}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna do meio - Configurações */}
          <div className="gartic-card p-5">
            <h2 className="gartic-subtitle flex items-center gap-2 mb-4">
              <Cog className="w-5 h-5" />
              CONFIGURAÇÕES
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block mb-2">Pontos para Vitória:</label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[pointsToWin]}
                    min={50}
                    max={500}
                    step={10}
                    onValueChange={(value) => setPointsToWin(value[0])}
                    className="flex-1"
                  />
                  <div
                    className="bg-primary text-primary-foreground px-3 py-1 rounded-md font-bold"
                    style={{ borderRadius: "10px" }}
                  >
                    {pointsToWin}
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-2">Modo de Jogo:</label>
                <Select
                  value={gameMode}
                  onValueChange={(value) => setGameMode(value as GameMode)}
                >
                  <SelectTrigger className="gartic-select w-full">
                    <SelectValue placeholder={gameMode} />
                  </SelectTrigger>
                  <SelectContent>
                    {gameModeOptions.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-2">Tema Visual:</label>
                <Select
                  value={visualTheme}
                  onValueChange={(value) => setVisualTheme(value as Theme)}
                >
                  <SelectTrigger className="gartic-select w-full">
                    <SelectValue placeholder={visualTheme} />
                  </SelectTrigger>
                  <SelectContent>
                    {themeOptions.map((theme) => (
                      <SelectItem key={theme} value={theme}>
                        {theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 mt-6">
                <button
                  onClick={handleStartGame}
                  className="gartic-button-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
                >
                  <Play className="w-5 h-5" /> INICIAR DESAFIO
                </button>
              </div>
            </div>
          </div>

          {/* Coluna da direita - Regras */}
          <div>
            <GameRules />
          </div>
        </div>

        {/* Mobile-only players section (always visible) */}
        <div className="block lg:hidden mt-6">
          <div className="gartic-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="gartic-subtitle flex items-center gap-2">
                <Users className="w-5 h-5" />
                JOGADORES {players.length}/5
              </h2>
              <Select
                value={players.length.toString()}
                onValueChange={(value) => {
                  const numPlayers = Number.parseInt(value);
                  setNumberOfPlayers(numPlayers);
                }}
              >
                <SelectTrigger className="gartic-select w-40">
                  <SelectValue placeholder={`${players.length} Jogadores`} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Jogador" : "Jogadores"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 p-3 gartic-card-highlight rounded-lg"
                >
                  <PlayerCard
                    player={player}
                    isCurrentPlayer={false}
                    onChangeAvatar={changePlayerAvatar}
                  />
                  <div className="flex-1">
                    <Input
                      value={player.name}
                      onChange={(e) =>
                        updatePlayerName(player.id, e.target.value)
                      }
                      className="gartic-input"
                      placeholder={`Jogador ${player.id}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
