"use client"

import { Box, Typography } from "@mui/material"
import AddSong from "./AddSong"
import "../css/AddSongPage.css"

const AddSongPage = () => {
  return (
    <Box className="add-song-page">
      <Typography variant="h4" className="section-title">
        הוספת שיר חדש
      </Typography>

      <Box className="add-song-container">
        <AddSong />
      </Box>
    </Box>
  )
}

export default AddSongPage
