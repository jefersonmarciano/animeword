"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { Difficulty, GameMode, Theme } from "@/context/game-context";

// Função para gerar um UUID válido para o Supabase
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Tipos
export type Player = {
  id: number;
  name: string;
  avatar: string;
  score: number;
  errors: number;
  userId: string;
};

export type GameQuestion = {
  word: string;
  hint: string;
  difficulty: Difficulty;
};

export type PlayerAction = {
  playerId: string;
  playerName: string;
  action: "guess_letter" | "guess_word";
  content: string;
  timestamp: string;
  isCorrect: boolean;
};

// Interface para o contexto
interface OnlineGameContextType {
  roomId: string;
  players: Player[];
  currentPlayerIndex: number;
  currentQuestion: GameQuestion | null;
  guessedLetters: string[];
  wrongLetters: string[];
  timeLeft: number;
  gameOver: boolean;
  isHost: boolean;
  makeGuess: (letter: string) => Promise<void>;
  guessWord: (word: string) => Promise<void>;
  startGame: () => Promise<void>;
  leaveRoom: () => Promise<void>;
  getCurrentPlayerErrors: () => number;
  isMyTurn: () => boolean;
  getLastPlayerAction: () => PlayerAction | null;
  playerActions: PlayerAction[];
}

const OnlineGameContext = createContext<OnlineGameContextType | undefined>(
  undefined
);

export function OnlineGameProvider({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: string;
}) {
  const { user } = useAuth();
  const [room, setRoom] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(
    null
  );
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameState, setGameState] = useState<any>(null);
  const [isHost, setIsHost] = useState(false);
  const [playerActions, setPlayerActions] = useState<PlayerAction[]>([]);

  // Carregar dados da sala e configurar inscrições em tempo real
  useEffect(() => {
    if (!roomId || !user) return;

    const setupRoom = async () => {
      // Buscar dados da sala
      const { data: roomData } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

      if (roomData) {
        setRoom(roomData);
        setCurrentPlayerIndex(roomData.current_player_index || 0);
      }

      // Buscar jogadores
      const { data: playersData } = await supabase
        .from("room_players")
        .select("*")
        .eq("room_id", roomId)
        .order("joined_at", { ascending: true });

      if (playersData) {
        setPlayers(
          playersData.map((p: any) => ({
            id: p.id,
            name: p.name,
            avatar: p.avatar,
            score: p.score || 0,
            errors: p.errors || 0,
            userId: p.user_id, // Adicionar ID do usuário para verificar de quem é a vez
          }))
        );

        // Definir o host como o primeiro jogador que entrou na sala (índice 0)
        if (playersData.length > 0) {
          // Verificar se o usuário atual é o primeiro jogador (anfitrião)
          console.log("Verificando anfitrião:", {
            primeiroJogador: playersData[0].user_id,
            usuarioAtual: user.id,
            isHost: playersData[0].user_id === user.id,
          });
          setIsHost(playersData[0].user_id === user.id);
        }
      }

      // Buscar estado do jogo
      const { data: stateData } = await supabase
        .from("game_state")
        .select("*")
        .eq("room_id", roomId)
        .single();

      if (stateData) {
        setGameState(stateData);
        setGuessedLetters(stateData.guessed_letters || []);
        setWrongLetters(stateData.wrong_letters || []);
        setTimeLeft(stateData.time_left || 60);
        setGameOver(stateData.game_over || false);
        setCurrentQuestion(stateData.shared_question || null);

        if (stateData.last_player_action) {
          setPlayerActions((oldActions) => {
            // Evitar duplicações
            if (
              !oldActions.some(
                (a) =>
                  a.timestamp === stateData.last_player_action.timestamp &&
                  a.playerId === stateData.last_player_action.playerId
              )
            ) {
              return [...oldActions, stateData.last_player_action];
            }
            return oldActions;
          });
        }
      }
    };

    setupRoom();

    // Inscrever-se para mudanças na sala
    const roomSubscription = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const newRoom = payload.new as any;
          setRoom(newRoom);
          setCurrentPlayerIndex(newRoom.current_player_index || 0);
        }
      )
      .subscribe();

    // Inscrever-se para mudanças nos jogadores
    const playersSubscription = supabase
      .channel(`room-players-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_players",
          filter: `room_id=eq.${roomId}`,
        },
        async () => {
          // Recarregar jogadores
          const { data } = await supabase
            .from("room_players")
            .select("*")
            .eq("room_id", roomId)
            .order("joined_at", { ascending: true });

          if (data) {
            setPlayers(
              data.map((p: any) => ({
                id: p.id,
                name: p.name,
                avatar: p.avatar,
                score: p.score || 0,
                errors: p.errors || 0,
                userId: p.user_id,
              }))
            );
          }
        }
      )
      .subscribe();

    // Inscrever-se para mudanças no estado do jogo
    const gameStateSubscription = supabase
      .channel(`game-state-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_state",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newState = payload.new as any;
          setGameState(newState);
          setGuessedLetters(newState.guessed_letters || []);
          setWrongLetters(newState.wrong_letters || []);
          setTimeLeft(newState.time_left || 60);
          setGameOver(newState.game_over || false);

          // Atualizar pergunta compartilhada
          if (newState.shared_question) {
            setCurrentQuestion(newState.shared_question);
          }

          // Adicionar nova ação de jogador se existir
          if (newState.last_player_action) {
            setPlayerActions((oldActions) => {
              // Evitar duplicações
              if (
                !oldActions.some(
                  (a) =>
                    a.timestamp === newState.last_player_action.timestamp &&
                    a.playerId === newState.last_player_action.playerId
                )
              ) {
                return [...oldActions, newState.last_player_action];
              }
              return oldActions;
            });
          }
        }
      )
      .subscribe();

    return () => {
      roomSubscription.unsubscribe();
      playersSubscription.unsubscribe();
      gameStateSubscription.unsubscribe();
    };
  }, [roomId, user]);

  // Efeito para atualizar o status de anfitrião sempre que a lista de jogadores mudar
  useEffect(() => {
    if (players.length > 0 && user) {
      // O primeiro jogador é sempre o anfitrião
      const hostId = players[0].userId;
      const isUserHost = hostId === user.id;

      console.log("Atualizando status de anfitrião:", {
        primeiroJogador: hostId,
        usuarioAtual: user.id,
        isHost: isUserHost,
      });

      setIsHost(isUserHost);
    }
  }, [players, user]);

  // Obter a última ação de jogador
  const getLastPlayerAction = (): PlayerAction | null => {
    if (playerActions.length === 0) return null;
    return playerActions[playerActions.length - 1];
  };

  // Verificar se é a vez do jogador atual
  const isMyTurn = () => {
    if (!user || !players || !players[currentPlayerIndex]) {
      console.log("isMyTurn: não há usuário ou jogadores");
      return false;
    }

    const currentPlayerId = players[currentPlayerIndex].userId;
    const myId = user.id;

    console.log("isMyTurn:", {
      currentPlayerIndex,
      currentPlayerId,
      myId,
      isMyTurn: currentPlayerId === myId,
    });

    return currentPlayerId === myId;
  };

  // Fazer um palpite de letra
  const makeGuess = async (letter: string) => {
    if (!roomId || !user || !currentQuestion) return;

    // Verificar se é a vez do jogador atual
    if (!isMyTurn()) {
      console.log("Não é a sua vez de jogar!");
      return;
    }

    // Verificar se a letra já foi adivinhada
    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) {
      console.log("Letra já foi tentada:", letter);
      return;
    }

    console.log("Tentando letra:", letter);

    // Verificar se é um acerto ou erro
    const isCorrect = currentQuestion.word.toUpperCase().includes(letter);
    console.log("É acerto?", isCorrect);

    // Criar nova ação de jogador
    const newAction: PlayerAction = {
      playerId: user.id,
      playerName: user.nickname,
      action: "guess_letter",
      content: letter,
      timestamp: new Date().toISOString(),
      isCorrect,
    };

    try {
      if (isCorrect) {
        // Acertou a letra
        const newGuessedLetters = [...guessedLetters, letter];

        // Atualizar estado do jogo
        await supabase
          .from("game_state")
          .update({
            guessed_letters: newGuessedLetters,
            last_player_action: newAction,
          })
          .eq("room_id", roomId);

        // Adicionar pontos ao jogador atual
        const currentPlayer = players[currentPlayerIndex];
        const occurrences = currentQuestion.word
          .toUpperCase()
          .split("")
          .filter((l) => l === letter).length;

        await supabase
          .from("room_players")
          .update({ score: (currentPlayer.score || 0) + occurrences })
          .eq("id", currentPlayer.id);

        // Verificar se ganhou a rodada
        const allLettersGuessed = currentQuestion.word
          .toUpperCase()
          .split("")
          .every((l) => l === " " || newGuessedLetters.includes(l));

        if (allLettersGuessed) {
          console.log(
            "Todas as letras foram adivinhadas! Iniciando nova rodada..."
          );
          // Ganhou a rodada
          // Iniciar nova rodada após um breve atraso
          setTimeout(() => {
            startNewRound();
          }, 1500);
        } else {
          // Mesmo acertando, passa para o próximo jogador
          console.log("Acertou a letra, mas passando para o próximo jogador");
          await nextPlayer();
        }
      } else {
        // Errou a letra
        const newWrongLetters = [...wrongLetters, letter];

        // Atualizar estado do jogo
        await supabase
          .from("game_state")
          .update({
            wrong_letters: newWrongLetters,
            last_player_action: newAction,
          })
          .eq("room_id", roomId);

        // Adicionar erro ao jogador atual
        const currentPlayer = players[currentPlayerIndex];

        await supabase
          .from("room_players")
          .update({ errors: (currentPlayer.errors || 0) + 1 })
          .eq("id", currentPlayer.id);

        console.log("Errou a letra, passando para o próximo jogador");
        // Sempre passar para o próximo jogador ao errar
        await nextPlayer();
      }
    } catch (error) {
      console.error("Erro ao processar palpite:", error);
    }
  };

  // Passar para o próximo jogador
  const nextPlayer = async () => {
    try {
      if (!players || players.length === 0) {
        console.error("Não há jogadores para passar a vez");
        return;
      }

      const nextIndex = (currentPlayerIndex + 1) % players.length;
      console.log("Passando para o próximo jogador:", {
        currentIndex: currentPlayerIndex,
        nextIndex,
        currentPlayerId: players[currentPlayerIndex]?.userId,
        nextPlayerId: players[nextIndex]?.userId,
      });

      const { error } = await supabase
        .from("rooms")
        .update({ current_player_index: nextIndex })
        .eq("id", roomId);

      if (error) {
        console.error("Erro ao atualizar índice do jogador:", error);
        return;
      }

      setCurrentPlayerIndex(nextIndex);
      console.log("Jogador atual atualizado para índice:", nextIndex);
    } catch (error) {
      console.error("Erro ao passar para o próximo jogador:", error);
    }
  };

  // Adivinhar a palavra completa
  const guessWord = async (word: string) => {
    if (!roomId || !user || !currentQuestion) return;

    // Verificar se é a vez do jogador atual
    if (!isMyTurn()) {
      console.log("Não é sua vez de adivinhar a palavra");
      return;
    }

    console.log("Tentando adivinhar a palavra:", word);
    const normalizedGuess = word.trim().toUpperCase();
    const normalizedAnswer = currentQuestion.word.trim().toUpperCase();
    const isCorrect = normalizedGuess === normalizedAnswer;
    console.log("É acerto?", isCorrect);

    // Criar nova ação de jogador
    const newAction: PlayerAction = {
      playerId: user.id,
      playerName: user.nickname,
      action: "guess_word",
      content: word,
      timestamp: new Date().toISOString(),
      isCorrect,
    };

    try {
      if (isCorrect) {
        // Adicionar pontos ao jogador atual
        const currentPlayer = players[currentPlayerIndex];
        const points = 10; // Pontos extras por adivinhar a palavra completa

        await supabase
          .from("room_players")
          .update({ score: (currentPlayer.score || 0) + points })
          .eq("id", currentPlayer.id);

        // Revelar todas as letras
        const allLetters = [
          ...new Set(currentQuestion.word.toUpperCase().split("")),
        ].filter((l) => l !== " ");

        await supabase
          .from("game_state")
          .update({
            guessed_letters: allLetters,
            last_player_action: newAction,
          })
          .eq("room_id", roomId);

        console.log(
          "Palavra adivinhada corretamente! Iniciando nova rodada..."
        );
        // Iniciar nova rodada após um breve atraso
        setTimeout(() => {
          startNewRound();
        }, 1500);
      } else {
        // Errou a palavra
        const currentPlayer = players[currentPlayerIndex];

        await supabase
          .from("room_players")
          .update({ errors: (currentPlayer.errors || 0) + 1 })
          .eq("id", currentPlayer.id);

        await supabase
          .from("game_state")
          .update({ last_player_action: newAction })
          .eq("room_id", roomId);

        console.log("Errou a palavra, passando para o próximo jogador");
        // Passar para o próximo jogador
        await nextPlayer();
      }
    } catch (error) {
      console.error("Erro ao processar palpite de palavra:", error);
    }
  };

  // Iniciar nova rodada com uma nova pergunta
  const startNewRound = async () => {
    if (!roomId || !user) return;

    try {
      // Definir as perguntas disponíveis
      const questions = [
        {
          word: "NARUTO",
          hint: "Anime sobre um ninja loiro com uma raposa de nove caudas",
          difficulty: "Fácil" as Difficulty,
        },
        {
          word: "ONE PIECE",
          hint: "Anime sobre piratas em busca do maior tesouro do mundo",
          difficulty: "Fácil" as Difficulty,
        },
        {
          word: "ATTACK ON TITAN",
          hint: "Humanidade ameaçada por gigantes",
          difficulty: "Médio" as Difficulty,
        },
        {
          word: "DEMON SLAYER",
          hint: "Caçador de demônios com irmã transformada",
          difficulty: "Médio" as Difficulty,
        },
        {
          word: "DRAGON BALL",
          hint: "Anime com esferas que realizam desejos",
          difficulty: "Fácil" as Difficulty,
        },
        {
          word: "HAIKYUU",
          hint: "Anime sobre vôlei com um protagonista baixinho",
          difficulty: "Médio" as Difficulty,
        },
        {
          word: "JUJUTSU KAISEN",
          hint: "Anime sobre exorcistas que lutam contra maldições",
          difficulty: "Difícil" as Difficulty,
        },
      ];

      // Selecionar uma pergunta aleatória
      const randomIndex = Math.floor(Math.random() * questions.length);
      const newQuestion = questions[randomIndex];

      // Limpar letras adivinhadas e erradas
      const { error: updateError } = await supabase
        .from("game_state")
        .update({
          guessed_letters: [],
          wrong_letters: [],
          shared_question: newQuestion,
          time_left: 60,
        })
        .eq("room_id", roomId);

      if (updateError) throw updateError;

      // Resetar os erros dos jogadores
      for (const player of players) {
        const { error: playerError } = await supabase
          .from("room_players")
          .update({ errors: 0 })
          .eq("id", player.id);

        if (playerError) console.error("Erro ao resetar erros:", playerError);
      }
    } catch (error) {
      console.error("Erro ao iniciar nova rodada:", error);
      throw error;
    }
  };

  // Iniciar o jogo
  const startGame = async () => {
    if (!roomId || !user) return;

    try {
      // Primeiro, verificar e garantir que temos as permissões necessárias
      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .select("host_id, id")
        .eq("id", roomId)
        .single();

      if (roomError) {
        console.error("Erro ao verificar sala:", roomError);
        throw new Error(`Erro ao verificar sala: ${roomError.message}`);
      }

      // Verificar se game_state já existe para esta sala
      const { data: existingState, error: checkError } = await supabase
        .from("game_state")
        .select("id")
        .eq("room_id", roomId);

      if (checkError) {
        console.error("Erro ao verificar game_state:", checkError);

        // Se o erro for que a tabela não existe, vamos tentar criá-la
        if (checkError.message.includes("does not exist")) {
          console.log("Tabela game_state não existe, tentando criar...");

          // Aqui você deve alertar o administrador para executar o script SQL
          throw new Error(
            "A tabela game_state não existe. Por favor, execute o script SQL para criar a tabela."
          );
        }

        throw new Error(`Erro ao verificar game_state: ${checkError.message}`);
      }

      // Se não existir ou estiver vazio, criar um novo
      if (!existingState || existingState.length === 0) {
        console.log("Criando novo game_state para a sala:", roomId);

        // Criar estado inicial do jogo
        const { data: insertData, error: insertError } = await supabase
          .from("game_state")
          .insert({
            room_id: roomId,
            guessed_letters: [],
            wrong_letters: [],
            time_left: 60,
            game_over: false,
          })
          .select();

        if (insertError) {
          console.error("Erro ao criar game_state:", insertError);

          // Se o erro for uma violação de política RLS, mostrar mensagem específica
          if (
            insertError.code === "42501" ||
            insertError.message.includes("new row violates row-level")
          ) {
            throw new Error(
              "Erro de permissão ao criar game_state. Verifique as políticas de segurança do Supabase."
            );
          }

          throw new Error(`Erro ao criar game_state: ${insertError.message}`);
        }

        console.log("game_state criado com sucesso:", insertData);
      }

      // Atualizar status da sala
      const { error: updateError } = await supabase
        .from("rooms")
        .update({
          status: "playing",
          game_status: "active",
          current_player_index: 0,
        })
        .eq("id", roomId);

      if (updateError) {
        console.error("Erro ao atualizar status da sala:", updateError);
        throw new Error(
          `Erro ao atualizar status da sala: ${updateError.message}`
        );
      }

      // Iniciar primeira rodada
      await startNewRound();
    } catch (error) {
      console.error("Erro ao iniciar o jogo:", error);
      throw error;
    }
  };

  // Sair da sala
  const leaveRoom = async () => {
    if (!roomId || !user) return;

    try {
      // Remover jogador da sala
      await supabase
        .from("room_players")
        .delete()
        .eq("room_id", roomId)
        .eq("user_id", user.id);

      // Se for o host, encerrar a sala
      if (isHost) {
        await supabase
          .from("rooms")
          .update({ status: "closed" })
          .eq("id", roomId);
      }

      // Redirecionar para página inicial
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao sair da sala:", error);
    }
  };

  // Obter o número de erros do jogador atual
  const getCurrentPlayerErrors = () => {
    if (!players || !players[currentPlayerIndex]) return 0;
    return players[currentPlayerIndex].errors || 0;
  };

  const value = {
    roomId,
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
    startGame,
    leaveRoom,
    getCurrentPlayerErrors,
    isMyTurn,
    getLastPlayerAction,
    playerActions,
  };

  return (
    <OnlineGameContext.Provider value={value}>
      {children}
    </OnlineGameContext.Provider>
  );
}

export function useOnlineGame() {
  const context = useContext(OnlineGameContext);
  if (context === undefined) {
    throw new Error("useOnlineGame must be used within an OnlineGameProvider");
  }
  return context;
}
