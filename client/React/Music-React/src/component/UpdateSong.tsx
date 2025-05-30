"use client"

import type React from "react"

import { useLocation, useNavigate } from "react-router-dom"
import { type FormEvent, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch } from "react-redux"
import { Music, Save, X, Eye, EyeOff, Camera, ImageIcon, ArrowRight } from "lucide-react"
import type { SongPostModel } from "../model/PostModel/SongPostModel"
import { updateSong } from "../services/SongsService"
import type { Dispatch } from "../store/store"
import { loadUser } from "../store/userSlice"
import SnackbarGreen from "./SnackbarWarn"
import axios from "axios"
import api from "../interceptor/axiosConfig"
import "../css/UpdateSong.css"
import SnackbarWarn from "./SnackbarWarn"

const UpdateSong = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<Dispatch>()
  const song = state?.song
  // const prevPath = state?.prevPath || "/mySongs"

  const [formData, setFormData] = useState(song)
  const [errors, setErrors] = useState<{ title: string }>({ title: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(song?.pathPicture || null)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [col,setCol] = useState("green") 
  useEffect(() => {
    if (selectedImageFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedImageFile)
    }
  }, [selectedImageFile])

  const handleChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value })
    if (errors.title && id === "title" && value.trim()) {
      setErrors({ title: "" })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImageFile(file)
    }
  }

  const uploadToS3 = async (file: File): Promise<string | null> => {
    try {
      const res = await api.get("Song/upload-url", {
        params: { fileName: file.name, contentType: file.type },
      })

      const presignedUrl = res.data.url
      await axios.put(presignedUrl, file, { headers: { "Content-Type": file.type } })

      return presignedUrl.split("?")[0]
    } catch (error) {
      setCol("red")
      setSnackbarMessage("שגיאה בהעלאת הקובץ")
      setSnackbarOpen(true)
      return null
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const newErrors = {
      title: formData.title.trim() ? "" : "כותרת השיר לא יכולה להיות ריקה",
    }

    setErrors(newErrors)

    if (!newErrors.title) {
      let imageUrl = formData.pathPicture

      if (selectedImageFile) {
        const uploadedUrl = await uploadToS3(selectedImageFile)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        } else {
          setCol("red")
          setSnackbarMessage("שגיאה בהעלאת התמונה")
          setSnackbarOpen(true)
          setIsLoading(false)
          return
        }
      }

      const songToUpdate: SongPostModel = {
        title: formData.title,
        gener: formData.gener || "",
        lyrics: formData.lyrics || "",
        isPublic: formData.isPublic,
        pathSong: formData.pathSong,
        pathPicture: imageUrl,
        userId: formData.userId,
      }
      try {
        const updatedSong = await updateSong(song.id, songToUpdate)
        dispatch(loadUser(song.userId))
        if (updatedSong) {
          setCol("green")
          setSnackbarMessage("השיר עודכן בהצלחה")
          setSnackbarOpen(true)
          setTimeout(() => {
            navigate(-1)
          }, 1500)
        }
      } catch (error) {
        console.error(error)
        setCol("red")
        setSnackbarMessage("שגיאה בעדכון השיר")
        setSnackbarOpen(true)
      }
    }
    setIsLoading(false)
  }

  const handleCancel = () => {
    navigate(-1)
  }

  if (!formData) {
    return (
      <div className="update-song-loading">
        <div className="loading-spinner"></div>
        <p>טוען נתונים...</p>
      </div>
    )
  }

  return (
    <div className="update-song-elegant">
      {/* Background Effects with Floating Notes */}
      <div className="update-song-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>

        {/* Floating Musical Notes */}
        <div className="floating-notes-container">
          <div className="floating-note note-1">♪</div>
          <div className="floating-note note-2">♫</div>
          <div className="floating-note note-3">♬</div>
          <div className="floating-note note-4">♩</div>
          <div className="floating-note note-5">♭</div>
          <div className="floating-note note-6">♯</div>
        </div>
      </div>

      <motion.div
        className="update-song-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="update-song-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <button onClick={handleCancel} className="back-button">
            <ArrowRight size={20} />
            <span>חזרה</span>
          </button>

          <div className="header-title">
            <div className="title-icon">
              <Music size={28} />
            </div>
            <h1>עריכת שיר</h1>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="update-song-card"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="update-song-form">
            <div className="form-layout">
              {/* Left Side - Image */}
              <div className="image-section">
                <div className="image-container">
                  <div className="image-wrapper" onClick={() => document.getElementById("image-upload")?.click()}>
                    {imagePreview ? (
                      <img src={imagePreview || "/placeholder.svg"} alt="Song cover" className="song-image" />
                    ) : (
                      <div className="image-placeholder">
                        <ImageIcon size={48} />
                        <span>העלה תמונת שיר</span>
                      </div>
                    )}
                    <div className="image-overlay">
                      <Camera size={24} />
                      <span>שנה תמונה</span>
                    </div>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="image-upload"
                  />

                  <motion.button
                    type="button"
                    className="change-image-btn"
                    onClick={() => document.getElementById("image-upload")?.click()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera size={18} />
                    <span>שנה תמונה</span>
                  </motion.button>
                </div>
              </div>

              {/* Right Side - Form Fields */}
              <div className="form-fields-section">
                <div className="form-group">
                  <label className="form-label">שם השיר</label>
                  <motion.input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                    className={`form-input ${errors.title ? "error" : ""}`}
                    placeholder="הזן את שם השיר"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  <AnimatePresence>
                    {errors.title && (
                      <motion.span
                        className="error-message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {errors.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="form-group">
                  <label className="form-label">ז'אנר</label>
                  <motion.input
                    type="text"
                    id="gener"
                    value={formData.gener}
                    onChange={(e) => handleChange(e.target.id, e.target.value)}
                    className="form-input"
                    placeholder="הזן את הז'אנר"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                {/* Privacy Toggle */}
                <div className="privacy-section">
                  <div className="privacy-toggle">
                    <div className="toggle-info">
                      <span className="toggle-label">פרטיות השיר</span>
                      <span className="toggle-description">{formData.isPublic ? "השיר גלוי לכולם" : "השיר פרטי"}</span>
                    </div>
                    <div className="toggle-container">
                      <input
                        type="checkbox"
                        id="privacy-toggle"
                        checked={formData.isPublic}
                        onChange={(e) => {
                          if (!song.isPublic) {
                            setFormData({ ...formData, isPublic: e.target.checked })
                          }
                        }}
                        className="toggle-input"
                      />
                      <label htmlFor="privacy-toggle" className="toggle-switch">
                        <div className="toggle-slider">
                          {formData.isPublic ? <Eye size={14} /> : <EyeOff size={14} />}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="form-actions">
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    className="btn-cancel"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>ביטול</span>
                  </motion.button>

                  <motion.button
                    type="submit"
                    className="btn-submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    {isLoading ? (
                      <div className="btn-loading">
                        <div className="loading-spinner-small"></div>
                        <span>שומר...</span>
                      </div>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>עדכן שיר</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>

      <SnackbarWarn col={col} snackbarMessage={snackbarMessage} snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} />
    </div>
  )
}

export default UpdateSong
