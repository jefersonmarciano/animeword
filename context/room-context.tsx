"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { generateRandomString } from "@/lib/utils"
import { useAuth, type User } from "./auth-context"

export interface Room {
  id: string
  name: string
  isPublic: boolean
  players: User[]
  createdBy: string
  createdAt: Date
}

interface RoomContextType {
  currentRoom: Room | null
  setCurrentRoom: (room: Room | null) => void
  publicRooms: Room[]
  createRoom: (isPublic: boolean) => string
  joinRoom: (roomId: string) => boolean
  leaveRoom: () => void
  addPlayerToRoom: (player: User) => void
  removePlayerFromRoom: (playerId: string) => void
}

// Mock data for public rooms
const mockPublicRooms: Room[] = [
  {
    id: "room-js123",
    name: "Sala de JavaScript",
    isPublic: true,
    players: [
      {
        id: "user1",
        nickname: "DevMaster",
        isGuest: false,
        avatar: "/images/avatars/devJs.png",
      },
      {
        id: "user2",
        nickname: "CodeNinja",
        isGuest: false,
        avatar: "/images/avatars/devRust.png",
      },
      {
        id: "user3",
        nickname: "BugHunter",
        isGuest: true,
        avatar: "/images/avatars/irritado.png",
      },
    ],
    createdBy: "user1",
    createdAt: new Date(),
  },
  {
    id: "room-react456",
    name: "Programadores React",
    isPublic: true,
    players: [
      {
        id: "user4",
        nickname: "ReactWizard",
        isGuest: false,
        avatar: "/images/avatars/devFront.png",
      },
      {
        id: "user5",
        nickname: "HooksMaster",
        isGuest: false,
        avatar: "/images/avatars/analistadeDados.png",
      },
    ],
    createdBy: "user4",
    createdAt: new Date(),
  },
  {
    id: "room-ts789",
    name: "Devs TypeScript",
    isPublic: true,
    players: [
      {
        id: "user6",
        nickname: "TypeWizard",
        isGuest: false,
        avatar: "/images/avatars/nerdola.png",
      },
    ],
    createdBy: "user6",
    createdAt: new Date(),
  },
]

const RoomContext = createContext<RoomContextType | undefined>(undefined)

export function RoomProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [publicRooms, setPublicRooms] = useState<Room[]>(mockPublicRooms)

  // Check for saved room on mount
  useEffect(() => {
    const savedRoom = localStorage.getItem("devword_current_room")
    if (savedRoom && user) {
      try {
        const parsedRoom = JSON.parse(savedRoom)
        setCurrentRoom(parsedRoom)
      } catch (error) {
        console.error("Failed to parse saved room", error)
        localStorage.removeItem("devword_current_room")
      }
    }
  }, [user])

  // Update localStorage when room changes
  useEffect(() => {
    if (currentRoom) {
      localStorage.setItem("devword_current_room", JSON.stringify(currentRoom))
    } else {
      localStorage.removeItem("devword_current_room")
    }
  }, [currentRoom])

  const createRoom = (isPublic: boolean): string => {
    if (!user) return ""

    const roomId = `room-${generateRandomString(6)}`
    const newRoom: Room = {
      id: roomId,
      name: `Sala de ${user.nickname}`,
      isPublic,
      players: [user],
      createdBy: user.id,
      createdAt: new Date(),
    }

    setCurrentRoom(newRoom)

    // If public, add to public rooms list
    if (isPublic) {
      setPublicRooms((prev) => [...prev, newRoom])
    }

    return roomId
  }

  const joinRoom = (roomId: string): boolean => {
    if (!user) return false

    // Check if room exists in public rooms
    const roomToJoin = publicRooms.find((room) => room.id === roomId)

    if (roomToJoin) {
      // Check if user is already in the room
      if (!roomToJoin.players.some((player) => player.id === user.id)) {
        // Add user to room
        const updatedRoom = {
          ...roomToJoin,
          players: [...roomToJoin.players, user],
        }

        setCurrentRoom(updatedRoom)

        // Update public rooms list
        setPublicRooms((prev) => prev.map((room) => (room.id === roomId ? updatedRoom : room)))
      } else {
        // User is already in the room, just set as current
        setCurrentRoom(roomToJoin)
      }
      return true
    }

    // Room not found
    return false
  }

  const leaveRoom = () => {
    if (!user || !currentRoom) return

    // Remove user from room
    const updatedPlayers = currentRoom.players.filter((player) => player.id !== user.id)

    // If room is empty, remove it from public rooms
    if (updatedPlayers.length === 0 && currentRoom.isPublic) {
      setPublicRooms((prev) => prev.filter((room) => room.id !== currentRoom.id))
    } else if (currentRoom.isPublic) {
      // Update public rooms list
      const updatedRoom = {
        ...currentRoom,
        players: updatedPlayers,
      }
      setPublicRooms((prev) => prev.map((room) => (room.id === currentRoom.id ? updatedRoom : room)))
    }

    setCurrentRoom(null)
  }

  const addPlayerToRoom = (player: User) => {
    if (!currentRoom) return

    // Check if player is already in the room
    if (!currentRoom.players.some((p) => p.id === player.id)) {
      const updatedRoom = {
        ...currentRoom,
        players: [...currentRoom.players, player],
      }
      setCurrentRoom(updatedRoom)

      // Update public rooms list if needed
      if (currentRoom.isPublic) {
        setPublicRooms((prev) => prev.map((room) => (room.id === currentRoom.id ? updatedRoom : room)))
      }
    }
  }

  const removePlayerFromRoom = (playerId: string) => {
    if (!currentRoom) return

    const updatedPlayers = currentRoom.players.filter((player) => player.id !== playerId)

    // If room is empty, remove it from public rooms
    if (updatedPlayers.length === 0 && currentRoom.isPublic) {
      setPublicRooms((prev) => prev.filter((room) => room.id !== currentRoom.id))
      setCurrentRoom(null)
    } else {
      // Update room
      const updatedRoom = {
        ...currentRoom,
        players: updatedPlayers,
      }
      setCurrentRoom(updatedRoom)

      // Update public rooms list if needed
      if (currentRoom.isPublic) {
        setPublicRooms((prev) => prev.map((room) => (room.id === currentRoom.id ? updatedRoom : room)))
      }
    }
  }

  return (
    <RoomContext.Provider
      value={{
        currentRoom,
        setCurrentRoom,
        publicRooms,
        createRoom,
        joinRoom,
        leaveRoom,
        addPlayerToRoom,
        removePlayerFromRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  const context = useContext(RoomContext)
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider")
  }
  return context
}
