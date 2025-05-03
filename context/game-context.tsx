"use client"

import type React from "react"
import { createContext, useState, useEffect } from "react"
import { useContext } from "react"

// Tipos
export type Difficulty = "Fácil" | "Médio" | "Difícil"
export type GameMode =
  | "Padrão (Erro = Próximo Jogador)"
  | "Fixo (cada jogador joga uma rodada inteira)"
  | "Contínuo (acerto = continua jogando)"
export type Theme = "Padrão" | "Modo Escuro" | "Neon" | "Retrô"

export type Player = {
  id: number
  name: string
  avatar: string
  score: number
  errors: number
}

export type GameQuestion = {
  word: string
  hint: string
  difficulty: Difficulty
}

// Banco de perguntas - Vamos ofuscar isso para não ficar facilmente visível no inspetor
// Usando uma função para gerar as perguntas em tempo de execução
const getGameQuestions = (): GameQuestion[] => {
  // Perguntas originais
  const originalQuestions = [
    // Fácil
    { word: atob("SFRNTAo=").trim(), hint: "Linguagem de marcação para páginas web", difficulty: "Fácil" },
    { word: atob("Q1NTCg==").trim(), hint: "Estiliza páginas web", difficulty: "Fácil" },
    { word: atob("SkFWQQo=").trim(), hint: "Linguagem orientada a objetos da Oracle", difficulty: "Fácil" },
    {
      word: atob("UFlUSE9OCg==").trim(),
      hint: "Linguagem com sintaxe simples e indentação obrigatória",
      difficulty: "Fácil",
    },
    { word: atob("UkVBQ1QK").trim(), hint: "Biblioteca JavaScript para interfaces", difficulty: "Fácil" },
    { word: atob("Tk9ERQo=").trim(), hint: "Runtime JavaScript para backend", difficulty: "Fácil" },
    { word: atob("R0lUCg==").trim(), hint: "Sistema de controle de versão", difficulty: "Fácil" },
    { word: atob("QVBJCg==").trim(), hint: "Interface para comunicação entre sistemas", difficulty: "Fácil" },

    // Médio
    { word: atob("VFlQRVNDUklQVAo=").trim(), hint: "JavaScript com tipagem estática", difficulty: "Médio" },
    { word: atob("RE9DS0VSCg==").trim(), hint: "Plataforma de containerização", difficulty: "Médio" },
    { word: atob("TU9OR09EQgo=").trim(), hint: "Banco de dados NoSQL", difficulty: "Médio" },
    { word: atob("TkVYVEpTCg==").trim(), hint: "Framework React com SSR", difficulty: "Médio" },
    { word: atob("UkVEVVgK").trim(), hint: "Gerenciamento de estado para JavaScript", difficulty: "Médio" },
    { word: atob("QVdTCg==").trim(), hint: "Serviço de computação em nuvem da Amazon", difficulty: "Médio" },
    { word: atob("R1JBUEhRTAo=").trim(), hint: "Linguagem de consulta para APIs", difficulty: "Médio" },
    { word: atob("RklSRUJBU0UK").trim(), hint: "Plataforma de desenvolvimento da Google", difficulty: "Médio" },

    // Difícil
    { word: atob("S1VCRVJORVRFUwo=").trim(), hint: "Orquestração de containers", difficulty: "Difícil" },
    { word: atob("V0VCQVNTRU1CTFkK").trim(), hint: "Formato de código binário para browsers", difficulty: "Difícil" },
    { word: atob("TUlDUk9TRVJWSUNFUwo=").trim(), hint: "Arquitetura de software distribuído", difficulty: "Difícil" },
    { word: atob("QkxPQ0tDSEFJTgo=").trim(), hint: "Tecnologia de registro distribuído", difficulty: "Difícil" },
    {
      word: atob("U0VSVkVSTEVTUwo=").trim(),
      hint: "Modelo de execução de código sem gerenciar servidores",
      difficulty: "Difícil",
    },
    { word: atob("VEVOU09SRkxPVwo=").trim(), hint: "Biblioteca para machine learning", difficulty: "Difícil" },
    { word: atob("RUxBU1RJQ1NFQVJDSAo=").trim(), hint: "Mecanismo de busca e análise", difficulty: "Difícil" },
    { word: atob("V0VCU09DS0VUUwo=").trim(), hint: "Protocolo de comunicação bidirecional", difficulty: "Difícil" },
  ]

  // Novas perguntas do arquivo JSON
  const newQuestions: GameQuestion[] = [
    // Fácil
    { word: "UNITY", hint: "Motor de jogo mais utilizado para desenvolvimento 2D e 3D", difficulty: "Fácil" },
    { word: "C#", hint: "Linguagem de programação padrão usada na Unity", difficulty: "Fácil" },
    { word: "SPRITE", hint: "Arquivo que representa uma textura em um jogo", difficulty: "Fácil" },
    { word: "VIEWPORT", hint: "Área do jogo visível na tela", difficulty: "Fácil" },
    { word: "SFX", hint: "Arquivo de áudio para efeitos sonoros curtos", difficulty: "Fácil" },
    { word: "BGM", hint: "Arquivo de áudio para música de fundo", difficulty: "Fácil" },
    { word: "HUD", hint: "Interface que permite ao jogador interagir com o jogo", difficulty: "Fácil" },
    { word: "HITBOX", hint: "Área onde os objetos colidem em um game", difficulty: "Fácil" },
    { word: "TRIGGER", hint: "Termo usado para objetos que não colidem", difficulty: "Fácil" },
    { word: "COLLIDER", hint: "Sistema responsável por detectar colisões", difficulty: "Fácil" },

    // Médio
    { word: "UNREAL ENGINE", hint: "Motor de jogo conhecido por seus gráficos realistas", difficulty: "Médio" },
    { word: "GD SCRIPT", hint: "Linguagem de programação usada em scripts do Godot", difficulty: "Médio" },
    { word: "FRAME-BY-FRAME", hint: "Técnica de animação quadro a quadro em jogos 2D", difficulty: "Médio" },
    { word: "BOUNDING BOX", hint: "Técnica de otimização de colisão usando caixas delimitadoras", difficulty: "Médio" },
    { word: "SCREEN SPACE", hint: "Sistema de coordenadas com origem no canto superior esquerdo", difficulty: "Médio" },
    { word: "RIGIDBODY", hint: "Processo de simular física realista em jogos", difficulty: "Médio" },
    { word: "CONTROLLER", hint: "Componente que permite controlar o movimento de um personagem", difficulty: "Médio" },
    { word: "GAME LOOP", hint: "Conceito de atualizar partes do jogo em ciclos constantes", difficulty: "Médio" },
    { word: "RIGGING", hint: "Técnica usada para animação de esqueletos", difficulty: "Médio" },
    { word: "DEBUG MODE", hint: "Ambiente de teste interno usado por desenvolvedores", difficulty: "Médio" },

    // Difícil
    { word: "RAY TRACING", hint: "Técnica para simular luz em tempo real", difficulty: "Difícil" },
    { word: "PLAYER CHARACTER", hint: "Elemento que representa o jogador", difficulty: "Difícil" },
    { word: "FOLLOW CAMERA", hint: "Tipo de câmera que segue o personagem", difficulty: "Difícil" },
    { word: "PARTICLE SYSTEM", hint: "Sistema de partículas usado para efeitos visuais", difficulty: "Difícil" },
    { word: "GAME MECHANICS", hint: "Conjunto de regras que define a jogabilidade", difficulty: "Difícil" },
    { word: "PHYSICS ENGINE", hint: "Representação física de objetos no game", difficulty: "Difícil" },
    { word: "TRIGGER ZONE", hint: "Área invisível que ativa eventos no jogo", difficulty: "Difícil" },
    { word: "ON COLLISION", hint: "Evento ativado quando dois objetos colidem", difficulty: "Difícil" },
    { word: "SAVE SYSTEM", hint: "Sistema que salva o progresso do jogador", difficulty: "Difícil" },
    { word: "MAIN MENU", hint: "Cena inicial que apresenta título e opções", difficulty: "Difícil" },
  ]

  // Combinar as perguntas originais com as novas
  return [...originalQuestions, ...newQuestions]
}

// Avatares disponíveis
export const avatars = [
  "/images/avatars/devFront.png",
  "/images/avatars/devJs.png",
  "/images/avatars/devRust.png",
  "/images/avatars/analistadeRedes.png",
  "/images/avatars/analistadeDados.png",
  "/images/avatars/nerdola.png",
  "/images/avatars/irritado.png",
  "/images/avatars/dracula.png",
  "/images/avatars/homemTranquilo.png",
]

// Número máximo de erros permitidos
export const MAX_ERRORS = 5

// Interface do contexto
interface GameContextType {
  players: Player[]
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>
  numberOfPlayers: number
  setNumberOfPlayers: React.Dispatch<React.SetStateAction<number>>
  pointsToWin: number
  setPointsToWin: React.Dispatch<React.SetStateAction<number>>
  gameMode: GameMode
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>
  visualTheme: Theme
  setVisualTheme: React.Dispatch<React.SetStateAction<Theme>>
  currentPlayerIndex: number
  setCurrentPlayerIndex: React.Dispatch<React.SetStateAction<number>>
  currentQuestion: GameQuestion | null
  setCurrentQuestion: React.Dispatch<React.SetStateAction<GameQuestion | null>>
  guessedLetters: string[]
  setGuessedLetters: React.Dispatch<React.SetStateAction<string[]>>
  wrongLetters: string[]
  setWrongLetters: React.Dispatch<React.SetStateAction<string[]>>
  timeLeft: number
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>
  gameOver: boolean
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>
  difficulty: Difficulty
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>
  showSuccessModal: boolean
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>
  getRandomQuestion: () => GameQuestion
  checkWin: () => boolean
  makeGuess: (letter: string) => void
  guessWord: (word: string) => void
  nextPlayer: () => void
  resetGame: () => void
  startNewRound: () => void
  applyTheme: () => void
  getCurrentPlayerErrors: () => number
  getRandomAvatar: () => string
}

// Função para obter um avatar aleatório
const getRandomAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * avatars.length)
  return avatars[randomIndex]
}

// Criação do contexto
const GameContext = createContext<GameContextType | undefined>(undefined)

// Provider do contexto
export function GameProvider({ children }: { children: React.ReactNode }) {
  // Inicializar as perguntas apenas quando o componente é montado
  const [questions] = useState(getGameQuestions)

  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Jogador 1", avatar: getRandomAvatar(), score: 0, errors: 0 },
    { id: 2, name: "Jogador 2", avatar: getRandomAvatar(), score: 0, errors: 0 },
  ])
  const [numberOfPlayers, setNumberOfPlayers] = useState(2)
  const [pointsToWin, setPointsToWin] = useState(100)
  const [gameMode, setGameMode] = useState<GameMode>("Padrão (Erro = Próximo Jogador)")
  const [visualTheme, setVisualTheme] = useState<Theme>("Padrão")
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [wrongLetters, setWrongLetters] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameOver, setGameOver] = useState(false)
  const [difficulty, setDifficulty] = useState<Difficulty>("Médio")
  // Adicionar estado para controlar o modal de sucesso
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Aplicar tema visual
  const applyTheme = () => {
    const root = document.documentElement

    // Remove all theme classes
    root.classList.remove("dark", "neon", "retro", "gartic")

    // Apply the selected theme
    switch (visualTheme) {
      case "Modo Escuro":
        root.classList.add("dark")
        break
      case "Neon":
        root.classList.add("neon")
        break
      case "Retrô":
        root.classList.add("retro")
        break
      default:
        // Default theme is gartic
        root.classList.add("gartic")
        break
    }
  }

  // Make sure the theme is applied when it changes
  useEffect(() => {
    applyTheme()
  }, [visualTheme])

  // Also apply theme on initial load
  useEffect(() => {
    applyTheme()
  }, [])

  // Obter uma pergunta aleatória com base na dificuldade
  const getRandomQuestion = (): GameQuestion => {
    const filteredQuestions = questions.filter((q) => q.difficulty === difficulty)
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length)

    // Limpar a palavra para remover possíveis caracteres de nova linha
    const question = filteredQuestions[randomIndex]
    return {
      ...question,
      word: question.word.trim(),
    }
  }

  // Obter o número de erros do jogador atual
  const getCurrentPlayerErrors = () => {
    return players[currentPlayerIndex].errors
  }

  // Verificar se o jogador ganhou
  const checkWin = (): boolean => {
    if (!currentQuestion) return false

    return currentQuestion.word
      .split("")
      .every((letter) => letter === " " || guessedLetters.includes(letter.toUpperCase()))
  }

  // Modificar a função makeGuess para mostrar o modal quando acertar a palavra
  const makeGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
      return
    }

    if (currentQuestion && currentQuestion.word.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter])

      // Adicionar pontos ao jogador atual
      const occurrences = currentQuestion.word.split("").filter((l) => l === letter).length
      const updatedPlayers = [...players]
      updatedPlayers[currentPlayerIndex].score += occurrences
      setPlayers(updatedPlayers)

      // Verificar se ganhou a rodada
      // Modificado para ignorar espaços na verificação de vitória
      if (currentQuestion.word.split("").every((l) => l === " " || guessedLetters.includes(l) || l === letter)) {
        // Adicionar pontos bônus por completar a palavra
        updatedPlayers[currentPlayerIndex].score += 10
        setPlayers(updatedPlayers)

        // Mostrar modal de sucesso
        setShowSuccessModal(true)
      }

      // Se o modo for "Contínuo", o jogador continua
      // Se for "Padrão" ou "Fixo", depende da lógica abaixo
    } else {
      setWrongLetters([...wrongLetters, letter])

      // Subtrair pontos por erro
      const updatedPlayers = [...players]
      updatedPlayers[currentPlayerIndex].score = Math.max(0, updatedPlayers[currentPlayerIndex].score - 5)

      // Incrementar o contador de erros do jogador atual
      updatedPlayers[currentPlayerIndex].errors += 1
      setPlayers(updatedPlayers)

      // Verificar se o jogador atingiu o número máximo de erros
      if (updatedPlayers[currentPlayerIndex].errors >= MAX_ERRORS) {
        setGameOver(true)
        return
      }

      // No modo padrão, passa para o próximo jogador ao errar
      if (gameMode === "Padrão (Erro = Próximo Jogador)") {
        nextPlayer()
      }
    }
  }

  // Modificar a função guessWord para mostrar o modal quando acertar a palavra
  const guessWord = (word: string) => {
    if (currentQuestion && word.toUpperCase() === currentQuestion.word) {
      // Acertou a palavra completa
      const updatedPlayers = [...players]
      updatedPlayers[currentPlayerIndex].score += 10 // Bônus por acertar a palavra completa
      setPlayers(updatedPlayers)

      // Mostrar modal de sucesso
      setShowSuccessModal(true)
    } else {
      // Errou a palavra completa
      const updatedPlayers = [...players]
      updatedPlayers[currentPlayerIndex].score = Math.max(0, updatedPlayers[currentPlayerIndex].score - 50)

      // Incrementar o contador de erros do jogador atual
      updatedPlayers[currentPlayerIndex].errors += 1
      setPlayers(updatedPlayers)

      // Verificar se o jogador atingiu o número máximo de erros
      if (updatedPlayers[currentPlayerIndex].errors >= MAX_ERRORS) {
        setGameOver(true)
        return
      }

      // Passa para o próximo jogador
      nextPlayer()
    }
  }

  // Adicionar função para iniciar nova rodada
  const startNewRound = () => {
    setCurrentQuestion(getRandomQuestion())
    setGuessedLetters([])
    setWrongLetters([])
    setTimeLeft(60)
    setShowSuccessModal(false)

    // Resetar os erros de todos os jogadores para a nova rodada
    const updatedPlayers = [...players]
    updatedPlayers.forEach((player) => {
      player.errors = 0
    })
    setPlayers(updatedPlayers)
  }

  // Passar para o próximo jogador
  const nextPlayer = () => {
    // Verificar se algum jogador atingiu a pontuação para vitória
    const winner = players.find((player) => player.score >= pointsToWin)
    if (winner) {
      setGameOver(true)
      return
    }

    // Passar para o próximo jogador
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length)
    setTimeLeft(60)
  }

  // Resetar o jogo
  const resetGame = () => {
    setCurrentQuestion(getRandomQuestion())
    setGuessedLetters([])
    setWrongLetters([])
    setTimeLeft(60)
    setGameOver(false)

    // Resetar pontuações e erros
    setPlayers(players.map((player) => ({ ...player, score: 0, errors: 0 })))
  }

  // Efeito para inicializar o jogo
  useEffect(() => {
    // Atualizar o array de jogadores quando o número de jogadores mudar
    const newPlayers = Array.from({ length: numberOfPlayers }, (_, i) => ({
      id: i + 1,
      name: `Jogador ${i + 1}`,
      avatar: getRandomAvatar(),
      score: 0,
      errors: 0,
    }))

    setPlayers(newPlayers)
  }, [numberOfPlayers])

  // Efeito para o timer
  useEffect(() => {
    if (!currentQuestion || gameOver) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          nextPlayer()
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestion, currentPlayerIndex, gameOver])

  // Adicionar showSuccessModal, startNewRound e getCurrentPlayerErrors ao valor do contexto
  const value = {
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
    currentPlayerIndex,
    setCurrentPlayerIndex,
    currentQuestion,
    setCurrentQuestion,
    guessedLetters,
    setGuessedLetters,
    wrongLetters,
    setWrongLetters,
    timeLeft,
    setTimeLeft,
    gameOver,
    setGameOver,
    difficulty,
    setDifficulty,
    showSuccessModal,
    setShowSuccessModal,
    getRandomQuestion,
    checkWin,
    makeGuess,
    guessWord,
    nextPlayer,
    resetGame,
    startNewRound,
    applyTheme,
    getCurrentPlayerErrors,
    getRandomAvatar,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

// Hook para usar o contexto
export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
