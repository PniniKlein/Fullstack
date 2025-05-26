// import { Box, Typography, IconButton, Paper } from "@mui/material";
// import { Edit, MoreVert, PlayArrowRounded, Public } from "@mui/icons-material";
// import { useDispatch, useSelector } from "react-redux";
// import { Dispatch, StoreType } from "../store/store";
// import { Song } from "../model/Song";
// import { loadSong, updateSong } from "../store/songSlice";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import '../css/SongCard.css';
// import { updateSongToPublic } from "../services/SongsService";
// import { getUserDataFromToken } from "./AppLayout";
// import { loadUser } from "../store/userSlice";
// import SnackbarGreen from "./SnackbarGreen";
// import DownloadSong from "./DownloadSong";
// import GradientIconButton from "./GradientIconButton";
// import ShareSongButton from "./ShareSongButton";
// import DeleteSong from "./DeleteSong";

// interface SongCardProps {
//     song: Song;
//     activeCardId: number | null;
//     onCardClick: (event: React.MouseEvent, songId: number) => void;
//     setActiveCardId: Function;
//     showActions?: boolean;
// }

// const SongCard = ({
//     song,
//     activeCardId,
//     onCardClick,
//     setActiveCardId,
//     showActions = false,
// }: SongCardProps) => {

//     const handleMouseDown = (songId: number) => setActiveCardId(songId);
//     const handleMouseUp = () => setActiveCardId(null);
//     const navigate = useNavigate();
//     const dispatch = useDispatch<Dispatch>();
//     const songPlayer = useSelector((state: StoreType) => state.songPlayer.song);
//     const [showOptions, setShowOptions] = useState(false);
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState("");

//     const handleEdit = (song: Song) => navigate("/updateSong", { state: { song } });

//     const updateToPublic = async (songId: number) => {
//         await updateSongToPublic(songId);
//         if (songPlayer.id === songId) {
//             const updatedSong = { ...songPlayer, isPublic: true };
//             dispatch(loadSong(updatedSong));
//         }
//         const token = localStorage.getItem("authToken");
//         setSnackbarMessage("השיר הפך לציבורי!");
//         if (token) {
//             const id = getUserDataFromToken(token);
//             if (id) {
//                 dispatch(loadUser(id));
//             }
//         }
//         setShowOptions(false)
//         setSnackbarOpen(true);
//     };

//     return (<>
//         <Paper
//             elevation={3}
//             className="songCard"
//             onClick={(e) => {
//                 if (!showOptions) {
//                     onCardClick(e, song.id);
//                 }
//             }}
//             onMouseDown={(e) => {
//                 const target = e.target as HTMLElement;
//                 if (!(target.closest("button, svg")) && !showOptions) {
//                     handleMouseDown(song.id);
//                 }
//             }}
//             onMouseUp={() => {
//                 if (!showOptions) {
//                     handleMouseUp();
//                 }
//             }}
//             style={{
//                 backgroundImage: `url(${song.pathPicture})`,
//                 transform: activeCardId === song.id ? "scale(0.95)" : "scale(1)",
//             }}
//         >
//             {!showOptions &&
//                 <IconButton
//                 className="playButton"
//                 onClick={(e) => {
//                     e.stopPropagation();
//                     dispatch(updateSong(song));
//                 }}
//                 sx={{
//                     position: "absolute",
//                     top: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, -50%)",
//                     border: "2px solid white",
//                     borderRadius: "50%",
//                     color: "white",
//                     backgroundColor: "transparent",
//                     boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.78)",
//                     opacity: 0,
//                     transition: "opacity 0.3s ease, transform 0.2s ease",
//                     "&:hover": {
//                         transform: "translate(-50%, -50%) scale(1.1)",
//                         borderColor: "#F7C26B",
//                     },
//                 }}
//             >
//                 <PlayArrowRounded fontSize="large" />
//             </IconButton>
//             }

//             <Typography
//                 className="moreButton"
//                 onClick={(e) => {
//                     e.stopPropagation();
//                     setShowOptions((prev) => !prev);
//                 }}
//             >
//                 <MoreVert />
//             </Typography>

//             {showOptions && (
//                 <Box className="optionsOverlay" onClick={() => setShowOptions(false)}>
//                     <Box
//                         className="optionsMenu"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {showActions && <GradientIconButton className="optionButton" onClick={() => handleEdit(song)} icon={<Edit sx={{ fontSize: 28 }} />} />}
//                         {showActions && <DeleteSong song={song} className="optionButton"/>}
//                         {!song.isPublic && <GradientIconButton className="optionButton" onClick={() => updateToPublic(song.id)} icon={<Public sx={{ fontSize: 28 }} />} />}
//                         <DownloadSong className={`optionButton ${!showActions ? "largeOption" : ""}`} song={song} />
//                         {song.isPublic && <ShareSongButton className={`optionButton ${!showActions ? "largeOption" : ""}`} song={song} />}
//                     </Box>
//                 </Box>
//             )}

//             <Box className="songCard-songFooter">
//                 <Typography variant="subtitle2" className="song-title">
//                     {song.title}
//                 </Typography>
//             </Box>
//         </Paper>
//         <SnackbarGreen snackbarMessage={snackbarMessage} snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} />
//     </>
//     );
// };

// export default SongCard;

"use client"

import type React from "react"
import { Typography } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import type { Dispatch, StoreType } from "../store/store"
import type { Song } from "../model/Song"
import { loadSong, updateSong } from "../store/songSlice"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { updateSongToPublic } from "../services/SongsService"
import { getUserDataFromToken } from "./AppLayout"
import { loadUser } from "../store/userSlice"
import SnackbarGreen from "./SnackbarGreen"
import DownloadSong from "./DownloadSong"
import ShareSongButton from "./ShareSongButton"
import DeleteSong from "./DeleteSong"
import {
  Play,
  Calendar,
  Headphones,
  Music,
  MoreVertical,
  Edit,
  Globe,
  Download,
  Share2,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"
import "../css/SongCard.css"

interface SongCardProps {
  song: Song
  activeCardId: number | null
  onCardClick: (event: React.MouseEvent, songId: number) => void
  setActiveCardId: Function
  showActions?: boolean
}

const SongCard = ({ song, activeCardId, onCardClick, setActiveCardId, showActions = false }: SongCardProps) => {
  const handleMouseDown = (songId: number) => setActiveCardId(songId)
  const handleMouseUp = () => setActiveCardId(null)
  const navigate = useNavigate()
  const dispatch = useDispatch<Dispatch>()
  const songPlayer = useSelector((state: StoreType) => state.songPlayer.song)
  const [showOptions, setShowOptions] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [isHovered, setIsHovered] = useState(false)

  const handleEdit = (song: Song) => {
    navigate("/updateSong", { state: { song } })
    setShowOptions(false)
  }

  const updateToPublic = async (songId: number) => {
    await updateSongToPublic(songId)
    if (songPlayer.id === songId) {
      const updatedSong = { ...songPlayer, isPublic: true }
      dispatch(loadSong(updatedSong))
    }
    const token = localStorage.getItem("authToken")
    setSnackbarMessage("השיר הפך לציבורי!")
    if (token) {
      const id = getUserDataFromToken(token)
      if (id) {
        dispatch(loadUser(id))
      }
    }
    setShowOptions(false)
    setSnackbarOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", { day: "numeric", month: "short" })
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(updateSong(song))
  }

  const optionsData = [
    ...(showActions
      ? [
          { icon: Edit, label: "עריכה", action: () => handleEdit(song), color: "#9CA3AF" },
          { icon: Trash2, label: "מחיקה", action: () => {}, color: "#EF4444", isComponent: true },
        ]
      : []),
    ...(!song.isPublic
      ? [{ icon: Globe, label: "הפוך לציבורי", action: () => updateToPublic(song.id), color: "#6B7280" }]
      : []),
    { icon: Download, label: "הורדה", action: () => {}, color: "#9CA3AF", isComponent: true },
    ...(song.isPublic ? [{ icon: Share2, label: "שיתוף", action: () => {}, color: "#9CA3AF", isComponent: true }] : []),
  ]

  return (
    <>
      <motion.div
        className="dark-song-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={(e) => {
          if (!showOptions) {
            onCardClick(e, song.id)
          }
        }}
        onMouseDown={(e) => {
          const target = e.target as HTMLElement
          if (!target.closest("button, svg") && !showOptions) {
            handleMouseDown(song.id)
          }
        }}
        onMouseUp={() => {
          if (!showOptions) {
            handleMouseUp()
          }
        }}
        style={{
          transform: activeCardId === song.id ? "scale(0.98)" : "scale(1)",
        }}
      >
        {/* Song Image */}
        <div className="song-image-wrapper">
          <div
            className="song-image"
            style={{ backgroundImage: `url(${song.pathPicture || "/placeholder.svg?height=80&width=80"})` }}
          >
            {!song.pathPicture && (
              <div className="image-placeholder">
                <Music size={20} />
              </div>
            )}

            {/* Play Button Overlay */}
            <AnimatePresence>
              {isHovered && (
                <motion.button
                  className="play-button"
                  onClick={handlePlayClick}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={14} fill="currentColor" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Song Content */}
        <div className="song-content">
          <div className="song-header">
            <Typography className="song-title">{song.title}</Typography>
            <div className="song-genre">{song.gener || "כללי"}</div>
          </div>

          <div className="song-stats">
            <div className="stat-item">
              <Calendar size={12} />
              <span>{formatDate(song.create_at)}</span>
            </div>
            <div className="stat-separator">•</div>
            <div className="stat-item">
              <Headphones size={12} />
              <span>{song.plays || Math.floor(Math.random() * 1000)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="song-actions">
          {/* Status */}
          <div className="status-badge">
            {song.isPublic ? (
              <Eye size={12} className="status-icon public" />
            ) : (
              <EyeOff size={12} className="status-icon private" />
            )}
          </div>

          {/* Options */}
          <motion.button
            className="options-button"
            onClick={(e) => {
              e.stopPropagation()
              setShowOptions(!showOptions)
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreVertical size={16} />
          </motion.button>
        </div>

        {/* Hover Effect */}
        <div className="hover-overlay"></div>
      </motion.div>

      {/* Options Menu */}
      <AnimatePresence>
        {showOptions && (
          <>
            <motion.div
              className="options-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOptions(false)}
            />
            <motion.div
              className="options-menu"
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="menu-header">
                <h4>אפשרויות</h4>
                <button className="close-button" onClick={() => setShowOptions(false)}>
                  ×
                </button>
              </div>

              <div className="menu-options">
                {optionsData.map((option, index) => (
                  <motion.div
                    key={index}
                    className="menu-option"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      if (!option.isComponent) {
                        option.action()
                      }
                    }}
                  >
                    <div className="option-icon" style={{ color: option.color }}>
                      <option.icon size={16} />
                    </div>
                    <span className="option-label">{option.label}</span>

                    {/* Component handling */}
                    {option.isComponent && option.label === "מחיקה" && (
                      <div className="component-wrapper">
                        <DeleteSong song={song} />
                      </div>
                    )}
                    {option.isComponent && option.label === "הורדה" && (
                      <div className="component-wrapper">
                        <DownloadSong song={song} />
                      </div>
                    )}
                    {option.isComponent && option.label === "שיתוף" && (
                      <div className="component-wrapper">
                        <ShareSongButton song={song} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SnackbarGreen snackbarMessage={snackbarMessage} snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} />
    </>
  )
}

export default SongCard





// import { Box, Typography, IconButton, Paper, Tooltip } from "@mui/material";
// import { Play, Headphones, StarIcon, DownloadIcon, FileText, Edit, Share, Globe, Plus, Heart, Trash, MoreHorizontal } from 'lucide-react';
// import { useDispatch, useSelector } from "react-redux";
// import { Dispatch, StoreType } from "../store/store";
// import { Song } from "../model/Song";
// import { loadSong, updateSong } from "../store/songSlice";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import '../css/SongCard.css';
// import { updateSongToPublic } from "../services/SongsService";
// import { getUserDataFromToken } from "./AppLayout";
// import { loadUser } from "../store/userSlice";
// import SnackbarGreen from "./SnackbarGreen";

// interface SongCardProps {
//     song: Song;
//     activeCardId: number | null;
//     onCardClick: (event: React.MouseEvent, songId: number) => void;
//     setActiveCardId: Function;
//     showActions?: boolean;
// }

// // פונקציה להמרת מספרים גדולים לפורמט קריא יותר
// const formatNumber = (num: number): string => {
//     if (num >= 1000000) {
//         return (num / 1000000).toFixed(1) + 'M';
//     }
//     if (num >= 1000) {
//         return (num / 1000).toFixed(1) + 'K';
//     }
//     return num.toString();
// };

// const SongCard = ({
//     song,
//     activeCardId,
//     onCardClick,
//     setActiveCardId,
//     showActions = false,
// }: SongCardProps) => {

//     const handleMouseDown = (songId: number) => setActiveCardId(songId);
//     const handleMouseUp = () => setActiveCardId(null);
//     const navigate = useNavigate();
//     const dispatch = useDispatch<Dispatch>();
//     const songPlayer = useSelector((state: StoreType) => state.songPlayer.song);
//     const [showOptions, setShowOptions] = useState(false);
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState("");

//     // נתונים לדוגמה - במציאות יגיעו מהשרת
//     const playCount = song.id * 1234 + 5678; // לדוגמה בלבד
//     const rating = (song.id % 5) + 1; // דירוג בין 1-5

//     const handleEdit = (song: Song) => navigate("/updateSong", { state: { song } });

//     const updateToPublic = async (songId: number) => {
//         await updateSongToPublic(songId);
//         if (songPlayer.id === songId) {
//             const updatedSong = { ...songPlayer, isPublic: true };
//             dispatch(loadSong(updatedSong));
//         }
//         const token = localStorage.getItem("authToken");
//         setSnackbarMessage("השיר הפך לציבורי!");
//         if (token) {
//             const id = getUserDataFromToken(token);
//             if (id) {
//                 dispatch(loadUser(id));
//             }
//         }
//         setShowOptions(false)
//         setSnackbarOpen(true);
//     };

//     const handlePlayClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         dispatch(updateSong(song));
//     };

//     const handleDownload = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         // קוד להורדת השיר
//         console.log("Downloading song:", song.title);
//     };

//     const handleLyrics = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         // קוד להצגת תמלול השיר
//         console.log("Showing lyrics for:", song.title);
//     };

//     return (<>
//         <Paper
//             elevation={3}
//             className="songCard"
//             onClick={(e) => {
//                 if (!showOptions) {
//                     onCardClick(e, song.id);
//                 }
//             }}
//             onMouseDown={(e) => {
//                 const target = e.target as HTMLElement;
//                 if (!(target.closest("button, svg")) && !showOptions) {
//                     handleMouseDown(song.id);
//                 }
//             }}
//             onMouseUp={() => {
//                 if (!showOptions) {
//                     handleMouseUp();
//                 }
//             }}
//             style={{
//                 transform: activeCardId === song.id ? "scale(0.98)" : "scale(1)",
//             }}
//         >
//             {/* תמונת השיר */}
//             <Box className="imageContainer">
//                 <img src={song.pathPicture || "/placeholder.svg"} alt={song.title} />
//                 <Box className="imageOverlay" />
                
//                 {/* נקודות אפשרויות לרוחב על התמונה */}
//                 <Box 
//                     className="optionsMenu"
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         setShowOptions(true);
//                     }}
//                 >
//                     <MoreHorizontal size={16} color="#9A9AA4" />
//                 </Box>
                
//                 {/* תגית דירוג */}
//                 <Box className="ratingBadge">
//                     <StarIcon size={14} className="ratingIcon" />
//                     <Typography className="ratingValue">{rating.toFixed(1)}</Typography>
//                 </Box>
                
//                 <IconButton
//                     className="playButton"
//                     onClick={handlePlayClick}
//                 >
//                     <Play size={24} fill="currentColor" />
//                 </IconButton>
//             </Box>
            
//             {/* תוכן השיר מתחת לתמונה */}
//             <Box className="songContent">
//                 <Typography variant="h6" className="songTitle">
//                     {song.title}
//                 </Typography>
                
//                 {/* נתונים בשורה אחת */}
//                 <Box className="statsContainer">
//                     {/* כמות השמעות */}
//                     <Tooltip title="השמעות">
//                         <Box className="statItem">
//                             <Headphones size={14} className="statIcon" />
//                             <Typography className="statValue">
//                                 {formatNumber(playCount)}
//                             </Typography>
//                         </Box>
//                     </Tooltip>
//                 </Box>
                
//                 {/* קו מפריד */}
//                 <Box className="divider" />
                
//                 {/* כפתורי פעולה */}
//                 <Box className="actionsRow">
//                     {/* כפתור תמלול */}
//                     <Box 
//                         className="actionButton"
//                         onClick={handleLyrics}
//                     >
//                         <FileText size={14} className="actionIcon" />
//                         <Typography className="actionText">תמלול</Typography>
//                     </Box>
                    
//                     {/* כפתור הורדה */}
//                     <Box 
//                         className="actionButton"
//                         onClick={handleDownload}
//                     >
//                         <DownloadIcon size={14} className="actionIcon" />
//                         <Typography className="actionText">Download</Typography>
//                     </Box>
//                 </Box>
//             </Box>
//         </Paper>
        
//         {/* תפריט אפשרויות */}
//         {showOptions && (
//             <Box className="optionsOverlay" onClick={() => setShowOptions(false)}>
//                 <Box
//                     className="optionsPanel"
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     <Box className="optionItem" onClick={handlePlayClick}>
//                         <Play size={18} className="optionIcon" />
//                         <Typography className="optionText">נגן עכשיו</Typography>
//                     </Box>
                    
//                     <Box className="optionItem" onClick={handleDownload}>
//                         <DownloadIcon size={18} className="optionIcon" />
//                         <Typography className="optionText">הורד</Typography>
//                     </Box>
                    
//                     <Box className="optionItem" onClick={handleLyrics}>
//                         <FileText size={18} className="optionIcon" />
//                         <Typography className="optionText">תמלול</Typography>
//                     </Box>
                    
//                     <Box className="optionItem" onClick={(e) => {
//                         e.stopPropagation();
//                         // קוד להוספה לפלייליסט
//                     }}>
//                         <Plus size={18} className="optionIcon" />
//                         <Typography className="optionText">הוסף לפלייליסט</Typography>
//                     </Box>
                    
//                     <Box className="optionItem" onClick={(e) => {
//                         e.stopPropagation();
//                         // קוד להוספה למועדפים
//                     }}>
//                         <Heart size={18} className="optionIcon" />
//                         <Typography className="optionText">הוסף למועדפים</Typography>
//                     </Box>
                    
//                     {song.isPublic && (
//                         <Box className="optionItem" onClick={(e) => {
//                             e.stopPropagation();
//                             // קוד לשיתוף
//                         }}>
//                             <Share size={18} className="optionIcon" />
//                             <Typography className="optionText">שתף</Typography>
//                         </Box>
//                     )}
                    
//                     {!song.isPublic && showActions && (
//                         <Box className="optionItem" onClick={(e) => {
//                             e.stopPropagation();
//                             updateToPublic(song.id);
//                         }}>
//                             <Globe size={18} className="optionIcon" />
//                             <Typography className="optionText">הפוך לציבורי</Typography>
//                         </Box>
//                     )}
                    
//                     {showActions && (
//                         <Box className="optionItem" onClick={(e) => {
//                             e.stopPropagation();
//                             handleEdit(song);
//                         }}>
//                             <Edit size={18} className="optionIcon" />
//                             <Typography className="optionText">ערוך</Typography>
//                         </Box>
//                     )}
                    
//                     {showActions && (
//                         <Box className="optionItem" onClick={(e) => {
//                             e.stopPropagation();
//                             // קוד למחיקה
//                         }}>
//                             <Trash size={18} className="optionIcon" />
//                             <Typography className="optionText">מחק</Typography>
//                         </Box>
//                     )}
//                 </Box>
//             </Box>
//         )}
        
//         <SnackbarGreen snackbarMessage={snackbarMessage} snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} />
//     </>
//     );
// };

// export default SongCard;
