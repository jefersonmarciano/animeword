"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

// Tipos
export type Difficulty = "Fácil" | "Médio" | "Difícil";
export type GameMode =
  | "Padrão (Erro = Próximo Jogador)"
  | "Fixo (cada jogador joga uma rodada inteira)"
  | "Contínuo (acerto = continua jogando)";
export type Theme = "Padrão" | "Modo Escuro" | "Neon" | "Retrô";

export type Player = {
  id: number;
  name: string;
  avatar: string;
  score: number;
  errors: number;
};

export type GameQuestion = {
  word: string;
  hint: string;
  difficulty: Difficulty;
};

// Banco de perguntas - Vamos ofuscar isso para não ficar facilmente visível no inspetor
// Usando uma função para gerar as perguntas em tempo de execução
const getGameQuestions = (): GameQuestion[] => [
  // Fácil
  {
    word: atob("SFRNTAo="),
    hint: "Linguagem de marcação para páginas web",
    difficulty: "Fácil",
  },
  { word: atob("Q1NTCg=="), hint: "Estiliza páginas web", difficulty: "Fácil" },
  {
    word: atob("SkFWQQo="),
    hint: "Linguagem orientada a objetos da Oracle",
    difficulty: "Fácil",
  },
  {
    word: atob("UFlUSE9OCg=="),
    hint: "Linguagem com sintaxe simples e indentação obrigatória",
    difficulty: "Fácil",
  },
  {
    word: atob("UkVBQ1QK"),
    hint: "Biblioteca JavaScript para interfaces",
    difficulty: "Fácil",
  },
  {
    word: atob("Tk9ERQo="),
    hint: "Runtime JavaScript para backend",
    difficulty: "Fácil",
  },
  {
    word: atob("R0lUCg=="),
    hint: "Sistema de controle de versão",
    difficulty: "Fácil",
  },
  {
    word: atob("QVBJCg=="),
    hint: "Interface para comunicação entre sistemas",
    difficulty: "Fácil",
  },

  // Médio
  {
    word: atob("VFlQRVNDUklQVAo="),
    hint: "JavaScript com tipagem estática",
    difficulty: "Médio",
  },
  {
    word: atob("RE9DS0VSCg=="),
    hint: "Plataforma de containerização",
    difficulty: "Médio",
  },
  {
    word: atob("TU9OR09EQgo="),
    hint: "Banco de dados NoSQL",
    difficulty: "Médio",
  },
  {
    word: atob("TkVYVEpTCg=="),
    hint: "Framework React com SSR",
    difficulty: "Médio",
  },
  {
    word: atob("UkVEVVgK"),
    hint: "Gerenciamento de estado para JavaScript",
    difficulty: "Médio",
  },
  {
    word: atob("QVdTCg=="),
    hint: "Serviço de computação em nuvem da Amazon",
    difficulty: "Médio",
  },
  {
    word: atob("R1JBUEhRTAo="),
    hint: "Linguagem de consulta para APIs",
    difficulty: "Médio",
  },
  {
    word: atob("RklSRUJBU0UK"),
    hint: "Plataforma de desenvolvimento da Google",
    difficulty: "Médio",
  },

  // Difícil
  {
    word: atob("S1VCRVJORVRFUwo="),
    hint: "Orquestração de containers",
    difficulty: "Difícil",
  },
  {
    word: atob("V0VCQVNTRU1CTFkK"),
    hint: "Formato de código binário para browsers",
    difficulty: "Difícil",
  },
  {
    word: atob("TUlDUk9TRVJWSUNFUwo="),
    hint: "Arquitetura de software distribuído",
    difficulty: "Difícil",
  },
  {
    word: atob("QkxPQ0tDSEFJTgo="),
    hint: "Tecnologia de registro distribuído",
    difficulty: "Difícil",
  },
  {
    word: atob("U0VSVkVSTEVTUwo="),
    hint: "Modelo de execução de código sem gerenciar servidores",
    difficulty: "Difícil",
  },
  {
    word: atob("VEVOU09SRkxPVwo="),
    hint: "Biblioteca para machine learning",
    difficulty: "Difícil",
  },
  {
    word: atob("RUxBU1RJQ1NFQVJDSAo="),
    hint: "Mecanismo de busca e análise",
    difficulty: "Difícil",
  },
  {
    word: atob("V0VCU09DS0VUUwo="),
    hint: "Protocolo de comunicação bidirecional",
    difficulty: "Difícil",
  },
];

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
];

// Número máximo de erros permitidos
export const MAX_ERRORS = 5;

// Interface do contexto
interface GameContextType {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  numberOfPlayers: number;
  setNumberOfPlayers: React.Dispatch<React.SetStateAction<number>>;
  pointsToWin: number;
  setPointsToWin: React.Dispatch<React.SetStateAction<number>>;
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  visualTheme: Theme;
  setVisualTheme: React.Dispatch<React.SetStateAction<Theme>>;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: React.Dispatch<React.SetStateAction<number>>;
  currentQuestion: GameQuestion | null;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<GameQuestion | null>>;
  guessedLetters: string[];
  setGuessedLetters: React.Dispatch<React.SetStateAction<string[]>>;
  wrongLetters: string[];
  setWrongLetters: React.Dispatch<React.SetStateAction<string[]>>;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  gameOver: boolean;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  difficulty: Difficulty;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>;
  showSuccessModal: boolean;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  getRandomQuestion: () => GameQuestion;
  checkWin: () => boolean;
  makeGuess: (letter: string) => void;
  guessWord: (word: string) => void;
  nextPlayer: () => void;
  resetGame: () => void;
  startNewRound: () => void;
  applyTheme: () => void;
  getCurrentPlayerErrors: () => number;
  getRandomAvatar: () => string;
}

// Função para obter um avatar aleatório
const getRandomAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
};

// Criação do contexto
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider do contexto
export function GameProvider({ children }: { children: React.ReactNode }) {
  // Inicializar as perguntas apenas quando o componente é montado
  const [questions] = useState(getGameQuestions);

  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: "Jogador 1",
      avatar: getRandomAvatar(),
      score: 0,
      errors: 0,
    },
    {
      id: 2,
      name: "Jogador 2",
      avatar: getRandomAvatar(),
      score: 0,
      errors: 0,
    },
  ]);
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [pointsToWin, setPointsToWin] = useState(100);
  const [gameMode, setGameMode] = useState<GameMode>(
    "Padrão (Erro = Próximo Jogador)"
  );
  const [visualTheme, setVisualTheme] = useState<Theme>("Padrão");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(
    null
  );
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("Médio");
  // Adicionar estado para controlar o modal de sucesso
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Aplicar tema visual
  const applyTheme = () => {
    const root = document.documentElement;

    // Remover todas as classes de tema
    root.classList.remove("light", "dark", "neon", "retro");

    // Aplicar o tema selecionado
    switch (visualTheme) {
      case "Modo Escuro":
        root.classList.add("dark");
        break;
      case "Neon":
        root.classList.add("neon");
        break;
      case "Retrô":
        root.classList.add("retro");
        break;
      default:
        root.classList.add("light");
        break;
    }
  };

  // Efeito para aplicar o tema quando ele mudar
  useEffect(() => {
    applyTheme();
  }, [visualTheme]);

  // Obter uma pergunta aleatória com base na dificuldade
  const getRandomQuestion = (): GameQuestion => {
    const filteredQuestions = questions.filter(
      (q) => q.difficulty === difficulty
    );
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);

    // Limpar a palavra para remover possíveis caracteres de nova linha
    const question = filteredQuestions[randomIndex];
    return {
      ...question,
      word: question.word.trim(),
    };
  };

  // Obter o número de erros do jogador atual
  const getCurrentPlayerErrors = () => {
    return players[currentPlayerIndex].errors;
  };

  // Verificar se o jogador ganhou
  const checkWin = (): boolean => {
    if (!currentQuestion) return false;

    return currentQuestion.word
      .split("")
      .every((letter) => guessedLetters.includes(letter.toUpperCase()));
  };

  // Modificar a função makeGuess para mostrar o modal quando acertar a palavra
  const makeGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
      return;
    }

    if (currentQuestion && currentQuestion.word.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);

      // Adicionar pontos ao jogador atual
      const occurrences = currentQuestion.word
        .split("")
        .filter((l) => l === letter).length;
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score += occurrences;
      setPlayers(updatedPlayers);

      // Verificar se ganhou a rodada
      if (
        currentQuestion.word
          .split("")
          .every((l) => guessedLetters.includes(l) || l === letter)
      ) {
        // Adicionar pontos bônus por completar a palavra
        updatedPlayers[currentPlayerIndex].score += 10;
        setPlayers(updatedPlayers);

        // Mostrar modal de sucesso
        setShowSuccessModal(true);
      }

      // Se o modo for "Contínuo", o jogador continua
      // Se for "Padrão" ou "Fixo", depende da lógica abaixo
    } else {
      setWrongLetters([...wrongLetters, letter]);

      // Subtrair pontos por erro
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score = Math.max(
        0,
        updatedPlayers[currentPlayerIndex].score - 5
      );

      // Incrementar o contador de erros do jogador atual
      updatedPlayers[currentPlayerIndex].errors += 1;
      setPlayers(updatedPlayers);

      // Verificar se o jogador atingiu o número máximo de erros
      if (updatedPlayers[currentPlayerIndex].errors >= MAX_ERRORS) {
        setGameOver(true);
        return;
      }

      // No modo padrão, passa para o próximo jogador ao errar
      if (gameMode === "Padrão (Erro = Próximo Jogador)") {
        nextPlayer();
      }
    }
  };

  // Modificar a função guessWord para mostrar o modal quando acertar a palavra
  const guessWord = (word: string) => {
    if (currentQuestion && word.toUpperCase() === currentQuestion.word) {
      // Acertou a palavra completa
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score += 10; // Bônus por acertar a palavra completa
      setPlayers(updatedPlayers);

      // Mostrar modal de sucesso
      setShowSuccessModal(true);
    } else {
      // Errou a palavra completa
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score = Math.max(
        0,
        updatedPlayers[currentPlayerIndex].score - 50
      );

      // Incrementar o contador de erros do jogador atual
      updatedPlayers[currentPlayerIndex].errors += 1;
      setPlayers(updatedPlayers);

      // Verificar se o jogador atingiu o número máximo de erros
      if (updatedPlayers[currentPlayerIndex].errors >= MAX_ERRORS) {
        setGameOver(true);
        return;
      }

      // Passa para o próximo jogador
      nextPlayer();
    }
  };

  // Adicionar função para iniciar nova rodada
  const startNewRound = () => {
    setCurrentQuestion(getRandomQuestion());
    setGuessedLetters([]);
    setWrongLetters([]);
    setTimeLeft(60);
    setShowSuccessModal(false);

    // Resetar os erros de todos os jogadores para a nova rodada
    const updatedPlayers = [...players];
    updatedPlayers.forEach((player) => {
      player.errors = 0;
    });
    setPlayers(updatedPlayers);
  };

  // Passar para o próximo jogador
  const nextPlayer = () => {
    // Verificar se algum jogador atingiu a pontuação para vitória
    const winner = players.find((player) => player.score >= pointsToWin);
    if (winner) {
      setGameOver(true);
      return;
    }

    // Passar para o próximo jogador
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    setTimeLeft(60);
  };

  // Resetar o jogo
  const resetGame = () => {
    setCurrentQuestion(getRandomQuestion());
    setGuessedLetters([]);
    setWrongLetters([]);
    setTimeLeft(60);
    setGameOver(false);

    // Resetar pontuações e erros
    setPlayers(players.map((player) => ({ ...player, score: 0, errors: 0 })));
  };

  // Efeito para inicializar o jogo
  useEffect(() => {
    // Atualizar o array de jogadores quando o número de jogadores mudar
    const newPlayers = Array.from({ length: numberOfPlayers }, (_, i) => ({
      id: i + 1,
      name: `Jogador ${i + 1}`,
      avatar: getRandomAvatar(),
      score: 0,
      errors: 0,
    }));

    setPlayers(newPlayers);
  }, [numberOfPlayers]);

  // Efeito para o timer
  useEffect(() => {
    if (!currentQuestion || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          nextPlayer();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, currentPlayerIndex, gameOver]);

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
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Hook para usar o contexto
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
