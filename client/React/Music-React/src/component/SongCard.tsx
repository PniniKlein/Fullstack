import { Box, Typography, IconButton, Paper } from "@mui/material";
import { Edit, MoreVert, PlayArrowRounded, Public } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import { Song } from "../model/Song";
import { loadSong, updateSong } from "../store/songSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import '../css/SongCard.css';
import { updateSongToPublic } from "../services/SongsService";
import { getUserDataFromToken } from "./AppLayout";
import { loadUser } from "../store/userSlice";
import SnackbarGreen from "./SnackbarGreen";
import DownloadSong from "./DownloadSong";
import GradientIconButton from "./GradientIconButton";
import ShareSongButton from "./ShareSongButton";
import DeleteSong from "./DeleteSong";

interface SongCardProps {
    song: Song;
    activeCardId: number | null;
    onCardClick: (event: React.MouseEvent, songId: number) => void;
    setActiveCardId: Function;
    showActions?: boolean;
}

const SongCard = ({
    song,
    activeCardId,
    onCardClick,
    setActiveCardId,
    showActions = false,
}: SongCardProps) => {

    const handleMouseDown = (songId: number) => setActiveCardId(songId);
    const handleMouseUp = () => setActiveCardId(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<Dispatch>();
    const songPlayer = useSelector((state: StoreType) => state.songPlayer.song);
    const [showOptions, setShowOptions] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleEdit = (song: Song) => navigate("/updateSong", { state: { song } });

    const updateToPublic = async (songId: number) => {
        await updateSongToPublic(songId);
        if (songPlayer.id === songId) {
            const updatedSong = { ...songPlayer, isPublic: true };
            dispatch(loadSong(updatedSong));
        }
        const token = localStorage.getItem("authToken");
        setSnackbarMessage("השיר הפך לציבורי!");
        if (token) {
            const id = getUserDataFromToken(token);
            if (id) {
                dispatch(loadUser(id));
            }
        }
        setShowOptions(false)
        setSnackbarOpen(true);
    };

    return (<>
        <Paper
            elevation={3}
            className="songCard"
            onClick={(e) => {
                if (!showOptions) {
                    onCardClick(e, song.id);
                }
            }}
            onMouseDown={(e) => {
                const target = e.target as HTMLElement;
                if (!(target.closest("button, svg")) && !showOptions) {
                    handleMouseDown(song.id);
                }
            }}
            onMouseUp={() => {
                if (!showOptions) {
                    handleMouseUp();
                }
            }}
            style={{
                backgroundImage: `url(${song.pathPicture})`,
                transform: activeCardId === song.id ? "scale(0.95)" : "scale(1)",
            }}
        >
            {!showOptions &&
                <IconButton
                className="playButton"
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch(updateSong(song));
                }}
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    border: "2px solid white",
                    borderRadius: "50%",
                    color: "white",
                    backgroundColor: "transparent",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.78)",
                    opacity: 0,
                    transition: "opacity 0.3s ease, transform 0.2s ease",
                    "&:hover": {
                        transform: "translate(-50%, -50%) scale(1.1)",
                        borderColor: "#F7C26B",
                    },
                }}
            >
                <PlayArrowRounded fontSize="large" />
            </IconButton>
            }

            <Typography
                className="moreButton"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions((prev) => !prev);
                }}
            >
                <MoreVert />
            </Typography>

            {showOptions && (
                <Box className="optionsOverlay" onClick={() => setShowOptions(false)}>
                    <Box
                        className="optionsMenu"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {showActions && <GradientIconButton className="optionButton" onClick={() => handleEdit(song)} icon={<Edit sx={{ fontSize: 28 }} />} />}
                        {showActions && <DeleteSong song={song} className="optionButton"/>}
                        {!song.isPublic && <GradientIconButton className="optionButton" onClick={() => updateToPublic(song.id)} icon={<Public sx={{ fontSize: 28 }} />} />}
                        <DownloadSong className={`optionButton ${!showActions ? "largeOption" : ""}`} song={song} />
                        {song.isPublic && <ShareSongButton className={`optionButton ${!showActions ? "largeOption" : ""}`} song={song} />}
                    </Box>
                </Box>
            )}

            <Box className="songCard-songFooter">
                <Typography variant="subtitle2" className="song-title">
                    {song.title}
                </Typography>
            </Box>
        </Paper>
        <SnackbarGreen snackbarMessage={snackbarMessage} snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} />
    </>
    );
};

export default SongCard;
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