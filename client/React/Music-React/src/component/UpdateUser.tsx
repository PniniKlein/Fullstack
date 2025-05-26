// import { FormEvent, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Dispatch, StoreType } from "../store/store";
// import { useNavigate } from "react-router-dom";
// import { updateUser } from "../store/userSlice";
// import { Button, Card, CardContent, Avatar, Box, Dialog, IconButton, Typography } from "@mui/material";
// import FormInput from "./FormInput";
// import ProfileImageDialog from "./ProfileImage";
// import { UserPostModel } from "../model/PostModel/UserPostModel";
// import axios from "axios";
// import api from "../interceptor/axiosConfig";
// import Swal from "sweetalert2";
// import CloseIcon from "@mui/icons-material/Close";
// import "../css/UpdateUser.css";

// const UpdateUser = () => {
//   const user = useSelector((state: StoreType) => state.user.user);
//   const dispatch = useDispatch<Dispatch>();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState<UserPostModel>({
//     userName: user?.userName || "",
//     email: user?.email || "",
//     password: user.password,
//     pathProfile: user?.pathProfile ? user?.pathProfile : user?.userName ? "" : "/avatars/default.jpg",
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(
//     typeof formData.pathProfile === "string" ? formData.pathProfile : null
//   );

//   // const [errors, setErrors] = useState({ password: "" });
//   const [openDialog, setOpenDialog] = useState(false);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     setOpen(true);
//   }, []);

//   useEffect(() => {
//     if (formData.pathProfile instanceof File) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(formData.pathProfile);
//     } else if (typeof formData.pathProfile === "string") {
//       setImagePreview(formData.pathProfile);
//     }
//   }, [formData.pathProfile]);

//   const isValidPassword = (password: string) =>
//     !password || (/[a-zA-Z]/.test(password) && /\d/.test(password) && password.length >= 6);

//   const handleChange = (id: string, value: string) => {
//     setFormData({ ...formData, [id]: value });

//     // setErrors((prev) => ({
//     //   ...prev,
//     //   password: id === "password" ? (isValidPassword(value) ? "" : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר") : prev.password,
//     // }));
//   };

//   const uploadToS3 = async (file: File): Promise<string | null> => {
//     try {
//       const res = await api.get("User/upload-url", {
//         params: { fileName: file.name, contentType: file.type },
//       });

//       const presignedUrl = res.data.url;
//       await axios.put(presignedUrl, file, { headers: { "Content-Type": file.type } });

//       return presignedUrl.split("?")[0];
//     } catch (error) {
//       console.error("שגיאה בהעלאת הקובץ:", error);
//       return null;
//     }
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true); // מתחיל טעינה

//     const newErrors = {
//       password: isValidPassword(formData.password) ? "" : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר",
//     };

//     // setErrors(newErrors);

//     if (!newErrors.password && formData.userName.trim()) {
//       let imageUrl = formData.pathProfile;

//       if (formData.pathProfile instanceof File) {
//         const uploadedUrl = await uploadToS3(formData.pathProfile);
//         if (uploadedUrl) {
//           imageUrl = uploadedUrl;
//         } else {
//           setLoading(false); // מסיים טעינה במקרה של שגיאה
//           Swal.fire({ icon: "error", title: "שגיאה!", text: "אירעה שגיאה בהעלאת התמונה." });
//           return;
//         }
//       }

//       await dispatch(updateUser({ id: user.id, userPostModl: { ...formData, pathProfile: imageUrl } }));
//       handleClose();
//     }

//     setLoading(false); // מסיים טעינה
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setTimeout(() => navigate(-1), 300);
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       fullWidth
//       maxWidth="xs"
//       PaperProps={{
//         sx: {
//           borderRadius: "16px",
//           boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
//           position: "relative", // נדרש כדי שה-overlay יהיה בתוך ה-dialog
//         },
//       }}
//       sx={{ backdropFilter: "blur(5px)" }}
//     >
//       <div className="update-user-container">
//         <Card className="update-user-card">
//           <IconButton onClick={handleClose} sx={{ position: "absolute", top: 10, left: 10, color: "white" }}>
//             <CloseIcon />
//           </IconButton>

//           <CardContent>
//             <Typography variant="h6" align="center" className="update-user-title">
//               עדכון פרופיל
//             </Typography>

//             <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
//               <Box
//                 className="avatar-large"
//                 sx={{
//                   width: 100,
//                   height: 100,
//                   borderRadius: "50%",
//                   overflow: "hidden",
//                   cursor: "pointer",
//                   marginBottom: "20px",
//                 }}
//                 onClick={() => setOpenDialog(true)}
//               >
//                 <Avatar
//                   src={imagePreview || ""}
//                   sx={{ width: "100%", height: "100%", backgroundColor: "#333", fontSize: "2rem" }}
//                 >
//                   {!user?.pathProfile && user?.userName ? user.userName[0] : ""}
//                 </Avatar>
//               </Box>
//             </div>

//             <form onSubmit={handleSubmit} className="update-user-form">
//               <FormInput label="שם משתמש" id="userName" value={formData.userName} error="" onChange={handleChange} />

//               <Button
//                 type="submit"
//                 variant="contained"
//                 fullWidth
//                 className="button"
//                 sx={{ mt: 2 }}
//                 disabled={loading} // הכפתור לא לחיץ בזמן טעינה
//               >
//                 {loading ? (
//                   <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <span className="spinner" />
//                     <span style={{ marginRight: 8 }}>טוען...</span>
//                   </span>
//                 ) : (
//                   "עדכן פרופיל"
//                 )}
//               </Button>

//             </form>
//           </CardContent>
//         </Card>
//       </div>
//       <ProfileImageDialog open={openDialog} onClose={() => setOpenDialog(false)} setFormData={setFormData} />
//       {loading && <div className="dialog-overlay" />}
//     </Dialog>
//   );
// };

// export default UpdateUser;
"use client"

import { FormEvent, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { User, Camera, Save, X, Loader } from 'lucide-react'
import type { Dispatch, StoreType } from "../store/store"
import { useNavigate } from "react-router-dom"
import { updateUser } from "../store/userSlice"
import ProfileImageDialog from "./ProfileImage"
import type { UserPostModel } from "../model/PostModel/UserPostModel"
import axios from "axios"
import api from "../interceptor/axiosConfig"
import Swal from "sweetalert2"
import "../css/UpdateUser.css"

const UpdateUser = () => {
  const user = useSelector((state: StoreType) => state.user.user)
  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const [formData, setFormData] = useState<UserPostModel>({
    userName: user?.userName || "",
    email: user?.email || "",
    password: user.password,
    pathProfile: user?.pathProfile ? user?.pathProfile : user?.userName ? "" : "/avatars/default.jpg",
  })

  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof formData.pathProfile === "string" ? formData.pathProfile : null
  )

  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (formData.pathProfile instanceof File) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(formData.pathProfile)
    } else if (typeof formData.pathProfile === "string") {
      setImagePreview(formData.pathProfile)
    }
  }, [formData.pathProfile])

  const isValidPassword = (password: string) =>
    !password || (/[a-zA-Z]/.test(password) && /\d/.test(password) && password.length >= 6)

  const handleChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const uploadToS3 = async (file: File): Promise<string | null> => {
    try {
      const res = await api.get("User/upload-url", {
        params: { fileName: file.name, contentType: file.type },
      })

      const presignedUrl = res.data.url
      await axios.put(presignedUrl, file, { headers: { "Content-Type": file.type } })

      return presignedUrl.split("?")[0]
    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ:", error)
      return null
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const newErrors = {
      password: isValidPassword(formData.password) ? "" : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר",
    }

    if (!newErrors.password && formData.userName.trim()) {
      let imageUrl = formData.pathProfile

      if (formData.pathProfile instanceof File) {
        const uploadedUrl = await uploadToS3(formData.pathProfile)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        } else {
          setLoading(false)
          Swal.fire({
            icon: "error",
            title: "שגיאה!",
            text: "אירעה שגיאה בהעלאת התמונה.",
            background: "#1a1a1a",
            color: "#fff",
            confirmButtonColor: "#d59039",
          })
          return
        }
      }

      await dispatch(updateUser({ id: user.id, userPostModl: { ...formData, pathProfile: imageUrl } }))
      handleClose()
    }

    setLoading(false)
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => navigate(-1), 300)
  }

  return (
    <div className="update-user-modern">
      {/* Background Effects */}
      <div className="update-user-background">
        <div className="bg-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="bg-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${12 + Math.random() * 8}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="update-user-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="update-user-modal"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.1, type: "spring", damping: 20 }}
          >
            {/* Close Button */}
            <button className="modal-close-btn" onClick={handleClose}>
              <X size={20} />
            </button>

            {/* Header */}
            <div className="modal-header">
              <div className="header-icon">
                <User size={28} />
                <div className="icon-glow"></div>
              </div>
              <h2 className="modal-title">עדכון פרופיל</h2>
              <p className="modal-subtitle">ערוך את הפרטים האישיים שלך</p>
            </div>

            {/* Profile Image Section */}
            <motion.div
              className="profile-image-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="profile-image-container" onClick={() => setOpenDialog(true)}>
                <div className="profile-image-wrapper">
                  {imagePreview ? (
                    <img src={imagePreview || "/placeholder.svg"} alt="Profile" className="profile-image" />
                  ) : (
                    <div className="profile-placeholder">
                      <User size={40} />
                    </div>
                  )}
                  <div className="profile-overlay">
                    <Camera size={24} />
                    <span>שנה תמונה</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="update-user-form">
              <motion.div
                className="form-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label className="form-label">שם משתמש</label>
                <div className="input-container">
                  <input
                    type="text"
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                    className="form-input"
                    placeholder="הזן את שם המשתמש"
                  />
                  <User size={18} className="input-icon" />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                className="form-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? (
                    <div className="btn-loading">
                      <Loader size={18} className="loading-icon" />
                      <span>שומר...</span>
                    </div>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>עדכן פרופיל</span>
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Loading Overlay */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  className="loading-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Image Dialog */}
      <ProfileImageDialog open={openDialog} onClose={() => setOpenDialog(false)} setFormData={setFormData} />
    </div>
  )
}

export default UpdateUser