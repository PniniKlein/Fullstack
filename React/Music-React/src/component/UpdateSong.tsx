import { useLocation, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { Button, Card, CardContent, Typography, TextField, Box, FormControlLabel, Switch } from "@mui/material";
import { SongPostModel } from "../model/PostModel/SongPostModel";
import { updateSong } from "../services/SongsService";
import { useDispatch } from "react-redux";
import { Dispatch } from "../store/store";
import { loadUser } from "../store/userSlice";

const UpdateSong = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const song = state?.song;
  const prevPath = state?.prevPath || "/mySongs";

  const [formData, setFormData] = useState(song);
  const [errors, setErrors] = useState<{ title: string }>({ title: "" });

  const handleChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = {
      title: formData.title.trim() ? "" : "כותרת השיר לא יכולה להיות ריקה",
    };

    setErrors(newErrors);

    if (!newErrors.title) {
      const songToUpdate: SongPostModel = {
        title: formData.title,
        gener: formData.gener || "",
        isPublic: formData.isPublic,
        pathSong: formData.pathSong,
        userId: formData.userId,
      };
      try {
        const updatedSong = await updateSong(song.id, songToUpdate);
        console.log(songToUpdate);
        dispatch(loadUser(song.userId));
        if (updatedSong) {
          alert("השיר עודכן בהצלחה");
          navigate(-1);
        } else {
          alert("שגיאה בעדכון השיר");
        }
      } catch (error) {
        console.error(error);
        alert("שגיאה בעדכון השיר");
      }
    }
  };

  const handleCancel = () => {
    navigate(prevPath);
  };

  if (!formData) return <div>טעינת נתונים...</div>;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Card sx={{ width: 520, padding: 2.5, boxShadow: 3, backgroundColor: "#1E1E1E" }}>
        <CardContent>
          <Typography variant="h6" align="center" sx={{ color: "white", fontWeight: "bold", marginBottom: 1 }}>
            עדכון שיר
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* שם השיר */}
            <TextField
              label="שם השיר"
              id="title"
              value={formData.title}
              onChange={(e) => handleChange(e.target.id, e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              variant="outlined"
              fullWidth
              sx={{
                backgroundColor: "#333",
                borderRadius: "8px",
                input: { color: "white" },
                "& .MuiInputLabel-root": { color: "#ddd" }, // צבע הכותרת בהיר
                "& .MuiInputLabel-root.Mui-focused": { color: "#FF9800" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#666" },
                  "&:hover fieldset": { borderColor: "#FF9800" },
                  "&.Mui-focused fieldset": { borderColor: "#FF9800" },
                },
              }}
            />

            {/* ז'אנר */}
            <TextField
              label="ז'אנר"
              id="gener"
              value={formData.gener}
              onChange={(e) => handleChange(e.target.id, e.target.value)}
              variant="outlined"
              fullWidth
              sx={{
                marginTop: 1,
                backgroundColor: "#333",
                borderRadius: "8px",
                input: { color: "white" },
                "& .MuiInputLabel-root": { color: "#ddd" }, // צבע הכותרת בהיר
                "& .MuiInputLabel-root.Mui-focused": { color: "#FF9800" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#666" },
                  "&:hover fieldset": { borderColor: "#FF9800" },
                  "&.Mui-focused fieldset": { borderColor: "#FF9800" },
                },
              }}
            />

            {/* פרטיות - אפשר להפוך לפרטי וגם לציבורי */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublic}
                  onChange={(e) => {
                    if (!song.isPublic) { // ניתן לשנות רק אם השיר פרטי
                      setFormData({ ...formData, isPublic: e.target.checked });
                    }
                  }}
                  color="warning"
                // disabled={formData.isPublic} // נועל את הסוויץ' כשהשיר כבר ציבורי
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
            <Box sx={{ padding: 1.5, backgroundColor: "#333", borderRadius: "8px", textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#FF9800", fontWeight: "bold" }}> 🔗 קישור לשיר:</Typography>
              <Typography variant="body1" sx={{ color: "white", wordBreak: "break-word" }}>
                {formData.pathSong}
              </Typography>
            </Box>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              

              {/* כפתור עדכון */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "#FF9800", color: "white" }}
              >
                עדכן שיר
              </Button>
              {/* כפתור ביטול */}
              <Button
                variant="outlined"
                fullWidth
                onClick={handleCancel}
                sx={{ color: "white", borderColor: "#FF9800" }}
              >
                ביטול
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateSong;
