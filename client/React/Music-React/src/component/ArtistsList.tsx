// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { artistList } from "../services/UserService";
// import { User } from "../model/User";
// import { Grid, Typography, Avatar, Box } from "@mui/material";
// import Search from "./Search";


// const ArtistsList = () => {
//   const [artists, setArtists] = useState<User[]>([]);
//   const navigate = useNavigate();

//   const [filterArtists, setFilterArtists] = useState<User[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>("");


//   const getArtistList = async () => {
//     try {
//       const res = await artistList();
//       const sortedArtists = res.sort((a: User, b: User) =>
//         a.userName?.localeCompare(b.userName || "")
//       );
//       setArtists(sortedArtists);
//       setFilterArtists(artists)
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   useEffect(() => {
//     getArtistList();
//   }, []);

//   useEffect(() => {
//     let filtered = artists;

//     if (searchTerm) {
//       filtered = filtered.filter(artist => artist.userName.toLowerCase().includes(searchTerm.toLowerCase()));
//     }

//     setFilterArtists(filtered);

//   }, [searchTerm, artists]);


//   return (
//     <Box
//       sx={{
//         // padding: "20px",
//         backgroundColor: "#1A1A1A",
//         // minHeight: "85vh",
//         width: "100%",
//         // marginTop: "50px"
//       }}
//     >
//       <Box sx={{
//         display: 'flex',
//         justifyContent: 'flex-end',
//         marginBottom: '20px',
//         left: '0px',
//         gap: '10px',
//         position: 'sticky',
//         top: '85px',
//         zIndex: 1000,
//         width:'50%',
//         marginTop: '0px',
//         marginRight: '50%',
//         marginLeft: '0px'
//       }}>
//         <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
//         {/* </Box> */}
//       </Box>
//       <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
//         <Grid container spacing={4} sx={{ maxWidth: "1300px" }} justifyContent="flex-start">
//           {filterArtists.map((artist) => (
//             <Grid item xs={12} sm={6} md={4} lg={2.4} key={artist.id} textAlign="center">
//               <Box
//                 onClick={() => navigate(`/artists/${artist.id}`)}
//                 sx={{
//                   cursor: "pointer",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                 }}
//               >
//                 <Avatar
//                   src={artist.pathProfile}
//                   alt={artist.userName}
//                   sx={{
//                     width: 190,
//                     height: 190,
//                     backgroundColor: "#333",
//                     marginBottom: "10px",
//                     boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
//                   }}
//                 />
//                 <Typography variant="h6" color="#E0E0E0">
//                   {artist.userName}
//                 </Typography>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default ArtistsList;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { artistList } from "../services/UserService";
// import { User } from "../model/User";
// import { Grid, Typography, Avatar, Box } from "@mui/material";
// import Search from "./Search";


// const ArtistsList = () => {
//   const [artists, setArtists] = useState<User[]>([]);
//   const navigate = useNavigate();

//   const [filterArtists, setFilterArtists] = useState<User[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>("");


//   const getArtistList = async () => {
//     try {
//       const res = await artistList();
//       const sortedArtists = res.sort((a: User, b: User) =>
//         a.userName?.localeCompare(b.userName || "")
//       );
//       setArtists(sortedArtists);
//       setFilterArtists(artists)
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   useEffect(() => {
//     getArtistList();
//   }, []);

//   useEffect(() => {
//     let filtered = artists;

//     if (searchTerm) {
//       filtered = filtered.filter(artist => artist.userName.toLowerCase().includes(searchTerm.toLowerCase()));
//     }

//     setFilterArtists(filtered);

//   }, [searchTerm, artists]);


//   return (
//     <Box
//       sx={{
//         // padding: "20px",
//         backgroundColor: "#1A1A1A",
//         // minHeight: "85vh",
//         width: "100%",
//         // marginTop: "50px"
//       }}
//     >
//       <Box sx={{
//         display: 'flex',
//         justifyContent: 'flex-end',
//         marginBottom: '20px',
//         left: '0px',
//         gap: '10px',
//         position: 'sticky',
//         top: '85px',
//         zIndex: 1000,
//         width:'50%',
//         marginTop: '0px',
//         marginRight: '50%',
//         marginLeft: '0px'
//       }}>
//         <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
//         {/* </Box> */}
//       </Box>
//       <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
//         <Grid container spacing={4} sx={{ maxWidth: "1300px" }} justifyContent="flex-start">
//           {filterArtists.map((artist) => (
//             <Grid item xs={12} sm={6} md={4} lg={2.4} key={artist.id} textAlign="center">
//               <Box
//                 onClick={() => navigate(`/artists/${artist.id}`)}
//                 sx={{
//                   cursor: "pointer",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                 }}
//               >
//                 <Avatar
//                   src={artist.pathProfile}
//                   alt={artist.userName}
//                   sx={{
//                     width: 190,
//                     height: 190,
//                     backgroundColor: "#333",
//                     marginBottom: "10px",
//                     boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
//                   }}
//                 />
//                 <Typography variant="h6" color="#E0E0E0">
//                   {artist.userName}
//                 </Typography>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default ArtistsList;


// "use client"

// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { artistList } from "../services/UserService"
// import type { User } from "../model/User"
// import { Grid, Typography, Avatar, Box } from "@mui/material"
// import Search from "./Search"
// import "../css/ArtistsList.css"

// const ArtistsList = () => {
//   const [artists, setArtists] = useState<User[]>([])
//   const [filteredArtists, setFilteredArtists] = useState<User[]>([])
//   const [searchTerm, setSearchTerm] = useState<string>("")
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const navigate = useNavigate()

//   const getArtistList = async () => {
//     setIsLoading(true)
//     try {
//       const res = await artistList()
//       const sortedArtists = res.sort((a: User, b: User) => a.userName?.localeCompare(b.userName || ""))
//       setArtists(sortedArtists)
//       setFilteredArtists(sortedArtists)
//     } catch (e) {
//       console.log(e)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     getArtistList()
//   }, [])

//   useEffect(() => {
//     let filtered = artists

//     if (searchTerm) {
//       filtered = filtered.filter((artist) => artist.userName.toLowerCase().includes(searchTerm.toLowerCase()))
//     }

//     setFilteredArtists(filtered)
//   }, [searchTerm, artists])

//   return (
//     <Box className="artists-list-container">
//       <Box>
//         <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//       </Box>

//       {isLoading ? (
//         <Box className="artists-loading">
//           <div className="artists-loader"></div>
//           <Typography>טוען אמנים...</Typography>
//         </Box>
//       ) : filteredArtists.length === 0 ? (
//         <Box className="artists-empty">
//           <Typography>לא נמצאו אמנים</Typography>
//         </Box>
//       ) : (
//         <Box className="artists-grid-container">
//           <Grid container spacing={4} className="artists-grid">
//             {filteredArtists.map((artist) => (
//               <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={artist.id}>
//                 <Box className="artist-card" onClick={() => navigate(`/artists/${artist.id}`)}>
//                   <div className="artist-avatar-container">
//                     <Avatar src={artist.pathProfile} alt={artist.userName} className="artist-avatar" />
//                     <div className="artist-hover-effect"></div>
//                   </div>
//                   <Typography className="artist-name">{artist.userName}</Typography>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}
//     </Box>
//   )
// }

// export default ArtistsList

// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { artistList } from "../services/UserService"
// import type { User } from "../model/User"
// import { Search, Users } from "lucide-react"
// import "../css/ArtistsList.css"
// import SkeletonLoader from "./ui/SkeletonLoader"

// const ArtistsList = () => {
//   const [artists, setArtists] = useState<User[]>([])
//   const [filteredArtists, setFilteredArtists] = useState<User[]>([])
//   const [searchTerm, setSearchTerm] = useState<string>("")
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const navigate = useNavigate()

//   const getArtistList = async () => {
//     setIsLoading(true)
//     try {
//       const res = await artistList()
//       const sortedArtists = res.sort((a: User, b: User) => a.userName?.localeCompare(b.userName || ""))
//       setArtists(sortedArtists)
//       setFilteredArtists(sortedArtists)
//     } catch (e) {
//       console.log(e)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     getArtistList()
//   }, [])

//   useEffect(() => {
//     let filtered = artists

//     if (searchTerm) {
//       filtered = filtered.filter((artist) => artist.userName.toLowerCase().includes(searchTerm.toLowerCase()))
//     }

//     setFilteredArtists(filtered)
//   }, [searchTerm, artists])

//   return (
//     <div className="artists-list-container">
//       <div className="artists-list-header">
//         <div className="artists-search-container">
//           <Search size={18} className="artists-search-icon" />
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="חיפוש אמנים..."
//             className="artists-search-input"
//           />
//           {searchTerm && (
//             <button className="artists-search-clear" onClick={() => setSearchTerm("")}>
//               ×
//             </button>
//           )}
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="artists-loading">
//           <div className="artists-grid">
//             {Array(8)
//               .fill(0)
//               .map((_, index) => (
//                 <SkeletonLoader key={index} type="artist" />
//               ))}
//           </div>
//         </div>
//       ) : filteredArtists.length === 0 ? (
//         <div className="artists-empty">
//           <Users size={48} className="artists-empty-icon" />
//           <p>לא נמצאו אמנים</p>
//         </div>
//       ) : (
//         <div className="artists-list-content">
//           <div className="artists-grid">
//             {filteredArtists.map((artist, index) => (
//               <div
//                 key={artist.id}
//                 className="artist-card"
//                 onClick={() => navigate(`/artists/${artist.id}`)}
//                 style={{ "--index": index } as React.CSSProperties}
//               >
//                 <div className="artist-avatar-container">
//                   <div
//                     className="artist-avatar"
//                     style={{ backgroundImage: `url(${artist.pathProfile || "/default-avatar.png"})` }}
//                   ></div>
//                   <div className="artist-hover-overlay"></div>
//                 </div>
//                 <h3 className="artist-name">{artist.userName}</h3>
//                 <div className="artist-card-glow"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ArtistsList
"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { artistList } from "../services/UserService"
import type { User } from "../model/User"
import { Search, Users, Star, Music2, Verified, Award, TrendingUp } from "lucide-react"
import "../css/ArtistsList.css"

const ArtistsList = () => {
  const [artists, setArtists] = useState<User[]>([])
  const [filteredArtists, setFilteredArtists] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hoveredArtist, setHoveredArtist] = useState<number | null>(null)
  const navigate = useNavigate()

  const getArtistList = async () => {
    setIsLoading(true)
    try {
      const res = await artistList()
      const sortedArtists = res.sort((a: User, b: User) => a.userName?.localeCompare(b.userName || ""))
      setArtists(sortedArtists)
      setFilteredArtists(sortedArtists)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getArtistList()
  }, [])

  useEffect(() => {
    let filtered = artists

    if (searchTerm) {
      filtered = filtered.filter((artist) => artist.userName.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setFilteredArtists(filtered)
  }, [searchTerm, artists])

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className="artists-list-modern">
      {/* Background Effects */}
      <div className="artists-background-effects">
        <div className="artists-gradient-orb orb-1"></div>
        <div className="artists-gradient-orb orb-2"></div>
        <div className="artists-gradient-orb orb-3"></div>

        {/* Floating Musical Notes */}
        <div className="floating-artists-notes">
          <div className="artists-note note-1">♪</div>
          <div className="artists-note note-2">♫</div>
          <div className="artists-note note-3">♬</div>
          <div className="artists-note note-4">🎤</div>
          <div className="artists-note note-5">♪</div>
          <div className="artists-note note-6">♫</div>
        </div>
      </div>

      {/* Header */}
      <motion.div
        className="artists-header-modern"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="artists-title-section">
          <div className="title-icon-container">
            <Users size={36} className="title-icon" />
          </div>
          <h1 className="artists-title">גלה אמנים</h1>
          <p className="artists-subtitle">חקור את הקהילה המוזיקלית שלנו</p>
        </div>

        {/* Search Section */}
        <div className="artists-search-modern">
          <div className="search-container-artists">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="חפש אמנים..."
                className="search-input"
              />
            </div>
            <div className="search-glow"></div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="artists-content-modern">
        {isLoading ? (
          <div className="artists-loading-modern">
            <motion.div
              className="loading-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="loading-spinner"></div>
              <div className="loading-text">טוען אמנים ...</div>
            </motion.div>

            {/* Loading Skeletons */}
            <div className="artists-grid-modern">
              {Array(12)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="artist-skeleton">
                    <div className="skeleton-avatar"></div>
                    <div className="skeleton-name"></div>
                    <div className="skeleton-stats"></div>
                  </div>
                ))}
            </div>
          </div>
        ) : filteredArtists.length === 0 ? (
          <motion.div
            className="artists-empty-modern"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty-icon-container">
              <div className="empty-glow"></div>
              {/* <Users size={64} className="empty-icon" /> */}
            </div>
            <h3>לא נמצאו אמנים</h3>
            <p>נסה לחפש במילות מפתח אחרות או נקה את החיפוש</p>
          </motion.div>
        ) : (
          <motion.div
            className="artists-grid-modern"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence>
              {filteredArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  className="artist-card-modern"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={() => navigate(`/artists/${artist.id}`)}
                  onHoverStart={() => setHoveredArtist(artist.id)}
                  onHoverEnd={() => setHoveredArtist(null)}
                >
                  {/* Card Background Effects */}
                  <div className="card-background-effects">
                    <div className="card-gradient-orb"></div>
                    <div className="card-glow"></div>
                  </div>

                  {/* Avatar Section */}
                  <div className="artist-avatar-section">
                    <div className="avatar-container">
                      <div className="avatar-glow"></div>
                      <div
                        className="artist-avatar-modern"
                        style={{
                          backgroundImage: `url(${artist.pathProfile || "/placeholder.svg?height=150&width=150"})`,
                        }}
                      >
                        {!artist.pathProfile && (
                          <div className="avatar-placeholder">
                            <Users size={40} />
                          </div>
                        )}
                      </div>

                      {/* Verified Badge */}
                      <motion.div
                        className="verified-artist-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 + 0.5 }}
                      >
                        <Verified size={16} />
                      </motion.div>

                      {/* Hover Overlay */}
                      <AnimatePresence>
                        {hoveredArtist === artist.id && (
                          <motion.div
                            className="avatar-hover-overlay"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Music2 size={28} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Artist Info */}
                  <div className="artist-info-modern">
                    <h3 className="artist-name-modern">{artist.userName}</h3>

                    {/* Stats */}
                    <div className="artist-stats-modern">
                      <div className="stat-item">
                        <Music2 size={14} />
                        <span>{20} שירים</span>
                      </div>
                      <div className="stat-item">
                        <Star size={14} />
                        <span>{20} עוקבים</span>
                      </div>
                    </div>

                    {/* Trending Badge */}
                    {index < 3 && (
                      <motion.div
                        className="trending-badge"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.8 }}
                      >
                        <TrendingUp size={12} />
                        <span>פופולרי</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Floating Notes on Hover */}
                  <AnimatePresence>
                    {hoveredArtist === artist.id && (
                      <div className="card-floating-notes">
                        <motion.div
                          className="card-note note-1"
                          initial={{ opacity: 0, y: 0 }}
                          animate={{ opacity: 1, y: -20 }}
                          exit={{ opacity: 0, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                          ♪
                        </motion.div>
                        <motion.div
                          className="card-note note-2"
                          initial={{ opacity: 0, y: 0 }}
                          animate={{ opacity: 1, y: -15 }}
                          exit={{ opacity: 0, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          ♫
                        </motion.div>
                        <motion.div
                          className="card-note note-3"
                          initial={{ opacity: 0, y: 0 }}
                          animate={{ opacity: 1, y: -25 }}
                          exit={{ opacity: 0, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          ♬
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Results Counter */}
      {!isLoading && (
        <motion.div
          className="results-counter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Award size={16} />
          <span>
            {searchTerm
              ? `נמצאו ${filteredArtists.length} אמנים עבור "${searchTerm}"`
              : `${filteredArtists.length} אמנים בקהילה שלנו`}
          </span>
        </motion.div>
      )}
    </div>
  )
}

export default ArtistsList
