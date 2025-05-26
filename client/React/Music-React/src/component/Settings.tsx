"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  Tabs,
  Tab,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Divider,
  Paper,
  Switch,
  Grid,
  Tooltip,
} from "@mui/material"
import { Palette, LanguagesIcon, Save, RotateCcw, Check, Sun, Moon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "./ThemeContext"
// import { getTranslation } from "./translations"


const Settings = () => {
  const { mode, color, language, toggleMode, setThemeColor, toggleLanguage } = useTheme()
  const [currentTab, setCurrentTab] = useState(0)
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false)

  const t = (key: string) => getTranslation(key, language)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  const handleSave = () => {
    setShowSaveConfirmation(true)
    setTimeout(() => setShowSaveConfirmation(false), 3000)
  }

  const colors = [
    { name: t("settings.appearance.color.purple"), value: "purple" },
    { name: t("settings.appearance.color.gold"), value: "gold" },
    { name: t("settings.appearance.color.blue"), value: "blue" },
    { name: t("settings.appearance.color.green"), value: "green" },
    { name: t("settings.appearance.color.orange"), value: "orange" },
    { name: t("settings.appearance.color.pink"), value: "pink" },
  ]

  const ColorCircle = ({ colorValue }: { colorValue: string }) => {
    const isSelected = color === colorValue

    return (
      <Box
        component={motion.div}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setThemeColor(colorValue as any)}
        sx={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          cursor: "pointer",
          position: "relative",
          border: isSelected ? "2px solid var(--text-primary)" : "2px solid transparent",
          padding: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: `var(--primary-500)`,
            boxShadow: isSelected ? "0 0 10px var(--primary-500)" : "none",
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: "0 0 10px var(--primary-500)",
            },
          }}
          className={`color-${colorValue}`}
        />
        {isSelected && (
          <Box
            component={motion.div}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#fff",
              zIndex: 1,
            }}
          >
            <Check size={20} />
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box>
     
    </Box>
  )
}

export default Settings
