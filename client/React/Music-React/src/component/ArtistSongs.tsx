import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Avatar, Box, Stack, Button } from '@mui/material';
import { User } from '../model/User';
import { addFollowee, getArtistByIdFull, removeFollowee } from '../services/UserService';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Song } from "../model/Song";
import { Dispatch } from "../store/store";
import { useSelector } from "react-redux";
import { StoreType } from "../store/store";
import '../css/ArtistSongs.css';
import SongCard from './SongCard';

const ArtistSongs = () => {
    const { id } = useParams();
    const [artist, setArtist] = useState<User | null>(null);
    const dispatch = useDispatch<Dispatch>();
    const navigate = useNavigate();
    const [activeCardId, setActiveCardId] = useState<number | null>(null);
    const { user } = useSelector((state: StoreType) => state.user);
    const authState = useSelector((state: StoreType) => state.user.authState);
    const isFollow = user.followees.some((f: number) => id ? +id === f : false);
    const [isFollowing, setIsFollowing] = useState(isFollow);


    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const response = await getArtistByIdFull(id ? +id : 0);
                setArtist(response);
                const isFollowee = user.followees.some((f: number) => id ? +id === f : false);
                setIsFollowing(isFollowee);
            } catch (error) {
                console.error('Error fetching artist:', error);
            }
        };
        fetchArtist();
    }, [id]);

    useEffect(() => {
        debugger
        const isFollowee = user.followees.some((f: number) => id ? +id === f : false);
        setIsFollowing(isFollowee);
    }, [authState]);

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

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await removeFollowee(artist.id);
                dispatch({ type: 'user/removeFollowee', payload: artist });
            } else {
                await addFollowee(artist.id, user.id);
                dispatch({ type: 'user/addFollowee', payload: artist });
            }
            setIsFollowing(!isFollowing);
            console.log(user);
        } catch (error) {
            console.error("שגיאה בעדכון מעקב:", error);
        }
    };

    return (
        <div style={{ padding: '24px', marginTop: '80px' }}>
            <Card sx={{ marginBottom: '24px', backgroundColor: '#181818', color: 'white', borderRadius: '20px', padding: '30px' }}>
                <Stack direction="row" alignItems="center">
                    <Avatar src={artist.pathProfile} alt={artist.userName} sx={{ width: 170, height: 170, boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}>
                        {artist.userName[0]}
                    </Avatar>
                    <Box sx={{ marginRight: '40px' }}>
                        <Typography variant="h3" className="artist-name-song">{artist.userName}</Typography>
                        <Typography variant="subtitle1" color="#B0B0B0">{artist.email}</Typography>
                        <Typography variant="subtitle2" color="#888888">הצטרף בתאריך: {new Date(artist.create_at).toLocaleDateString()}</Typography>
                        <Button
                            variant="outlined"
                            className="join-button"
                            onClick={() => handleFollowToggle()}
                        >
                            {isFollowing ? "ביטול מנוי" : "הרשמה למנוי"}
                        </Button>

                    </Box>
                </Stack>
            </Card>

            {artist.songs.length > 0 && (
                <Box sx={{
                    margin: "5%",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "40px",
                    marginTop: "60px",
                    // padding:"20px",
                    paddingTop: "0px",
                }}>
                    {artist.songs.map((song: Song) => (
                        <SongCard
                            key={song.id}
                            song={song}
                            activeCardId={activeCardId}
                            onCardClick={handleCardClick}
                            setActiveCardId={setActiveCardId}
                        />
                    ))}
                </Box>
            )}
        </div>
    );
};

export default ArtistSongs;
