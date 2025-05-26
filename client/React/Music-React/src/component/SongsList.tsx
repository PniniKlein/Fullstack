// import { useEffect, useState } from "react";
// import { Box, Typography } from "@mui/material";
// // import { PlayArrow, Pause } from "@mui/icons-material";
// // import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Song } from "../model/Song";
// // import { Dispatch } from "../store/store";
// import { getAllPublic } from "../services/SongsService";
// // import { updateSong } from "../store/songSlice";
// import SongFilters from "./SongFilter";
// import SongCard from "./SongCard";
// const SongsList = () => {
//   // const dispatch = useDispatch<Dispatch>();
//   const [songs, setSongs] = useState<Song[]>([]);
//   const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
//   const navigate = useNavigate();
//   const [activeCardId, setActiveCardId] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [sortOption, setSortOption] = useState<string>("title");
//   const [genreFilter, setGenreFilter] = useState<string>("all");
//   useEffect(() => {
//     const fetchSongs = async () => {
//       const res = await getAllPublic();
//       setSongs(res);
//       setFilteredSongs(res);
//     };
//     fetchSongs();
//   }, []);

//   useEffect(() => {
//     let filtered = [...songs];
//     console.log(sortOption)

//     if (searchTerm) {
//       filtered = filtered.filter(song => song.title.toLowerCase().includes(searchTerm.toLowerCase()));
//     }

//     if (genreFilter !== "all") {
//       filtered = filtered.filter(song => song.gener === genreFilter);
//     }

//     if (sortOption == "date") {
//       // מיון לפי תאריך מהחדש לישן
//       filtered.sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime());
//     } else {
//       // מיון לפי שם - עברית תחילה
//       filtered.sort((a, b) => {
//         const isAHebrew = /^[\u0590-\u05FF]/.test(a.title);
//         const isBHebrew = /^[\u0590-\u05FF]/.test(b.title);

//         if (isAHebrew && !isBHebrew) return -1;
//         if (!isAHebrew && isBHebrew) return 1;

//         return a.title.localeCompare(b.title, "he");
//       });
//     }

//     setFilteredSongs(filtered);

//   }, [searchTerm, sortOption, genreFilter, songs]);

//   const genres = Array.from(
//     new Set(songs.map(song => song.gener).filter((g): g is string => typeof g === "string"))
//   );

//   const handleCardClick = (event: React.MouseEvent, songId: number) => {
//     const target = event.target as HTMLElement;

//     if (target.closest("button, svg")) {
//       return;
//     }
//     setActiveCardId(songId);
//     navigate(`/songComments/${songId}`);
//   };

//   return (
//     <Box sx={{ color: "white" }}>

//       <SongFilters
//         sortOption={sortOption}
//         setSortOption={setSortOption}
//         genreFilter={genreFilter}
//         setGenreFilter={setGenreFilter}
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         genres={genres}
//       />

//       {filteredSongs.length === 0 ? (
//         <Typography textAlign="center" sx={{ marginTop: "20px" }}>
//           !אין לך שירים עדיין. נסה להעלות שיר חדש
//         </Typography>
//       ) : (
//         <Box
//           sx={{
//             margin: "5%",
//             display: "grid",
//             gridTemplateColumns: "repeat(4, 1fr)",
//             gap: "40px",
//             marginTop: "60px",
//             // padding:"20px",
//             paddingTop: "0px",
//           }}
//         >
//           {filteredSongs.map((song: Song) => (
//                 <SongCard
//                 key={song.id}
//                 song={song}
//                 activeCardId={activeCardId}
//                 onCardClick={handleCardClick}
//                 setActiveCardId={setActiveCardId}
//               />
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default SongsList;

// // "use client"

// // import type React from "react"

// // import { useEffect, useState } from "react"
// // import { Box, Typography } from "@mui/material"
// // import { useDispatch } from "react-redux"
// // import { useNavigate } from "react-router-dom"
// // import type { Song } from "../model/Song"
// // import type { Dispatch } from "../store/store"
// // import { getAllPublic } from "../services/SongsService"
// // import SongFilters from "./SongFilter"
// // import SongCard from "./SongCard"
// // import "../css/SongsList.css"

// // const SongsList = () => {
// //   const dispatch = useDispatch<Dispatch>()
// //   const [songs, setSongs] = useState<Song[]>([])
// //   const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
// //   const navigate = useNavigate()
// //   const [activeCardId, setActiveCardId] = useState<number | null>(null)
// //   const [searchTerm, setSearchTerm] = useState<string>("")
// //   const [sortOption, setSortOption] = useState<string>("title")
// //   const [genreFilter, setGenreFilter] = useState<string>("all")
// //   const [isLoading, setIsLoading] = useState<boolean>(true)

// //   useEffect(() => {
// //     const fetchSongs = async () => {
// //       setIsLoading(true)
// //       try {
// //         const res = await getAllPublic()
// //         setSongs(res)
// //         setFilteredSongs(res)
// //       } catch (error) {
// //         console.error("Error fetching songs:", error)
// //       } finally {
// //         setIsLoading(false)
// //       }
// //     }
// //     fetchSongs()
// //   }, [])

// //   useEffect(() => {
// //     let filtered = [...songs]

// //     if (searchTerm) {
// //       filtered = filtered.filter((song) => song.title.toLowerCase().includes(searchTerm.toLowerCase()))
// //     }

// //     if (genreFilter !== "all") {
// //       filtered = filtered.filter((song) => song.gener === genreFilter)
// //     }

// //     if (sortOption === "date") {
// //       filtered.sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())
// //     } else {
// //       filtered.sort((a, b) => {
// //         const isAHebrew = /^[\u0590-\u05FF]/.test(a.title)
// //         const isBHebrew = /^[\u0590-\u05FF]/.test(b.title)

// //         if (isAHebrew && !isBHebrew) return -1
// //         if (!isAHebrew && isBHebrew) return 1

// //         return a.title.localeCompare(b.title, "he")
// //       })
// //     }

// //     setFilteredSongs(filtered)
// //   }, [searchTerm, sortOption, genreFilter, songs])

// //   const genres = Array.from(new Set(songs.map((song) => song.gener).filter((g): g is string => typeof g === "string")))

// //   const handleCardClick = (event: React.MouseEvent, songId: number) => {
// //     const target = event.target as HTMLElement

// //     if (target.closest("button, svg")) {
// //       return
// //     }
// //     setActiveCardId(songId)
// //     navigate(`/songComments/${songId}`)
// //   }

// //   return (
// //     <Box className="songs-list-container">
// //       <SongFilters
// //         sortOption={sortOption}
// //         setSortOption={setSortOption}
// //         genreFilter={genreFilter}
// //         setGenreFilter={setGenreFilter}
// //         searchTerm={searchTerm}
// //         setSearchTerm={setSearchTerm}
// //         genres={genres}
// //       />

// //       {isLoading ? (
// //         <Box className="songs-loading">
// //           <div className="pulse-loader"></div>
// //           <Typography>טוען שירים...</Typography>
// //         </Box>
// //       ) : filteredSongs.length === 0 ? (
// //         <Box className="songs-empty-state">
// //           <div className="empty-icon"></div>
// //           <Typography>!אין לך שירים עדיין. נסה להעלות שיר חדש</Typography>
// //         </Box>
// //       ) : (
// //         <Box className="songs-grid">
// //           {filteredSongs.map((song: Song) => (
// //             <SongCard
// //               key={song.id}
// //               song={song}
// //               activeCardId={activeCardId}
// //               onCardClick={handleCardClick}
// //               setActiveCardId={setActiveCardId}
// //             />
// //           ))}
// //         </Box>
// //       )}
// //     </Box>
// //   )
// // }

// // export default SongsList
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import type { Song } from "../model/Song"
import { getAllPublic } from "../services/SongsService"
import SongFilters from "./SongFilters"
import SongCard from "./SongCard"
import { Music, Award } from "lucide-react"
import "../css/SongsList.css"

const SongsList = () => {
  const [songs, setSongs] = useState<Song[]>([])
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [activeCardId, setActiveCardId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortOption, setSortOption] = useState<string>("title")
  const [genreFilter, setGenreFilter] = useState<string>("all")

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true)
      try {
        const res = await getAllPublic()
        setSongs(res)
        setFilteredSongs(res)
      } catch (error) {
        console.error("שגיאה בטעינת השירים:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSongs()
  }, [])

  useEffect(() => {
    let filtered = [...songs]

    if (searchTerm) {
      filtered = filtered.filter((song) => song.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (genreFilter !== "all") {
      filtered = filtered.filter((song) => song.gener === genreFilter)
    }

    if (sortOption === "date") {
      filtered.sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())
    } else {
      filtered.sort((a, b) => {
        const isAHebrew = /^[\u0590-\u05FF]/.test(a.title)
        const isBHebrew = /^[\u0590-\u05FF]/.test(b.title)

        if (isAHebrew && !isBHebrew) return -1
        if (!isAHebrew && isBHebrew) return 1

        return a.title.localeCompare(b.title, "he")
      })
    }

    setFilteredSongs(filtered)
  }, [searchTerm, sortOption, genreFilter, songs])

  const genres = Array.from(new Set(songs.map((song) => song.gener).filter((g): g is string => typeof g === "string")))

  const handleCardClick = (event: React.MouseEvent, songId: number) => {
    const target = event.target as HTMLElement

    if (target.closest("button, svg")) {
      return
    }
    setActiveCardId(songId)
    navigate(`/songComments/${songId}`)
  }

  return (
    <div className="songs-list-modern">
      {/* Background Effects */}
      <div className="songs-background-effects">
        <div className="songs-gradient-orb orb-1"></div>
        <div className="songs-gradient-orb orb-2"></div>
        <div className="songs-gradient-orb orb-3"></div>

        {/* Floating Musical Notes */}
        <div className="floating-songs-notes">
          <div className="songs-note note-1">♪</div>
          <div className="songs-note note-2">♫</div>
          <div className="songs-note note-3">♬</div>
          <div className="songs-note note-4">♬</div>
          <div className="songs-note note-5">♪</div>
          <div className="songs-note note-6">♫</div>
        </div>
      </div>

      {/* Header */}
      <motion.div
        className="songs-header-modern"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="songs-title-section">
          <div className="title-icon-container">
            <Music size={36} className="title-icon" />
          </div>
          <h1 className="songs-title">גלה שירים</h1>
          <p className="songs-subtitle">חקור את הספרייה המוזיקלית שלנו</p>
        </div>

        {/* Filters Section */}
        <div className="songs-filters-modern" style={{zIndex: 1}}>
          <SongFilters
            sortOption={sortOption}
            setSortOption={setSortOption}
            genreFilter={genreFilter}
            setGenreFilter={setGenreFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            genres={genres}
          />
        </div>
      </motion.div>

      {/* Content */}
      <div className="songs-content-modern">
        {loading ? (
          <div className="songs-loading-modern">
            <motion.div
              className="loading-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="loading-spinner"></div>
              <div className="loading-text">טוען שירים ...</div>
            </motion.div>

            {/* Loading Skeletons */}
            <div className="songs-grid-modern">
              {Array(12)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="song-skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-genre"></div>
                    <div className="skeleton-stats"></div>
                  </div>
                ))}
            </div>
          </div>
        ) : filteredSongs.length === 0 ? (
          <motion.div
            className="songs-empty-modern"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty-icon-container">
              <div className="empty-glow"></div>
              {/* <Music size={64} className="empty-icon" /> */}
            </div>
            <h3>לא נמצאו שירים</h3>
            <p>נסה לחפש במילות מפתח אחרות או שנה את הפילטרים</p>
          </motion.div>
        ) : (
          <motion.div
            className="songs-grid-modern"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence>
              {filteredSongs.map((song, index) => (
                <motion.div
                  key={song.id}
                  className="song-card-wrapper"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  style={{ "--index": index } as React.CSSProperties}
                  onClick={(e) => handleCardClick(e, song.id)}
                >
                  <SongCard
                    song={song}
                    activeCardId={activeCardId}
                    onCardClick={handleCardClick}
                    setActiveCardId={setActiveCardId}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Results Counter */}
      {!loading && (
        <motion.div
          className="results-counter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Award size={16} />
          <span>
            {searchTerm || genreFilter !== "all"
              ? `נמצאו ${filteredSongs.length} שירים`
              : `${filteredSongs.length} שירים בספרייה שלנו`}
          </span>
        </motion.div>
      )}
    </div>
  )
}

export default SongsList
