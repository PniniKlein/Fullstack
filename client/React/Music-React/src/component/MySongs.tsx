import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Song } from "../model/Song";
import { Dispatch, StoreType } from "../store/store";
import AddSong from "./AddSong";
import { loadUser } from "../store/userSlice";
import { getUserDataFromToken } from "./AppLayout";
import SongCard from "./SongCard";
import "../css/MySongs.css";

const MySongs = () => {
  const dispatch = useDispatch<Dispatch>();
  const songs = useSelector((state: StoreType) => state.user.user.songs || []);
  const navigate = useNavigate();
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'public' | 'private'>('public'); 

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const id = getUserDataFromToken(token);
      if (id) {
        dispatch(loadUser(id));
      }
    }
  }, []);

  const handleCardClick = (event: React.MouseEvent, songId: number) => {
    const target = event.target as HTMLElement;
    if ((target.closest("button, svg"))) {
      return;
    }
    setActiveCardId(songId);
    navigate(`/songComments/${songId}`);
  };
  return (
    <Box className="mySongsContainer">
    <Box className="mySongsHeader">
      <Box className="mySongsTitleContainer">
        <Typography className="mySongsTitle">השירים שלי</Typography>
        <Box className="mySongsFilter">
          <Box
            className={`filterOption ${filter === 'private' ? 'active' : ''}`}
            onClick={() => setFilter('private')}
          >
            פרטי
          </Box>
          <Box
            className={`filterOption ${filter === 'public' ? 'active' : ''}`}
            onClick={() => setFilter('public')}
          >
            ציבורי
          </Box>
        </Box>
      </Box>
      <AddSong />
    </Box>
  
    {songs.length !== 0 && (
      <Box className="songsGrid">
        {songs
          .filter((song: Song) => song.isPublic === (filter === "public"))
          .map((song: Song) => (
            <SongCard
              key={song.id}
              song={song}
              activeCardId={activeCardId}
              onCardClick={handleCardClick}
              setActiveCardId={setActiveCardId}
              showActions={true}
            />
          ))}
      </Box>
    )}
  </Box>
  
  );
};

export default MySongs;

