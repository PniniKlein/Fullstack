import { useState } from "react";
import {Box,Button,Dialog,DialogTitle,DialogContent,Typography,LinearProgress,} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../store/store";
import { addSong } from "../services/SongsService";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import api from "../interceptor/axiosConfig";
import { loadUser } from "../store/userSlice";
import * as mm from "music-metadata-browser";
import { Buffer } from "buffer";
import "../css/AddSong.css";

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}
window.Buffer = Buffer;

const AddSong = () => {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector((state: StoreType) => state.user.user.id);

  const uploadToS3 = async (
    file: File,
    isImage = false,
    onProgress?: (percent: number) => void
  ): Promise<string | null> => {
    try {
      const res = await api.get(isImage ? "User/upload-url" : "Song/upload-url", {
        params: { fileName: file.name, contentType: file.type },
      });

      const presignedUrl = res.data.url;

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          if (onProgress) {
            onProgress(percent);
          } else {
            setProgress(percent);
          }
        },
      });

      const cleanUrl = presignedUrl.split("?")[0].replace("us-east-1.", "");

    return cleanUrl;

    } catch (error) {
      console.error("שגיאה בהעלאת קובץ:", error);
      return null;
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    try {
      setLoading(true);
      setProgress(0);

      const metadata = await mm.parseBlob(file);
      const genre = metadata.common.genre?.[0] || "לא ידוע";
      const title = metadata.common.title || file.name.replace(/\.[^/.]+$/, "");

      let coverImageUrl =
        "https://pninimusic.s3.us-east-1.amazonaws.com/images/music2.jpg";

      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const cover = metadata.common.picture[0];
        const coverBlob = new Blob([cover.data], { type: cover.format });
        const coverFile = new File(
          [coverBlob],
          `${file.name}_cover.${cover.format.split("/")[1] || "jpg"}`,
          { type: coverBlob.type, lastModified: Date.now() }
        );

        const uploadedCover = await uploadToS3(coverFile, true, (percent) =>
          setProgress(Math.round(percent * 0.25))
        );

        if (uploadedCover) {
          coverImageUrl = uploadedCover;
        }
      } else {
        setProgress(25);
      }

      const uploadedSongUrl = await uploadToS3(file, false, (percent) =>
        setProgress(Math.round(25 + percent * 0.75))
      );

      if (!uploadedSongUrl) return;

      const newSong = {
        title,
        gener: genre,
        lyrics: "",
        isPublic: false,
        pathSong: uploadedSongUrl,
        pathPicture: coverImageUrl,
        userId,
      };

      await addSong(newSong);
      dispatch(loadUser(userId) as any);
      setOpen(false);
    } catch (error) {
      console.error("שגיאה בקריאת מטא נתונים:", error);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        endIcon={<FileUploadIcon />}
        onClick={() => setOpen(true)}
        className="add-song-button with-icon"
      >
        הוסף שיר
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: "16px" } }}
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle className="dialog-title">העלאת שיר חדש</DialogTitle>
        <DialogContent className="dialog-content">
          <Box
            className={`upload-box ${dragOver ? "drag-over" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileUpload(file);
            }}
          >
            <CloudUploadIcon className="upload-icon" />
            <Typography className="upload-text">
              גרור ושחרר כאן קובץ או לחץ לבחירה
            </Typography>
            <Button variant="contained" component="label" className="choose-file-button">
              בחר קובץ
              <input
                type="file"
                hidden
                onChange={(e) =>
                  e.target.files && handleFileUpload(e.target.files[0])
                }
              />
            </Button>
          </Box>

          {loading && (
            <Box className="progress-container">
              <LinearProgress
                variant="determinate"
                value={progress}
                className="progress-bar"
              />
              <Typography className="progress-text">{progress}%</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddSong;
