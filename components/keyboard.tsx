"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface KeyboardProps {
  onKeyPress: (key: string) => void
  guessedLetters: string[]
  wrongLetters: string[]
}

export default function Keyboard({ onKeyPress, guessedLetters, wrongLetters }: KeyboardProps) {
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

  const isKeyUsed = (key: string) => {
    return guessedLetters.includes(key) || wrongLetters.includes(key)
  }

  return (
    <div>
      <Tabs defaultValue="letras" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="letras">Letras</TabsTrigger>
          <TabsTrigger value="numeros">Números</TabsTrigger>
          <TabsTrigger value="especiais">Caracteres Especiais</TabsTrigger>
        </TabsList>

        <TabsContent value="letras" className="space-y-2">
          {letters.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex justify-center gap-2">
              {row.map((letter) => (
                <button
                  key={letter}
                  className={`keyboard-button ${isKeyUsed(letter) ? "used" : ""}`}
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
            <div key={`row-${rowIndex}`} className="flex justify-center gap-2">
              {row.map((num) => (
                <button
                  key={num}
                  className={`keyboard-button ${isKeyUsed(num) ? "used" : ""}`}
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
            <div key={`row-${rowIndex}`} className="flex justify-center gap-2">
              {row.map((char) => (
                <button
                  key={char}
                  className={`keyboard-button ${isKeyUsed(char) ? "used" : ""}`}
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
