"use client"

import { useState, useEffect, useCallback } from "react"

export function useSound() {
  const [isMuted, setIsMuted] = useState(false)

  // Save mute state to localStorage when it changes
  useEffect(() => {
    const savedMuteState = localStorage.getItem("devword_muted")
    if (savedMuteState) {
      setIsMuted(savedMuteState === "true")
    }
  }, [])

  // Update localStorage when mute state changes
  useEffect(() => {
    localStorage.setItem("devword_muted", isMuted.toString())
  }, [isMuted])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  const playSound = useCallback(
    (type: "error" | "success" | "defeat") => {
      if (isMuted) return

      // Use the Web Audio API for simple sounds
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        // Configure sound based on type
        switch (type) {
          case "error":
            oscillator.type = "square"
            oscillator.frequency.setValueAtTime(220, audioContext.currentTime)
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.2)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
            break
          case "success":
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            oscillator.start()
            oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.1)
            oscillator.stop(audioContext.currentTime + 0.2)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
            break
          case "defeat":
            oscillator.type = "sawtooth"
            oscillator.frequency.setValueAtTime(220, audioContext.currentTime)
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            oscillator.start()
            oscillator.frequency.setValueAtTime(110, audioContext.currentTime + 0.3)
            oscillator.stop(audioContext.currentTime + 0.6)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)
            break
        }
      } catch (error) {
        console.error("Web Audio API not supported:", error)
      }
    },
    [isMuted],
  )

  return {
    isMuted,
    toggleMute,
    playSound,
  }
}
