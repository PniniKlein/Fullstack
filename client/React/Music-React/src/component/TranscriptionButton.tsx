// import { useState } from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
//   Typography
// } from "@mui/material";
// // import { FaMicrophone } from "react-icons/fa"; // אייקון מיקרופון מ-react-icons
// import axios from "axios";

// const TranscriptionButton = ({ songUrl }: { songUrl: string }) => {
//   const [openDialog, setOpenDialog] = useState(false);
//   // const [transcription, setTranscription] = useState("");
//   // const [loading, setLoading] = useState(false);

//   const handleDialogOpen = async () => {
//     setOpenDialog(true);
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//   };

//   return (
//     <div>
//       <Button
//         onClick={handleDialogOpen}
//         variant="contained"
//         color="primary"
//         sx={{
//           background: "linear-gradient(90deg, #D59039, #F7C26B)",
//           "&:hover": { background: "linear-gradient(90deg, #F7C26B, #D59039)" },
//           color: "#fff",
//         }}
//       >
//         תמלול
//       </Button>

//       <Dialog
//         open={openDialog}
//         onClose={handleDialogClose}
//         PaperProps={{
//           sx: {
//             backgroundColor: "#333", // רקע כהה
//             color: "#fff", // טקסט לבן ברירת מחדל
//           },
//         }}
//       >
//         <DialogTitle sx={{ color: "#fff" }}>תמלול</DialogTitle>
//         <DialogContent>
//           <Typography sx={{ color: "#fff", whiteSpace: "pre-line" }}>
//             {songLyrics || "אין תמלול זמין"}
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={handleDialogClose}
//             sx={{
//               background: "linear-gradient(90deg, #D59039, #F7C26B)",
//               "&:hover": {
//                 background: "linear-gradient(90deg, #F7C26B, #D59039)",
//               },
//               color: "#fff",
//             }}
//           >
//             סגור
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default TranscriptionButton;

import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography
} from "@mui/material";
import axios from "axios";
import { Song } from "../model/Song";
import { addLyrics } from "../services/SongsService";

const TranscriptionButton = ({ song }: { song: Song }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [songLyrics, setSongLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDialogOpen = async () => {
    setOpenDialog(true);
    setLoading(true);
    setError("");
    try {
      if (song.lyrics == "") {
        const response = await axios.post("https://singsong-python.onrender.com/transcribe", {
          url: song.pathSong,
        });
        setSongLyrics(response.data.corrected_lyrics);
        await addLyrics(song.id, response.data.corrected_lyrics);
      } else {
        setSongLyrics(song.lyrics);
      }
    } catch (err: any) {
      setError("שגיאה בתמלול השיר. נסה שוב מאוחר יותר.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSongLyrics("");
    setError("");
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
            backgroundColor: "#333",
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff" }}>תמלול</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#fff", whiteSpace: "pre-line" }}>
            {loading
              ? "טוען תמלול..."
              : error
                ? error
                : songLyrics || "אין תמלול זמין"}
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

