"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useGame, type GameMode, type Theme } from "@/context/game-context"
import { Cog, Users, Trophy, RefreshCw } from "lucide-react"

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
  const changePlayerAvatar = (id: number) => {
    const updatedPlayers = players.map((player) =>
      player.id === id ? { ...player, avatar: getRandomAvatar() } : player,
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
    <div className="bg-card rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Configuração do Jogo</h1>
      <div className="border-b border-border mb-6"></div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Opções do Jogo */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-primary">
            <Cog className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Opções do Jogo</h2>
          </div>
          <div className="border-b border-primary/30 mb-4"></div>

          <div className="space-y-6">
            <div>
              <label className="block mb-2">Número de Jogadores</label>
              <Select
                value={numberOfPlayers.toString()}
                onValueChange={(value) => setNumberOfPlayers(Number.parseInt(value))}
              >
                <SelectTrigger>
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
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md font-bold">{pointsToWin}</div>
              </div>
            </div>

            <div>
              <label className="block mb-2">Modo de Jogo:</label>
              <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                <SelectTrigger>
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
              <Select value={visualTheme} onValueChange={(value) => setVisualTheme(value as Theme)}>
                <SelectTrigger>
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
          </div>
        </div>

        {/* Jogadores */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-primary">
            <Users className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Jogadores</h2>
          </div>
          <div className="border-b border-primary/30 mb-4"></div>

          <div className="space-y-4">
            {players.map((player) => (
              <div key={player.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold">
                  {player.id}
                </div>
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground">Jogador {player.id}:</label>
                  <Input
                    value={player.name}
                    onChange={(e) => updatePlayerName(player.id, e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="relative group">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                    <Image
                      src={player.avatar || "/placeholder.svg"}
                      alt={`Avatar do ${player.name}`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={() => changePlayerAvatar(player.id)}
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Trocar avatar"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleStartGame}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-6 text-lg font-bold"
        >
          INICIAR DESAFIO 🚀
        </Button>
      </div>

      {/* Regras do Jogo */}
      <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
        <div className="flex items-center gap-2 mb-4 text-amber-500">
          <Trophy className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Regras do Jogo</h2>
        </div>

        <ul className="space-y-2 list-disc pl-6">
          <li>Cada jogador tenta adivinhar uma letra por vez ou arriscar a palavra completa.</li>
          <li>Acertar uma letra = +1 ponto por ocorrência da letra.</li>
          <li>Acertar a palavra completa = +10 pontos.</li>
          <li>Errar um palpite de palavra completa = -50 pontos!</li>
          <li>O primeiro jogador a atingir a pontuação para vitória vence o jogo.</li>
          <li>
            Dependendo da dificuldade, você terá um número limitado de tentativas (Fácil: 8, Médio: 6, Difícil: 4).
          </li>
        </ul>
      </div>
    </div>
  )
}
