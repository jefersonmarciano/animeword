"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { avatars } from "@/context/game-context"

interface AvatarSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (avatar: string) => void
  currentAvatar: string
}

export default function AvatarSelectorModal({ isOpen, onClose, onSelect, currentAvatar }: AvatarSelectorModalProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showRoulette, setShowRoulette] = useState(false)
  const [finalAvatar, setFinalAvatar] = useState<string | null>(null)
  const [spinningAvatars, setSpinningAvatars] = useState<string[]>([])
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Reset selected avatar when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(currentAvatar)
      setShowRoulette(false)
      setFinalAvatar(null)
      setIsSpinning(false)
    }
  }, [isOpen, currentAvatar])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current)
      }
    }
  }, [])

  const handleSelectAvatar = (avatar: string) => {
    setSelectedAvatar(avatar)
  }

  const handleConfirm = () => {
    onSelect(finalAvatar || selectedAvatar)
    onClose()
  }

  const handleRandomAvatar = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setShowRoulette(true)

    // Create a shuffled array of avatars for spinning
    const shuffled = [...avatars].sort(() => 0.5 - Math.random())
    setSpinningAvatars(shuffled)

    let counter = 0
    const maxSpins = 20 + Math.floor(Math.random() * 10) // Random number of spins

    // Start spinning
    spinIntervalRef.current = setInterval(() => {
      counter++
      setSpinningAvatars((prev) => {
        // Rotate the array to create spinning effect
        const newArray = [...prev]
        const first = newArray.shift()
        if (first) newArray.push(first)
        return newArray
      })

      // Gradually slow down and eventually stop
      if (counter > maxSpins * 0.7) {
        if (spinIntervalRef.current) {
          clearInterval(spinIntervalRef.current)

          // Slow down for the final spins
          spinIntervalRef.current = setInterval(() => {
            counter++
            setSpinningAvatars((prev) => {
              const newArray = [...prev]
              const first = newArray.shift()
              if (first) newArray.push(first)
              return newArray
            })

            // Stop completely
            if (counter >= maxSpins) {
              if (spinIntervalRef.current) {
                clearInterval(spinIntervalRef.current)
                spinIntervalRef.current = null
              }

              // Set the final selected avatar
              setFinalAvatar(spinningAvatars[0])
              setIsSpinning(false)
            }
          }, 300) // Slower interval for final spins
        }
      }
    }, 100) // Initial fast spinning interval
  }

  const handleStop = () => {
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current)
      spinIntervalRef.current = null
    }

    // Set the current avatar as final
    setFinalAvatar(spinningAvatars[0])
    setIsSpinning(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-background">
        <DialogTitle className="text-center text-xl font-bold text-primary mb-4">Escolha seu Avatar</DialogTitle>

        {showRoulette ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-xs mx-auto">
              {/* Background grid of avatars (blurred) */}
              <div className="grid grid-cols-3 gap-2 opacity-40 blur-sm">
                {avatars.map((avatar, idx) => (
                  <div key={`bg-${idx}`} className="w-20 h-20 relative rounded-full overflow-hidden">
                    <Image src={avatar || "/placeholder.svg"} alt="Avatar background" fill className="object-cover" />
                  </div>
                ))}
              </div>

              {/* Highlighted center avatar */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32">
                <div className="relative w-full h-full rounded-lg overflow-hidden border-4 border-yellow-400 shadow-[0_0_15px_5px_rgba(255,215,0,0.7)]">
                  {spinningAvatars.length > 0 && (
                    <Image
                      src={spinningAvatars[0] || "/placeholder.svg"}
                      alt="Selected avatar"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Yellow dots around the highlighted avatar */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full"></div>
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full"></div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full"></div>
                <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-4 w-full">
              {isSpinning ? (
                <Button
                  onClick={handleStop}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-8 rounded-full"
                >
                  PARAR
                </Button>
              ) : (
                <Button
                  onClick={handleConfirm}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-8 rounded-full"
                >
                  CONFIRMAR
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 relative border-2 border-primary rounded-full overflow-hidden">
                <Image src={selectedAvatar || "/placeholder.svg"} alt="Avatar atual" fill className="object-cover" />
              </div>
            </div>

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

            <div className="flex justify-between gap-3 mt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>

              <Button
                onClick={handleRandomAvatar}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              >
                Aleatório
              </Button>

              <Button onClick={handleConfirm} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                Confirmar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
