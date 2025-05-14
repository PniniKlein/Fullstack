import { PlayArrowRounded } from "@mui/icons-material";
import { Avatar, Box, Card, IconButton, Typography } from "@mui/material";
import Slider from "react-slick";
import { updateSong } from "../store/songSlice";
import { useDispatch } from "react-redux";
import { Dispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Song } from "../model/Song";
import { getAllPublic } from "../services/SongsService";
import "../css/NewSongs.css"; // Import your CSS file

const NewSongs = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const dispatch = useDispatch<Dispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSongs = async () => {
            const res = await getAllPublic();
            const sortedByDate = res
                .sort((a: Song, b: Song) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())
                .slice(0, 8);
            setSongs(sortedByDate);
        };
        fetchSongs();
    }, []);

    const recentSongs = songs.slice(-20);

    const NextArrow = (props: any) => {
        const { onClick } = props;
        return (
          <div onClick={onClick} className="home-arrow home-next-arrow">
            <span>❯</span>
          </div>
        );
      };
    
      const PrevArrow = (props: any) => {
        const { onClick } = props;
        return (
          <div onClick={onClick} className="home-arrow home-prev-arrow">
            <span>❮</span>
          </div>
        );
      };
    
      const settings = {
        infinite: true,
        speed: 1500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        cssEase: "linear",
        pauseOnHover: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
      };
    
      const handleSongClick = (songId: number) => {
        navigate(`/songComments/${songId}`);
      };
    
      return (
        <Box className="home-new-songs-container">
          <Typography variant="h4" className="home-new-songs-title">
            החדשים שלנו
          </Typography>
    
          <Slider {...settings}>
            {recentSongs.map((song, index) => (
              <Box key={index} className="home-song-card-wrapper">
                <Card
                  className="home-song-card"
                  onClick={() => handleSongClick(song.id)}
                >
                  <Box className="home-song-card-image-wrapper">
                    <Avatar
                      src={song.pathPicture}
                      className="home-song-card-avatar"
                    />
                    <IconButton
                      className="home-play-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(updateSong(song));
                      }}
                    >
                      <PlayArrowRounded fontSize="large" />
                    </IconButton>
                    <Box className="home-song-card-footer">
                      <Typography variant="subtitle1" className="home-song-card-title">
                        {song.title}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      );
    };
    
    export default NewSongs;