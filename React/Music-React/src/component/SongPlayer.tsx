import { useState, useRef, useEffect } from "react";
import { VolumeUp, VolumeOff } from "@mui/icons-material";
import { Box, IconButton, Slider, Typography, CardMedia } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import { useNavigate } from "react-router";
import { SkipPreviousRounded, Replay10Rounded, PlayArrowRounded, PauseRounded, Forward30Rounded, SkipNextRounded } from '@mui/icons-material';
import { resetRestartSong } from "../store/songSlice";
import SongOptionsMenu from "./SongOptionMenu";


const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

const SongPlayer = () => {
    const songPlayer = useSelector((state: StoreType) => state.songPlayer.song);
    const restartSong = useSelector((state: StoreType) => state.songPlayer.restartSong);
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
            audioRef.current.play();
            dispatch(resetRestartSong())
            setIsPlaying(true);
        }
        sessionStorage.setItem('songPlayer', JSON.stringify(songPlayer));
    }, [restartSong]);

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
            <Box sx={{ position: "fixed", bottom: 0, width: "99%", backgroundColor: "#1A1A1A", color: "white", direction: "rtl", paddingTop: '5px' }}>
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
                            height: 4,
                            '& .MuiSlider-thumb': {
                                width: 18,
                                height: 18,
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
                            height: 3,
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
                            <SkipNextRounded sx={{ fontSize: 42 }} />
                        </IconButton>
                        {/* כפתור קדימה 30 שניות */}
                        <IconButton sx={{ color: 'rgba(240, 240, 240, 0.8)' }} onClick={() => skipTime(30)}>
                            <Forward30Rounded sx={{ fontSize: 42 }} />
                        </IconButton>

                        {/* כפתור Play/Pause עם אפקט מעגלי צבעוני */}
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                background: "linear-gradient(90deg, #D59039, #F7C26B);",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
                            }}
                        >
                            <IconButton
                                onClick={togglePlay}
                                sx={{
                                    backgroundColor: "#111",
                                    borderRadius: "50%",
                                    width: 50,
                                    height: 50,
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "#111",
                                    },
                                }}
                            >
                                {isPlaying ? <PauseRounded sx={{ fontSize: 42 }} /> : <PlayArrowRounded sx={{ fontSize: 50 }} />}
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
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 1,
                            position: "relative",
                            cursor: songPlayer.isPublic ? "pointer" : "default",
                            '&::before': songPlayer.isPublic ? {
                                content: '""',
                                position: 'absolute',
                                top: '-7px',
                                left: '-7px',
                                right: '-7px',
                                bottom: '-7px',
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
                        <Typography variant="h6">{songPlayer.title}</Typography>
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
