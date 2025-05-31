"use client"

import { Box, CircularProgress, Typography } from "@mui/material"
import { motion } from "framer-motion"
// import { useTheme } from "./ThemeContext"
// import { getTranslation } from "./translations"

interface LoadingSpinnerProps {
  size?: number
  thickness?: number
  text?: string
  fullScreen?: boolean
}

const LoadingSpinner = ({ size = 40, thickness = 4, text, fullScreen = false }: LoadingSpinnerProps) => {
  // const { language } = useTheme()
  // const t = (key: string) => getTranslation(key, language)

  // const defaultText = t("common.loading")

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: fullScreen ? "100%" : "auto",
        height: fullScreen ? "100vh" : "auto",
        padding: fullScreen ? 0 : 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CircularProgress
          size={size}
          thickness={thickness}
          sx={{
            color: "var(--primary-500)",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
      </motion.div>
      {(text || fullScreen) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Typography
            variant="body1"
            sx={{
              mt: 2,
              color: "var(--text-secondary)",
              fontWeight: "var(--font-medium)",
            }}
          >
            {text} 
          </Typography>
        </motion.div>
      )}
    </Box>
  )
}

export default LoadingSpinner
