import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteSong, getSongById } from "../services/SongsService";
import { addComment } from "../services/CommentsService";
import { Song } from "../model/Song";
import { Avatar, Box, Card, Typography, Button, Collapse } from "@mui/material";
import { Comment } from "../model/Comment";
import { Edit, Delete, PlayArrowRounded } from "@mui/icons-material";
import { UserPostModel } from "../model/PostModel/UserPostModel";
import { getArtistById } from "../services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import { resetSong, updateSong } from "../store/songSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DownloadSong from "./DownloadSong";
import AddComment from "./AddComment";
import Comments from "./Comments";
import SnackbarGreen from "./SnackbarGreen";
import GradientIconButton from "./GradientIconButton";
import "../css/SongComments.css"; // הוספת קובץ ה-CSS

const MySwal = withReactContent(Swal);

const SongComments = () => {
  const { songId } = useParams();
  const user = useSelector((store: StoreType) => store.user.user);
  const [song, setSong] = useState<Song | null>(null);
  const [artist, setArtist] = useState<UserPostModel>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const isOwner = song?.userId === user?.id;

  const dispatch = useDispatch<Dispatch>();
  const songPlayer = useSelector((state: StoreType) => state.songPlayer.song);
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
        if (songId === songPlayer.id) dispatch(resetSong());
        setSnackbarMessage("השיר נמחק בהצלחה!");
        setSnackbarOpen(true);
        navigate(-1);
      } else {
        setSnackbarMessage("שגיאה במחיקת השיר");
        setSnackbarOpen(true);
      }
    }
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

  const handleAddComment = async (newComment: string, newRating: number) => {
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
      setComments((prev) => [newC, ...prev]);
      setOpen(false);
    } catch (error) {
      console.error("שגיאה בהוספת תגובה:", error);
    }
  };

  const averageRating =
    comments.length > 0
      ? comments.reduce((sum, comment) => sum + comment.star, 0) / comments.length
      : 0;

  return (
    <Box className="song-comments-container">
      {song && (
        <Card className="song-card">
          <Box className="song-card-top">
            <Avatar src={song.pathPicture} className="song-avatar" />
            <Box className="song-info">
              <Typography variant="h3" className="song-title">{song.title}</Typography>
              <Typography variant="h6" className="song-artist">יוצר: {artist?.userName}</Typography>
              <Typography variant="body1" className="song-genre">ז׳אנר: {song.gener}</Typography>
              <Box className="rating-box">
                <Box className="stars">
                  {[...Array(5)].map((_, index) => {
                    const isFullStar = averageRating >= index + 1;
                    return (
                      <Box
                        key={index}
                        className={`star ${isFullStar ? "full-star" : ""}`}
                      >
                        ★
                      </Box>
                    );
                  })}
                </Box>
                <Typography variant="body1" className="average-rating">
                  {averageRating.toFixed(1)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className="top-left-buttons">
            <GradientIconButton onClick={() => dispatch(updateSong(song))} icon={<PlayArrowRounded sx={{ fontSize: 33 }} />} />
            <DownloadSong song={song} />
            {isOwner && (
              <>
                <GradientIconButton onClick={() => handleEdit(song)} icon={<Edit sx={{ fontSize: 28 }} />} />
                <GradientIconButton onClick={() => handleDelete(song.id)} icon={<Delete sx={{ fontSize: 28 }} />} />
              </>
            )}
          </Box>

          {user?.id !== 0 && (
            <Box className="bottom-left-add-comment">
              <Button
                onClick={() => setOpen(!open)}
                className="add-comment-button"
              >
                הוסף תגובה
              </Button>
            </Box>
          )}
        </Card>
      )}

      <Collapse in={open}>
        <AddComment handleAddComment={handleAddComment} />
      </Collapse>

      {comments.length > 0 ? (
        <Comments comments={comments} currentUser={user.id} setComments={setComments} />
      ) : (
        <Typography color="gray">אין תגובות עדיין.</Typography>
      )}

      <SnackbarGreen
        snackbarMessage={snackbarMessage}
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
      />
    </Box>
  );
};

export default SongComments;
