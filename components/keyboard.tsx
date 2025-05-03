"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  guessedLetters: string[];
  wrongLetters: string[];
  correctLetters: string[];
}

export default function Keyboard({
  onKeyPress,
  guessedLetters,
  wrongLetters,
  correctLetters,
}: KeyboardProps) {
  const [activeTab, setActiveTab] = useState("letras");

  const letters = [
    ["A", "B", "C", "D", "E", "F", "G"],
    ["H", "I", "J", "K", "L", "M", "N"],
    ["O", "P", "Q", "R", "S", "T", "U"],
    ["V", "W", "X", "Y", "Z"],
  ];

  const numbers = [
    ["1", "2", "3", "4", "5"],
    ["6", "7", "8", "9", "0"],
  ];

  const specialChars = [
    ["@", "#", "$", "%", "&"],
    ["*", "(", ")", "-", "+"],
    [".", ",", "!", "?", "/"],
  ];

  // Update the getKeyClass function to use green for correct letters
  const getKeyClass = (key: string) => {
    if (correctLetters && correctLetters.includes(key))
      return "bg-green-500 text-white";
    if (wrongLetters && wrongLetters.includes(key))
      return "bg-red-500 text-white opacity-50";
    if (guessedLetters && guessedLetters.includes(key))
      return "bg-purple-700 text-white opacity-50";
    return "bg-blue-500 text-white hover:bg-blue-600";
  };

  const isKeyUsed = (key: string) => {
    return (
      (guessedLetters && guessedLetters.includes(key)) ||
      (wrongLetters && wrongLetters.includes(key)) ||
      (correctLetters && correctLetters.includes(key))
    );
  };

  return (
    <div className="keyboard-container">
      <Tabs
        defaultValue="letras"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="letras">Letras</TabsTrigger>
          <TabsTrigger value="numeros">Números</TabsTrigger>
          <TabsTrigger value="especiais">Caracteres Especiais</TabsTrigger>
        </TabsList>

        <TabsContent value="letras" className="space-y-2">
          {letters.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex justify-center gap-1">
              {row.map((letter) => (
                <button
                  key={letter}
                  className={`w-8 h-8 rounded-md font-semibold text-center flex items-center justify-center ${getKeyClass(
                    letter
                  )}`}
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
            <div key={`row-${rowIndex}`} className="flex justify-center gap-1">
              {row.map((num) => (
                <button
                  key={num}
                  className={`w-8 h-8 rounded-md font-semibold text-center flex items-center justify-center ${getKeyClass(
                    num
                  )}`}
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
            <div key={`row-${rowIndex}`} className="flex justify-center gap-1">
              {row.map((char) => (
                <button
                  key={char}
                  className={`w-8 h-8 rounded-md font-semibold text-center flex items-center justify-center ${getKeyClass(
                    char
                  )}`}
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
  );
}
