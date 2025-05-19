import { useLocation, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { Button, Card, CardContent, Typography, TextField, Box, FormControlLabel, Switch } from "@mui/material";
import { SongPostModel } from "../model/PostModel/SongPostModel";
import { updateSong } from "../services/SongsService";
import { useDispatch } from "react-redux";
import { Dispatch } from "../store/store";
import { loadUser } from "../store/userSlice";
import SnackbarGreen from "../component/SnackbarGreen";
import "../css/UpdateSong.css";

const UpdateSong = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const song = state?.song;
  const prevPath = state?.prevPath || "/mySongs";

  const [formData, setFormData] = useState(song);
  const [errors, setErrors] = useState<{ title: string }>({ title: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = {
      title: formData.title.trim() ? "" : "\u05db\u05d5\u05ea\u05e8\u05ea \u05d4\u05e9\u05d9\u05e8 \u05dc\u05d0 \u05d9\u05db\u05d5\u05dc\u05d4 \u05dc\u05d4\u05d9\u05d5\u05ea \u05e8\u05d9\u05e7\u05d4",
    };

    setErrors(newErrors);

    if (!newErrors.title) {
      const songToUpdate: SongPostModel = {
        title: formData.title,
        gener: formData.gener || "",
        lyrics: formData.lyrics || "",
        isPublic: formData.isPublic,
        pathSong: formData.pathSong,
        pathPicture: formData.pathPicture,
        userId: formData.userId,
      };
      try {
        const updatedSong = await updateSong(song.id, songToUpdate);
        dispatch(loadUser(song.userId));
        if (updatedSong) {
          setSnackbarMessage("\u05d4\u05e9\u05d9\u05e8 \u05e2\u05d5\u05d3\u05db\u05df \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4");
          setSnackbarOpen(true);
          setTimeout(() => {
            navigate(-1);
          }, 300);
        } else {
          alert("\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05e2\u05d3\u05db\u05d5\u05df \u05d4\u05e9\u05d9\u05e8");
        }
      } catch (error) {
        console.error(error);
        alert("\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05e2\u05d3\u05db\u05d5\u05df \u05d4\u05e9\u05d9\u05e8");
      }
    }
  };

  const handleCancel = () => {
    navigate(prevPath);
  };

  if (!formData) return <div>טעינת נתונים...</div>;

  return (
    <div className="update-song-container">
      <Card className="update-song-card">
        <CardContent>
          <Typography variant="h6" align="center" className="update-song-title">
            עדכון שיר
          </Typography>

          <form onSubmit={handleSubmit} className="update-song-form">
            <TextField
              label="שם השיר"
              id="title"
              value={formData.title}
              onChange={(e) => handleChange(e.target.id, e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              variant="outlined"
              fullWidth
              className="update-song-textfield"
            />

            <TextField
              label="ז'אנר"
              id="gener"
              value={formData.gener}
              onChange={(e) => handleChange(e.target.id, e.target.value)}
              variant="outlined"
              fullWidth
              className="update-song-textfield"
            />

            {/* פרטיות - אפשר להפוך לפרטי וגם לציבורי */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublic}
                  onChange={(e) => {
                    if (!song.isPublic) {
                      setFormData({ ...formData, isPublic: e.target.checked });
                    }
                  }}
                  sx={{
                    "& .MuiSwitch-switchBase": {
                      color: "#777", // צבע העיגול כשהוא כבוי
                    },
                    "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                      backgroundColor: "#888", // צבע הפס כשהוא כבוי
                    },
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#c67c28", // צבע העיגול כשהוא דלוק
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      background: "linear-gradient(90deg, #c67c28, #e3aa50)", // גרדיאנט לפס כשהדלוק
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ color: "white" }}>
                  {formData.isPublic ? "ציבורי" : "פרטי"}
                </Typography>
              }
              labelPlacement="start"
            />

            {/* הצגת הנתיב הנוכחי (רק לקריאה) */}
            <Box className="link-box">
              <Box className="flex-row">
                <Typography variant="body2" sx={{ color: "white" }}>
                  🔗
                </Typography>
                <Typography variant="body2" className="link-text">
                  קישור לשיר:
                </Typography>
              </Box>

              <Typography variant="body1" className="link-path">
                {formData.pathSong}
              </Typography>
            </Box>

            <div className="buttons-cont">
              {/* כפתור ביטול */}
              <Button
                variant="outlined"
                fullWidth
                onClick={handleCancel}
                className="button-cancel"
              >
                ביטול
              </Button>
                            {/* כפתור עדכון */}
                            <Button
                type="submit"
                variant="contained"
                fullWidth
                className="button"
              >
                עדכן שיר
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <SnackbarGreen
        snackbarMessage={snackbarMessage}
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
      />
    </div>
  );
};

export default UpdateSong;