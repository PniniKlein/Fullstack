// import { useEffect, useState } from "react";
// import { Box, Typography } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Song } from "../model/Song";
// import { Dispatch, StoreType } from "../store/store";
// import AddSong from "./AddSong";
// import { loadUser } from "../store/userSlice";
// import { getUserDataFromToken } from "./AppLayout";
// import SongCard from "./SongCard";
// import "../css/MySongs.css";
// import AddSongButton from "./AddSongButton";

// const MySongs = () => {
//   const dispatch = useDispatch<Dispatch>();
//   const songs = useSelector((state: StoreType) => state.user.user.songs || []);
//   const navigate = useNavigate();
//   const [activeCardId, setActiveCardId] = useState<number | null>(null);
//   const [filter, setFilter] = useState<'public' | 'private'>('public'); 

//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       const id = getUserDataFromToken(token);
//       if (id) {
//         dispatch(loadUser(id));
//       }
//     }
//   }, []);

//   const handleCardClick = (event: React.MouseEvent, songId: number) => {
//     const target = event.target as HTMLElement;
//     if ((target.closest("button, svg"))) {
//       return;
//     }
//     setActiveCardId(songId);
//     navigate(`/songComments/${songId}`);
//   };
//   return (
//     <Box className="mySongsContainer">
//     <Box className="mySongsHeader">
//       <Box className="mySongsTitleContainer">
//         <Typography className="mySongsTitle">השירים שלי</Typography>
//         <Box className="mySongsFilter">
//           <Box
//             className={`filterOption ${filter === 'private' ? 'active' : ''}`}
//             onClick={() => setFilter('private')}
//           >
//             פרטי
//           </Box>
//           <Box
//             className={`filterOption ${filter === 'public' ? 'active' : ''}`}
//             onClick={() => setFilter('public')}
//           >
//             ציבורי
//           </Box>
//         </Box>
//       </Box>
//       <AddSongButton />
//     </Box>
  
//     {songs.length !== 0 && (
//       <Box className="songsGrid">
//         {songs
//           .filter((song: Song) => song.isPublic === (filter === "public"))
//           .map((song: Song) => (
//             <SongCard
//               key={song.id}
//               song={song}
//               activeCardId={activeCardId}
//               onCardClick={handleCardClick}
//               setActiveCardId={setActiveCardId}
//               showActions={true}
//             />
//           ))}
//       </Box>
//     )}
//   </Box>
  
//   );
// };

// export default MySongs;

"use client"
import { useEffect, useState } from "react"
import { Box, Container } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import type { Dispatch, StoreType } from "../store/store"
import { loadUser } from "../store/userSlice"
import { getUserDataFromToken } from "./AppLayout"
import PrivateSongs from "./PrivateSongs"
import PublicSongs from "./PublicSongs"
import SongAnalytics from "./SongAnalytics"
import AddSong from "./AddSong"
import { Globe, Lock, BarChart2, Plus } from "lucide-react"
import "../css/MySongs.css"

const MySongs = () => {
  const dispatch = useDispatch<Dispatch>()
  const user = useSelector((state: StoreType) => state.user.user)
  const [activeView, setActiveView] = useState<"public" | "private" | "analytics" | "add">("public")

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      const id = getUserDataFromToken(token)
      if (id) {
        dispatch(loadUser(id))
      }
    }
  }, [])

  return (
    <Box className="personal-area" sx={{ overflow: "visible",paddingTop:0 ,marginTop:"0px"}}>
      <div className="sticky-nav">
        <div className="nav-options">
          <div
            className={`nav-option ${activeView === "public" ? "active" : ""}`}
            onClick={() => setActiveView("public")}
          >
            <Globe size={18} />
            <span>שירים ציבוריים</span>
          </div>

          <div
            className={`nav-option ${activeView === "private" ? "active" : ""}`}
            onClick={() => setActiveView("private")}
          >
            <Lock size={18} />
            <span>שירים פרטיים</span>
          </div>

          <div
            className={`nav-option ${activeView === "analytics" ? "active" : ""}`}
            onClick={() => setActiveView("analytics")}
          >
            <BarChart2 size={18} />
            <span>ניתוח נתונים</span>
          </div>
        </div>

        <div
          className={`nav-option add-option ${activeView === "add" ? "active" : ""}`}
          onClick={() =>activeView=== "add"? setActiveView("public"): setActiveView("add")}
        >
          <Plus size={18} />
          <span>{activeView === "add" ? "סגור" : "הוסף שיר"}</span>
        </div>
      </div>

      <Box className="content-section">
        {activeView === "public" && <PublicSongs />}
        {activeView === "private" && <PrivateSongs />}
        {activeView === "analytics" && <SongAnalytics />}
        {activeView === "add" && <AddSong />}
      </Box>
    </Box>
  )
}

export default MySongs
