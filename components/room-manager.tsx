"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

// Função para gerar um UUID v4 simples
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function RoomManager({
  onJoinRoom,
}: {
  onJoinRoom: (roomId: string) => void;
}) {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se o usuário tem um ID válido
  useEffect(() => {
    if (
      user &&
      !user.id.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      )
    ) {
      console.error("ID de usuário inválido detectado:", user.id);
      setError("ID de usuário inválido. Fazendo logout para corrigir...");

      // Esperar um pouco para mostrar a mensagem e fazer logout
      setTimeout(() => {
        logout();
        // Recarregar a página para garantir estado limpo
        window.location.reload();
      }, 2000);
    }
  }, [user, logout]);

  // Carregar salas disponíveis
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Buscar salas com informações do host
        const { data, error } = await supabase
          .from("rooms")
          .select("*, room_players(user_id, name)")
          .eq("status", "waiting");

        if (error) {
          console.error("Erro ao buscar salas:", error);
          setError("Erro ao carregar salas. Por favor, tente novamente.");
          return;
        }

        // Processar os dados para incluir informações sobre quem é o host
        const processedRooms = data?.map((room) => {
          // Para cada sala, verificar quem é o primeiro jogador (host)
          let hostPlayer = null;

          try {
            hostPlayer =
              Array.isArray(room.room_players) && room.room_players.length > 0
                ? room.room_players[0]
                : null;
          } catch (e) {
            console.error("Erro ao processar room_players:", e, room);
          }

          return {
            ...room,
            host_id: hostPlayer?.user_id || room.host_id,
            host_name: hostPlayer?.name || "Desconhecido",
            // Verificar se o usuário atual é o dono da sala
            isOwner: hostPlayer?.user_id === user?.id,
          };
        });

        console.log("Salas carregadas:", processedRooms);
        setRooms(processedRooms || []);
        setError(null);
      } catch (e) {
        console.error("Exceção ao buscar salas:", e);
        setError("Erro ao carregar salas. Por favor, tente novamente.");
      }
    };

    fetchRooms();

    // Configurar inscrição em tempo real para atualizações de salas
    const roomsSubscription = supabase
      .channel("public:rooms")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
        },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    // Configurar inscrição em tempo real para atualizações de jogadores nas salas
    const playersSubscription = supabase
      .channel("public:room_players")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_players",
        },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      roomsSubscription.unsubscribe();
      playersSubscription.unsubscribe();
    };
  }, [user?.id]);

  // Criar nova sala - simplificado
  const createRoom = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Criar a sala
      const roomName = newRoomName || `Sala de ${user.nickname}`;
      console.log("Criando sala:", { roomName, userId: user.id });

      // Verificar se o ID do usuário é um UUID válido
      if (
        !user.id.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        )
      ) {
        console.error("ID de usuário inválido:", user.id);
        throw new Error(
          "ID de usuário inválido. Por favor, faça logout e login novamente."
        );
      }

      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .insert({
          host_id: user.id,
          name: roomName,
          status: "waiting",
        })
        .select()
        .single();

      if (roomError) {
        console.error("Erro ao criar sala:", roomError);

        // Verificar o tipo específico de erro
        if (
          roomError.code === "22P02" ||
          roomError.message.includes("invalid input syntax")
        ) {
          throw new Error(
            "Formato de ID inválido. Por favor, faça logout e login novamente."
          );
        }

        throw roomError;
      }

      if (!roomData) {
        throw new Error("Nenhum dado retornado ao criar sala");
      }

      console.log("Sala criada com sucesso:", roomData);

      // Adicionar o jogador à sala em uma chamada separada
      await addPlayerToRoom(roomData.id, user.nickname);

      // Entrar na sala
      onJoinRoom(roomData.id);
    } catch (error: any) {
      console.error("Erro ao criar sala:", error);
      setError(
        error.message || "Erro ao criar sala. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
      setShowCreateModal(false);
    }
  };

  // Função para adicionar jogador a uma sala
  const addPlayerToRoom = async (roomId: string, nickname: string) => {
    try {
      if (!user || !user.id) {
        throw new Error("Usuário não autenticado");
      }

      // Verificar se o ID do usuário é um UUID válido
      if (
        !user.id.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        )
      ) {
        console.error("ID de usuário inválido ao adicionar jogador:", user.id);
        throw new Error(
          "ID de usuário inválido. Por favor, faça logout e login novamente."
        );
      }

      console.log("Adicionando jogador à sala:", {
        roomId,
        userId: user.id,
        nickname: user.nickname,
      });

      // Verificar se o jogador já está na sala
      const { data: existingPlayer, error: checkError } = await supabase
        .from("room_players")
        .select("id")
        .eq("room_id", roomId)
        .eq("user_id", user.id);

      if (checkError) {
        console.error("Erro ao verificar jogador na sala:", checkError);

        // Verificar o tipo específico de erro
        if (
          checkError.code === "22P02" ||
          checkError.message.includes("invalid input syntax")
        ) {
          throw new Error(
            "Formato de ID inválido. Por favor, faça logout e login novamente."
          );
        }

        throw checkError;
      }

      // Se o jogador não estiver na sala, adicione-o
      if (!existingPlayer || existingPlayer.length === 0) {
        const { data, error: insertError } = await supabase
          .from("room_players")
          .insert({
            room_id: roomId,
            user_id: user.id,
            name: user.nickname,
            avatar: "/images/avatars/devFront.png", // Avatar padrão
          })
          .select();

        if (insertError) {
          console.error("Erro ao inserir jogador na sala:", insertError);

          // Verificar o tipo específico de erro
          if (
            insertError.code === "22P02" ||
            insertError.message.includes("invalid input syntax")
          ) {
            throw new Error(
              "Formato de ID inválido. Por favor, faça logout e login novamente."
            );
          }

          throw insertError;
        }

        console.log("Jogador adicionado com sucesso:", data);
      } else {
        console.log("Jogador já está na sala:", existingPlayer);
      }

      return true;
    } catch (error) {
      console.error("Erro ao adicionar jogador à sala:", error);
      throw error;
    }
  };

  // Deletar uma sala
  const deleteRoom = async (roomId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Primeiro excluir todos os jogadores da sala
      await supabase.from("room_players").delete().eq("room_id", roomId);

      // Depois excluir o estado do jogo associado à sala, se existir
      await supabase.from("game_state").delete().eq("room_id", roomId);

      // Por fim, excluir a sala
      await supabase.from("rooms").delete().eq("id", roomId);

      // Atualizar a lista de salas localmente para feedback imediato
      setRooms(rooms.filter((room) => room.id !== roomId));
    } catch (error: any) {
      console.error("Erro ao excluir sala:", error);
      setError(
        error.message || "Erro ao excluir sala. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Entrar em uma sala existente
  const joinRoom = async (roomId: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Adicionar o jogador à sala
      await addPlayerToRoom(roomId, user.nickname);

      // Entrar na sala
      onJoinRoom(roomId);
    } catch (error: any) {
      console.error("Erro ao entrar na sala:", error);
      setError(
        error.message || "Erro ao entrar na sala. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gartic-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="gartic-title">Salas Disponíveis</h2>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="gartic-button-primary"
        >
          Criar Nova Sala
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {rooms.length === 0 ? (
        <div className="text-center p-4">
          <p className="text-white/70">Nenhuma sala disponível no momento.</p>
          <p className="text-white/70 mt-2">
            Crie uma sala para começar a jogar!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="gartic-card-highlight p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold text-white">{room.name}</h3>
                <p className="text-sm text-white/70">
                  Criado por: {room.host_name || "Anônimo"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => deleteRoom(room.id)}
                  className="gartic-button-secondary"
                  variant="outline"
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => joinRoom(room.id)}
                  className="gartic-button"
                  disabled={loading}
                >
                  Entrar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para criar sala */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="gartic-title">Criar Nova Sala</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-4">
            <div>
              <label className="block text-white mb-2">Nome da Sala:</label>
              <Input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="gartic-input"
                placeholder={`Sala de ${user?.nickname}`}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={createRoom}
                className="gartic-button-primary"
                disabled={loading}
              >
                {loading ? "Criando..." : "Criar Sala"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
