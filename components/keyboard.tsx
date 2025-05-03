"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface KeyboardProps {
  onKeyPress: (key: string) => void
  guessedLetters: string[]
  wrongLetters: string[]
  correctLetters: string[]
}

export default function Keyboard({ onKeyPress, guessedLetters, wrongLetters, correctLetters }: KeyboardProps) {
  const [activeTab, setActiveTab] = useState("letras")

  const letters = [
    ["A", "B", "C", "D", "E", "F", "G"],
    ["H", "I", "J", "K", "L", "M", "N"],
    ["O", "P", "Q", "R", "S", "T", "U"],
    ["V", "W", "X", "Y", "Z"],
  ]

  const numbers = [
    ["1", "2", "3", "4", "5"],
    ["6", "7", "8", "9", "0"],
  ]

  const specialChars = [
    ["@", "#", "$", "%", "&"],
    ["*", "(", ")", "-", "+"],
    [".", ",", "!", "?", "/"],
  ]

  // Update the getKeyClass function to use green for correct letters
  const getKeyClass = (key: string) => {
    if (correctLetters.includes(key)) return "keyboard-button correct"
    if (wrongLetters.includes(key)) return "keyboard-button wrong"
    if (guessedLetters.includes(key)) return "keyboard-button used"
    return "keyboard-button"
  }

  const isKeyUsed = (key: string) => {
    return guessedLetters.includes(key) || wrongLetters.includes(key) || correctLetters.includes(key)
  }

  return (
    <div className="keyboard-container">
      <Tabs defaultValue="letras" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="letras">Letras</TabsTrigger>
          <TabsTrigger value="numeros">Números</TabsTrigger>
          <TabsTrigger value="especiais">Caracteres Especiais</TabsTrigger>
        </TabsList>

        <TabsContent value="letras" className="space-y-2">
          {letters.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex justify-center gap-1 sm:gap-2">
              {row.map((letter) => (
                <button
                  key={letter}
                  className={getKeyClass(letter)}
                  onClick={() => onKeyPress(letter)}
                  disabled={isKeyUsed(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="numeros" className="space-y-2">
          {numbers.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex justify-center gap-1 sm:gap-2">
              {row.map((num) => (
                <button
                  key={num}
                  className={getKeyClass(num)}
                  onClick={() => onKeyPress(num)}
                  disabled={isKeyUsed(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="especiais" className="space-y-2">
          {specialChars.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex justify-center gap-1 sm:gap-2">
              {row.map((char) => (
                <button
                  key={char}
                  className={getKeyClass(char)}
                  onClick={() => onKeyPress(char)}
                  disabled={isKeyUsed(char)}
                >
                  {char}
                </button>
              ))}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
