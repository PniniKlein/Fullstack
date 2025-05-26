// import React, { useCallback } from "react";
// import { Dialog, DialogContent, Grid, Box, Typography } from "@mui/material";
// import { useDropzone } from "react-dropzone";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// const presetImages = [
//   "/avatars/music1.jpg",
//   "/avatars/music2.jpg",
//   "/avatars/music3.jpg",
//   "/avatars/music4.jpg",
// ];

// interface ProfileImageProps {
//   open: boolean;
//   onClose: () => void;
//   setFormData: React.Dispatch<React.SetStateAction<{ userName: string; email: string; password: string; pathProfile: string | File }>>;
// }

// const ProfileImage: React.FC<ProfileImageProps> = ({ open, onClose, setFormData }) => {
//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     if (acceptedFiles.length > 0) {
//       setFormData((prev) => ({ ...prev, pathProfile: acceptedFiles[0] })); // שמירת הקובץ לבחירה מאוחרת
//     }
//     onClose();
//   }, [setFormData, onClose]);

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: { "image/*": [] },
//     maxFiles: 1,
//   });

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: "16px",boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)"} }}>
//       <DialogContent sx={{ backgroundColor: "#252525", color: "#fff", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
//         <Typography 
//           align="center"
//           sx={{
//             fontWeight: "bold",
//             fontSize: "1.5rem",
//             backgroundColor: "#252525",
//             borderTopLeftRadius: "16px",
//             borderTopRightRadius: "16px",
//             margin: 1,
//             marginBottom: 2,
//             background: "linear-gradient(90deg, #c67c28, #e3aa50)", // גרדיאנט לכיתוב
//             color: "transparent", // הופך את הצבע לטקסט שקוף
//             backgroundClip: "text", // מיישם את הגרדיאנט על הטקסט
//             WebkitBackgroundClip: "text", // תמיכה ב-Webkit (במובייל)
//           }}
//         >
//           בחר תמונת פרופיל
//         </Typography>
//         <Box
//           {...getRootProps()}
//           sx={{
//             border: "2px dashed #ccc",
//             borderRadius: "12px",
//             padding: 5,  // הגדרתי את הגרירה בגודל גדול יותר
//             textAlign: "center",
//             cursor: "pointer",
//             backgroundColor: "#333",
//             transition: "0.3s",
//             "&:hover": { borderColor: "#d5933c", backgroundColor: "#3b3b3b" },
//           }}
//         >
//           <input {...getInputProps()} />
//           <CloudUploadIcon sx={{ fontSize: 50, color: "#d5933c" }} /> {/* הגדלתי את גודל האייקון */}
//           <Typography variant="body1" sx={{ mt: 1, fontSize: "1rem", color: "#ccc" }}>
//             גרור ושחרר כאן תמונה או לחץ לבחירה
//           </Typography>
//         </Box>

//         <Typography
//           variant="subtitle1"
//           align="center"
//           sx={{
//             mt: 3,
//             fontWeight: "bold",
//             fontSize: "1.1rem",
//             background: "linear-gradient(90deg, #c67c28, #e3aa50)", // גרדיאנט לכיתוב
//             backgroundClip: "text",
//             WebkitBackgroundClip: "text", // תמיכה ב-Webkit (במובייל)
//             color: "transparent", // הופך את הצבע לטקסט שקוף
//           }}
//         >
//           או בחר תמונה מוכנה
//         </Typography>

//         <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center", paddingBottom: 3 }}>
//           {presetImages.map((src) => (
//             <Grid item key={src}>
//               <Box
//                 component="img"
//                 src={src}
//                 sx={{
//                   width: 70,  // הגדלתי את גודל התמונות
//                   height: 70, // הגדלתי את גודל התמונות
//                   borderRadius: "50%",
//                   objectFit: "cover",
//                   cursor: "pointer",
//                   border: "3px solid transparent",
//                   transition: "0.3s",
//                   "&:hover": { borderColor: "#e3aa50" },
//                 }}
//                 onClick={() => {
//                   setFormData((prev) => ({ ...prev, pathProfile: src }));
//                   onClose();
//                 }}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ProfileImage;


import type React from "react"
import { useState, useRef, type ChangeEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, ImageIcon, Check } from 'lucide-react'
import type { UserPostModel } from "../model/PostModel/UserPostModel"
import "../css/ProfileImage.css"

const presetImages = ["/avatars/music1.jpg", "/avatars/music2.jpg", "/avatars/music3.jpg", "/avatars/music4.jpg"]

interface ProfileImageDialogProps {
  open: boolean
  onClose: () => void
  setFormData: React.Dispatch<React.SetStateAction<UserPostModel>>
  onSelectImage?: (file: File) => void
}

const ProfileImageDialog = ({ open, onClose, setFormData, onSelectImage }: ProfileImageDialogProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setSelectedImage(URL.createObjectURL(file))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
      setSelectedImage(URL.createObjectURL(file))
    }
  }

  const handleSelectClick = () => {
    fileInputRef.current?.click()
  }

  const handlePresetSelect = (imagePath: string) => {
    setSelectedImage(imagePath)
    setSelectedFile(null)
    setFormData((prev) => ({ ...prev, pathProfile: imagePath }))
    onClose()
  }

  const handleConfirm = () => {
    if (selectedFile && onSelectImage) {
      onSelectImage(selectedFile)
    } else if (selectedFile) {
      setFormData((prev) => ({ ...prev, pathProfile: selectedFile }))
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="profile-dialog-modern">
          {/* Backdrop */}
          <motion.div
            className="profile-dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="profile-dialog-modal"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, type: "spring", damping: 25 }}
          >
            <div className="profile-dialog-header">
              <div className="header-content">
                <div className="header-icon">
                  <ImageIcon size={24} />
                  <div className="icon-glow"></div>
                </div>
                <h2 className="dialog-title">בחר תמונת פרופיל</h2>
              </div>
              <button className="close-button" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <motion.div
              className={`upload-area ${dragActive ? "drag-active" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={handleSelectClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
                ref={fileInputRef}
              />

              {selectedImage ? (
                <div className="selected-image-preview">
                  <img src={selectedImage || "/placeholder.svg"} alt="תמונה נבחרה" className="preview-image" />
                  <div className="image-overlay">
                    <Upload size={24} />
                    <span>לחץ לשינוי</span>
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon-container">
                    <Upload size={32} />
                    <div className="upload-icon-glow"></div>
                  </div>
                  <h3>גרור ושחרר תמונה כאן</h3>
                  <p>או לחץ לבחירת קובץ</p>
                  {/* <div className="supported-formats">
                    <span>JPG, PNG, GIF עד 5MB</span>
                  </div> */}
                </div>
              )}
            </motion.div>

            {/* Divider */}
            <motion.div
              className="divider-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="divider-line"></div>
              <span className="divider-text">או בחר תמונה מוכנה</span>
              <div className="divider-line"></div>
            </motion.div>

            {/* Preset Images */}
            <motion.div
              className="preset-images-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="preset-images-grid">
                {presetImages.map((src, index) => (
                  <motion.div
                    key={src}
                    className="preset-image-item"
                    onClick={() => handlePresetSelect(src)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={src || "/placeholder.svg"} alt="תמונת פרופיל" className="preset-image" />
                    <div className="preset-overlay">
                      <Check size={20} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Confirm Button */}
            <AnimatePresence>
              {selectedImage && selectedFile && (
                <motion.div
                  className="confirm-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button className="confirm-button" onClick={handleConfirm}>
                    <Check size={18} />
                    <span>אישור בחירה</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ProfileImageDialog