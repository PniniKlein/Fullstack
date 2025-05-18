import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
// import { PlayArrow, Pause } from "@mui/icons-material";
// import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Song } from "../model/Song";
// import { Dispatch } from "../store/store";
import { getAllPublic } from "../services/SongsService";
// import { updateSong } from "../store/songSlice";
import SongFilters from "./SongFilter";
import SongCard from "./SongCard";
const SongsList = () => {
  // const dispatch = useDispatch<Dispatch>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const navigate = useNavigate();
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("title");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  useEffect(() => {
    const fetchSongs = async () => {
      const res = await getAllPublic();
      setSongs(res);
      setFilteredSongs(res);
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    let filtered = [...songs];
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

  const genres = Array.from(
    new Set(songs.map(song => song.gener).filter((g): g is string => typeof g === "string"))
  );

  const handleCardClick = (event: React.MouseEvent, songId: number) => {
    const target = event.target as HTMLElement;

    if (target.closest("button, svg")) {
      return;
    }
    setActiveCardId(songId);
    navigate(`/songComments/${songId}`);
  };

  return (
    <Box sx={{ color: "white" }}>

      <SongFilters
        sortOption={sortOption}
        setSortOption={setSortOption}
        genreFilter={genreFilter}
        setGenreFilter={setGenreFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        genres={genres}
      />

      {filteredSongs.length === 0 ? (
        <Typography textAlign="center" sx={{ marginTop: "20px" }}>
          !אין לך שירים עדיין. נסה להעלות שיר חדש
        </Typography>
      ) : (
        <Box
          sx={{
            margin: "5%",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "40px",
            marginTop: "60px",
            // padding:"20px",
            paddingTop: "0px",
          }}
        >
          {filteredSongs.map((song: Song) => (
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
    </Box>
  );
};

export default SongsList;

// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { Box, Typography } from "@mui/material"
// import { useDispatch } from "react-redux"
// import { useNavigate } from "react-router-dom"
// import type { Song } from "../model/Song"
// import type { Dispatch } from "../store/store"
// import { getAllPublic } from "../services/SongsService"
// import SongFilters from "./SongFilter"
// import SongCard from "./SongCard"
// import "../css/SongsList.css"

// const SongsList = () => {
//   const dispatch = useDispatch<Dispatch>()
//   const [songs, setSongs] = useState<Song[]>([])
//   const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
//   const navigate = useNavigate()
//   const [activeCardId, setActiveCardId] = useState<number | null>(null)
//   const [searchTerm, setSearchTerm] = useState<string>("")
//   const [sortOption, setSortOption] = useState<string>("title")
//   const [genreFilter, setGenreFilter] = useState<string>("all")
//   const [isLoading, setIsLoading] = useState<boolean>(true)

//   useEffect(() => {
//     const fetchSongs = async () => {
//       setIsLoading(true)
//       try {
//         const res = await getAllPublic()
//         setSongs(res)
//         setFilteredSongs(res)
//       } catch (error) {
//         console.error("Error fetching songs:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchSongs()
//   }, [])

//   useEffect(() => {
//     let filtered = [...songs]

//     if (searchTerm) {
//       filtered = filtered.filter((song) => song.title.toLowerCase().includes(searchTerm.toLowerCase()))
//     }

//     if (genreFilter !== "all") {
//       filtered = filtered.filter((song) => song.gener === genreFilter)
//     }

//     if (sortOption === "date") {
//       filtered.sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())
//     } else {
//       filtered.sort((a, b) => {
//         const isAHebrew = /^[\u0590-\u05FF]/.test(a.title)
//         const isBHebrew = /^[\u0590-\u05FF]/.test(b.title)

//         if (isAHebrew && !isBHebrew) return -1
//         if (!isAHebrew && isBHebrew) return 1

//         return a.title.localeCompare(b.title, "he")
//       })
//     }

//     setFilteredSongs(filtered)
//   }, [searchTerm, sortOption, genreFilter, songs])

//   const genres = Array.from(new Set(songs.map((song) => song.gener).filter((g): g is string => typeof g === "string")))

//   const handleCardClick = (event: React.MouseEvent, songId: number) => {
//     const target = event.target as HTMLElement

//     if (target.closest("button, svg")) {
//       return
//     }
//     setActiveCardId(songId)
//     navigate(`/songComments/${songId}`)
//   }

//   return (
//     <Box className="songs-list-container">
//       <SongFilters
//         sortOption={sortOption}
//         setSortOption={setSortOption}
//         genreFilter={genreFilter}
//         setGenreFilter={setGenreFilter}
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         genres={genres}
//       />

//       {isLoading ? (
//         <Box className="songs-loading">
//           <div className="pulse-loader"></div>
//           <Typography>טוען שירים...</Typography>
//         </Box>
//       ) : filteredSongs.length === 0 ? (
//         <Box className="songs-empty-state">
//           <div className="empty-icon"></div>
//           <Typography>!אין לך שירים עדיין. נסה להעלות שיר חדש</Typography>
//         </Box>
//       ) : (
//         <Box className="songs-grid">
//           {filteredSongs.map((song: Song) => (
//             <SongCard
//               key={song.id}
//               song={song}
//               activeCardId={activeCardId}
//               onCardClick={handleCardClick}
//               setActiveCardId={setActiveCardId}
//             />
//           ))}
//         </Box>
//       )}
//     </Box>
//   )
// }

// export default SongsList
