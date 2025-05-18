import React, { useCallback } from "react";
import { Dialog, DialogContent, Grid, Box, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const presetImages = [
  "/avatars/music1.jpg",
  "/avatars/music2.jpg",
  "/avatars/music3.jpg",
  "/avatars/music4.jpg",
];

interface ProfileImageProps {
  open: boolean;
  onClose: () => void;
  setFormData: React.Dispatch<React.SetStateAction<{ userName: string; email: string; password: string; pathProfile: string | File }>>;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ open, onClose, setFormData }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFormData((prev) => ({ ...prev, pathProfile: acceptedFiles[0] })); // שמירת הקובץ לבחירה מאוחרת
    }
    onClose();
  }, [setFormData, onClose]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: "16px",boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)"} }}>
      <DialogContent sx={{ backgroundColor: "#252525", color: "#fff", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
        <Typography 
          align="center"
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            backgroundColor: "#252525",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            margin: 1,
            marginBottom: 2,
            background: "linear-gradient(90deg, #c67c28, #e3aa50)", // גרדיאנט לכיתוב
            color: "transparent", // הופך את הצבע לטקסט שקוף
            backgroundClip: "text", // מיישם את הגרדיאנט על הטקסט
            WebkitBackgroundClip: "text", // תמיכה ב-Webkit (במובייל)
          }}
        >
          בחר תמונת פרופיל
        </Typography>
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed #ccc",
            borderRadius: "12px",
            padding: 5,  // הגדרתי את הגרירה בגודל גדול יותר
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "#333",
            transition: "0.3s",
            "&:hover": { borderColor: "#d5933c", backgroundColor: "#3b3b3b" },
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 50, color: "#d5933c" }} /> {/* הגדלתי את גודל האייקון */}
          <Typography variant="body1" sx={{ mt: 1, fontSize: "1rem", color: "#ccc" }}>
            גרור ושחרר כאן תמונה או לחץ לבחירה
          </Typography>
        </Box>

        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            mt: 3,
            fontWeight: "bold",
            fontSize: "1.1rem",
            background: "linear-gradient(90deg, #c67c28, #e3aa50)", // גרדיאנט לכיתוב
            backgroundClip: "text",
            WebkitBackgroundClip: "text", // תמיכה ב-Webkit (במובייל)
            color: "transparent", // הופך את הצבע לטקסט שקוף
          }}
        >
          או בחר תמונה מוכנה
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center", paddingBottom: 3 }}>
          {presetImages.map((src) => (
            <Grid item key={src}>
              <Box
                component="img"
                src={src}
                sx={{
                  width: 70,  // הגדלתי את גודל התמונות
                  height: 70, // הגדלתי את גודל התמונות
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "3px solid transparent",
                  transition: "0.3s",
                  "&:hover": { borderColor: "#e3aa50" },
                }}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, pathProfile: src }));
                  onClose();
                }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileImage;
