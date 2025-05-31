// "use client"

// import { Button } from "@mui/material"
// import { Upload } from "lucide-react"
// import { Link } from "react-router-dom"
// import { useTheme } from "./ThemeContext"
// // import { getTranslation } from "./translations"
// import { motion } from "framer-motion"

// const AddSongButton = () => {
//   const { language } = useTheme()
//   const t = (key: string) => getTranslation(key, language)

//   return (
//     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//       <Button
//         component={Link}
//         to="/add-song"
//         variant="contained"
//         endIcon={<Upload size={18} />}
//         className="add-song-button"
//         sx={{
//           background: "var(--gradient-primary)",
//           color: "var(--text-on-primary)",
//           borderRadius: "var(--radius-full)",
//           padding: "8px 20px",
//           fontWeight: "var(--font-medium)",
//           textTransform: "none",
//           boxShadow: "var(--shadow-md)",
//           transition: "var(--transition-normal)",
//           "&:hover": {
//             boxShadow: "0 0 15px var(--primary-500)",
//             transform: "translateY(-2px)",
//           },
//         }}
//       >
//         {t("addSong.addSong")}
//       </Button>
//     </motion.div>
//   )
// }

// export default AddSongButton
