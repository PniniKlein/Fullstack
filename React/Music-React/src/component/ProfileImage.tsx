import React, { useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, Grid, Box, Typography } from "@mui/material";
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle align="center" sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        בחר תמונת פרופיל
      </DialogTitle>
      <DialogContent>
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed #ccc",
            borderRadius: "12px",
            padding: 4,
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
            "&:hover": { borderColor: "#333", backgroundColor: "#f1f1f1" },
            transition: "0.3s",
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 40, color: "#666" }} />
          <Typography variant="body1" sx={{ mt: 1, fontSize: "0.9rem", color: "#555" }}>
            גרור ושחרר כאן תמונה או לחץ לבחירה
          </Typography>
        </Box>

        <Typography variant="subtitle1" align="center" sx={{ mt: 3, fontWeight: "bold" }}>
          או בחר תמונה מוכנה
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
          {presetImages.map((src) => (
            <Grid item key={src}>
              <Box
                component="img"
                src={src}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "3px solid transparent",
                  transition: "0.3s",
                  "&:hover": { borderColor: "#666", transform: "scale(1.1)" },
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
