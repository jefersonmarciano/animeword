"use client";

import type React from "react";
import { createContext, useState, useEffect } from "react";
import { useContext } from "react";

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

// Banco de perguntas
const getGameQuestions = (): GameQuestion[] => {
  return [
    // Fácil
    {
      word: "NARUTO",
      hint: "Ninja que sonha em se tornar Hokage",
      difficulty: "Fácil",
    },
    {
      word: "GOKU",
      hint: "Protagonista de Dragon Ball que é um Saiyajin",
      difficulty: "Fácil",
    },
    {
      word: "LIGHT",
      hint: "Estudante que encontra um Death Note",
      difficulty: "Fácil",
    },
    {
      word: "EREN",
      hint: "Jovem que busca vingança contra os Titãs",
      difficulty: "Fácil",
    },
    {
      word: "L",
      hint: "Detetive genial que investiga o caso Kira",
      difficulty: "Fácil",
    },
    {
      word: "SAITAMA",
      hint: "Herói que derrota inimigos com um soco",
      difficulty: "Fácil",
    },
    {
      word: "DEKU",
      hint: "Protagonista de My Hero Academia",
      difficulty: "Fácil",
    },
    {
      word: "TANJIRO",
      hint: "Caçador de demônios que busca curar sua irmã",
      difficulty: "Fácil",
    },
    {
      word: "LEVI",
      hint: "Soldado mais forte da humanidade em Attack on Titan",
      difficulty: "Fácil",
    },
    {
      word: "ZORO",
      hint: "Espadachim que se perde facilmente em One Piece",
      difficulty: "Fácil",
    },

    // Médio
    {
      word: "KAKASHI",
      hint: "Ninja que sempre lê o livro Icha Icha",
      difficulty: "Médio",
    },
    {
      word: "VEGETA",
      hint: "Príncipe dos Saiyajins que rivaliza com Goku",
      difficulty: "Médio",
    },
    {
      word: "MISA",
      hint: "Idol que apoia Kira no Death Note",
      difficulty: "Médio",
    },
    {
      word: "MADARA",
      hint: "Ninja lendário que planeja o Tsukuyomi Infinito",
      difficulty: "Médio",
    },
    {
      word: "GAROU",
      hint: "Discípulo de Bang que se torna um monstro",
      difficulty: "Médio",
    },
    {
      word: "BAKUGOU",
      hint: "Estudante explosivo de UA que rivaliza com Deku",
      difficulty: "Médio",
    },
    {
      word: "NEZUKO",
      hint: "Irmã de Tanjiro que se torna um demônio",
      difficulty: "Médio",
    },
    {
      word: "ERWIN",
      hint: "Comandante da Divisão de Reconhecimento",
      difficulty: "Médio",
    },
    {
      word: "SANJI",
      hint: "Cozinheiro dos Chapéus de Palha que não luta contra mulheres",
      difficulty: "Médio",
    },
    {
      word: "ALLMIGHT",
      hint: "Herói número um que passa seu poder para Deku",
      difficulty: "Médio",
    },

    // Difícil
    {
      word: "ITACHI",
      hint: "Ninja que massacrou seu clã para proteger a vila",
      difficulty: "Difícil",
    },
    {
      word: "FRIEZA",
      hint: "Imperador do universo que destruiu o planeta Vegeta",
      difficulty: "Difícil",
    },
    {
      word: "RYUK",
      hint: "Shinigami que deixa cair o Death Note na Terra",
      difficulty: "Difícil",
    },
    {
      word: "OBITO",
      hint: "Ninja que se passa por Madara após a morte de Rin",
      difficulty: "Difícil",
    },
    {
      word: "BOROS",
      hint: "Alienígena que busca um oponente digno de Saitama",
      difficulty: "Difícil",
    },
    {
      word: "SHIGARAKI",
      hint: "Vilão que busca destruir a sociedade dos heróis",
      difficulty: "Difícil",
    },
    {
      word: "MUICHIRO",
      hint: "Pilar da Névoa que perdeu a memória",
      difficulty: "Difícil",
    },
    {
      word: "ZACKE",
      hint: "Titã Bestial que lidera o ataque a Shiganshina",
      difficulty: "Difícil",
    },
    {
      word: "DOFLAMINGO",
      hint: "Ex-nobre celestial que controla Dressrosa",
      difficulty: "Difícil",
    },
    {
      word: "ENDEAVOR",
      hint: "Herói número dois que busca superar All Might",
      difficulty: "Difícil",
    },
  ];
};

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
// Remover a constante MAX_ERRORS = 5 e substituir por uma função
export const getMaxErrors = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case "Fácil":
      return 8;
    case "Médio":
      return 6;
    case "Difícil":
      return 4;
    default:
      return 6; // Médio como padrão
  }
};

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
  usedQuestions: string[];
  setUsedQuestions: React.Dispatch<React.SetStateAction<string[]>>;
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
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);

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
    root.classList.remove("dark", "neon", "retro", "gartic");

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
        // Tema padrão, adicionar gartic como padrão
        root.classList.add("gartic");
        break;
    }
  };

  // Efeito para aplicar o tema quando ele mudar
  useEffect(() => {
    applyTheme();
  }, [visualTheme]);

  // Obter uma pergunta aleatória com base na dificuldade
  const getRandomQuestion = (): GameQuestion => {
    // Filtrar perguntas da dificuldade atual que ainda não foram usadas
    let filteredQuestions = questions.filter(
      (q) => q.difficulty === difficulty && !usedQuestions.includes(q.word)
    );

    // Se todas as perguntas dessa dificuldade já foram usadas
    if (filteredQuestions.length === 0) {
      // Filtrar todas as perguntas da dificuldade atual
      const allQuestionsOfDifficulty = questions.filter(
        (q) => q.difficulty === difficulty
      );

      // Se houver apenas uma pergunta dessa dificuldade, retornar ela
      if (allQuestionsOfDifficulty.length === 1) {
        return allQuestionsOfDifficulty[0];
      }

      // Remover a última pergunta usada para evitar repetição imediata
      const lastUsedQuestion = usedQuestions[usedQuestions.length - 1];
      filteredQuestions = allQuestionsOfDifficulty.filter(
        (q) => q.word !== lastUsedQuestion
      );

      // Se ainda não houver perguntas disponíveis, resetar completamente
      if (filteredQuestions.length === 0) {
        setUsedQuestions([]);
        filteredQuestions = allQuestionsOfDifficulty;
      }
    }

    // Selecionar uma pergunta aleatória
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const question = filteredQuestions[randomIndex];

    // Adicionar a palavra à lista de perguntas usadas
    setUsedQuestions((prev) => [...prev, question.word]);

    // Limpar a palavra para remover possíveis caracteres de nova linha
    return {
      ...question,
      word: question.word.trim(),
    };
  };

  // Obter o número de erros do jogador atual
  const getCurrentPlayerErrors = () => {
    // Verificar se o índice é válido e se o jogador existe
    if (
      currentPlayerIndex >= 0 &&
      currentPlayerIndex < players.length &&
      players[currentPlayerIndex]
    ) {
      return players[currentPlayerIndex].errors;
    }
    return 0; // Retornar 0 como valor padrão se o jogador não existir
  };

  // Verificar se o jogador ganhou
  const checkWin = (): boolean => {
    if (!currentQuestion) return false;

    return currentQuestion.word
      .split("")
      .every(
        (letter) =>
          letter === " " || guessedLetters.includes(letter.toUpperCase())
      );
  };

  // Modificar a função makeGuess para retirar apenas 1 ponto ao errar uma letra
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

      // Verificar se o jogador atingiu a pontuação para vitória
      if (updatedPlayers[currentPlayerIndex].score >= pointsToWin) {
        setPlayers(updatedPlayers);
        setGameOver(true);
        return;
      }

      setPlayers(updatedPlayers);

      // Verificar se ganhou a rodada
      // Modificado para ignorar espaços na verificação de vitória
      if (
        currentQuestion.word
          .split("")
          .every((l) => l === " " || guessedLetters.includes(l) || l === letter)
      ) {
        // Adicionar pontos bônus por completar a palavra
        updatedPlayers[currentPlayerIndex].score += 10;

        // Verificar novamente se o jogador atingiu a pontuação para vitória após o bônus
        if (updatedPlayers[currentPlayerIndex].score >= pointsToWin) {
          setPlayers(updatedPlayers);
          setGameOver(true);
          return;
        }

        setPlayers(updatedPlayers);

        // Mostrar modal de sucesso
        setShowSuccessModal(true);
      }

      // Se o modo for "Contínuo", o jogador continua
      // Se for "Padrão" ou "Fixo", depende da lógica abaixo
    } else {
      setWrongLetters([...wrongLetters, letter]);

      // Subtrair pontos por erro - ALTERADO PARA -1 PONTO
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score = Math.max(
        0,
        updatedPlayers[currentPlayerIndex].score - 1
      );

      // Incrementar o contador de erros do jogador atual
      updatedPlayers[currentPlayerIndex].errors += 1;
      setPlayers(updatedPlayers);

      // Verificar se o jogador atingiu o número máximo de erros baseado na dificuldade
      const maxErrors =
        difficulty === "Fácil" ? 8 : difficulty === "Médio" ? 6 : 4;
      if (updatedPlayers[currentPlayerIndex].errors >= maxErrors) {
        setGameOver(true);
        return;
      }

      // No modo padrão, passa para o próximo jogador ao errar
      if (gameMode === "Padrão (Erro = Próximo Jogador)") {
        nextPlayer();
      }
    }
  };

  // Modificar a função guessWord para não encerrar o jogo ao errar, apenas retirar 50 pontos e passar para o próximo jogador
  const guessWord = (word: string) => {
    if (currentQuestion && word.toUpperCase() === currentQuestion.word) {
      // Acertou a palavra completa
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score += 10; // Bônus por acertar a palavra completa

      // Verificar se o jogador atingiu a pontuação para vitória
      if (updatedPlayers[currentPlayerIndex].score >= pointsToWin) {
        setPlayers(updatedPlayers);
        setGameOver(true);
        return;
      }

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

      // Verificar se o jogador atingiu o número máximo de erros baseado na dificuldade
      const maxErrors =
        difficulty === "Fácil" ? 8 : difficulty === "Médio" ? 6 : 4;
      if (updatedPlayers[currentPlayerIndex].errors >= maxErrors) {
        setGameOver(true);
        return;
      }

      // Passa para o próximo jogador
      nextPlayer();
    }
  };

  // Atualizar a função resetGame para considerar a dificuldade
  const resetGame = () => {
    setCurrentQuestion(getRandomQuestion());
    setGuessedLetters([]);
    setWrongLetters([]);
    setTimeLeft(60);
    setGameOver(false);
    setUsedQuestions([]); // Limpar perguntas usadas ao reiniciar

    // Resetar apenas os erros, mantendo os pontos
    setPlayers(players.map((player) => ({ ...player, errors: 0 })));
  };

  // Modificar a função startNewRound para verificar vitória por pontuação após cada rodada
  const startNewRound = () => {
    // Verificar se algum jogador atingiu a pontuação para vitória
    const winner = players.find((player) => player.score >= pointsToWin);
    if (winner) {
      setGameOver(true);
      return;
    }

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
    usedQuestions,
    setUsedQuestions,
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
