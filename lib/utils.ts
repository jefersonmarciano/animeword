import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function copyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => resolve(true))
        .catch(() => resolve(false))
    } else {
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand("copy")
        document.body.removeChild(textArea)
        resolve(successful)
      } catch (err) {
        resolve(false)
      }
    }
  })
}
