// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getSongById } from "../services/SongsService";
// import { addComment } from "../services/CommentsService";
// import { Song } from "../model/Song";
// import { Avatar, Box, Card, Typography, Button, Collapse } from "@mui/material";
// import { Comment } from "../model/Comment";
// import { Edit, PlayArrowRounded } from "@mui/icons-material";
// import { UserPostModel } from "../model/PostModel/UserPostModel";
// import { getArtistById } from "../services/UserService";
// import { useDispatch, useSelector } from "react-redux";
// import { Dispatch, StoreType } from "../store/store";
// import { updateSong } from "../store/songSlice";
// import DownloadSong from "./DownloadSong";
// import AddComment from "./AddComment";
// import Comments from "./Comments";
// import GradientIconButton from "./GradientIconButton";
// import "../css/SongComments.css"; // הוספת קובץ ה-CSS
// import ShareSongButton from "./ShareSongButton";
// import DeleteSong from "./DeleteSong";
// import TranscriptionButton from "./TranscriptionButton";

// const SongComments = () => {
//   const { songId } = useParams();
//   const user = useSelector((store: StoreType) => store.user.user);
//   const [song, setSong] = useState<Song | null>(null);
//   const [artist, setArtist] = useState<UserPostModel>();
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [open, setOpen] = useState<boolean>(false);
//   const isOwner = song?.userId === user?.id;

//   const dispatch = useDispatch<Dispatch>();
//   const navigate = useNavigate();
//   const handleEdit = (song: Song) => navigate("/updateSong", { state: { song } });

//   useEffect(() => {
//     const fetchSongData = async () => {
//       try {
//         const songData = await getSongById(songId ? +songId : 0);
//         setSong(songData);
//         const artistData = await getArtistById(songData.userId);
//         setArtist(artistData);
//         setComments(songData.comments);
//       } catch (error) {
//         console.error("שגיאה בטעינת הנתונים:", error);
//       }
//     };
//     fetchSongData();
//   }, [songId]);

//   const handleAddComment = async (newComment: string, newRating: number) => {
//     if (!newRating && !newComment.trim()) return;
//     try {
//       const comment = await addComment({
//         content: newComment,
//         star: newRating ? newRating : 0,
//         songId: song?.id!,
//         userId: user.id,
//       });
//       const newC = {
//         ...comment,
//         user: { pathProfile: user.pathProfile, userName: user.userName, id: user.id },
//       };
//       setComments((prev) => [newC, ...prev]);
//       setOpen(false);
//     } catch (error) {
//       console.error("שגיאה בהוספת תגובה:", error);
//     }
//   };

//   const averageRating =
//     comments.length > 0
//       ? comments.reduce((sum, comment) => sum + comment.star, 0) / comments.length
//       : 0;

//   return (
//     <Box className="song-comments-container">
//       {song && (
//         <Card className="song-card">
//           <Box className="song-card-top">
//             <Avatar src={song.pathPicture} className="song-avatar" />
//             <Box className="song-info">
//               <Typography variant="h3" sx={{width:"85%"}} className="song-title">{song.title}</Typography>
//               <Typography variant="h6" className="song-artist">יוצר: {artist?.userName}</Typography>
//               <Typography variant="body1" className="song-genre">ז׳אנר: {song.gener}</Typography>
//               <Box className="rating-box">
//                 <Box className="stars">
//                   {[...Array(5)].map((_, index) => {
//                     const isFullStar = averageRating >= index + 1;
//                     return (
//                       <Box
//                         key={index}
//                         className={`star ${isFullStar ? "full-star" : ""}`}
//                       >
//                         ★
//                       </Box>
//                     );
//                   })}
//                 </Box>
//                 <Typography variant="body1" className="average-rating">
//                   {averageRating.toFixed(1)}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>

//           <Box className="top-left-buttons">
//             <GradientIconButton onClick={() => dispatch(updateSong(song))} icon={<PlayArrowRounded sx={{ fontSize: 33 }} />} />
//             {isOwner && (
//               <>
//                 <GradientIconButton onClick={() => handleEdit(song)} icon={<Edit sx={{ fontSize: 28 }} />} />
//                 <DeleteSong song={song} />
//               </>
//             )}
//             <DownloadSong song={song} />
//             <ShareSongButton song={song} />
//             <TranscriptionButton song={song} />
//           </Box>

//           {user?.id !== 0 && (
//             <Box className="bottom-left-add-comment">
//               <Button
//                 onClick={() => setOpen(!open)}
//                 className="add-comment-button"
//               >
//                 הוסף תגובה
//               </Button>
//             </Box>
//           )}
//         </Card>
//       )}

//       <Collapse in={open}>
//         <AddComment handleAddComment={handleAddComment} />
//       </Collapse>

//       {comments.length > 0 ? (
//         <Comments comments={comments} currentUser={user.id} setComments={setComments} />
//       ) : (
//         <Typography color="gray">אין תגובות עדיין.</Typography>
//       )}
//     </Box>
//   );
// };

// export default SongComments;

// // "use client"

// // import { useEffect, useState } from "react"
// // import { useNavigate, useParams } from "react-router-dom"
// // import { getSongById } from "../services/SongsService"
// // import { addComment } from "../services/CommentsService"
// // import type { Song } from "../model/Song"
// // import { Avatar, Box, Card, Typography, Button, Collapse } from "@mui/material"
// // import type { Comment } from "../model/Comment"
// // import { Edit, PlayArrowRounded, MusicNoteRounded, ExpandMore, ExpandLess } from "@mui/icons-material"
// // import type { UserPostModel } from "../model/PostModel/UserPostModel"
// // import { getArtistById } from "../services/UserService"
// // import { useDispatch, useSelector } from "react-redux"
// // import type { Dispatch, StoreType } from "../store/store"
// // import { updateSong } from "../store/songSlice"
// // import DownloadSong from "./DownloadSong"
// // import AddComment from "./AddComment"
// // import Comments from "./Comments"
// // import GradientIconButton from "./GradientIconButton"
// // import "../css/SongComments.css"
// // import ShareSongButton from "./ShareSongButton"
// // import DeleteSong from "./DeleteSong"
// // import TranscriptionButton from "./TranscriptionButton"

// // const SongComments = () => {
// //   const { songId } = useParams()
// //   const user = useSelector((store: StoreType) => store.user.user)
// //   const [song, setSong] = useState<Song | null>(null)
// //   const [artist, setArtist] = useState<UserPostModel>()
// //   const [comments, setComments] = useState<Comment[]>([])
// //   const [open, setOpen] = useState<boolean>(false)
// //   const [showWaveform, setShowWaveform] = useState<boolean>(false)
// //   const [isPlaying, setIsPlaying] = useState<boolean>(false)
// //   const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
// //   const isOwner = song?.userId === user?.id

// //   const dispatch = useDispatch<Dispatch>()
// //   const navigate = useNavigate()
// //   const handleEdit = (song: Song) => navigate("/updateSong", { state: { song } })

// //   useEffect(() => {
// //     const fetchSongData = async () => {
// //       try {
// //         const songData = await getSongById(songId ? +songId : 0)
// //         setSong(songData)
// //         const artistData = await getArtistById(songData.userId)
// //         setArtist(artistData)
// //         setComments(songData.comments)
// //       } catch (error) {
// //         console.error("שגיאה בטעינת הנתונים:", error)
// //       }
// //     }
// //     fetchSongData()
// //   }, [songId])

// //   useEffect(() => {
// //     if (song?.pathSong) {
// //       const audio = new Audio(song.pathSong)
// //       setAudioElement(audio)

// //       return () => {
// //         audio.pause()
// //         audio.src = ""
// //       }
// //     }
// //   }, [song])

// //   const handleAddComment = async (newComment: string, newRating: number) => {
// //     if (!newRating && !newComment.trim()) return
// //     try {
// //       const comment = await addComment({
// //         content: newComment,
// //         star: newRating ? newRating : 0,
// //         songId: song?.id!,
// //         userId: user.id,
// //       })
// //       const newC = {
// //         ...comment,
// //         user: { pathProfile: user.pathProfile, userName: user.userName, id: user.id },
// //       }
// //       setComments((prev) => [newC, ...prev])
// //       setOpen(false)
// //     } catch (error) {
// //       console.error("שגיאה בהוספת תגובה:", error)
// //     }
// //   }

// //   const handlePlaySong = () => {
// //     if (!audioElement) return

// //     if (isPlaying) {
// //       audioElement.pause()
// //     } else {
// //       audioElement.play()
// //       dispatch(updateSong(song!))
// //     }
// //     setIsPlaying(!isPlaying)
// //   }

// //   const averageRating =
// //     comments.length > 0 ? comments.reduce((sum, comment) => sum + comment.star, 0) / comments.length : 0

// //   return (
// //     <Box className="song-comments-container">
// //       {song && (
// //         <Card className="song-details-card">
// //           <Box className="song-card-content">
// //             <Box className="song-card-top">
// //               <Box className="song-artwork-container" onClick={() => setShowWaveform(!showWaveform)}>
// //                 {song.pathPicture ? (
// //                   <Avatar src={song.pathPicture} className="song-avatar" />
// //                 ) : (
// //                   <Avatar className="song-avatar default-avatar">
// //                     <MusicNoteRounded />
// //                   </Avatar>
// //                 )}
// //                 <div className="artwork-overlay">{showWaveform ? <ExpandLess /> : <ExpandMore />}</div>
// //               </Box>

// //               <Box className="song-info">
// //                 <Typography variant="h3" className="song-title">
// //                   {song.title}
// //                 </Typography>
// //                 <Typography variant="h6" className="song-artist">
// //                   יוצר: {artist?.userName}
// //                 </Typography>
// //                 <Typography variant="body1" className="song-genre">
// //                   ז׳אנר: {song.gener}
// //                 </Typography>
// //                 <Box className="rating-container">
// //                   <Box className="stars-container">
// //                     {[...Array(5)].map((_, index) => {
// //                       const isFullStar = averageRating >= index + 1
// //                       return (
// //                         <Box key={index} className={`star ${isFullStar ? "full-star" : ""}`}>
// //                           ★
// //                         </Box>
// //                       )
// //                     })}
// //                   </Box>
// //                   <Typography variant="body1" className="average-rating">
// //                     {averageRating.toFixed(1)}
// //                   </Typography>
// //                 </Box>
// //               </Box>
// //             </Box>

// //             <Collapse in={showWaveform} className="waveform-collapse">
// //               <Box className="waveform-container">
// //                 <Box className="waveform-visualization">
// //                   {[...Array(50)].map((_, i) => (
// //                     <div
// //                       key={i}
// //                       className={`waveform-bar ${isPlaying ? "playing" : ""}`}
// //                       style={{
// //                         height: `${Math.random() * 80 + 20}%`,
// //                       }}
// //                     />
// //                   ))}
// //                 </Box>
// //                 <Box className="waveform-controls">
// //                   <Button className="play-waveform-button" onClick={handlePlaySong}>
// //                     {isPlaying ? "השהה" : "נגן"}
// //                   </Button>
// //                 </Box>
// //               </Box>
// //             </Collapse>

// //             <Box className="song-actions">
// //               <Box className="primary-actions">
// //                 <GradientIconButton
// //                   onClick={handlePlaySong}
// //                   icon={<PlayArrowRounded sx={{ fontSize: 33 }} />}
// //                   className="play-button"
// //                 />
// //                 {isOwner && (
// //                   <>
// //                     <GradientIconButton
// //                       onClick={() => handleEdit(song)}
// //                       icon={<Edit sx={{ fontSize: 28 }} />}
// //                       className="edit-button"
// //                     />
// //                     <DeleteSong song={song} />
// //                   </>
// //                 )}
// //               </Box>

// //               <Box className="secondary-actions">
// //                 <DownloadSong song={song} />
// //                 <ShareSongButton song={song} />
// //                 <TranscriptionButton songUrl={song.pathSong} />
// //               </Box>
// //             </Box>
// //           </Box>

// //           {user?.id !== 0 && (
// //             <Box className="add-comment-container">
// //               <Button onClick={() => setOpen(!open)} className="add-comment-button">
// //                 {open ? "ביטול" : "הוסף תגובה"}
// //               </Button>
// //             </Box>
// //           )}
// //         </Card>
// //       )}

// //       <Collapse in={open} className="add-comment-collapse">
// //         <AddComment handleAddComment={handleAddComment} />
// //       </Collapse>

// //       <Box className="comments-section">
// //         {comments.length > 0 ? (
// //           <Comments comments={comments} currentUser={user.id} setComments={setComments} />
// //         ) : (
// //           <Typography className="no-comments-message">אין תגובות עדיין.</Typography>
// //         )}
// //       </Box>
// //     </Box>
// //   )
// // }

// // export default SongComments

"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { getSongById } from "../services/SongsService"
import { addComment } from "../services/CommentsService"
import type { Song } from "../model/Song"
import type { Comment } from "../model/Comment"
import type { UserPostModel } from "../model/PostModel/UserPostModel"
import { getArtistById } from "../services/UserService"
import { useDispatch, useSelector } from "react-redux"
import type { Dispatch, StoreType } from "../store/store"
import { updateSong } from "../store/songSlice"
import DownloadSong from "./DownloadSong"
import AddComment from "./AddComment"
import Comments from "./Comments"
import ShareSongButton from "./ShareSongButton"
import DeleteSong from "./DeleteSong"
import TranscriptionButton from "./TranscriptionButton"
import {
  Play,
  Edit,
  Music,
  User,
  Calendar,
  Star,
  MessageCircle,
  Award,
  Eye,
  EyeOff,
  Headphones,
  Heart,
} from "lucide-react"
import "../css/SongComments.css"

const SongComments = () => {
  const { songId } = useParams()
  const user = useSelector((store: StoreType) => store.user.user)
  const [song, setSong] = useState<Song | null>(null)
  const [artist, setArtist] = useState<UserPostModel>()
  const [comments, setComments] = useState<Comment[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()

  const isOwner = song?.userId === user?.id

  const handleEdit = (song: Song) => navigate("/updateSong", { state: { song } })

  useEffect(() => {
    const fetchSongData = async () => {
      setIsLoading(true)
      try {
        const songData = await getSongById(songId ? +songId : 0)
        setSong(songData)
        const artistData = await getArtistById(songData.userId)
        setArtist(artistData)
        setComments(songData.comments)
      } catch (error) {
        console.error("שגיאה בטעינת הנתונים:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSongData()
  }, [songId])

  const handleAddComment = async (newComment: string, newRating: number) => {
    if (!newRating && !newComment.trim()) return
    try {
      const comment = await addComment({
        content: newComment,
        star: newRating ? newRating : 0,
        songId: song?.id!,
        userId: user.id,
      })
      const newC = {
        ...comment,
        user: { pathProfile: user.pathProfile, userName: user.userName, id: user.id },
      }
      setComments((prev) => [newC, ...prev])
      setOpen(false)
    } catch (error) {
      console.error("שגיאה בהוספת תגובה:", error)
    }
  }

  const averageRating =
    comments.length > 0 ? comments.reduce((sum, comment) => sum + comment.star, 0) / comments.length : 0

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  if (isLoading) {
    return (
      <div className="song-comments-refined">
        <div className="song-comments-background-effects">
          <div className="song-comments-gradient-orb orb-1"></div>
          <div className="song-comments-gradient-orb orb-2"></div>
          <div className="song-comments-gradient-orb orb-3"></div>
        </div>

        <div className="song-comments-loading-refined">
          <motion.div
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loading-spinner-refined"></div>
            <div className="loading-text-refined">טוען פרטי שיר...</div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="song-comments-refined">
        <div className="song-comments-background-effects">
          <div className="song-comments-gradient-orb orb-1"></div>
          <div className="song-comments-gradient-orb orb-2"></div>
        </div>

        <motion.div
          className="song-comments-empty-refined"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="empty-icon-container">
            <div className="empty-glow"></div>
            <Music size={64} className="empty-icon" />
          </div>
          <h3>השיר לא נמצא</h3>
          <p>נסה לחפש שיר אחר או חזור לדף הראשי</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="song-comments-refined">
      <div className="song-comments-background-effects">
        <div className="song-comments-gradient-orb orb-1"></div>
        <div className="song-comments-gradient-orb orb-2"></div>
        <div className="song-comments-gradient-orb orb-3"></div>

        <div className="floating-song-comments-notes">
          <div className="song-comments-note note-1">♪</div>
          <div className="song-comments-note note-2">♫</div>
          <div className="song-comments-note note-3">♬</div>
          <div className="song-comments-note note-4">🎵</div>
          <div className="song-comments-note note-5">♪</div>
          <div className="song-comments-note note-6">♫</div>
        </div>
      </div>

      <motion.div
        className="song-details-card-refined"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="song-details-background">
          <div className="details-gradient-orb"></div>
          <div className="details-shimmer"></div>
        </div>

        <div className="song-details-content-refined">
          <div className="song-image-section-details-refined">
            <div className="image-container-details-refined">
              <div className="image-glow-details-refined"></div>
              <div
                className="song-image-details-refined"
                style={{
                  backgroundImage: `url(${song.pathPicture || "/placeholder.svg?height=280&width=280"})`,
                }}
              >
                {!song.pathPicture && (
                  <div className="image-placeholder-details-refined">
                    <Music size={70} />
                  </div>
                )}
              </div>

              <div className="status-badge-details-refined">
                {song.isPublic ? (
                  <>
                    <Eye size={12} />
                    <span>ציבורי</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={12} />
                    <span>פרטי</span>
                  </>
                )}
              </div>

              {/* Quick Actions on Image */}
              <div className="image-quick-actions">
                <motion.button
                  className={`image-action-btn like-btn ${isLiked ? "liked" : ""}`}
                  onClick={handleLike}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                </motion.button>

                <ShareSongButton song={song} />
                <DownloadSong song={song} />
              </div>
            </div>
          </div>

          <div className="song-info-details-refined">
            <div className="song-header-refined">
              <h1 className="song-title-details-refined">{song.title}</h1>

              <div className="song-genre-badge-refined">{song.gener || "כללי"}</div>
            </div>

            <div className="artist-info-details-refined">
              <User size={16} />
              <span>יוצר: {artist?.userName}</span>
            </div>

            <div className="song-meta-details-refined">
              <div className="meta-item-details-refined">
                <Calendar size={14} />
                <span>הועלה ב{formatDate(song.create_at)}</span>
              </div>
              <div className="meta-item-details-refined">
                <Headphones size={14} />
                <span>{song.plays || Math.floor(Math.random() * 1000)} השמעות</span>
              </div>
            </div>

            <div className="rating-section-details-refined">
              <div className="rating-stars-details-refined">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    className={`rating-star-refined ${index < Math.round(averageRating) ? "filled" : ""}`}
                    fill={index < Math.round(averageRating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <div className="rating-info-details-refined">
                <span className="rating-value-refined">{averageRating.toFixed(1)}</span>
                <span className="rating-count-refined">({comments.length} דירוגים)</span>
              </div>
            </div>

            <div className="action-buttons-details-refined">
              <motion.button
                className="play-button-details-refined"
                onClick={() => dispatch(updateSong(song))}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={18} fill="currentColor" />
                <span>השמע</span>
              </motion.button>

              {isOwner && (
                <motion.button
                  className="edit-button-details-refined"
                  onClick={() => handleEdit(song)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit size={16} />
                  <span>ערוך</span>
                </motion.button>
              )}

              <div className="secondary-actions-details-refined">
                <TranscriptionButton song={song} />
                {isOwner && <DeleteSong song={song} />}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {user?.id !== 0 && (
        <motion.div
          className="add-comment-section-refined"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="add-comment-header-refined">
            <MessageCircle size={20} className="comment-icon-refined" />
            <h3>הוסף תגובה</h3>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AddComment handleAddComment={handleAddComment} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            className="toggle-comment-button-refined"
            onClick={() => setOpen(!open)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {open ? "סגור" : "כתוב תגובה"}
          </motion.button>
        </motion.div>
      )}

      <motion.div
        className="comments-section-refined"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {comments.length > 0 ? (
          <Comments comments={comments} currentUser={user.id} setComments={setComments} />
        ) : (
          <div className="no-comments-refined">
            <MessageCircle size={40} className="no-comments-icon-refined" />
            <h4>אין תגובות עדיין</h4>
            <p>היה הראשון להגיב על השיר הזה</p>
          </div>
        )}
      </motion.div>

      
    </div>
  )
}

export default SongComments
