import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, Typography, Avatar, Paper, Box, Stack, Button } from '@mui/material';
import { User } from '../model/User';
import { getArtistByIdFull } from '../services/UserService';
import { IconButton } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Song } from "../model/Song";
import { Dispatch } from "../store/store";
import { updateSong } from "../store/songSlice";
const ArtistSongs = () => {
    const { id } = useParams();
    const [artist, setArtist] = useState<User | null>(null);
    const dispatch = useDispatch<Dispatch>();
    const [currentSong, setCurrentSong] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const navigate = useNavigate();
    const [activeCardId, setActiveCardId] = useState<number | null>(null);

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const response = await getArtistByIdFull(id ? +id : 0)
                // const data = await response.json();
                setArtist(response);
            } catch (error) {
                console.error('Error fetching artist:', error);
            }
        };
        fetchArtist();
    }, [id]);

    if (!artist) {
        return <Typography>Loading...</Typography>;
    }

    const handleCardClick = (event: React.MouseEvent, songId: number) => {
        const target = event.target as HTMLElement;
        if (target.closest("button, svg")) {
            return;
        }
        setActiveCardId(songId);
        navigate(`/songComments/${songId}`);
    };

    const handleMouseDown = (songId: number) => setActiveCardId(songId);
    const handleMouseUp = () => setActiveCardId(null);


    return (
        <div style={{ padding: '24px', marginTop: '80px' }}>
      <Card sx={{ marginBottom: '24px', backgroundColor: '#181818', color: 'white', borderRadius: '20px', padding: '30px' }}>
        <Stack direction="row" alignItems="center">
          <Avatar src={artist.pathProfile} alt={artist.userName} sx={{ width: 170, height: 170, boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}>
            {artist.userName[0]}
          </Avatar>
          <Box sx={{marginRight:'40px'}}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#FFA500' }}>{artist.userName}</Typography>
            <Typography variant="subtitle1" color="#B0B0B0">{artist.email}</Typography>
            <Typography variant="subtitle2" color="#888888">הצטרף בתאריך: {new Date(artist.create_at).toLocaleDateString()}</Typography>
            <Button variant="contained" sx={{ backgroundColor: '#FFA500', color: '#181818', borderRadius: '20px', marginTop: '16px' }} >
              הצטרף למנוי
            </Button>
          </Box>
        </Stack>
      </Card>

            {artist.songs.length > 0 ? (
                <Box
                    sx={{
                        margin: "5%",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "40px",
                        marginTop: "40px",
                    }}
                >
                    {artist.songs.map((song: Song) => (
                        <Paper
                            key={song.id}
                            elevation={3}
                            sx={{
                                textAlign: "left",
                                position: "relative",
                                backgroundColor: "#252525",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                                borderRadius: "12px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                minHeight: "260px",
                                transform: activeCardId === song.id ? "scale(0.95)" : "scale(1)",
                            }}
                            onClick={(e) => handleCardClick(e, song.id)}
                            onMouseDown={(e) => {
                                const target = e.target as HTMLElement;
                                if (!(target.closest("button, svg"))) { handleMouseDown(song.id); }
                            }}
                            onMouseUp={handleMouseUp}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "150px",
                                    backgroundImage: `url(/avatars/music2.jpg)`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    borderRadius: "8px 8px 0 0",
                                    position: "relative",
                                }}
                            >
                                <IconButton
                                    onClick={() => dispatch(updateSong(song))}
                                    sx={{
                                        position: "absolute",
                                        bottom: "10px",
                                        left: "10px",
                                        color: "white",
                                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.6)" },
                                    }}
                                >
                                    {currentSong === song.pathSong && isPlaying ? <Pause fontSize="medium" /> : <PlayArrow fontSize="medium" />}
                                </IconButton>
                            </Box>

                            <Box sx={{ marginLeft: "10px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", textAlign: "left" }}>
                                <Typography fontWeight="bold" mt={1} sx={{ color: "#fff" }}>{song.title}</Typography>
                                <Typography variant="body2" sx={{ color: "#808080" }}>{new Date(song.create_at).toLocaleDateString()}</Typography>
                                <Typography variant="body2" sx={{ color: "#808080" }}>{song.gener}</Typography>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            ) : (
                <Typography color="gray">No songs available.</Typography>
            )}
        </div>
    );
};

export default ArtistSongs;
