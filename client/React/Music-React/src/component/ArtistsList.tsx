import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { artistList } from "../services/UserService";
import { User } from "../model/User";
import { Grid, Typography, Avatar, Box } from "@mui/material";
import Search from "./Search";


const ArtistsList = () => {
  const [artists, setArtists] = useState<User[]>([]);
  const navigate = useNavigate();

  const [filterArtists, setFilterArtists] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");


  const getArtistList = async () => {
    try {
      const res = await artistList();
      const sortedArtists = res.sort((a: User, b: User) =>
        a.userName?.localeCompare(b.userName || "")
      );
      setArtists(sortedArtists);
      setFilterArtists(artists)
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getArtistList();
  }, []);

  useEffect(() => {
    let filtered = artists;

    if (searchTerm) {
      filtered = filtered.filter(artist => artist.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setFilterArtists(filtered);

  }, [searchTerm, artists]);


  return (
    <Box
      sx={{
        // padding: "20px",
        backgroundColor: "#1A1A1A",
        // minHeight: "85vh",
        width: "100%",
        // marginTop: "50px"
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px',
        left: '0px',
        gap: '10px',
        position: 'sticky',
        top: '85px',
        zIndex: 1000,
        width:'50%',
        marginTop: '0px',
        marginRight: '50%',
        marginLeft: '0px'
      }}>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        {/* </Box> */}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Grid container spacing={4} sx={{ maxWidth: "1300px" }} justifyContent="flex-start">
          {filterArtists.map((artist) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={artist.id} textAlign="center">
              <Box
                onClick={() => navigate(`/artists/${artist.id}`)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={artist.pathProfile}
                  alt={artist.userName}
                  sx={{
                    width: 190,
                    height: 190,
                    backgroundColor: "#333",
                    marginBottom: "10px",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  }}
                />
                <Typography variant="h6" color="#E0E0E0">
                  {artist.userName}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ArtistsList;


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
