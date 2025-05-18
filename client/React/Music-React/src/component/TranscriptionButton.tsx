import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography
} from "@mui/material";
// import { FaMicrophone } from "react-icons/fa"; // אייקון מיקרופון מ-react-icons
import axios from "axios";

const TranscriptionButton = ({ songLyrics }: { songLyrics: string }) => {
  const [openDialog, setOpenDialog] = useState(false);
  // const [transcription, setTranscription] = useState("");
  // const [loading, setLoading] = useState(false);

  const handleDialogOpen = async () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Button
        onClick={handleDialogOpen}
        variant="contained"
        color="primary"
        sx={{
          background: "linear-gradient(90deg, #D59039, #F7C26B)",
          "&:hover": { background: "linear-gradient(90deg, #F7C26B, #D59039)" },
          color: "#fff",
        }}
      >
        תמלול
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            backgroundColor: "#333", // רקע כהה
            color: "#fff", // טקסט לבן ברירת מחדל
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff" }}>תמלול</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#fff", whiteSpace: "pre-line" }}>
            {songLyrics || "אין תמלול זמין"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            sx={{
              background: "linear-gradient(90deg, #D59039, #F7C26B)",
              "&:hover": {
                background: "linear-gradient(90deg, #F7C26B, #D59039)",
              },
              color: "#fff",
            }}
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TranscriptionButton;
