import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import SpeedIcon from "@mui/icons-material/Speed";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { handleDownload } from "../services/SongsService";
import { Song } from "../model/Song";
import { resetSong } from "../store/songSlice";
import { useDispatch } from "react-redux";
import { Dispatch } from "../store/store";

type Props = {
  song: Song;
  playbackRate: number;
  onRateChange: (rate: number) => void;
};

const SongOptionsMenu = ({ song, playbackRate, onRateChange }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
const dispatch = useDispatch<Dispatch>();
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    dispatch(resetSong())
    sessionStorage.removeItem("songPlayer");
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
    setShowSpeedOptions(false);
  };

  const handleSpeedChange = (speed: number) => {
    onRateChange(speed);
    handleMenuClose();
  };

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          color: "#f5f5f5",
          p: 1,
          marginLeft: 2,
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#222",
            borderRadius: "12px",
            color: "#fff",
            minWidth: 180,
            direction: "rtl",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
  {!showSpeedOptions
  ? [
      <MenuItem key="download" onClick={() => {
        handleDownload(song);
        handleMenuClose();
      }}>
        <ListItemIcon sx={{ color: "#fff" }}>
          <DownloadIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="הורד שיר" />
      </MenuItem>,

      <MenuItem key="speed" onClick={() => setShowSpeedOptions(true)}>
        <ListItemIcon sx={{ color: "#fff" }}>
          <SpeedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="שנה מהירות" />
      </MenuItem>,

      <Divider key="divider1" sx={{ backgroundColor: "#555" }} />,

      <MenuItem key="exit" onClick={() => {
        handleClose();
        handleMenuClose();
      }}>
        <ListItemIcon sx={{ color: "#fff" }}>
          <ExitToAppIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="יציאה" />
      </MenuItem>
    ]
  : [
      <Typography
        key="title"
        sx={{
          px: 2,
          py: 1,
          color: "#fff",
          fontSize: "0.9rem",
          fontWeight: 500,
        }}
      >
        בחר מהירות:
      </Typography>,

      ...[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((val) => (
        <MenuItem
          key={val}
          onClick={() => handleSpeedChange(val)}
          sx={{
            backgroundColor: "#333",
            "&:hover": { backgroundColor: "#555" },
            position: "relative",
            paddingRight: "30px",
            "&:before": {
              content: '""',
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: val === playbackRate ? "5px" : "0",
              height: "20px",
              background: val === playbackRate ? "linear-gradient(90deg, #D59039, #F7C26B)" : "#888",
              borderRadius: "5px",
              transition: "width 0.3s",
            },
          }}
        >
          <ListItemText primary={`${val}x`} />
        </MenuItem>
      )),

      <Divider key="divider2" sx={{ backgroundColor: "#555" }} />,

      <MenuItem key="back" onClick={() => setShowSpeedOptions(false)}>
        <ListItemIcon sx={{ color: "#fff" }}>
          <ArrowBackIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="חזרה" />
      </MenuItem>
    ]
}
      </Menu>
    </>
  );
};

export default SongOptionsMenu;
