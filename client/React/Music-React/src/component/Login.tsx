// import { FormEvent, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import { loginUser } from "../store/userSlice";
// import { AuthLogin } from "../model/AuthLogin";
// import { Button, Card, CardContent, Typography } from "@mui/material";
// import FormInput from "./FormInput";
// import { Dispatch } from "../store/store";
// import "../css/Login.css"; // ✅ ייבוא הקובץ החדש

// const Login = () => {
//   const emptyUser: AuthLogin = { email: "", password: "" };

//   const dispatch = useDispatch<Dispatch>();
//   const [formData, setFormData] = useState<AuthLogin>(emptyUser);
//   const [errors, setErrors] = useState({ email: "", password: "" });
//   const [submitted, setSubmitted] = useState(false);
//   const navigate = useNavigate();

//   const isValidEmail = (email: string) =>
//     /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
//   const isValidPassword = (password: string) =>
//     /[a-zA-Z]/.test(password) && /\d/.test(password) && password.length >= 6;

//   const handleChange = (id: string, value: string) => {
//     setFormData({ ...formData, [id]: value });

//     if (submitted) {
//       setErrors((prev) => ({
//         ...prev,
//         email:
//           id === "email"
//             ? isValidEmail(value)
//               ? ""
//               : "כתובת אימייל לא תקינה"
//             : prev.email,
//         password:
//           id === "password"
//             ? isValidPassword(value)
//               ? ""
//               : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר"
//             : prev.password,
//       }));
//     }
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     setSubmitted(true);

//     const newErrors = {
//       email: isValidEmail(formData.email) ? "" : "כתובת אימייל לא תקינה",
//       password: isValidPassword(formData.password)
//         ? ""
//         : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר",
//     };

//     setErrors(newErrors);

//     if (!newErrors.email && !newErrors.password) {
//       dispatch(loginUser(formData));
//       navigate("/");
//     }
//   };

//   return (
//     <div className="login-container">
//       <Card className="login-card">
//         <CardContent>
//           <Typography variant="h6" align="center" className="login-title">
//             התחברות
//           </Typography>

//           <form onSubmit={handleSubmit} className="login-form">
//             <FormInput
//               label="אימייל"
//               type="email"
//               id="email"
//               value={formData.email}
//               error={errors.email}
//               onChange={handleChange}
//             />
//             <FormInput
//               label="סיסמה"
//               type="password"
//               id="password"
//               value={formData.password}
//               error={errors.password}
//               onChange={handleChange}
//             />
// <Typography variant="body2" align="center" sx={{ marginTop: "5px" ,color: "#888"}}>
//             עדיין לא נרשמת?{" "}
//             <Link to="/register" style={{ textDecoration: "none", color: "#d5933c" }}>
//               לחץ כאן 
//             </Link>
//           </Typography>
//             <Button type="submit" variant="contained" fullWidth className="login-button">
//               התחבר
//             </Button>
//           </form>
          
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Login;


"use client"

import { type FormEvent, useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "../store/userSlice"
import type { AuthLogin } from "../model/AuthLogin"
import type { Dispatch } from "../store/store"
import MicrophoneIcon from "./icons/MicrophoneIcon"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
import "../css/Login.css"

const Login = () => {
  const emptyUser: AuthLogin = { email: "", password: "" }

  const dispatch = useDispatch<Dispatch>()
  const [formData, setFormData] = useState<AuthLogin>(emptyUser)
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        email: id === "email" ? (isValidEmail(value) ? "" : "כתובת אימייל לא תקינה") : prev.email,
        password:
          id === "password"
            ? isValidPassword(value)
              ? ""
              : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר"
            : prev.password,
      }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    const newErrors = {
      email: isValidEmail(formData.email) ? "" : "כתובת אימייל לא תקינה",
      password: isValidPassword(formData.password) ? "" : "הסיסמה חייבת להכיל לפחות 6 תווים, אות ומספר",
    }

    setErrors(newErrors)

    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true)
      try {
        await dispatch(loginUser(formData))
        navigate("/")
      } catch (error) {
        console.error("Login failed:", error)
      } finally {
        setIsLoading(false)
      }
    }
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
            <h2 className="form-title">התחברות</h2>
            <p className="form-subtitle">ברוכים הבאים בחזרה!</p>

            <form onSubmit={handleSubmit} className="login-form">
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

              <button type="submit" className={`login-submit-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                {isLoading ? <span className="button-spinner"></span> : "התחבר"}
              </button>
            </form>

            <div className="form-footer">
              <p className="redirect-text">
                עדיין לא נרשמת?{" "}
                <Link to="/register" className="redirect-link">
                  הרשם עכשיו
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login