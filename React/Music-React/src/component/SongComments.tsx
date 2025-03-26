import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteSong, getSongById } from "../services/SongsService";
import { addComment } from "../services/CommentsService";
import { Song } from "../model/Song";
import { Avatar, Box, Card, Typography, Rating, Button, TextField, Collapse, IconButton, InputAdornment, Snackbar, Alert } from "@mui/material";
import { Comment } from "../model/Comment";
import { Edit, Delete, Public, Lock, Send, AddComment } from "@mui/icons-material";
import { UserPostModel } from "../model/PostModel/UserPostModel";
import { getArtistById } from "../services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import { resetSong } from "../store/songSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Download } from "@mui/icons-material";
const MySwal = withReactContent(Swal);
const SongComments = () => {
  const { songId } = useParams();
  const user = useSelector((store: StoreType) => store.user.user);
  const [song, setSong] = useState<Song | null>(null);
  const [artist, setArtist] = useState<UserPostModel>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const isOwner = song?.userId === user?.id;

  const dispatch = useDispatch<Dispatch>();
  const songPlayer = useSelector((state: StoreType) => state.songPlayer.song);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const maxStars = 5;

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
        navigate(-1)
      } else {
        setSnackbarMessage("שגיאה במחיקת השיר");
        setSnackbarOpen(true);
      }
    }
  };

  const handleMouseEnter = (index: number) => {
    setHoveredValue(index + 1);
  };

  const handleMouseLeave = () => {
    setHoveredValue(null);
  };

  const handleClick = (index: number) => {
    setNewRating(index + 1);
  };

  useEffect(() => {
    const fetchSongData = async () => {
      try {
        const songData = await getSongById(songId ? +songId : 0);
        setSong(songData);
        const artistData = await getArtistById(songData.userId);
        setArtist(artistData);
        setComments(songData.comments);
      } catch (error) {
        console.error("שגיאה בטעינת הנתונים:", error);
      }
    };
    fetchSongData();
  }, [songId]);

  const handleAddComment = async () => {
    if (!newRating && !newComment.trim()) return;
    try {
      const comment = await addComment({
        content: newComment,
        star: newRating ? newRating : 0,
        songId: song?.id!,
        userId: user.id,
      });
      const newC = {
        ...comment,
        user: { pathProfile: user.pathProfile, userName: user.userName, id: user.id },
      };
      setComments((prev) => [...prev, newC]);
      setNewComment("");
      setNewRating(null);
      setOpen(false);
    } catch (error) {
      console.error("שגיאה בהוספת תגובה:", error);
    }
  };
  const handleDownload = async () => {
    if (song?.pathSong) {
      try {
        const response = await fetch(song.pathSong);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = song.title + ".mp3"; // או פורמט הקובץ שלך
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (error) {
        console.error("שגיאה בהורדת השיר:", error);
      }
    }
  };
  const averageRating =
    comments.length > 0
      ? comments.reduce((sum, comment) => sum + comment.star, 0) / comments.length
      : 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddComment(); // אם לוחצים על Enter, התגובה תישלח
    }
  };

  return (
    <Box sx={{ padding: "30px", minHeight: "100vh", marginTop: "60px" }}>
      {song && (
        <Card
          sx={{
            backgroundColor: "#181818",
            color: "#E0E0E0",
            padding: "30px",
            borderRadius: "12px",
            marginBottom: "30px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Avatar src={"/avatars/music2.jpg"} sx={{ width: 140, height: 140, marginLeft: "20px" }} />

            {/* פרטי השיר בצד ימין */}
            <Box sx={{ textAlign: "right", flex: 1 }}>
              <Typography variant="h4" gutterBottom sx={{ color: "#FF8C00", fontWeight: "bold" }}>
                {song.title}
              </Typography>
              <Typography variant="h6" color="gray">יוצר: {artist?.userName}</Typography>
              <Typography variant="body1" sx={{ color: "#B0B0B0", fontStyle: "italic" }}>ז׳אנר: {song.gener}</Typography>

              {/* דירוג הכוכבים */}
              <Box sx={{ display: "flex", alignItems: "center", textAlign: "right", marginTop: "20px" }}>
                <Box sx={{ display: "flex", direction: "rtl", gap: "5px" }}>
                  {[...Array(5)].map((_, index) => {
                    const isHalfStar = averageRating - index > 0 && averageRating - index < 1;
                    const isFullStar = averageRating - index >= 1;

                    return (
                      <Box
                        key={index}
                        sx={{
                          cursor: "pointer",
                          color: isFullStar ? "#FF8C00" : isHalfStar ? "#FF8C00" : "#B0B0B0",
                          fontSize: "36px", // גודל גדול יותר לכוכבים
                          transition: "color 0.3s ease",
                          borderRadius: "50%",
                        }}
                      >
                        {isHalfStar ? "☆" : "★"} {/* חצי כוכב או כוכב מלא */}
                      </Box>
                    );
                  })}
                </Box>
                <Typography variant="body1" sx={{ color: "#FF8C00", marginRight: "10px" }}>
                  {averageRating.toFixed(1)} {/* הצגת הממוצע */}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* כפתורים בצד שמאל למעלה */}
           
            <Box sx={{ position: "absolute", top: "20px", left: "20px", display: "flex", gap: "10px" }}>
              <IconButton onClick={handleDownload} sx={{ color: "#FF8C00", "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" } }}>
                <Download />
              </IconButton>
              {isOwner&&(<IconButton onClick={() => handleEdit(song)} sx={{ color: "white", "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" }, }}>
                <Edit />
              </IconButton>)}
              {isOwner&&(<IconButton onClick={() => handleDelete(song.id)} sx={{ color: "red", "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" }, }}>
                <Delete  />
              </IconButton>)}
            </Box>
          

          {/* כפתור הוספת תגובה בצד שמאל למטה */}
          {user?.id !== 0 && (
            <Button
              onClick={() => setOpen(!open)}
              startIcon={<AddComment />}
              sx={{
                border: "2px solid #FF8C00",
                color: "#FFFFFF",
                borderRadius: "25px",
                padding: "8px 16px", // קטן ועדין יותר
                position: "absolute",
                bottom: "20px",
                left: "20px", // בצד שמאל
                fontSize: "12px", // גודל טקסט קטן
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#FF8C00",
                  opacity: "0.8",
                },
              }}
            >
              הוסף תגובה
            </Button>
          )}
        </Card>




      )}

      <Collapse in={open}>
        <Card
          sx={{
            backgroundColor: "#1E1E1E",
            color: "#E0E0E0",
            padding: "20px",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* כוכבים */}
          <Box sx={{ display: "flex", direction: "rtl", marginBottom: "10px" }}>
            {[...Array(maxStars)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  cursor: "pointer",
                  color: index < (hoveredValue || newRating) ? "#FF8C00" : "#B0B0B0",
                  fontSize: "30px",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(index)}
              >
                ★
              </Box>
            ))}
          </Box>

          {/* Input עם אייקון */}
          <TextField
            fullWidth
            multiline
            rows={1}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
            placeholder="כתוב כאן את התגובה שלך..."
            sx={{
              backgroundColor: "#2A2A2A",
              borderRadius: "8px",
              color: "#FFFFFF",
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleAddComment} color="primary">
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Card>
      </Collapse>

      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: "#1E1E1E",
              color: "#E0E0E0",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "12px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
              <Avatar
                src={comment.user.pathProfile || "/avatars/default-avatar.jpg"}
                sx={{ width: 50, height: 50, marginRight: "15px" }}
              />
              <Typography variant="h6" sx={{ color: "#FF8C00" }}>
                {comment.user.userName}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ marginBottom: "10px" }}>
              {comment.content}
            </Typography>
            <Rating value={comment.star} readOnly precision={0.5} sx={{ marginBottom: "10px", color: "#FF8C00" }} />
          </Card>
        ))
      ) : (
        <Typography color="gray">אין תגובות עדיין.</Typography>
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

export default SongComments;
