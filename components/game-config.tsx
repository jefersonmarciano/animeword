"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useGame, type GameMode, type Theme } from "@/context/game-context"
import { Cog, Users, Play } from "lucide-react"
import PlayerCard from "./player-card"
import GameRules from "./game-rules"

export default function GameConfig({ onStartGame }: { onStartGame: () => void }) {
  const {
    players,
    setPlayers,
    numberOfPlayers,
    setNumberOfPlayers,
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
  } = useGame()

  // Opções para os selects
  const playerOptions = [1, 2, 3, 4, 5]
  const gameModeOptions: GameMode[] = [
    "Padrão (Erro = Próximo Jogador)",
    "Fixo (cada jogador joga uma rodada inteira)",
    "Contínuo (acerto = continua jogando)",
  ]
  const themeOptions: Theme[] = ["Padrão", "Modo Escuro", "Neon", "Retrô"]

  // Atualizar nome do jogador
  const updatePlayerName = (id: number, name: string) => {
    const updatedPlayers = players.map((player) => (player.id === id ? { ...player, name } : player))
    setPlayers(updatedPlayers)
  }

  // Trocar avatar do jogador
  const changePlayerAvatar = (id: number, newAvatar?: string) => {
    const updatedPlayers = players.map((player) =>
      player.id === id ? { ...player, avatar: newAvatar || getRandomAvatar() } : player,
    )
    setPlayers(updatedPlayers)
  }

  // Iniciar o jogo
  const handleStartGame = () => {
    setCurrentQuestion(getRandomQuestion())
    resetGame()
    onStartGame()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna da esquerda - Jogadores */}
      <div className="gartic-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="gartic-subtitle flex items-center gap-2">
            <Users className="w-5 h-5" />
            JOGADORES {players.length}/5
          </h2>
          <Select
            value={numberOfPlayers.toString()}
            onValueChange={(value) => setNumberOfPlayers(Number.parseInt(value))}
          >
            <SelectTrigger className="gartic-select w-40">
              <SelectValue placeholder={`${numberOfPlayers} Jogadores`} />
            </SelectTrigger>
            <SelectContent>
              {playerOptions.map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Jogador" : "Jogadores"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {players.map((player) => (
            <div key={player.id} className="flex items-center gap-4 p-3 gartic-card-highlight rounded-lg">
              <PlayerCard player={player} isCurrentPlayer={false} onChangeAvatar={changePlayerAvatar} />
              <div className="flex-1">
                <Input
                  value={player.name}
                  onChange={(e) => updatePlayerName(player.id, e.target.value)}
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
            <label className="block mb-2 text-white">Pontos para Vitória:</label>
            <div className="flex items-center gap-4">
              <Slider
                value={[pointsToWin]}
                min={50}
                max={500}
                step={10}
                onValueChange={(value) => setPointsToWin(value[0])}
                className="flex-1"
              />
              <div className="bg-[#4cc9f0] text-[#3a0ca3] px-3 py-1 rounded-md font-bold">{pointsToWin}</div>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-white">Modo de Jogo:</label>
            <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
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
            <label className="block mb-2 text-white">Tema Visual:</label>
            <Select value={visualTheme} onValueChange={(value) => setVisualTheme(value as Theme)}>
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
  )
}
