"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { generateRandomString } from "@/lib/utils"

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  login: (nickname: string) => void
  loginAsGuest: () => void
  logout: () => void
}

export interface User {
  id: string
  nickname: string
  isGuest: boolean
  avatar: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("devword_user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Failed to parse saved user", error)
        localStorage.removeItem("devword_user")
      }
    }
  }, [])

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("devword_user", JSON.stringify(user))
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem("devword_user")
      setIsAuthenticated(false)
    }
  }, [user])

  const login = (nickname: string) => {
    // Generate a random avatar from the available avatars
    const avatars = [
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
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)]

    const newUser: User = {
      id: generateRandomString(8),
      nickname: nickname || `Jogador_${generateRandomString(4)}`,
      isGuest: false,
      avatar: randomAvatar,
    }
    setUser(newUser)
  }

  const loginAsGuest = () => {
    // Generate a random avatar from the available avatars
    const avatars = [
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
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)]

    const guestUser: User = {
      id: generateRandomString(8),
      nickname: `Convidado_${generateRandomString(4)}`,
      isGuest: true,
      avatar: randomAvatar,
    }
    setUser(guestUser)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
