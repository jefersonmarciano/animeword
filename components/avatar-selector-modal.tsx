"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { avatars } from "@/context/game-context"
import { Loader2 } from "lucide-react"

interface AvatarSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (avatar: string) => void
  currentAvatar: string
}

export default function AvatarSelectorModal({ isOpen, onClose, onSelect, currentAvatar }: AvatarSelectorModalProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinningAvatars, setSpinningAvatars] = useState<string[]>([])
  const [showConfirm, setShowConfirm] = useState(false)
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Reset selected avatar when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(currentAvatar)
      setShowConfirm(false)
    }
  }, [isOpen, currentAvatar])

  const handleSelectAvatar = (avatar: string) => {
    setSelectedAvatar(avatar)
  }

  const handleConfirm = () => {
    onSelect(selectedAvatar)
    onClose()
  }

  const handleRandomAvatar = () => {
    setIsSpinning(true)
    setShowConfirm(false)

    // Prepare initial spinning avatars
    const initialSpinningAvatars = [...avatars].sort(() => Math.random() - 0.5).slice(0, 10)
    setSpinningAvatars(initialSpinningAvatars)

    // Simular uma roleta girando através dos avatares
    let spinCount = 0
    const maxSpins = 20
    const spinInterval = setInterval(() => {
      // Shift avatars in the array to create a rolling effect
      setSpinningAvatars((prev) => {
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)]
        return [randomAvatar, ...prev.slice(0, -1)]
      })

      spinCount++
      if (spinCount >= maxSpins) {
        clearInterval(spinInterval)
        spinIntervalRef.current = null
        setIsSpinning(false)

        // Get the final avatar (first in the array)
        const finalAvatar = spinningAvatars[0]
        setSelectedAvatar(finalAvatar)
        setShowConfirm(true)
      }
    }, 100)

    spinIntervalRef.current = spinInterval
  }

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current)
      }
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-background">
        <DialogTitle className="text-center text-xl font-bold text-primary mb-4">Escolha seu Avatar</DialogTitle>

        {isSpinning ? (
          <div className="flex flex-col items-center mb-6">
            <div className="avatar-roll-container mb-4">
              {spinningAvatars.slice(0, 1).map((avatar, idx) => (
                <div key={`spin-${idx}`} className="avatar-roll-item">
                  <Image
                    src={avatar || "/placeholder.svg"}
                    alt="Avatar"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-center text-sm">Girando...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-6">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`relative cursor-pointer rounded-full overflow-hidden border-2 transition-all duration-200
                  ${
                    selectedAvatar === avatar
                      ? "border-primary shadow-lg scale-110"
                      : "border-muted hover:border-primary/50"
                  }
                `}
                onClick={() => handleSelectAvatar(avatar)}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                  <Image src={avatar || "/placeholder.svg"} alt="Avatar" fill className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>

          <Button
            onClick={handleRandomAvatar}
            disabled={isSpinning}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            {isSpinning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Girando...
              </>
            ) : (
              "Aleatório"
            )}
          </Button>

          {showConfirm || !isSpinning ? (
            <Button onClick={handleConfirm} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
              Confirmar
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
