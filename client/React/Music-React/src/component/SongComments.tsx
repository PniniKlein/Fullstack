import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSongById } from "../services/SongsService";
import { addComment } from "../services/CommentsService";
import { Song } from "../model/Song";
import { Avatar, Box, Card, Typography, Button, Collapse } from "@mui/material";
import { Comment } from "../model/Comment";
import { Edit, PlayArrowRounded } from "@mui/icons-material";
import { UserPostModel } from "../model/PostModel/UserPostModel";
import { getArtistById } from "../services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import { updateSong } from "../store/songSlice";
import DownloadSong from "./DownloadSong";
import AddComment from "./AddComment";
import Comments from "./Comments";
import GradientIconButton from "./GradientIconButton";
import "../css/SongComments.css"; // הוספת קובץ ה-CSS
import ShareSongButton from "./ShareSongButton";
import DeleteSong from "./DeleteSong";
import TranscriptionButton from "./TranscriptionButton";

const SongComments = () => {
  const { songId } = useParams();
  const user = useSelector((store: StoreType) => store.user.user);
  const [song, setSong] = useState<Song | null>(null);
  const [artist, setArtist] = useState<UserPostModel>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const isOwner = song?.userId === user?.id;

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const handleEdit = (song: Song) => navigate("/updateSong", { state: { song } });

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
              <Typography variant="h3" sx={{width:"85%"}} className="song-title">{song.title}</Typography>
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
            {isOwner && (
              <>
                <GradientIconButton onClick={() => handleEdit(song)} icon={<Edit sx={{ fontSize: 28 }} />} />
                <DeleteSong song={song} />
              </>
            )}
            <DownloadSong song={song} />
            <ShareSongButton song={song} />
            <TranscriptionButton song={song} />
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
    </Box>
  );
};

export default SongComments;

// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import { getSongById } from "../services/SongsService"
// import { addComment } from "../services/CommentsService"
// import type { Song } from "../model/Song"
// import { Avatar, Box, Card, Typography, Button, Collapse } from "@mui/material"
// import type { Comment } from "../model/Comment"
// import { Edit, PlayArrowRounded, MusicNoteRounded, ExpandMore, ExpandLess } from "@mui/icons-material"
// import type { UserPostModel } from "../model/PostModel/UserPostModel"
// import { getArtistById } from "../services/UserService"
// import { useDispatch, useSelector } from "react-redux"
// import type { Dispatch, StoreType } from "../store/store"
// import { updateSong } from "../store/songSlice"
// import DownloadSong from "./DownloadSong"
// import AddComment from "./AddComment"
// import Comments from "./Comments"
// import GradientIconButton from "./GradientIconButton"
// import "../css/SongComments.css"
// import ShareSongButton from "./ShareSongButton"
// import DeleteSong from "./DeleteSong"
// import TranscriptionButton from "./TranscriptionButton"

// const SongComments = () => {
//   const { songId } = useParams()
//   const user = useSelector((store: StoreType) => store.user.user)
//   const [song, setSong] = useState<Song | null>(null)
//   const [artist, setArtist] = useState<UserPostModel>()
//   const [comments, setComments] = useState<Comment[]>([])
//   const [open, setOpen] = useState<boolean>(false)
//   const [showWaveform, setShowWaveform] = useState<boolean>(false)
//   const [isPlaying, setIsPlaying] = useState<boolean>(false)
//   const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
//   const isOwner = song?.userId === user?.id

//   const dispatch = useDispatch<Dispatch>()
//   const navigate = useNavigate()
//   const handleEdit = (song: Song) => navigate("/updateSong", { state: { song } })

//   useEffect(() => {
//     const fetchSongData = async () => {
//       try {
//         const songData = await getSongById(songId ? +songId : 0)
//         setSong(songData)
//         const artistData = await getArtistById(songData.userId)
//         setArtist(artistData)
//         setComments(songData.comments)
//       } catch (error) {
//         console.error("שגיאה בטעינת הנתונים:", error)
//       }
//     }
//     fetchSongData()
//   }, [songId])

//   useEffect(() => {
//     if (song?.pathSong) {
//       const audio = new Audio(song.pathSong)
//       setAudioElement(audio)

//       return () => {
//         audio.pause()
//         audio.src = ""
//       }
//     }
//   }, [song])

//   const handleAddComment = async (newComment: string, newRating: number) => {
//     if (!newRating && !newComment.trim()) return
//     try {
//       const comment = await addComment({
//         content: newComment,
//         star: newRating ? newRating : 0,
//         songId: song?.id!,
//         userId: user.id,
//       })
//       const newC = {
//         ...comment,
//         user: { pathProfile: user.pathProfile, userName: user.userName, id: user.id },
//       }
//       setComments((prev) => [newC, ...prev])
//       setOpen(false)
//     } catch (error) {
//       console.error("שגיאה בהוספת תגובה:", error)
//     }
//   }

//   const handlePlaySong = () => {
//     if (!audioElement) return

//     if (isPlaying) {
//       audioElement.pause()
//     } else {
//       audioElement.play()
//       dispatch(updateSong(song!))
//     }
//     setIsPlaying(!isPlaying)
//   }

//   const averageRating =
//     comments.length > 0 ? comments.reduce((sum, comment) => sum + comment.star, 0) / comments.length : 0

//   return (
//     <Box className="song-comments-container">
//       {song && (
//         <Card className="song-details-card">
//           <Box className="song-card-content">
//             <Box className="song-card-top">
//               <Box className="song-artwork-container" onClick={() => setShowWaveform(!showWaveform)}>
//                 {song.pathPicture ? (
//                   <Avatar src={song.pathPicture} className="song-avatar" />
//                 ) : (
//                   <Avatar className="song-avatar default-avatar">
//                     <MusicNoteRounded />
//                   </Avatar>
//                 )}
//                 <div className="artwork-overlay">{showWaveform ? <ExpandLess /> : <ExpandMore />}</div>
//               </Box>

//               <Box className="song-info">
//                 <Typography variant="h3" className="song-title">
//                   {song.title}
//                 </Typography>
//                 <Typography variant="h6" className="song-artist">
//                   יוצר: {artist?.userName}
//                 </Typography>
//                 <Typography variant="body1" className="song-genre">
//                   ז׳אנר: {song.gener}
//                 </Typography>
//                 <Box className="rating-container">
//                   <Box className="stars-container">
//                     {[...Array(5)].map((_, index) => {
//                       const isFullStar = averageRating >= index + 1
//                       return (
//                         <Box key={index} className={`star ${isFullStar ? "full-star" : ""}`}>
//                           ★
//                         </Box>
//                       )
//                     })}
//                   </Box>
//                   <Typography variant="body1" className="average-rating">
//                     {averageRating.toFixed(1)}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Box>

//             <Collapse in={showWaveform} className="waveform-collapse">
//               <Box className="waveform-container">
//                 <Box className="waveform-visualization">
//                   {[...Array(50)].map((_, i) => (
//                     <div
//                       key={i}
//                       className={`waveform-bar ${isPlaying ? "playing" : ""}`}
//                       style={{
//                         height: `${Math.random() * 80 + 20}%`,
//                       }}
//                     />
//                   ))}
//                 </Box>
//                 <Box className="waveform-controls">
//                   <Button className="play-waveform-button" onClick={handlePlaySong}>
//                     {isPlaying ? "השהה" : "נגן"}
//                   </Button>
//                 </Box>
//               </Box>
//             </Collapse>

//             <Box className="song-actions">
//               <Box className="primary-actions">
//                 <GradientIconButton
//                   onClick={handlePlaySong}
//                   icon={<PlayArrowRounded sx={{ fontSize: 33 }} />}
//                   className="play-button"
//                 />
//                 {isOwner && (
//                   <>
//                     <GradientIconButton
//                       onClick={() => handleEdit(song)}
//                       icon={<Edit sx={{ fontSize: 28 }} />}
//                       className="edit-button"
//                     />
//                     <DeleteSong song={song} />
//                   </>
//                 )}
//               </Box>

//               <Box className="secondary-actions">
//                 <DownloadSong song={song} />
//                 <ShareSongButton song={song} />
//                 <TranscriptionButton songUrl={song.pathSong} />
//               </Box>
//             </Box>
//           </Box>

//           {user?.id !== 0 && (
//             <Box className="add-comment-container">
//               <Button onClick={() => setOpen(!open)} className="add-comment-button">
//                 {open ? "ביטול" : "הוסף תגובה"}
//               </Button>
//             </Box>
//           )}
//         </Card>
//       )}

//       <Collapse in={open} className="add-comment-collapse">
//         <AddComment handleAddComment={handleAddComment} />
//       </Collapse>

//       <Box className="comments-section">
//         {comments.length > 0 ? (
//           <Comments comments={comments} currentUser={user.id} setComments={setComments} />
//         ) : (
//           <Typography className="no-comments-message">אין תגובות עדיין.</Typography>
//         )}
//       </Box>
//     </Box>
//   )
// }

// export default SongComments
