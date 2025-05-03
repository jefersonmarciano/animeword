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

// Banco de perguntas - Vamos ofuscar isso para não ficar facilmente visível no inspetor
// Usando uma função para gerar as perguntas em tempo de execução
const getGameQuestions = (): GameQuestion[] => {
  // Perguntas originais
  const originalQuestions = [
    // Fácil
    {
      word: atob("TkFSVVRPCg==").trim(),
      hint: "Anime sobre um ninja loiro com uma raposa de nove caudas",
      difficulty: "Fácil",
    },
    {
      word: atob("RE9SQUVNT04K").trim(),
      hint: "Gato robô azul do futuro com bolso mágico",
      difficulty: "Fácil",
    },
    {
      word: atob("T05FIFBJRUNFCg==").trim(),
      hint: "Anime sobre piratas em busca do maior tesouro do mundo",
      difficulty: "Fácil",
    },
    {
      word: atob("QVRBUVVFIERPU1MgVElUw4NT").trim(),
      hint: "Humanidade ameaçada por gigantes",
      difficulty: "Fácil",
    },
    {
      word: atob("REVBVEggTk9URQ==").trim(),
      hint: "Caderno que mata quem tem o nome escrito nele",
      difficulty: "Fácil",
    },
    {
      word: atob("RFJBRyBCQUxMCg==").trim(),
      hint: "Anime com esferas que realizam desejos",
      difficulty: "Fácil",
    },
    {
      word: atob("VE9LWU8gR0hPVUw=").trim(),
      hint: "Humanos que comem carne humana",
      difficulty: "Fácil",
    },
    {
      word: atob("RlVMTCBNRVRBTA==").trim(),
      hint: "Irmãos alquimistas em busca da pedra filosofal",
      difficulty: "Fácil",
    },

    // Médio
    {
      word: atob("QkxFQUNICg==").trim(),
      hint: "Anime sobre shinigamis e espadas zanpakutou",
      difficulty: "Médio",
    },
    {
      word: "DEMON SLAYER",
      hint: "Caçador de demônios com irmã transformada",
      difficulty: "Médio",
    },
    {
      word: atob("SEFJS1lVVQ==").trim(),
      hint: "Anime sobre vôlei com um protagonista baixinho",
      difficulty: "Médio",
    },
    {
      word: atob("TU9CIFBTWUNITw==").trim(),
      hint: "Garoto com poderes psíquicos tentando ser reconhecido",
      difficulty: "Médio",
    },
    {
      word: atob("Q09ERSBHRUFTUw==").trim(),
      hint: "Revolução contra império com mechas",
      difficulty: "Médio",
    },
    {
      word: atob("U1dPUkQgQVJUIE9OTElORQ==").trim(),
      hint: "Jogadores presos em um jogo de realidade virtual",
      difficulty: "Médio",
    },
    {
      word: atob("SEVMTFNJTkc=").trim(),
      hint: "Organização que caça vampiros e outros monstros",
      difficulty: "Médio",
    },
    {
      word: atob("Tk9SQUdBTUk=").trim(),
      hint: "Deus da calamidade e uma garota sem lar",
      difficulty: "Médio",
    },

    // Difícil
    {
      word: atob("U1RFSVlOUyBHQVRF").trim(),
      hint: "Cientista maluco que viaja no tempo com micro-ondas",
      difficulty: "Difícil",
    },
    {
      word: atob("TU9OT0dBVEFSSQ==").trim(),
      hint: "Série de anime com espíritos sobrenaturais e uma protagonista loira",
      difficulty: "Difícil",
    },
    {
      word: atob("UEFSQVNZVEU=").trim(),
      hint: "Alienígenas que se hospedam em humanos e comem suas cabeças",
      difficulty: "Difícil",
    },
    {
      word: atob("SlVKVVRTVSBLQUlTRU4=").trim(),
      hint: "Anime sobre exorcistas que lutam contra maldições",
      difficulty: "Difícil",
    },
    {
      word: atob("RUxBSU5F").trim(),
      hint: "Anime sobre uma garota afetada por experiências e seus múltiplos corpos",
      difficulty: "Difícil",
    },
    {
      word: atob("QUtJUkE=").trim(),
      hint: "Filme de anime cyberpunk sobre uma explosão em Neo-Tóquio",
      difficulty: "Difícil",
    },
    {
      word: atob("QkVSU0VSSw==").trim(),
      hint: "Manga sombrio sobre um guerreiro com uma espada gigante",
      difficulty: "Difícil",
    },
    {
      word: atob("UFNZQy1IT1BBCFM=").trim(),
      hint: "Detetive com sistema para medir criminalidade",
      difficulty: "Difícil",
    },
  ];

  // Novas perguntas do arquivo JSON
  const newQuestions: GameQuestion[] = [
    // Fácil
    {
      word: "GHIBLI",
      hint: "Estúdio famoso por filmes como A Viagem de Chihiro",
      difficulty: "Fácil",
    },
    {
      word: "MAPPA",
      hint: "Estúdio que animou Attack on Titan: The Final Season",
      difficulty: "Fácil",
    },
    {
      word: "TOEI",
      hint: "Estúdio responsável por Dragon Ball e One Piece",
      difficulty: "Fácil",
    },
    {
      word: "CRUNCHYROLL",
      hint: "Plataforma de streaming de animes",
      difficulty: "Fácil",
    },
    {
      word: "OTAKU",
      hint: "Termo usado para fãs de anime e mangá",
      difficulty: "Fácil",
    },
    {
      word: "MANGAKA",
      hint: "Pessoa que desenha e escreve mangás",
      difficulty: "Fácil",
    },
    {
      word: "WAIFU",
      hint: "Personagem feminina pela qual se tem afeição",
      difficulty: "Fácil",
    },
    {
      word: "SHONEN",
      hint: "Demografia de anime/mangá voltada para garotos adolescentes",
      difficulty: "Fácil",
    },
    {
      word: "ISEKAI",
      hint: "Gênero de anime onde personagem vai para outro mundo",
      difficulty: "Fácil",
    },
    {
      word: "SAKURA",
      hint: "Flor de cerejeira, comum em cenas de anime",
      difficulty: "Fácil",
    },

    // Médio
    {
      word: "MADHOUSE",
      hint: "Estúdio que produziu Death Note e Hunter x Hunter",
      difficulty: "Médio",
    },
    {
      word: "KYOTO ANIMATION",
      hint: "Estúdio famoso por suas animações fluidas e belas",
      difficulty: "Médio",
    },
    {
      word: "UFOTABLE",
      hint: "Estúdio conhecido por efeitos visuais incríveis em Demon Slayer",
      difficulty: "Médio",
    },
    {
      word: "SHOJO",
      hint: "Demografia de anime/mangá voltada para garotas adolescentes",
      difficulty: "Médio",
    },
    {
      word: "SEINEN",
      hint: "Demografia de anime/mangá voltada para homens adultos",
      difficulty: "Médio",
    },
    {
      word: "JOSEI",
      hint: "Demografia de anime/mangá voltada para mulheres adultas",
      difficulty: "Médio",
    },
    {
      word: "MECHA",
      hint: "Gênero de anime com robôs gigantes",
      difficulty: "Médio",
    },
    {
      word: "TSUNDERE",
      hint: "Arquétipo de personagem inicialmente hostil que se torna afetuoso",
      difficulty: "Médio",
    },
    {
      word: "ISEKAI",
      hint: "Gênero de anime onde o protagonista vai para outro mundo",
      difficulty: "Médio",
    },
    {
      word: "SLICE OF LIFE",
      hint: "Gênero que retrata a vida cotidiana dos personagens",
      difficulty: "Médio",
    },

    // Difícil
    {
      word: "GAINAX",
      hint: "Estúdio que criou Neon Genesis Evangelion",
      difficulty: "Difícil",
    },
    {
      word: "PRODUCTION IG",
      hint: "Estúdio que produziu Ghost in the Shell e Haikyuu",
      difficulty: "Difícil",
    },
    {
      word: "BONES",
      hint: "Estúdio responsável por Fullmetal Alchemist e My Hero Academia",
      difficulty: "Difícil",
    },
    {
      word: "YANDERE",
      hint: "Arquétipo de personagem que é violento por amor",
      difficulty: "Difícil",
    },
    {
      word: "KUUDERE",
      hint: "Arquétipo de personagem frio e sem emoções",
      difficulty: "Difícil",
    },
    {
      word: "NAKAMA",
      hint: "Palavra japonesa para amigos/companheiros, comum em animes",
      difficulty: "Difícil",
    },
    {
      word: "DOJINSHI",
      hint: "Mangás feitos por fãs baseados em obras originais",
      difficulty: "Difícil",
    },
    {
      word: "SEIYUU",
      hint: "Dublador de anime japonês",
      difficulty: "Difícil",
    },
    {
      word: "SAKUGA",
      hint: "Termo para sequências de animação excepcionalmente bem feitas",
      difficulty: "Difícil",
    },
    {
      word: "LIGHT NOVEL",
      hint: "Formato de romance japonês que serve de base para muitos animes",
      difficulty: "Difícil",
    },
  ];

  // Combinar as perguntas originais com as novas
  return [...originalQuestions, ...newQuestions] as GameQuestion[];
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
  // Adicionar estado para controlar perguntas já usadas
  const [usedQuestions, setUsedQuestions] = useState<GameQuestion[]>([]);
  // Adicionar estado para controlar se a nova rodada está sendo preparada
  const [isPreparingNewRound, setIsPreparingNewRound] = useState(false);

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

    // Remove all theme classes
    root.classList.remove("dark", "neon", "retro", "gartic");

    // Apply the selected theme
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
        // Default theme is gartic
        root.classList.add("gartic");
        break;
    }
  };

  // Make sure the theme is applied when it changes
  useEffect(() => {
    applyTheme();
  }, [visualTheme]);

  // Also apply theme on initial load
  useEffect(() => {
    applyTheme();
  }, []);

  // Modificar para não repetir perguntas no mesmo jogo
  const getRandomQuestion = (): GameQuestion => {
    const filteredQuestions = questions.filter(
      (q) =>
        // Filtrar por dificuldade
        q.difficulty === difficulty &&
        // Filtrar perguntas já usadas
        !usedQuestions.some((usedQ) => usedQ.word === q.word)
    );

    // Se não houver mais perguntas disponíveis, resetar usedQuestions e usar todas novamente
    if (filteredQuestions.length === 0) {
      setUsedQuestions([]);
      const resetFilteredQuestions = questions.filter(
        (q) => q.difficulty === difficulty
      ) as GameQuestion[];
      const randomIndex = Math.floor(
        Math.random() * resetFilteredQuestions.length
      );
      const question = resetFilteredQuestions[randomIndex];

      // Adicionar a pergunta escolhida à lista de usadas
      setUsedQuestions([question]);

      return {
        ...question,
        word: question.word.trim(),
      };
    }

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const question = filteredQuestions[randomIndex];

    // Adicionar a pergunta escolhida à lista de usadas
    setUsedQuestions((prev) => [...prev, question]);

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
      .every(
        (letter) =>
          letter === " " || guessedLetters.includes(letter.toUpperCase())
      );
  };

  // Modificar makeGuess para verificar se o jogador atingiu a pontuação para vitória
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
        setGameOver(true);
        setPlayers(updatedPlayers);
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
          setGameOver(true);
          setPlayers(updatedPlayers);
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

  // Modificar guessWord para verificar se o jogador atingiu a pontuação para vitória
  const guessWord = (word: string) => {
    if (currentQuestion && word.toUpperCase() === currentQuestion.word) {
      // Acertou a palavra completa
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score += 10; // Bônus por acertar a palavra completa

      // Verificar se o jogador atingiu a pontuação para vitória
      if (updatedPlayers[currentPlayerIndex].score >= pointsToWin) {
        setGameOver(true);
        setPlayers(updatedPlayers);
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

      // Verificar se o jogador atingiu o número máximo de erros
      if (updatedPlayers[currentPlayerIndex].errors >= MAX_ERRORS) {
        setGameOver(true);
        return;
      }

      // Passa para o próximo jogador
      nextPlayer();
    }
  };

  // Modificar função para iniciar nova rodada
  const startNewRound = () => {
    // Marcar que estamos preparando uma nova rodada
    setIsPreparingNewRound(true);

    // Primeiro fechamos o modal
    setShowSuccessModal(false);

    // Usamos um setTimeout com delay maior para garantir que
    // o modal seja completamente fechado antes de atualizar a questão
    setTimeout(() => {
      setCurrentQuestion(getRandomQuestion());
      setGuessedLetters([]);
      setWrongLetters([]);
      setTimeLeft(60);

      // Resetar os erros de todos os jogadores para a nova rodada
      const updatedPlayers = [...players];
      updatedPlayers.forEach((player) => {
        player.errors = 0;
      });
      setPlayers(updatedPlayers);

      // Desmarcar que terminamos de preparar a nova rodada
      setIsPreparingNewRound(false);
    }, 300); // Aumentar para 300ms para garantir que o modal esteja completamente fechado
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
    setUsedQuestions([]); // Limpar perguntas usadas quando o jogo reiniciar

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
