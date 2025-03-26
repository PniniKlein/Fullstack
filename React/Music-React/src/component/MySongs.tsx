import { useEffect, useState } from "react";
import { Box, Typography, IconButton, Paper, Snackbar, Alert, Grow } from "@mui/material";
import { MoreVert, Edit, Delete, PlayArrow, Pause } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Song } from "../model/Song";
import { Dispatch, StoreType } from "../store/store";
import AddSong from "./AddSong";
import { deleteSong, updateSongToPublic } from "../services/SongsService";
import { loadUser } from "../store/userSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getUserDataFromToken } from "./AppLayout";
import PublicIcon from '@mui/icons-material/Public';
import { resetSong, updateSong } from "../store/songSlice";

const MySwal = withReactContent(Swal);

const MySongs = () => {
  const dispatch = useDispatch<Dispatch>();
  const user = useSelector((store: StoreType) => store.user.user);
  const songs = useSelector((state: StoreType) => state.user.user.songs || []);
  const songPlayer = useSelector((state: StoreType) => state.songPlayer.song);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const audioRef = useState(new Audio())[0];
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'public' | 'private'>('public'); // הגדרת ה-state של filter

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const id = getUserDataFromToken(token);
      if (id) {
        dispatch(loadUser(id));
      }
    }
  }, []);

  const handleEdit = (song: Song) => navigate("/updateSong", { state: { song } });

  const handleDelete = async (songId: number) => {
    const result = await MySwal.fire({
      title: "האם אתה בטוח?",
      text: "!לא תוכל לשחזר את השיר לאחר מחיקה",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "!כן, מחק",
      cancelButtonText: "ביטול",
    });

    if (result.isConfirmed) {
      if (await deleteSong(songId)) {
        if (songId == songPlayer.id)
          dispatch(resetSong())
        setSnackbarMessage("השיר נמחק בהצלחה!");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("שגיאה במחיקת השיר");
        setSnackbarOpen(true);
      }
    }
  };

  const updateToPublic = async (songId: number) => {
    await updateSongToPublic(songId);
    songPlayer.isPublic = true;
    dispatch(updateSong(songPlayer))
    const token = localStorage.getItem("authToken");
    if (token) {
      const id = getUserDataFromToken(token);
      if (id) {
        dispatch(loadUser(id));
      }
    }
  };

  const handlePlayPause = (songUrl: string) => {
    if (currentSong === songUrl && isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
    } else {
      audioRef.src = songUrl;
      audioRef.play();
      setIsPlaying(true);
      setCurrentSong(songUrl);
    }
  };
  const handleCardClick = (event: React.MouseEvent, songId: number) => {
    const target = event.target as HTMLElement;
    if ((target.closest("button, svg"))) {
      return;
    }
    setActiveCardId(songId);
    navigate(`/songComments/${songId}`);
  };
  const handleMouseDown = (songId: number) => setActiveCardId(songId);

  const handleMouseUp = () => setActiveCardId(null);
  return (
    <Box sx={{ padding: "20px", color: "white", marginTop: "40px" }}>
      {/* <MediaPlayer song={songs[0]}/> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 62,  // דואג שהאלמנט יישאר למעלה
          backgroundColor: "#212121", // אם רוצים צבע רקע כדי שהאלמנט יהיה תמיד בולט
          zIndex: 1, // חשוב לשים ז-אינדקס אם יש אלמנטים אחרים עליהם הוא צריך להישאר
          padding: "20px", // אם צריך ריפוד נוסף
        }}
      >

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "right", marginRight: "5%" }}>
          <Typography variant="h3" fontWeight="bold" fontSize="50px" noWrap width="310px">
            השירים שלי
          </Typography>
          <Box sx={{ display: "flex", gap: "40px", marginRight: "15%" }}>
            {/* פרטי */}
            <Box
              onClick={() => setFilter('private')} // שינוי filter לפרטי
              sx={{
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
                textDecoration: "none",
                position: "relative",
                paddingBottom: "5px",
                cursor: "pointer", // נראה כמו כפתור
                "&::after": {
                  content: '""',
                  display: "block",
                  width: filter === 'private' ? "60%" : "0%", // פס רק לשיר הציבורי
                  height: "3px",
                  backgroundColor: "#FFA726",
                  borderRadius: "2px",
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  transform: "translateX(-50%)",
                },
              }}
            >
              פרטי
            </Box>
            {/* ציבורי */}
            <Box
              onClick={() => setFilter('public')} // שינוי filter לציבורי
              sx={{
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
                textDecoration: "none",
                position: "relative",
                paddingBottom: "5px",
                cursor: "pointer", // נראה כמו כפתור
                "&::after": {
                  content: '""',
                  display: "block",
                  width: filter === 'public' ? "60%" : "0%", // פס רק לשיר הציבורי
                  height: "3px",
                  backgroundColor: "#FFA726",
                  borderRadius: "2px",
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  transform: "translateX(-50%)",
                },
              }}
            >
              ציבורי
            </Box>
          </Box>

        </Box>
        <AddSong />
      </Box>

      {songs.length === 0 ? (
        <Typography textAlign="center" sx={{ marginTop: "20px" }}>
          !אין לך שירים עדיין. נסה להעלות שיר חדש
        </Typography>
      ) : (
        <Box sx={{
          margin: "5%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "40px",
          marginTop: "40px",
        }}>
          {songs.filter((song: Song) => song.isPublic === (filter === 'public')).map((song: Song) => (
            <Paper
              key={song.id}
              elevation={3}
              sx={{
                textAlign: "left",
                position: "relative",
                backgroundColor: "#252525",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "260px",
                transform: activeCardId === song.id ? "scale(0.95)" : "scale(1)", // הקטנה בלחיצה
              }}
              onClick={(e) => handleCardClick(e, song.id)}
              onMouseDown={(e) => {
                const target = e.target as HTMLElement;
                if (!(target.closest("button, svg"))) { handleMouseDown(song.id); }
              }}
              onMouseUp={handleMouseUp}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "150px",
                  backgroundImage: `url(/avatars/music2.jpg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "8px 8px 0 0",
                  position: "relative",
                }}
              >
                <IconButton
                  onClick={() => dispatch(updateSong(song))}
                  sx={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.6)" },
                  }}
                >
                  {currentSong === song.pathSong && isPlaying ? <Pause fontSize="medium" /> : <PlayArrow fontSize="medium" />}
                </IconButton>
              </Box>

              <Box sx={{ marginLeft: "10px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", textAlign: "left" }}>
                <Typography fontWeight="bold" mt={1} sx={{ color: "#fff", textAlign: "left" }}>{song.title}</Typography>
                <Typography variant="body2" sx={{ color: "#808080", textAlign: "left" }}>{new Date(song.create_at).toLocaleDateString()}</Typography>
                <Typography variant="body2" sx={{ color: "#808080", textAlign: "left" }}>{song.gener}</Typography>
              </Box>

              <IconButton
                onClick={() => setOpenMenuId(openMenuId === song.id ? null : song.id)}
                sx={{
                  color: "white",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                }}
              >
                <MoreVert />
              </IconButton>

              <Grow in={openMenuId === song.id}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    display: "flex",
                    gap: "5px",
                    backgroundColor: "rgba(105, 100, 100, 0.41)",
                    backdropFilter: "blur(10px)",
                    padding: "2px",
                    borderRadius: "30px",
                    boxShadow: "0px 2px 4px rgba(255, 255, 255, 0.3)",
                    transform: openMenuId === song.id ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "right center",
                    transition: "transform 2s ease-in-out", // זמן האנימציה שודרג ל-1 שניה
                  }}
                >
                  <IconButton
                    onClick={() => setOpenMenuId(openMenuId === song.id ? null : song.id)}
                    sx={{
                      color: "white", "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(song)} sx={{ color: "white", "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" }, }}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(song.id)} sx={{ color: "red", "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" }, }}>
                    <Delete fontSize="small" />
                  </IconButton>
                  <IconButton disabled={song.isPublic} sx={{ color: "white", "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" }, }} onClick={(e) => { updateToPublic(song.id); }}>
                    <PublicIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grow>
            </Paper>
          ))}
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{
            backgroundColor: "#2E7D32",
            color: "white",
            "& .MuiAlert-icon": { color: "white" },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MySongs;
