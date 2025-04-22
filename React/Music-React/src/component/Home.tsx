import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, Avatar, CardContent } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { getAllPublic } from '../services/SongsService';
import { Song } from '../model/Song';

const Home = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await getAllPublic();
      setSongs(res);
    };
    fetchSongs();
  }, []);

  const recentSongs = songs.slice(-20);

  const settings = {
    infinite: true,
    speed: 3500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: false,
  };

  const handleSongClick = (songId: number) => {
    navigate(`/songComments/${songId}`);
  };

  return (
    <Box sx={{  color: '#E0E0E0', minHeight: '80vh' }}>
      {/* Header */}
      <Box
        sx={{
          backgroundImage: 'url("/images/header-background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '70px 20px',
          textAlign: 'center',
          color: '#FFF',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '48px' }}>
          מוזיקה עכשווית. קהילה יצירתית.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'normal', fontSize: '22px', marginTop: '20px' }}>
          גלה, שתף ושתף את המוזיקה שלך עם העולם.
        </Typography>
        <Box sx={{ marginTop: '40px' }}>
          <Button
            component={Link}
            to="musicLibrary/songList"
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #c67c28, #e3aa50)',
              padding: '10px 30px',
              borderRadius: '30px',
              fontSize: '18px',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #e3aa50, #c67c28)',
              },
            }}
          >
            למוזיקה
          </Button>
        </Box>
      </Box>

      {/* Featured Songs Section */}
      <Box sx={{ padding: '20px 20px', marginRight: "100px", marginLeft: "100px", marginBottom: "100px" }}>
        <Typography variant="h4" sx={{ textAlign: 'center', color: '#e3aa50', fontWeight: 'bold', marginBottom: '40px' }}>
          שירים מומלצים
        </Typography>

        <Slider {...settings}>
          {recentSongs.map((song, index) => (
            <Box key={index} sx={{ padding: '10px' }}>
              <Card
                sx={{
                  marginRight: "30px",
                  backgroundColor: '#2A2A2A',
                  color: '#E0E0E0',
                  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.5)',
                  },
                }}
                onClick={() => handleSongClick(song.id)}
              >
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={song.pathPicture}
                    sx={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      borderRadius: '0px',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      padding: '10px',
                      borderRadius: '5px',
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#e3aa50', fontWeight: 'bold' }}>
                      {song.title}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Community Section */}
      <Box
        sx={{
          backgroundColor: '#1E1E1E',
          padding: '60px 20px',
          textAlign: 'center',
          borderRadius: '10px',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)',
          marginTop: '40px',
        }}
      >
        <Typography variant="h4" sx={{ color: '#e3aa50', fontWeight: 'bold', marginBottom: '20px' }}>
          הצטרף לקהילה המוזיקלית שלנו
        </Typography>
        <Typography variant="h6" sx={{ color: '#E0E0E0', fontWeight: 'normal', marginBottom: '20px' }}>
          שתף את המוזיקה שלך, קבל תגובות, ותהנה מהיצירות של אחרים.
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(90deg, #c67c28, #e3aa50)',
            padding: '12px 30px',
            borderRadius: '30px',
            fontSize: '18px',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(90deg, #e3aa50, #c67c28)',
            },
          }}
        >
          הצטרף עכשיו
        </Button>
      </Box>

      {/* About Section */}
      <Box
        sx={{
          padding: '60px 20px',
          backgroundColor: '#2A2A2A',
          textAlign: 'center',
          marginTop: '40px',
          borderRadius: '10px',
        }}
      >
        <Typography variant="h4" sx={{ color: '#e3aa50', fontWeight: 'bold', marginBottom: '20px' }}>
          אודות האתר
        </Typography>
        <Typography variant="h6" sx={{ color: '#E0E0E0', fontWeight: 'normal', maxWidth: '800px', margin: '0 auto' }}>
          הפלטפורמה החברתית שלנו נועדה לחובבי מוזיקה, יוצרים ומאזינים. כאן תוכלו לפרסם שירים, להגיב, לקבל פידבק אמיתי, ולבנות קהילה סביב המוזיקה שאתם אוהבים. המקום שלכם ליצירה, שיתוף, והשראה.
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#121212' }}>
        <Typography variant="body2" sx={{ color: '#E0E0E0', fontSize: '14px' }}>
          © 2025 פלטפורמת המוזיקה החברתית. כל הזכויות שמורות.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
