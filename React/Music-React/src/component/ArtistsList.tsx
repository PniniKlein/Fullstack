import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { artistList } from "../services/UserService";
import { User } from "../model/User";
import { Grid, Typography, Avatar, Box, MenuItem, Select, TextField } from "@mui/material";
import { Song } from "../model/Song";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const ArtistsList = () => {
  const [artists, setArtists] = useState<User[]>([]);
  const navigate = useNavigate();

  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("title");
  const selectRef = useRef<HTMLDivElement>(null);


  const getArtistList = async () => {
    try {
      const res = await artistList();
      const sortedArtists = res.sort((a: User, b: User) =>
        a.userName?.localeCompare(b.userName || "")
      );
      setArtists(sortedArtists);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getArtistList();
  }, []);

  return (
    <Box
      sx={{
        // padding: "20px",
        backgroundColor: "#212121",
        // minHeight: "85vh",
        width: "100%",
        // marginTop: "50px"
      }}
    >
      {/* סינון ומיון */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px',
        width: '100%'
      }}>
        {/* חיפוש ומיון */}
        <Box sx={{ display: 'flex',justifyContent:"flex-end"}}>
          {/* <Select
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
          </Select> */}

          <TextField
            label="חיפוש"
            variant="outlined"
            size="small"
            sx={{
              marginLeft:'20%',
              backgroundColor: '#222',
              borderRadius: '8px',
              color: 'white',
              width: '150px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              '& .MuiInputBase-input': { color: 'white' },
              '& label': { color: 'gray' },
              '&:hover': { backgroundColor: '#333' },
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'center',width:'100%' }}>
      <Grid container spacing={4} sx={{ maxWidth: "1300px" }} justifyContent="flex-start">
        {artists.map((artist) => (
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