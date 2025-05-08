"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Aplicar o tema diretamente ao elemento HTML em vez de usar a classe no body
  React.useEffect(() => {
    const applyTheme = (theme: string) => {
      const root = document.documentElement
      root.classList.remove("dark", "neon", "retro", "gartic")

      switch (theme) {
        case "dark":
          root.classList.add("dark")
          break
        case "neon":
          root.classList.add("neon")
          break
        case "retro":
          root.classList.add("retro")
          break
        case "light":
          root.classList.add("gartic")
          break
        default:
          root.classList.add("gartic")
          break
      }
    }

    // Aplicar tema inicial
    const savedTheme = localStorage.getItem("theme") || props.defaultTheme || "light"
    applyTheme(savedTheme)

    // Observar mudanças no tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          const theme = document.documentElement.getAttribute("data-theme") || "light"
          applyTheme(theme)
          localStorage.setItem("theme", theme)
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [props.defaultTheme])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
