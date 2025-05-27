// import { FormEvent, useState } from "react";
// import { useDispatch } from "react-redux";
// import { Dispatch } from "../store/store";
// import { useNavigate } from "react-router-dom";
// import { registerUser, sendEmail } from "../store/userSlice";
// import { UserPostModel } from "../model/PostModel/UserPostModel";
// import { Button, Card, CardContent, Typography } from "@mui/material";
// import ProfileImageDialog from "./ProfileImage";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
// import FormInput from "./FormInput";
// import axios from "axios";
// import api from "../interceptor/axiosConfig";
// import Swal from "sweetalert2";
// import "../css/Register.css"; // ייבוא עיצוב מותאם

// const Register = () => {
//   const emptyUser: UserPostModel = { userName: "", email: "", password: "", pathProfile: "" };

//   const dispatch = useDispatch<Dispatch>();
//   const [formData, setFormData] = useState<UserPostModel>(emptyUser);
//   const [errors, setErrors] = useState({ email: "", password: "" });
//   const [openDialog, setOpenDialog] = useState(false);
//   // const [setSubmitted] = useState(false);
//   const navigate = useNavigate();

//   const isValidEmail = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
//   const isValidPassword = (password: string) => /[a-zA-Z]/.test(password) && /\d/.test(password) && password.length >= 6;

//   const handleChange = (id: string, value: string) => {
//     setFormData({ ...formData, [id]: value });
//   }

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
//     // setSubmitted(true);
//   debugger
//     const newErrors = {
//       email: isValidEmail(formData.email) ? "" : "כתובת אימייל לא תקינה",
//       password: isValidPassword(formData.password) ? "" : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר",
//     };

//     setErrors(newErrors);

//     if (!newErrors.email && !newErrors.password && formData.userName.trim()) {
//       let imageUrl = formData.pathProfile;

//       if (formData.pathProfile instanceof File) {
//         const uploadedUrl = await uploadToS3(formData.pathProfile);
//         if (uploadedUrl) {
//           imageUrl = uploadedUrl;
//         } else {
//           Swal.fire({ icon: "error", title: "שגיאה!", text: "אירעה שגיאה בהעלאת התמונה." });
//           return;
//         }
//       }

//       const result = await dispatch(registerUser({ ...formData, pathProfile: imageUrl }));
//       if (result.meta.requestStatus === 'fulfilled') {
//         // setSnackMessage('הרשמה בוצעה בהצלחה');
//         // setSnackSeverity('success');
//         // setSnackOpen(true);
//         setTimeout(() => {navigate('/');}, 1500);
//         const subject = "ברוך הבא ל-singsong – הבית שלך למוזיקה חברתית!";
//         const body = `
//         <div style="direction: rtl; background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
//           <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 35px;">
//             <h1 style="color: #333; font-size: 32px; text-align: center; font-weight: bold;">
//               ברוך הבא ל-<span style="text-decoration: underline;">singsong</span>!
//             </h1>
//             <p style="font-weight: bold;font-size: 25px; color: #333;">שלום ${formData.userName},</p>
//             <p style="font-size: 18px; color: #333;">
//               איזה כיף שהצטרפת אלינו! singsong היא הרבה יותר מאפליקציה – זו קהילה של יוצרים, מאזינים ואנשים שחיים ונושמים מוזיקה. מהרגע הזה, אתה חלק ממשהו גדול יותר.
//             </p>
//             <p style="font-size: 18px; color: #333;">
//               אצלנו תוכל:
//             </p>
//             <ul style="font-size: 18px; color: #333; padding-right: 20px;">
//               <li>🎶 <strong>לשתף את היצירה שלך:</strong> העלה שירים מקוריים, קטעי קול או גרסאות כיסוי – וקבל במה.</li>
//               <li>📢 <strong>להגיע לקהל אמיתי:</strong> כל שיר שתעלה יכול לזכות בלייקים, תגובות, ושיתופים.</li>
//               <li>👂 <strong>לשמוע מוזיקה חדשה:</strong> גלה יוצרים מוכשרים, האזן, ושתף עם חברים.</li>
//               <li>👥 <strong>להתחבר לקהילה:</strong> עקוב אחרי משתמשים, הגב להם, קבל התראות על שירים חדשים – ובנה לעצמך קהל.</li>
//             </ul>
//             <p style="font-size: 18px; color: #333;">
//               בכל רגע שתפתח את singsong, תוכל לגלות השראה חדשה – כי כאן, המוזיקה אף פעם לא עוצרת.
//             </p>
//             <p style="font-size: 18px; color: #333;">
//               אנחנו כאן כדי ללוות אותך – אם תצטרך עזרה, הכוונה או סתם מקום לשתף, תמיד נשמח לשמוע ממך.
//             </p>
//             <div style="text-align: center; margin: 30px 0;">
//               <a href="http://:5173/" style="display: inline-block; padding: 12px 24px; background: linear-gradient(90deg, #D59039, #F7C26B); color: white; text-decoration: none; border-radius: 30px; font-size: 16px;">
//                 התחבר ל-singsong
//               </a>
//             </div>
//             <p style="font-size: 20px; color: #D59039; text-align: center;">
//               באהבה,<br/>צוות singsong
//             </p>
//           </div>
//         </div>
//         `;
        
        
//         const result2 = await dispatch(sendEmail({ to: [formData.email], subject: subject, body: body }));
//         if(result2.meta.requestStatus === 'fulfilled'){
//             console.log("mail sent!");
//             // window.location.reload();
//             // dispatch(fetchUser() as any);
//           }
//         else{
//             console.log("mail not sent!");}
//         }
//       navigate("/");
//     }
//   };

//   return (
//     <div className="login-container">
//       <Card className="login-card">
//         <CardContent>
//           <Typography variant="h6" align="center" className="login-title">
//             הרשמה
//           </Typography>

//           <form onSubmit={handleSubmit} className="login-form">
//             <FormInput label="שם משתמש" id="userName" value={formData.userName} error="" onChange={handleChange} />
//             <FormInput label="אימייל" type="email" id="email" value={formData.email} error={errors.email} onChange={handleChange} />
//             <FormInput label="סיסמה" type="password" id="password" value={formData.password} error={errors.password} onChange={handleChange} />

//             <Button variant="outlined" className="picture" fullWidth onClick={() => setOpenDialog(true)} sx={{ mt: 1 }} startIcon={<CameraAltIcon sx={{ marginLeft: "8px" }}/>}>
//               בחר תמונת פרופיל
//             </Button>

//             <Button type="submit" variant="contained" fullWidth className="login-button">
//               הרשמה
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       <ProfileImageDialog open={openDialog} onClose={() => setOpenDialog(false)} setFormData={setFormData} />
//     </div>
//   );
// };

// export default Register;
"use client"

import { type FormEvent, useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import type { Dispatch } from "../store/store"
import { useNavigate, Link } from "react-router-dom"
import { registerUser, sendEmail } from "../store/userSlice"
import type { UserPostModel } from "../model/PostModel/UserPostModel"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import ProfileImageDialog from "./ProfileImage"
import MicrophoneIcon from "./icons/MicrophoneIcon"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
import PersonIcon from "@mui/icons-material/Person"
import axios from "axios"
import api from "../interceptor/axiosConfig"
import Swal from "sweetalert2"
import "../css/Register.css"

const Register = () => {
  const emptyUser: UserPostModel = {
    userName: "",
    email: "",
    password: "",
    pathProfile: "",
  }
  const dispatch = useDispatch<Dispatch>()
  const [formData, setFormData] = useState<UserPostModel>(emptyUser)
  const [errors, setErrors] = useState({ userName: "", email: "", password: "" })
  const [openDialog, setOpenDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const navigate = useNavigate()

  // Animation states
  const [animateForm, setAnimateForm] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimateForm(true)
    }, 100)
  }, [])

  const isValidEmail = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
  const isValidPassword = (password: string) => /[a-zA-Z]/.test(password) && /\d/.test(password) && password.length >= 6

  const handleChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value })

    // Clear error when user types
    if (errors[id as keyof typeof errors]) {
      setErrors({
        ...errors,
        [id]: "",
      })
    }
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

    const newErrors = {
      userName: formData.userName.trim() ? "" : "שם משתמש הוא שדה חובה",
      email: isValidEmail(formData.email) ? "" : "כתובת אימייל לא תקינה",
      password: isValidPassword(formData.password) ? "" : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר",
    }

    setErrors(newErrors)

    if (!newErrors.userName && !newErrors.email && !newErrors.password) {
      setIsLoading(true)

      try {
        let imageUrl = formData.pathProfile

        if (formData.pathProfile instanceof File) {
          const uploadedUrl = await uploadToS3(formData.pathProfile)
          if (uploadedUrl) {
            imageUrl = uploadedUrl
          } else {
            Swal.fire({
              icon: "error",
              title: "שגיאה!",
              text: "אירעה שגיאה בהעלאת התמונה.",
              background: "#1e1e1e",
              color: "#fff",
              confirmButtonColor: "#d59039",
            })
            setIsLoading(false)
            return
          }
        }

        const result = await dispatch(registerUser({ ...formData, pathProfile: imageUrl }))

        if (result.meta.requestStatus === "fulfilled") {
          const subject = "ברוך הבא ל-singsong – הבית שלך למוזיקה חברתית!"
          const body = `
<div style="direction: rtl; background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 35px;">
<h1 style="color: #333; font-size: 32px; text-align: center; font-weight: bold;">
ברוך הבא ל-<span style="text-decoration: underline;">singsong</span>!
</h1>
<p style="font-weight: bold;font-size: 25px; color: #333;">שלום ${formData.userName},</p>
<p style="font-size: 18px; color: #333;">
איזה כיף שהצטרפת אלינו! singsong היא הרבה יותר מאפליקציה – זו קהילה של יוצרים, מאזינים ואנשים שחיים ונושמים מוזיקה. מהרגע הזה, אתה חלק ממשהו גדול יותר.
</p>
<p style="font-size: 18px; color: #333;">
אצלנו תוכל:
</p>
<ul style="font-size: 18px; color: #333; padding-right: 20px;">
<li>🎶 <strong>לשתף את היצירה שלך:</strong> העלה שירים מקוריים, קטעי קול או גרסאות כיסוי – וקבל במה.</li>
<li>📢 <strong>להגיע לקהל אמיתי:</strong> כל שיר שתעלה יכול לזכות בלייקים, תגובות, ושיתופים.</li>
<li>👂 <strong>לשמוע מוזיקה חדשה:</strong> גלה יוצרים מוכשרים, האזן, ושתף עם חברים.</li>
<li>👥 <strong>להתחבר לקהילה:</strong> עקוב אחרי משתמשים, הגב להם, קבל התראות על שירים חדשים – ובנה לעצמך קהל.</li>
</ul>
<p style="font-size: 18px; color: #333;">
בכל רגע שתפתח את singsong, תוכל לגלות השראה חדשה – כי כאן, המוזיקה אף פעם לא עוצרת.
</p>
<p style="font-size: 18px; color: #333;">
אנחנו כאן כדי ללוות אותך – אם תצטרך עזרה, הכוונה או סתם מקום לשתף, תמיד נשמח לשמוע ממך.
</p>
<div style="text-align: center; margin: 30px 0;">
<a href="http://:5173/" style="display: inline-block; padding: 12px 24px; background: linear-gradient(90deg, #D59039, #F7C26B); color: white; text-decoration: none; border-radius: 30px; font-size: 16px;">
התחבר ל-singsong
</a>
</div>
<p style="font-size: 20px; color: #D59039; text-align: center;">
באהבה,<br/>צוות singsong
</p>
</div>
</div>
`

          await dispatch(sendEmail({ to: [formData.email], subject: subject, body: body }))

          Swal.fire({
            icon: "success",
            title: "נרשמת בהצלחה!",
            text: "ברוך הבא ל-SingSong",
            background: "#1e1e1e",
            color: "#fff",
            confirmButtonColor: "#d59039",
            timer: 2000,
            showConfirmButton: false,
          })

          setTimeout(() => {
            navigate("/")
          }, 2000)
        }
      } catch (error) {
        console.error("Registration error:", error)
        Swal.fire({
          icon: "error",
          title: "שגיאה!",
          text: "אירעה שגיאה בתהליך ההרשמה. נסה שוב מאוחר יותר.",
          background: "#1e1e1e",
          color: "#fff",
          confirmButtonColor: "#d59039",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleProfileSelect = (file: File) => {
    setFormData((prev) => ({ ...prev, pathProfile: file }))
    setProfilePreview(URL.createObjectURL(file))
    setOpenDialog(false)
  }

  return (
    <div className="split-auth-container">
      <div className="auth-background">
        <div className="auth-gradient-circle circle-1"></div>
        <div className="auth-gradient-circle circle-2"></div>
        <div className="auth-gradient-circle circle-3"></div>
      </div>

      <div className={`split-auth-content ${animateForm ? "animate-in" : ""}`}>
        <div className="brand-section">
          <div className="brand-content">
            <div className="microphone-icon-container">
              <MicrophoneIcon />
            </div>
            <h1 className="brand-name">SingSong</h1>
            <p className="brand-tagline">המקום שלך למוזיקה</p>

            <div className="auth-decorative-circles">
              <div className="auth-decorative-circle auth-circle-sm"></div>
              <div className="auth-decorative-circle auth-circle-md"></div>
              <div className="auth-decorative-circle auth-circle-lg"></div>
            </div>

            <div className="sound-waves">
              <div className="wave wave-1"></div>
              <div className="wave wave-2"></div>
              <div className="wave wave-3"></div>
              <div className="wave wave-4"></div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-container">
            <h2 className="form-title">הרשמה</h2>
            <p className="form-subtitle">הצטרף אלינו עכשיו!</p>

            <div className="profile-upload-enhanced" onClick={() => setOpenDialog(true)}>
              {profilePreview ? (
                <div className="profile-preview-enhanced" style={{ backgroundImage: `url(${profilePreview})` }}>
                  <div className="profile-overlay">
                    <CameraAltIcon className="camera-icon-overlay" />
                  </div>
                </div>
              ) : (
                <div className="profile-placeholder-enhanced">
                  <CameraAltIcon className="camera-icon-enhanced" />
                  <span>בחר תמונת פרופיל</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-field">
                {/* <label className="field-label">שם משתמש</label> */}
                <div className="input-container">
                  <PersonIcon className="field-icon" />
                  <input
                    type="text"
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => handleChange("userName", e.target.value)}
                    className={`field-input ${errors.userName ? "field-error" : ""}`}
                    placeholder="הזן את שם המשתמש שלך"
                  />
                </div>
                {errors.userName && <span className="error-text">{errors.userName}</span>}
              </div>

              <div className="form-field">
                {/* <label className="field-label">אימייל</label> */}
                <div className="input-container">
                  <EmailIcon className="field-icon" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`field-input ${errors.email ? "field-error" : ""}`}
                    placeholder="הזן את האימייל שלך"
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-field">
                {/* <label className="field-label">סיסמה</label> */}
                <div className="input-container">
                  <LockIcon className="field-icon" />
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className={`field-input ${errors.password ? "field-error" : ""}`}
                    placeholder="הזן את הסיסמה שלך"
                  />
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <button type="submit" className={`register-submit-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                {isLoading ? <span className="button-spinner"></span> : "הרשם"}
              </button>
            </form>

            <div className="form-footer">
              <p className="redirect-text">
                כבר יש לך חשבון?{" "}
                <Link to="/login" className="redirect-link">
                  התחבר כאן
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProfileImageDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        setFormData={setFormData}
        onSelectImage={handleProfileSelect}
      />
    </div>
  )
}

export default Register
