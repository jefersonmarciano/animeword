"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useRoom } from "@/context/room-context"
import { useAuth } from "@/context/auth-context"
import { PlusCircle, LogIn, Users } from "lucide-react"

export default function RoomSelection() {
  const { createRoom, joinRoom, publicRooms } = useRoom()
  const { user } = useAuth()
  const [isPublic, setIsPublic] = useState(true)
  const [roomCode, setRoomCode] = useState("")

  const handleCreateRoom = () => {
    if (!user) return
    createRoom(isPublic)
  }

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomCode.trim()) {
      joinRoom(roomCode.trim())
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Create Room */}
      <div className="gartic-card p-5">
        <h2 className="gartic-subtitle flex items-center gap-2 mb-4">
          <PlusCircle className="w-5 h-5" />
          CRIAR NOVA SALA
        </h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="public-room"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked as boolean)}
            />
            <label
              htmlFor="public-room"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Sala pública
            </label>
          </div>

          <Button onClick={handleCreateRoom} className="gartic-button-primary w-full">
            CRIAR SALA
          </Button>
        </div>
      </div>

      {/* Join Room */}
      <div className="gartic-card p-5">
        <h2 className="gartic-subtitle flex items-center gap-2 mb-4">
          <LogIn className="w-5 h-5" />
          ENTRAR EM UMA SALA
        </h2>

        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="room-code" className="block text-foreground">
              Código da sala:
            </label>
            <Input
              id="room-code"
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Digite o código da sala"
              className="gartic-input w-full"
            />
          </div>

          <Button type="submit" className="gartic-button-primary w-full">
            ENTRAR NA SALA
          </Button>
        </form>

        {/* Public Rooms */}
        <div className="mt-6">
          <h3 className="flex items-center gap-2 text-foreground font-medium mb-3">
            <Users className="w-4 h-4" /> Salas públicas disponíveis:
          </h3>

          <div className="space-y-2">
            {publicRooms.map((room) => (
              <div
                key={room.id}
                className="gartic-card-highlight p-3 flex justify-between items-center cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => joinRoom(room.id)}
              >
                <span className="font-medium">{room.name}</span>
                <span className="bg-primary/20 text-foreground px-2 py-1 rounded-full text-xs">
                  {room.players.length} jogadores
                </span>
              </div>
            ))}

            {publicRooms.length === 0 && (
              <p className="text-center text-muted-foreground py-2">Nenhuma sala pública disponível</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
