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
import { useState } from "react"
import { IconButton } from "@mui/material"
import { Play, MoreVertical, Headphones, Download, Music, Edit, Trash2, Globe, Eye, Mail, Calendar } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { Dispatch, StoreType } from "../store/store"
import type { Song } from "../model/Song"
import { loadSong, resetSong, updateSong } from "../store/songSlice"
import { useNavigate } from "react-router-dom"
import "../css/SongCard.css"
import { deleteSong, handleDownload, updateSongToPublic } from "../services/SongsService"
import { getUserDataFromToken } from "./AppLayout"
import { loadUser, sendEmail } from "../store/userSlice"

interface SongCardProps {
  song: Song
  activeCardId?: number | null
  onCardClick?: (event: React.MouseEvent, songId: number) => void
  setActiveCardId?: Function
  showActions?: boolean
}

const SongCard = ({ song, activeCardId, onCardClick, setActiveCardId, showActions = true }: SongCardProps) => {
  const [showOptions, setShowOptions] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [shareEmails, setShareEmails] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const user = useSelector((state: StoreType) => state.user.user)

  const sendEmailShare = async (emails: string[], song: Song) => {
const subject = "שיר ששותף איתך ב-singsong";
      const body = `
        <div style="direction: rtl; background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 35px;">
            <h2 style="color: #333; font-size: 24px; text-align: center;">
              ${user?.userName || "משתמש"} שיתף/ה איתך שיר ב-<span style="text-decoration: underline;">singsong</span>
            </h2>
            <p style="font-size: 16px; color: #333;">השיר <strong>${song.title}</strong> מחכה לך!</p>
            <p style="font-size: 16px; color: #333;">לחץ/י על הכפתור למטה כדי להאזין:</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${song.pathSong}" style="display: inline-block; padding: 10px 20px; background: linear-gradient(90deg, #D59039, #F7C26B); color: white; text-decoration: none; border-radius: 30px; font-size: 15px;">
                🎧 האזן/י לשיר
              </a>
            </div>
            <p style="font-size: 15px; color: #888; text-align: center;">נשמע טוב? תמיד אפשר לשתף גם חברים :)</p>
          </div>
        </div>
      `;

      try {
        const result = await dispatch(sendEmail({ to: emails, subject, body }));
        if (result.meta.requestStatus === "fulfilled") {
          console.log("המייל נשלח בהצלחה!");
        } else {
          console.log("שגיאה בשליחת המייל.");
        }
      } catch {
          console.log("שגיאה בשליחת המייל.");
      } finally {
        // setSnackbarOpen(true);
        const token = localStorage.getItem("authToken");
        if (token) {
          const id = getUserDataFromToken(token);
          if (id) {
            dispatch(loadUser(id));
          }
        }
      }
}

  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()
  const songPlayer = useSelector((state: StoreType) => state.songPlayer?.song)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", { year: "numeric", month: "numeric", day: "numeric" })
  }

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(updateSong(song))
  }

  const handleDownload2 = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLoading(true)
    try {
      await handleDownload(song)
      setSnackbarMessage("השיר הורד בהצלחה!")
      setSnackbarOpen(true)
    } catch (error) {
      setSnackbarMessage("שגיאה בהורדת השיר")
      setSnackbarOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowOptions(false)
    setShowShareDialog(true)
  }

  const handleSendShare = async () => {
    if (!shareEmails.trim()) return

    setIsLoading(true)
    try {
      const emailList = shareEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email)
      await sendEmailShare(emailList, song)
      setSnackbarMessage("השיר נשלח בהצלחה!")
      setSnackbarOpen(true)
      setShowShareDialog(false)
      setShareEmails("")
    } catch (error) {
      setSnackbarMessage("שגיאה בשליחת השיר")
      setSnackbarOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate("/updateSong", { state: { song } })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowOptions(false)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    setIsLoading(true)
    try {
       if (await deleteSong(song.id)) {
          if (song.id == songPlayer.id)
              dispatch(resetSong())
              setSnackbarMessage("השיר נמחק בהצלחה!");
              const token = localStorage.getItem("authToken");
              if (token) {
                const id = getUserDataFromToken(token);
                if (id) {
                  dispatch(loadUser(id));
                }
              }
              setSnackbarOpen(true);
        } else {
          setSnackbarMessage("שגיאה במחיקת השיר");
          setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("שגיאה במחיקת השיר")
      setSnackbarOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMakePublic = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLoading(true)
    try {
      await updateSongToPublic(song.id)
      if (songPlayer?.id === song.id) {
        const updatedSong = { ...songPlayer, isPublic: true }
        dispatch(loadSong(updatedSong))
      }

      const token = localStorage.getItem("authToken")
      if (token) {
        const id = getUserDataFromToken(token)
        if (id) {
                dispatch(loadUser(id));
        }
      }

      setSnackbarMessage("השיר הפך לציבורי!")
      setSnackbarOpen(true)
      setShowOptions(false)
    } catch (error) {
      setSnackbarMessage("שגיאה בהפיכת השיר לציבורי")
      setSnackbarOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (onCardClick) {
      onCardClick(e, song.id)
    } else {
      navigate(`/songComments/${song.id}`)
    }
  }

  const handleOptionClick = (action: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowOptions(false)

    switch (action) {
      case "view":
        navigate(`/songComments/${song.id}`)
        break
      case "edit":
        handleEdit(e)
        break
      case "delete":
        handleDelete(e)
        break
      case "play":
        handlePlay(e)
        break
      case "download":
        handleDownload2(e)
        break
      case "share":
        handleShare(e)
        break
      case "makePublic":
        handleMakePublic(e)
        break
      default:
        break
    }
  }

  return (
    <div className="modern-song-card">
      {/* Background Effects */}
      <div className="card-background-effects">
        <div className="card-gradient-orb"></div>
        <div className="card-shimmer"></div>
      </div>

      {/* Top Section - Image & Controls */}
      <div className="card-image-section">
        <div className="card-image-wrapper">
          <div className="card-image" style={{ backgroundImage: `url(${song.pathPicture})` }}></div>
          <div className="card-overlay"></div>

          {/* Play Button */}
          <IconButton className="play-button-modern" onClick={handlePlay}>
            <Play size={24} />
          </IconButton>

          {/* Stats Badge */}
          <div className="stats-badge">
            <Headphones size={14} />
            <span>{song.plays || 0}</span>
          </div>

          {/* More Options */}
          <div className="options-container">
            <IconButton
              className="options-button"
              onClick={(e) => {
                e.stopPropagation()
                setShowOptions(!showOptions)
              }}
            >
              <MoreVertical size={18} />
            </IconButton>

            {showOptions && (
              <div className="options-dropdown-modern">
                <div className="options-header">
                  <Music size={16} />
                  <span>אפשרויות שיר</span>
                </div>

                <div className="options-list">
                  <div className="option-item-modern primary-option" onClick={(e) => handleOptionClick("view", e)}>
                    <Eye size={16} />
                    <span>צפה בפרטים</span>
                    <div className="option-glow"></div>
                  </div>

                  <div className="option-item-modern" onClick={(e) => handleOptionClick("play", e)}>
                    <Play size={16} />
                    <span>נגן עכשיו</span>
                  </div>

                  <div className="option-item-modern" onClick={(e) => handleOptionClick("download", e)}>
                    <Download size={16} />
                    <span>הורד שיר</span>
                  </div>

                  <div className="option-item-modern" onClick={(e) => handleOptionClick("share", e)}>
                    <Mail size={16} />
                    <span>שתף במייל</span>
                  </div>

                  {showActions && (
                    <>
                      <div className="option-item-modern" onClick={(e) => handleOptionClick("edit", e)}>
                        <Edit size={16} />
                        <span>ערוך שיר</span>
                      </div>

                      <div className="option-item-modern" onClick={(e) => handleOptionClick("delete", e)}>
                        <Trash2 size={16} />
                        <span>מחק שיר</span>
                      </div>

                      {!song.isPublic && (
                        <div className="option-item-modern" onClick={(e) => handleOptionClick("makePublic", e)}>
                          <Globe size={16} />
                          <span>הפוך לציבורי</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="card-content-modern" onClick={handleCardClick}>
        <div className="song-title-modern">{song.title}</div>

        {/* Genre */}
        <div className="genre-text-modern">
          <Music size={14} />
          <span className="genre-value">{song.gener || "כללי"}</span>
        </div>

        <div className="song-date-modern">
          <Calendar size={12} />
          <span className="date-value">{formatDate(song.create_at)}</span>
        </div>

        <div className="song-card-elegant-divider">
          <div className="divider-line"></div>
        </div>

        <div className="action-buttons-elegant">
          <button className="action-button-elegant" onClick={(e) => handleOptionClick("view", e)}>
            <Eye size={14} />
            <span>פרטים</span>
          </button>
          <button className="action-button-elegant" onClick={handleDownload2}>
            <Download size={14} />
            <span>הורדה</span>
          </button>
        </div>
      </div>

      {/* Floating Notes */}
      <div className="floating-notes">
        <div className="note note-1">♪</div>
        <div className="note note-2">♫</div>
      </div>
    </div>
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
