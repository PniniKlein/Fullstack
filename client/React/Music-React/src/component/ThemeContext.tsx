"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"

type ThemeMode = "dark" | "light"
type ThemeColor = "gold" | "purple" | "blue" | "green" | "ocean" | "sunset" | "neon"
type Language = "he" | "en"

interface ThemeContextType {
  mode: ThemeMode
  color: ThemeColor
  language: Language
  toggleMode: () => void
  setThemeColor: (color: ThemeColor) => void
  toggleLanguage: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "dark",
  color: "gold",
  language: "he",
  toggleMode: () => {},
  setThemeColor: () => {},
  toggleLanguage: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>("dark")
  const [color, setColor] = useState<ThemeColor>("gold")
  const [language, setLanguage] = useState<Language>("he")

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedMode = localStorage.getItem("themeMode") as ThemeMode
    const savedColor = localStorage.getItem("themeColor") as ThemeColor
    const savedLanguage = localStorage.getItem("language") as Language

    if (savedMode) setMode(savedMode)
    if (savedColor) setColor(savedColor)
    if (savedLanguage) setLanguage(savedLanguage)

    // Apply theme to document
    document.documentElement.setAttribute("data-theme", savedMode || "dark")
    document.documentElement.setAttribute("data-color", savedColor || "gold")
    document.documentElement.setAttribute("dir", savedLanguage === "en" ? "ltr" : "rtl")
    document.documentElement.setAttribute("lang", savedLanguage || "he")
  }, [])

  const toggleMode = () => {
    const newMode = mode === "dark" ? "light" : "dark"
    setMode(newMode)
    localStorage.setItem("themeMode", newMode)
    document.documentElement.setAttribute("data-theme", newMode)
  }

  const setThemeColor = (newColor: ThemeColor) => {
    setColor(newColor)
    localStorage.setItem("themeColor", newColor)
    document.documentElement.setAttribute("data-color", newColor)
  }

  const toggleLanguage = () => {
    const newLanguage = language === "he" ? "en" : "he"
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    document.documentElement.setAttribute("dir", newLanguage === "en" ? "ltr" : "rtl")
    document.documentElement.setAttribute("lang", newLanguage)
  }

  return (
    <ThemeContext.Provider value={{ mode, color, language, toggleMode, setThemeColor, toggleLanguage }}>
      {children}
    </ThemeContext.Provider>
  )
}
