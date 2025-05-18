import { useState, useRef, useEffect } from "react";
import { VolumeUp, VolumeOff } from "@mui/icons-material";
import { Box, IconButton, Slider, Typography, CardMedia } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import { useNavigate } from "react-router";
import { SkipPreviousRounded, Replay10Rounded, PlayArrowRounded, PauseRounded, Forward30Rounded, SkipNextRounded } from '@mui/icons-material';
import { resetRestartSong } from "../store/songSlice";
import SongOptionsMenu from "./SongOptionMenu";
import { addPlay } from "../services/SongsService";


const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

const SongPlayer = () => {
    const songPlayer = useSelector((state: StoreType) => state.songPlayer.song);
    const restartSong = useSelector((state: StoreType) => state.songPlayer.restartSong);
    const [hasCountedListen, setHasCountedListen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<Dispatch>();
    const [playbackRate, setPlaybackRate] = useState(1);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = muted ? 0 : volume;
        }
    }, [volume, muted]);

    useEffect(() => {
        if (songPlayer.id !== 0 && audioRef.current && restartSong) {
            audioRef.current.currentTime = 0;
            setHasCountedListen(false);
            audioRef.current.play();
            dispatch(resetRestartSong())
            setIsPlaying(true);
        }
        sessionStorage.setItem('songPlayer', JSON.stringify(songPlayer));
    }, [restartSong]);

    useEffect(() => {
  let listenTimeout: ReturnType<typeof setTimeout>;

  if (isPlaying && !hasCountedListen) {
    listenTimeout = setTimeout(() => {
      if (!audioRef.current?.paused) {
        setHasCountedListen(true);
        addPlay(songPlayer.id);
      }
    }, 5000);
  }

  return () => {
    clearTimeout(listenTimeout);
  };
}, [isPlaying]);


    const togglePlay = () => {
        if (audioRef.current) {
            isPlaying ? audioRef.current.pause() : audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleSeek = (_: any, newValue: number | number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = newValue as number;
            setCurrentTime(newValue as number);
        }
    };

    const handleSongEnd = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setHasCountedListen(false);
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            setCurrentTime(0);
        }
    };

    const skipTime = (seconds: number) => {
        if (audioRef.current) {
            const newTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration);
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    return (
        <>{songPlayer.id !== 0 && (
            <Box sx={{ position: "fixed", bottom: 0, left: 0, width: "100%", background: "linear-gradient(0deg, rgb(0, 0, 0),rgba(11, 11, 10, 0.96),rgba(247, 193, 107, 0))", color: "white", direction: "rtl", paddingTop: '100px', boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.0)" }}>
                <audio ref={audioRef} src={songPlayer.pathSong} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleTimeUpdate} onEnded={handleSongEnd} />

                {/* פס התקדמות */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: -1 }}>
                    <Typography sx={{ mx: 1.5, fontSize: '15px' }}>{formatTime(duration - currentTime)}</Typography>
                    <Slider
                        value={currentTime}
                        max={duration}
                        onChange={handleSeek}
                        sx={{
                            color: '#D59039',
                            height: '3px',
                            '& .MuiSlider-thumb': {
                                width: 18,
                                height: 18,
                                backgroundColor: '#D59039',
                                border: '4px solid rgba(60, 60, 60, 0.8)',
                                '&:focus, &:hover, &:active': {
                                    boxShadow: '0 0 0 8px rgba(0, 0, 0, 0.2)', // עיגול שחור שקוף במעבר עכבר
                                    backgroundColor: '#D59039', // שינוי הצבע גם בפוקוס
                                },

                            },
                            '& .MuiSlider-track': {
                                backgroundColor: 'linear-gradient(90deg, #D59039, #F7C26B);',
                            },
                            '& .MuiSlider-rail': {
                                backgroundColor: 'rgba(240, 240, 240, 0.88)',
                            },
                            '& .MuiSlider-thumb.Mui-active': {
                                boxShadow: '0 0 0 8px rgba(0, 0, 0, 0.2)',
                            },
                        }}
                    />
                    <Typography sx={{ mx: 1.5, fontSize: '15px' }}>{formatTime(currentTime)}</Typography>
                </Box>

                {/* נגן */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: '8px' }}>

                    <Box sx={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
                        <SongOptionsMenu
                            song={songPlayer}
                            playbackRate={playbackRate}
                            onRateChange={(rate) => {
                                setPlaybackRate(rate);
                                if (audioRef.current) {
                                    audioRef.current.playbackRate = rate;
                                }
                            }}
                        />

                        <Slider value={muted ? 0 : volume} min={0} max={1} step={0.01} onChange={(_, newValue) => setVolume(newValue as number)} sx={{
                            color: '#D59039',
                            height: 2,
                            '& .MuiSlider-thumb': {
                                width: 20,
                                height: 20,
                                backgroundColor: '#D59039',
                                border: '4px solid rgba(60, 60, 60, 0.8)',
                                '&:focus, &:hover, &:active': {
                                    boxShadow: '0 0 0 8px rgba(0, 0, 0, 0.2)', // עיגול שחור שקוף במעבר עכבר
                                },

                            },
                            '& .MuiSlider-track': {
                                backgroundColor: 'linear-gradient(90deg, #D59039, #F7C26B);',
                            },
                            '& .MuiSlider-rail': {
                                backgroundColor: 'rgba(240, 240, 240, 0.89)',
                            },
                            '& .MuiSlider-thumb.Mui-active': {
                                boxShadow: '0 0 0 8px rgba(0, 0, 0, 0.2)',
                            },
                            width: 100, mx: 0
                        }} />
                        <IconButton sx={{ color: 'rgba(240, 240, 240, 0.8)' }} onClick={() => setMuted(!muted)}>{muted ? <VolumeOff /> : <VolumeUp />}</IconButton>
                    </Box>

                    <Box
                        sx={{
                            position: "fixed",
                            left: "40%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        {/* כפתור הבא */}
                        <IconButton disabled sx={{ color: 'rgba(240, 240, 240, 0.8)' }} onClick={() => { }}>
                            <SkipNextRounded sx={{ fontSize: 38 }} />
                        </IconButton>
                        {/* כפתור קדימה 30 שניות */}
                        <IconButton sx={{ color: 'rgba(240, 240, 240, 0.8)' }} onClick={() => skipTime(30)}>
                            <Forward30Rounded sx={{ fontSize: 38 }} />
                        </IconButton>

                        {/* כפתור Play/Pause עם אפקט מעגלי צבעוני */}
                        <Box
                            sx={{
                                margin: '10px',
                                width: 53,
                                height: 53,
                                borderRadius: "50%",
                                background: "linear-gradient(90deg, #D59039, #F7C26B);",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.24)",
                            }}
                        >
                            <IconButton
                                onClick={togglePlay}
                                sx={{
                                    backgroundColor: "#111",
                                    borderRadius: "50%",
                                    width: 48,
                                    height: 48,
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "#111",
                                    },
                                }}
                            >
                                {isPlaying ? <PauseRounded sx={{ fontSize: 40 }} /> : <PlayArrowRounded sx={{ fontSize: 47 }} />}
                            </IconButton>
                        </Box>
                        {/* כפתור חזור 10 שניות */}
                        <IconButton sx={{ color: 'rgba(240, 240, 240, 0.8)' }} onClick={() => skipTime(-10)}>
                            <Replay10Rounded sx={{ fontSize: 38 }} />
                        </IconButton>
                        {/* כפתור קודם */}
                        <IconButton disabled sx={{ color: 'rgba(240, 240, 240, 0.8)' }} onClick={() => { }}>
                            <SkipPreviousRounded sx={{ fontSize: 38 }} />
                        </IconButton>


                    </Box>
                    <Box
                        sx={{
                            maxWidth: "38%",
                            whiteSpace: "nowrap", // מונע קפיצה לשורה חדשה
                            overflow: "hidden", // מחביא את הטקסט מעבר למגבלת הרוחב
                            textOverflow: "ellipsis", // מוסיף את ה-...
                            marginLeft: "5px",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 1,
                            position: "relative",
                            cursor: songPlayer.isPublic ? "pointer" : "default",
                            '&::before': songPlayer.isPublic ? {
                                content: '""',
                                position: 'absolute',
                                top: '-5px',
                                left: '-5px',
                                right: '-5px',
                                bottom: '-5px',
                                borderRadius: 1,
                                backgroundColor: 'rgba(200, 200, 200, 0.1)',
                                transition: 'transform 0.05s, opacity 0.2s',
                                opacity: 0,
                                zIndex: -1,
                            } : {},
                            '&:hover::before': songPlayer.isPublic ? {
                                transform: 'scale(1)',
                                opacity: 1,
                            } : {},
                        }}
                        onClick={() => { if (songPlayer.isPublic) navigate('songComments/' + songPlayer.id) }} // כאן תוכל להוסיף ניווט
                    >
                        <Typography variant="h6"
                        sx={{
                            whiteSpace: "nowrap", // מונע קפיצה לשורה חדשה
                            overflow: "hidden", // מחביא את הטקסט מעבר למגבלת הרוחב
                            textOverflow: "ellipsis", // מוסיף את ה-...
                        }}>
                            {songPlayer.title}</Typography>
                        <CardMedia
                            component="img"
                            image={songPlayer.pathPicture}
                            alt={songPlayer.title}
                            sx={{ width: 65, height: 65, borderRadius: 1, mr: 2 }}
                        />
                    </Box>
                </Box>
            </Box>
        )}</>
    );
};

export default SongPlayer;


// "use client"

// import { useState, useRef, useEffect } from "react"
// import { VolumeUp, VolumeOff } from "@mui/icons-material"
// import { Box, IconButton, Slider, Typography, CardMedia } from "@mui/material"
// import { useDispatch, useSelector } from "react-redux"
// import type { Dispatch, StoreType } from "../store/store"
// import { useNavigate } from "react-router"
// import {
//   SkipPreviousRounded,
//   Replay10Rounded,
//   PlayArrowRounded,
//   PauseRounded,
//   Forward30Rounded,
//   SkipNextRounded,
//   MusicNoteRounded,
// } from "@mui/icons-material"
// import { resetRestartSong } from "../store/songSlice"
// import SongOptionsMenu from "./SongOptionMenu"
// import "../css/SongPlayer.css"

// const formatTime = (time: number) => {
//   const hours = Math.floor(time / 3600)
//     .toString()
//     .padStart(2, "0")
//   const minutes = Math.floor((time % 3600) / 60)
//     .toString()
//     .padStart(2, "0")
//   const seconds = Math.floor(time % 60)
//     .toString()
//     .padStart(2, "0")
//   return `${hours}:${minutes}:${seconds}`
// }

// const SongPlayer = () => {
//   const songPlayer = useSelector((state: StoreType) => state.songPlayer.song)
//   const restartSong = useSelector((state: StoreType) => state.songPlayer.restartSong)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [volume, setVolume] = useState(1)
//   const [muted, setMuted] = useState(false)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [isVolumeHovered, setIsVolumeHovered] = useState(false)
//   const [isArtworkExpanded, setIsArtworkExpanded] = useState(false)
//   const audioRef = useRef<HTMLAudioElement | null>(null)
//   const navigate = useNavigate()
//   const dispatch = useDispatch<Dispatch>()
//   const [playbackRate, setPlaybackRate] = useState(1)

//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.volume = muted ? 0 : volume
//     }
//   }, [volume, muted])

//   useEffect(() => {
//     if (songPlayer.id !== 0 && audioRef.current && restartSong) {
//       audioRef.current.currentTime = 0
//       audioRef.current.play()
//       dispatch(resetRestartSong())
//       setIsPlaying(true)
//     }
//     sessionStorage.setItem("songPlayer", JSON.stringify(songPlayer))
//   }, [restartSong, dispatch, songPlayer])

//   const togglePlay = () => {
//     if (audioRef.current) {
//       isPlaying ? audioRef.current.pause() : audioRef.current.play()
//       setIsPlaying(!isPlaying)
//     }
//   }

//   const handleTimeUpdate = () => {
//     if (audioRef.current) {
//       setCurrentTime(audioRef.current.currentTime)
//       setDuration(audioRef.current.duration || 0)
//     }
//   }

//   const handleSeek = (_: any, newValue: number | number[]) => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = newValue as number
//       setCurrentTime(newValue as number)
//     }
//   }

//   const handleSongEnd = () => {
//     if (audioRef.current) {
//       audioRef.current.pause()
//       audioRef.current.currentTime = 0
//       setIsPlaying(false)
//       setCurrentTime(0)
//     }
//   }

//   const skipTime = (seconds: number) => {
//     if (audioRef.current) {
//       const newTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration)
//       audioRef.current.currentTime = newTime
//       setCurrentTime(newTime)
//     }
//   }

//   // Calculate progress percentage for visualizer
//   const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

//   if (songPlayer.id === 0) {
//     return null
//   }

//   return (
//     <Box className="song-player-container">
//       <audio
//         ref={audioRef}
//         src={songPlayer.pathSong}
//         onTimeUpdate={handleTimeUpdate}
//         onLoadedMetadata={handleTimeUpdate}
//         onEnded={handleSongEnd}
//       />

//       {/* Visualizer bars */}
//       <Box className="visualizer-container">
//         {[...Array(50)].map((_, i) => (
//           <div
//             key={i}
//             className={`visualizer-bar ${isPlaying ? "active" : ""}`}
//             style={{
//               height: `${Math.random() * 100}%`,
//               opacity: i / 50 < progressPercentage / 100 ? 1 : 0.2,
//             }}
//           />
//         ))}
//       </Box>

//       {/* Progress bar */}
//       <Box className="progress-container">
//         <Typography className="time-display">{formatTime(currentTime)}</Typography>
//         <Slider value={currentTime} max={duration} onChange={handleSeek} className="progress-slider" />
//         <Typography className="time-display">{formatTime(duration - currentTime)}</Typography>
//       </Box>

//       {/* Player controls */}
//       <Box className="player-controls-container">
//         {/* Volume and options */}
//         <Box
//           className="volume-container"
//           onMouseEnter={() => setIsVolumeHovered(true)}
//           onMouseLeave={() => setIsVolumeHovered(false)}
//         >
//           <SongOptionsMenu
//             song={songPlayer}
//             playbackRate={playbackRate}
//             onRateChange={(rate) => {
//               setPlaybackRate(rate)
//               if (audioRef.current) {
//                 audioRef.current.playbackRate = rate
//               }
//             }}
//           />

//           <Box className={`volume-slider-container ${isVolumeHovered ? "visible" : ""}`}>
//             <Slider
//               value={muted ? 0 : volume}
//               min={0}
//               max={1}
//               step={0.01}
//               onChange={(_, newValue) => setVolume(newValue as number)}
//               className="volume-slider"
//             />
//           </Box>

//           <IconButton className="volume-button" onClick={() => setMuted(!muted)}>
//             {muted ? <VolumeOff /> : <VolumeUp />}
//           </IconButton>
//         </Box>

//         {/* Main controls */}
//         <Box className="main-controls">
//           <IconButton className="control-button secondary" disabled>
//             <SkipPreviousRounded />
//           </IconButton>

//           <IconButton className="control-button" onClick={() => skipTime(-10)}>
//             <Replay10Rounded />
//           </IconButton>

//           <Box className="play-button-container" onClick={togglePlay}>
//             <div className="play-button-outer">
//               <div className="play-button-inner">
//                 {isPlaying ? <PauseRounded className="play-icon" /> : <PlayArrowRounded className="play-icon" />}
//               </div>
//             </div>
//           </Box>

//           <IconButton className="control-button" onClick={() => skipTime(30)}>
//             <Forward30Rounded />
//           </IconButton>

//           <IconButton className="control-button secondary" disabled>
//             <SkipNextRounded />
//           </IconButton>
//         </Box>

//         {/* Song info */}
//         <Box
//           className={`song-info-container ${songPlayer.isPublic ? "clickable" : ""}`}
//           onClick={() => {
//             if (songPlayer.isPublic) navigate("songComments/" + songPlayer.id)
//           }}
//         >
//           <Box
//             className={`artwork-container ${isArtworkExpanded ? "expanded" : ""}`}
//             onClick={(e) => {
//               e.stopPropagation()
//               setIsArtworkExpanded(!isArtworkExpanded)
//             }}
//           >
//             {songPlayer.pathPicture ? (
//               <CardMedia
//                 component="img"
//                 image={songPlayer.pathPicture}
//                 alt={songPlayer.title}
//                 className="song-artwork"
//               />
//             ) : (
//               <Box className="default-artwork">
//                 <MusicNoteRounded />
//               </Box>
//             )}
//             <div className="artwork-overlay"></div>
//           </Box>

//           <Box className="song-text-info">
//             <Typography className="song-title">{songPlayer.title}</Typography>
//             <Typography className="song-artist">{songPlayer.userId || "Unknown Artist"}</Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   )
// }

// export default SongPlayer
