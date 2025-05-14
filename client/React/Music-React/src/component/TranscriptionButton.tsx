import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress } from "@mui/material";
// import { FaMicrophone } from "react-icons/fa"; // אייקון מיקרופון מ-react-icons
import axios from "axios";

const TranscriptionButton = ({ songUrl }:{songUrl:string}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDialogOpen = async () => {
    setOpenDialog(true);
    setLoading(true);
      console.log("URL של השיר:", songUrl); // הדפסת ה-URL של השיר לקונסול
    // שליחה של ה-URL של השיר לשרת לקבלת התמלול
    try {
      const response = await axios.post("http://localhost:5000/transcribe", {
        url: songUrl, // שולחים את ה-URL של השיר
      });

      // עדכון התמלול שיתקבל
      setTranscription(response.data.corrected_lyrics  || "לא נמצא תמלול.");
    } catch (error) {
      console.error("שגיאה בשליחת התמלול:", error);
      setTranscription("אירעה שגיאה בתמלול.");
    } finally {
      setLoading(false); // סיום התהליך
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      {/* כפתור עם אייקון לתמלול */}
      <Button
        onClick={handleDialogOpen}
        variant="contained"
        color="primary"
        // startIcon={<FaMicrophone />}
        disabled={loading} // אם התמלול בעיצומו, הכפתור יהיה לא פעיל
        sx={{
          background: "linear-gradient(90deg, #D59039, #F7C26B)", // הגרנדיאנט שלך
          "&:hover": { background: "linear-gradient(90deg, #F7C26B, #D59039)" },
          color: "#fff",
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "תמלול"}
      </Button>

      {/* דיאלוג עם התמלול */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>תמלול</DialogTitle>
        <DialogContent>
          <p>{transcription}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TranscriptionButton;
