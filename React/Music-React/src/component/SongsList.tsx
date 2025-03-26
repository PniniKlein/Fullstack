import { useEffect, useRef, useState } from "react";
import { Box, Typography, IconButton, Paper, Select, MenuItem, TextField } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Song } from "../model/Song";
import { Dispatch } from "../store/store";
import { getAllPublic } from "../services/SongsService";
import { updateSong } from "../store/songSlice";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const SongsList = () => {
  const dispatch = useDispatch<Dispatch>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const navigate = useNavigate();
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("title");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await getAllPublic();
      setSongs(res);
      setFilteredSongs(res);
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    let filtered = songs;
    console.log(sortOption)

    if (searchTerm) {
      filtered = filtered.filter(song => song.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (genreFilter !== "all") {
      filtered = filtered.filter(song => song.gener === genreFilter);
    }

    if (sortOption == "date") {
      // מיון לפי תאריך מהחדש לישן
      filtered.sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime());
    } else {
      // מיון לפי שם - עברית תחילה
      filtered.sort((a, b) => {
        const isAHebrew = /^[\u0590-\u05FF]/.test(a.title);
        const isBHebrew = /^[\u0590-\u05FF]/.test(b.title);

        if (isAHebrew && !isBHebrew) return -1;
        if (!isAHebrew && isBHebrew) return 1;

        return a.title.localeCompare(b.title, "he");
      });
    }

    setFilteredSongs(filtered);

  }, [searchTerm, sortOption, genreFilter, songs]);

  const genres = Array.from(new Set(songs.map(song => song.gener)));

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
    <Box sx={{ padding: "20px", color: "white" }}>

      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px',
        gap: '10px',
        position: 'sticky',
        top: '80px',
        zIndex: 1000
      }}>
        {/* מיון לפי */}
        <Select
          ref={selectRef}
          value={sortOption}
          onChange={(e) => { setSortOption(e.target.value) }}
          size="small"
          dir="ltr"
          IconComponent={(props) => (
            <ExpandMoreIcon {...props} sx={{
              color: '#FFA500',
              transform: props.open ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease'
            }} />
          )}
          sx={{
            backgroundColor: '#222',
            borderRadius: '8px',
            color: 'white',
            width: '180px',
            textAlign: 'right',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            '& .MuiSelect-select': { color: 'white', paddingRight: '12px' },
            '&:hover': { backgroundColor: '#333' },
            input: { color: "white" },
            "& .MuiInputLabel-root": { color: "#ddd" }, // צבע הכותרת בהיר
            "& .MuiInputLabel-root.Mui-focused": { color: "#FF9800" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#666" },
              "&:hover fieldset": { borderColor: "#FF9800" },
              "&.Mui-focused fieldset": { borderColor: "#FF9800" },
            },
            "&:before": { borderBottom: "none" },
            "&:after": { borderBottom: "none" },
            "&:hover:before": { borderBottom: "none !important" }
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: '#333',
                color: 'white',
                borderRadius: '8px',
                '& .MuiMenuItem-root': {
                  '&.Mui-selected': {
                    backgroundColor: '#FFA500',
                    color: 'black',
                  },
                  '&:hover': {
                    backgroundColor: '#444',
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="title">מיין לפי שם</MenuItem>
          <MenuItem value="date">מיין לפי תאריך</MenuItem>
        </Select>

        {/* לפי ז'אנר */}
        <Select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          size="small"
          dir="ltr"
          IconComponent={(props) => (
            <ExpandMoreIcon {...props} sx={{
              color: '#FFA500',
              transform: props.open ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease'
            }} />
          )}
          sx={{
            backgroundColor: '#222',
            borderRadius: '8px',
            color: 'white',
            width: '180px',
            textAlign: 'right',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            '& .MuiSelect-select': { color: 'white', paddingRight: '12px' },
            '&:hover': { backgroundColor: '#333' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: '#333',
                color: 'white',
                borderRadius: '8px',
                '& .MuiMenuItem-root': {
                  '&.Mui-selected': {
                    backgroundColor: '#FFA500',
                    color: 'black',
                  },
                  '&:hover': {
                    backgroundColor: '#444',
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="all">כל הז'אנרים</MenuItem>
          {genres.map((genre, index) => (
            <MenuItem key={index} value={genre}>{genre}</MenuItem>
          ))}
        </Select>

        {/* חיפוש */}
        <TextField
          label="חיפוש"
          variant="outlined"
          size="small"
          sx={{
            backgroundColor: '#222',
            borderRadius: '8px',
            color: 'white',
            width: '150px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            '& .MuiInputBase-input': { color: 'white' },
            '& label': { color: 'gray' },
            '&:hover': { backgroundColor: '#333' },
            input: { color: "white" },
            "& .MuiInputLabel-root": { color: "#ddd" }, // צבע הכותרת בהיר
            "& .MuiInputLabel-root.Mui-focused": { color: "#FF9800" },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": { borderColor: "#666" }
            }
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>






      {filteredSongs.length === 0 ? (
        <Typography textAlign="center" sx={{ marginTop: "20px" }}>
          !אין לך שירים עדיין. נסה להעלות שיר חדש
        </Typography>
      ) : (
        <Box
          sx={{
            margin: "5%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "40px",
            marginTop: "40px",
          }}
        >
          {filteredSongs.map((song: Song) => (
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
      )}
    </Box>
  );
};

export default SongsList;

