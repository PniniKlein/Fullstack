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
// "use client"

// import type React from "react"

// import { useState, useRef } from "react"
// import {
//   Typography,
//   Button,
//   TextField,
//   FormControlLabel,
//   Switch,
//   CircularProgress,
//   Stepper,
//   Step,
//   StepLabel,
//   StepContent,
//   LinearProgress,
// } from "@mui/material"
// import { useDispatch, useSelector } from "react-redux"
// import type { Dispatch, StoreType } from "../store/store"
// import { addSong } from "../services/SongsService";
// import { Upload, ImageIcon, Globe, Check, ChevronRight, ChevronLeft, Info } from "lucide-react"
// import "../css/AddSong.css"

// // Utility function to extract metadata from audio file
// const extractMetadata = async (
//   file: File,
// ): Promise<{ title?: string; artist?: string; genre?: string; picture?: string }> => {
//   return new Promise((resolve) => {
//     // Create an audio element to read metadata
//     const audio = document.createElement("audio")
//     audio.preload = "metadata"

//     // Create object URL for the file
//     const url = URL.createObjectURL(file)
//     audio.src = url

//     // Set up event listener for when metadata is loaded
//     audio.addEventListener("loadedmetadata", () => {
//       // In a real implementation, we would use a library like jsmediatags
//       // For this example, we'll simulate extracting metadata

//       // Simulate metadata extraction with a timeout
//       setTimeout(() => {
//         // Revoke the object URL to free memory
//         URL.revokeObjectURL(url)

//         // Extract filename without extension as fallback title
//         const fileName = file.name.replace(/\.[^/.]+$/, "")

//         // In a real implementation, we would extract actual metadata
//         // For now, we'll simulate it based on the filename
//         const metadata = {
//           title: fileName,
//           artist: fileName.includes("-") ? fileName.split("-")[0].trim() : "",
//           genre: detectGenreFromFileName(fileName),
//           // We don't have actual album art, so we'll return undefined
//           picture: undefined,
//         }

//         resolve(metadata)
//       }, 1000)
//     })

//     // Handle errors
//     audio.addEventListener("error", () => {
//       URL.revokeObjectURL(url)
//       resolve({})
//     })

//     // Load the audio to trigger metadata loading
//     audio.load()
//   })
// }

// // Helper function to guess genre from filename
// const detectGenreFromFileName = (fileName: string): string => {
//   const lowerFileName = fileName.toLowerCase()

//   if (lowerFileName.includes("rock")) return "רוק"
//   if (lowerFileName.includes("pop")) return "פופ"
//   if (lowerFileName.includes("hip") || lowerFileName.includes("hop") || lowerFileName.includes("rap")) return "היפ הופ"
//   if (lowerFileName.includes("jazz")) return "ג'אז"
//   if (lowerFileName.includes("blues")) return "בלוז"
//   if (lowerFileName.includes("country")) return "קאנטרי"
//   if (lowerFileName.includes("electronic") || lowerFileName.includes("techno") || lowerFileName.includes("house"))
//     return "אלקטרוני"

//   return ""
// }

// const AddSong = () => {
//   const dispatch = useDispatch<Dispatch>()
//   const user = useSelector((state: StoreType) => state.user.user)

//   const [activeStep, setActiveStep] = useState(0)
//   const [songName, setSongName] = useState("")
//   const [artist, setArtist] = useState("")
//   const [genre, setGenre] = useState("")
//   const [isPublic, setIsPublic] = useState(true)
//   const [songFile, setSongFile] = useState<File | null>(null)
//   const [coverImage, setCoverImage] = useState<File | null>(null)
//   const [coverPreview, setCoverPreview] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [extractingMetadata, setExtractingMetadata] = useState(false)
//   const [metadataExtracted, setMetadataExtracted] = useState(false)

//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const coverInputRef = useRef<HTMLInputElement>(null)

//   const handleSongFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0]
//       setSongFile(file)
// debugger
//       // Extract metadata from the audio file
//       setExtractingMetadata(true)
//       try {
//         const metadata = await extractMetadata(file)

//         // Update form fields with extracted metadata
//         if (metadata.title) setSongName(metadata.title)
//         // if (metadata.artist) setArtist(metadata.artist)
//         if (metadata.genre) setGenre(metadata.genre)

//         // If we have album art, set it as cover image
//         if (metadata.picture) {
//           setCoverPreview(metadata.picture)
//         }

//         setMetadataExtracted(true)
//       } catch (error) {
//         console.error("Error extracting metadata:", error)
//       } finally {
//         setExtractingMetadata(false)
//       }
//     }
//   }

//   const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0]
//       setCoverImage(file)

//       // Create preview URL
//       const reader = new FileReader()
//       reader.onload = () => {
//         setCoverPreview(reader.result as string)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1)
//   }

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!songFile) {
//       alert("אנא בחר קובץ שיר")
//       return
//     }

//     setLoading(true)

//     try {
//       // Here you would normally upload the files and get URLs
//       // For this example, we'll just simulate it
//       const songData = {
//         title: songName,
//         lyrics: "",
//         gener: genre,
//         isPublic,
//         userId: user.id,
//         pathSong: URL.createObjectURL(songFile),
//         pathPicture: coverPreview || "/placeholder.svg?height=300&width=300",
//       }

//       await addSong(songData)

//       // Reset form
//       setSongName("")
//       setArtist("")
//       setGenre("")
//       setSongFile(null)
//       setCoverImage(null)
//       setCoverPreview(null)
//       setActiveStep(0)
//       setMetadataExtracted(false)

//       alert("השיר נוסף בהצלחה!")
//     } catch (error) {
//       console.error("שגיאה בהוספת השיר:", error)
//       alert("אירעה שגיאה בהוספת השיר")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const steps = [
//     {
//       label: "בחירת קובץ שמע",
//       description: "העלה את קובץ השמע שלך",
//       content: (
//         <div className="step-content">
//           <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
//             {!songFile ? (
//               <>
//                 <div className="upload-icon-container">
//                   <Upload size={30} className="upload-icon" />
//                 </div>
//                 <Typography className="upload-title">העלה קובץ שמע</Typography>
//                 <Typography className="upload-description">גרור ושחרר קובץ כאן או לחץ לבחירת קובץ</Typography>
//                 <Button variant="contained" className="upload-button">
//                   בחר קובץ
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <div className="upload-icon-container success">
//                   <Check size={30} className="upload-icon" />
//                 </div>
//                 <Typography className="upload-title">הקובץ נבחר בהצלחה</Typography>
//                 <Typography className="upload-description">{songFile.name}</Typography>

//                 {extractingMetadata && (
//                   <div className="metadata-loading">
//                     <Typography className="metadata-text">מחלץ מידע מהקובץ...</Typography>
//                     <LinearProgress className="metadata-progress" />
//                   </div>
//                 )}

//                 {metadataExtracted && (
//                   <div className="metadata-success">
//                     <Info size={16} />
//                     <Typography className="metadata-text">המידע חולץ בהצלחה ושדות הטופס עודכנו</Typography>
//                   </div>
//                 )}

//                 <Button
//                   variant="outlined"
//                   className="change-button"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     fileInputRef.current?.click()
//                   }}
//                 >
//                   החלף קובץ
//                 </Button>
//               </>
//             )}
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleSongFileChange}
//               accept="audio/*"
//               style={{ display: "none" }}
//             />
//           </div>
//         </div>
//       ),
//     },
//     {
//       label: "פרטי השיר",
//       description: "הוסף מידע על השיר",
//       content: (
//         <div className="step-content">
//           <div className="form-fields">
//             <div className="form-field">
//               <label htmlFor="songName">שם השיר</label>
//               <TextField
//                 id="songName"
//                 value={songName}
//                 onChange={(e) => setSongName(e.target.value)}
//                 placeholder="הזן את שם השיר"
//                 fullWidth
//                 required
//                 variant="outlined"
//                 className="text-field"
//               />
//             </div>

//             <div className="form-field">
//               <label htmlFor="artist">אמן</label>
//               <TextField
//                 id="artist"
//                 value={artist}
//                 onChange={(e) => setArtist(e.target.value)}
//                 placeholder={`ברירת מחדל: ${user.userName}`}
//                 fullWidth
//                 variant="outlined"
//                 className="text-field"
//               />
//             </div>

//             <div className="form-field">
//               <label htmlFor="genre">ז'אנר</label>
//               <TextField
//                 id="genre"
//                 value={genre}
//                 onChange={(e) => setGenre(e.target.value)}
//                 placeholder="לדוגמה: פופ, רוק, היפ הופ"
//                 fullWidth
//                 variant="outlined"
//                 className="text-field"
//               />
//             </div>

//             <div className="privacy-toggle">
//               <Globe size={18} />
//               <FormControlLabel
//                 control={<Switch checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} color="primary" />}
//                 label={<span className="privacy-label">פרסם את השיר באופן ציבורי</span>}
//               />
//             </div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       label: "תמונת כריכה",
//       description: "הוסף תמונת כריכה לשיר",
//       content: (
//         <div className="step-content">
//           <div className="cover-upload-container">
//             <div className="cover-preview-area" onClick={() => coverInputRef.current?.click()}>
//               {coverPreview ? (
//                 <img src={coverPreview || "/placeholder.svg"} alt="תמונת כריכה" className="cover-image" />
//               ) : (
//                 <div className="cover-placeholder">
//                   <ImageIcon size={40} className="placeholder-icon" />
//                   <Typography className="placeholder-text">לחץ להוספת תמונת כריכה</Typography>
//                 </div>
//               )}
//             </div>
//             <input
//               type="file"
//               ref={coverInputRef}
//               onChange={handleCoverImageChange}
//               accept="image/*"
//               style={{ display: "none" }}
//             />

//             <Typography className="cover-description">
//               תמונת הכריכה תוצג בכרטיס השיר ובנגן. מומלץ להשתמש בתמונה ריבועית באיכות גבוהה.
//             </Typography>

//             <Button
//               variant={coverPreview ? "outlined" : "contained"}
//               className={coverPreview ? "change-button" : "upload-button"}
//               onClick={() => coverInputRef.current?.click()}
//             >
//               {coverPreview ? "החלף תמונה" : "הוסף תמונה"}
//             </Button>
//           </div>
//         </div>
//       ),
//     },
//     {
//       label: "סיום",
//       description: "סקירה והעלאה",
//       content: (
//         <div className="step-content">
//           <div className="summary-container">
//             <Typography className="summary-title">סיכום פרטי השיר</Typography>

//             <div className="summary-item">
//               <div className="summary-label">שם השיר:</div>
//               <div className="summary-value">{songName || "לא הוזן"}</div>
//             </div>

//             <div className="summary-item">
//               <div className="summary-label">אמן:</div>
//               <div className="summary-value">{artist || user.userName}</div>
//             </div>

//             <div className="summary-item">
//               <div className="summary-label">ז'אנר:</div>
//               <div className="summary-value">{genre || "לא הוזן"}</div>
//             </div>

//             <div className="summary-item">
//               <div className="summary-label">סטטוס:</div>
//               <div className="summary-value">{isPublic ? "ציבורי" : "פרטי"}</div>
//             </div>

//             <div className="summary-item">
//               <div className="summary-label">קובץ שמע:</div>
//               <div className="summary-value">{songFile ? songFile.name : "לא נבחר"}</div>
//             </div>

//             <div className="summary-item">
//               <div className="summary-label">תמונת כריכה:</div>
//               <div className="summary-value">{coverImage ? coverImage.name : "לא נבחרה"}</div>
//             </div>

//             {coverPreview && (
//               <div className="summary-cover">
//                 <img src={coverPreview || "/placeholder.svg"} alt="תמונת כריכה" className="summary-cover-image" />
//               </div>
//             )}
//           </div>
//         </div>
//       ),
//     },
//   ]

//   return (
//     <div className="add-song-stepper">
//       <Stepper activeStep={activeStep} orientation="vertical" className="stepper">
//         {steps.map((step, index) => (
//           <Step key={step.label} className={`step ${activeStep === index ? "active-step" : ""}`}>
//             <StepLabel
//               StepIconProps={{
//                 className: "step-icon",
//               }}
//               className="step-label"
//             >
//               <Typography className="step-title">{step.label}</Typography>
//               <Typography className="step-description">{step.description}</Typography>
//             </StepLabel>
//             <StepContent className="step-content-wrapper">
//               {step.content}
//               <div className="step-actions">
//                 <Button
//                   disabled={activeStep === 0}
//                   onClick={handleBack}
//                   className="back-button"
//                   startIcon={<ChevronRight size={16} />}
//                 >
//                   חזור
//                 </Button>

//                 {activeStep === steps.length - 1 ? (
//                   <Button
//                     variant="contained"
//                     onClick={handleSubmit}
//                     className="submit-button"
//                     disabled={loading || !songFile || !songName}
//                     endIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
//                   >
//                     {loading ? "מעלה..." : "העלה שיר"}
//                   </Button>
//                 ) : (
//                   <Button
//                     variant="contained"
//                     onClick={handleNext}
//                     className="next-button"
//                     endIcon={<ChevronLeft size={16} />}
//                     disabled={(activeStep === 0 && !songFile) || extractingMetadata}
//                   >
//                     המשך
//                   </Button>
//                 )}
//               </div>
//             </StepContent>
//           </Step>
//         ))}
//       </Stepper>
//     </div>
//   )
// }

// export default AddSong
