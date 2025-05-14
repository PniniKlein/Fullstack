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

// "use client"

// import type React from "react"

// import { Box, Typography, IconButton, Paper } from "@mui/material"
// import { Edit, MoreVert, PlayArrowRounded, Public } from "@mui/icons-material"
// import { useDispatch, useSelector } from "react-redux"
// import type { Dispatch, StoreType } from "../store/store"
// import type { Song } from "../model/Song"
// import { loadSong, updateSong } from "../store/songSlice"
// import { useNavigate } from "react-router-dom"
// import { useState } from "react"
// import "../css/SongCard.css"
// import { updateSongToPublic } from "../services/SongsService"
// import { getUserDataFromToken } from "./AppLayout"
// import { loadUser } from "../store/userSlice"
// import SnackbarGreen from "./SnackbarGreen"
// import DownloadSong from "./DownloadSong"
// import GradientIconButton from "./GradientIconButton"
// import ShareSongButton from "./ShareSongButton"
// import DeleteSong from "./DeleteSong"

// interface SongCardProps {
//   song: Song
//   activeCardId: number | null
//   onCardClick: (event: React.MouseEvent, songId: number) => void
//   setActiveCardId: Function
//   showActions?: boolean
// }

// const SongCard = ({ song, activeCardId, onCardClick, setActiveCardId, showActions = false }: SongCardProps) => {
//   const handleMouseDown = (songId: number) => setActiveCardId(songId)
//   const handleMouseUp = () => setActiveCardId(null)
//   const navigate = useNavigate()
//   const dispatch = useDispatch<Dispatch>()
//   const songPlayer = useSelector((state: StoreType) => state.songPlayer.song)
//   const [showOptions, setShowOptions] = useState(false)
//   const [snackbarOpen, setSnackbarOpen] = useState(false)
//   const [snackbarMessage, setSnackbarMessage] = useState("")

//   const handleEdit = (song: Song) => navigate("/updateSong", { state: { song } })

//   const updateToPublic = async (songId: number) => {
//     await updateSongToPublic(songId)
//     if (songPlayer.id === songId) {
//       const updatedSong = { ...songPlayer, isPublic: true }
//       dispatch(loadSong(updatedSong))
//     }
//     const token = localStorage.getItem("authToken")
//     setSnackbarMessage("השיר הפך לציבורי!")
//     if (token) {
//       const id = getUserDataFromToken(token)
//       if (id) {
//         dispatch(loadUser(id))
//       }
//     }
//     setShowOptions(false)
//     setSnackbarOpen(true)
//   }

//   return (
//     <>
//       <Paper
//         elevation={3}
//         className={`songCard ${activeCardId === song.id ? "active" : ""}`}
//         onClick={(e) => {
//           if (!showOptions) {
//             onCardClick(e, song.id)
//           }
//         }}
//         onMouseDown={(e) => {
//           const target = e.target as HTMLElement
//           if (!target.closest("button, svg") && !showOptions) {
//             handleMouseDown(song.id)
//           }
//         }}
//         onMouseUp={() => {
//           if (!showOptions) {
//             handleMouseUp()
//           }
//         }}
//         style={{
//           backgroundImage: `url(${song.pathPicture})`,
//         }}
//       >
//         <div className="songCard-overlay"></div>

//         {!showOptions && (
//           <IconButton
//             className="playButton"
//             onClick={(e) => {
//               e.stopPropagation()
//               dispatch(updateSong(song))
//             }}
//           >
//             <div className="playButton-inner">
//               <PlayArrowRounded className="playIcon" />
//             </div>
//           </IconButton>
//         )}

//         {song.isPublic && (
//           <div className="publicBadge">
//             <Public fontSize="small" />
//           </div>
//         )}

//         <Typography
//           className="moreButton"
//           onClick={(e) => {
//             e.stopPropagation()
//             setShowOptions((prev) => !prev)
//           }}
//         >
//           <MoreVert />
//         </Typography>

//         {showOptions && (
//           <Box className="optionsOverlay" onClick={() => setShowOptions(false)}>
//             <Box className="optionsMenu" onClick={(e) => e.stopPropagation()}>
//               {showActions && (
//                 <GradientIconButton
//                   className="optionButton"
//                   onClick={() => handleEdit(song)}
//                   icon={<Edit sx={{ fontSize: 28 }} />}
//                 />
//               )}
//               {showActions && <DeleteSong song={song} className="optionButton" />}
//               {!song.isPublic && (
//                 <GradientIconButton
//                   className="optionButton"
//                   onClick={() => updateToPublic(song.id)}
//                   icon={<Public sx={{ fontSize: 28 }} />}
//                 />
//               )}
//               <DownloadSong className={`optionButton ${!showActions ? "largeOption" : ""}`} song={song} />
//               {song.isPublic && (
//                 <ShareSongButton className={`optionButton ${!showActions ? "largeOption" : ""}`} song={song} />
//               )}
//             </Box>
//           </Box>
//         )}

//         <Box className="songCard-songFooter">
//           <div className="songCard-waveform">
//             {[...Array(12)].map((_, i) => (
//               <div key={i} className="waveform-bar" style={{ height: `${Math.random() * 15 + 5}px` }}></div>
//             ))}
//           </div>
//           <Typography variant="subtitle2" className="song-title">
//             {song.title}
//           </Typography>
//         </Box>
//       </Paper>
//       <SnackbarGreen snackbarMessage={snackbarMessage} snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} />
//     </>
//   )
// }

// export default SongCard
