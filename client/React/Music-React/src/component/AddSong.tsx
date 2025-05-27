"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import { addSong } from "../services/SongsService"
import { loadUser } from "../store/userSlice"
import axios from "axios"
import api from "../interceptor/axiosConfig"
import * as mm from "music-metadata-browser"
import { Buffer } from "buffer"
import {
  Upload,
  Music,
  Edit3,
  Save,
  ArrowRight,
  ArrowLeft,
  FileAudio,
  Disc3,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  Camera,
} from "lucide-react"
import "../css/AddSong.css"

declare global {
  interface Window {
    Buffer: typeof Buffer
  }
}
window.Buffer = Buffer

interface SongData {
  title: string
  gener: string
  lyrics: string
  isPublic: boolean
  pathSong: string
  pathPicture: string
  userId: number
}

interface SongMetadata {
  title: string
  genre: string
  artist: string
  album: string
  coverImage: File | null
  defaultCover: string
}

const AddSong = () => {
  const [currentStep, setCurrentStep] = useState<"upload" | "metadata" | "edit" | "saving">("upload")
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [songData, setSongData] = useState<Partial<SongData>>({})
  const [songMetadata, setSongMetadata] = useState<SongMetadata | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [customCoverImage, setCustomCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>("")
  const [error, setError] = useState<string>("")

  const dispatch = useDispatch()
  const userId = useSelector((state: StoreType) => state.user.user.id)

  const uploadToS3 = async (
    file: File,
    isImage = false,
    onProgress?: (percent: number) => void,
  ): Promise<string | null> => {
    try {
      const res = await api.get(isImage ? "User/upload-url" : "Song/upload-url", {
        params: { fileName: file.name, contentType: file.type },
      })

      const presignedUrl = res.data.url

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          if (onProgress) {
            onProgress(percent)
          }
        },
      })

      const cleanUrl = presignedUrl.split("?")[0].replace("us-east-1.", "")
      return cleanUrl
    } catch (error) {
      console.error("שגיאה בהעלאת קובץ:", error)
      return null
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setError("")
    setLoading(true)
    setProgress(0)
    setOriginalFile(file)
    setCurrentStep("metadata")

    try {
      // Extract metadata only - no upload yet
      const metadata = await mm.parseBlob(file)
      const genre = metadata.common.genre?.[0] || "לא ידוע"
      const title = metadata.common.title || file.name.replace(/\.[^/.]+$/, "")
      const artist = metadata.common.artist || ""
      const album = metadata.common.album || ""

      let coverImageFile: File | null = null
      let defaultCover = "https://pninimusic.s3.us-east-1.amazonaws.com/images/music2.jpg"

      // Extract cover image if exists
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const cover = metadata.common.picture[0]
        const coverBlob = new Blob([cover.data], { type: cover.format })
        coverImageFile = new File([coverBlob], `${file.name}_cover.${cover.format.split("/")[1] || "jpg"}`, {
          type: coverBlob.type,
          lastModified: Date.now(),
        })
        defaultCover = URL.createObjectURL(coverImageFile)
      }

      const songMetadata: SongMetadata = {
        title,
        genre,
        artist,
        album,
        coverImage: coverImageFile,
        defaultCover,
      }

      setSongMetadata(songMetadata)
      setCoverPreview(defaultCover)

      // Prepare song data for editing
      setSongData({
        title,
        gener: genre,
        lyrics: artist && album ? `אמן: ${artist}\nאלבום: ${album}` : "",
        isPublic: false,
        userId,
      })

      // Simulate processing time with real progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      // Wait 2 seconds as requested
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setCurrentStep("edit")
      setLoading(false)
      setProgress(0)
    } catch (error) {
      console.error("שגיאה בקריאת מטא נתונים:", error)
      setError("שגיאה בעיבוד הקובץ")
      setCurrentStep("upload")
      setLoading(false)
    }
  }

  const handleCoverImageChange = (file: File) => {
    setCustomCoverImage(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleSaveSong = async () => {
    if (!songData.title || !originalFile) return

    setCurrentStep("saving")
    setLoading(true)
    setProgress(0)

    try {
      let coverImageUrl = "https://pninimusic.s3.us-east-1.amazonaws.com/images/music2.jpg"

      // Upload cover image first (30% of progress)
      const imageToUpload = customCoverImage || songMetadata?.coverImage
      if (imageToUpload) {
        const uploadedCover = await uploadToS3(imageToUpload, true, (percent) => {
          setProgress(Math.round(percent * 0.3))
        })
        if (uploadedCover) {
          coverImageUrl = uploadedCover
        }
      } else {
        setProgress(30)
      }

      // Upload song file (70% of progress)
      const uploadedSongUrl = await uploadToS3(originalFile, false, (percent) => {
        setProgress(Math.round(30 + percent * 0.7))
      })

      if (!uploadedSongUrl) {
        setError("שגיאה בהעלאת הקובץ")
        setCurrentStep("edit")
        setLoading(false)
        return
      }

      const finalSongData: SongData = {
        ...songData,
        pathSong: uploadedSongUrl,
        pathPicture: coverImageUrl,
      } as SongData

      await addSong(finalSongData)
      dispatch(loadUser(userId) as any)

      // Reset form
      resetForm()
    } catch (error) {
      console.error("שגיאה בשמירת השיר:", error)
      setError("שגיאה בשמירת השיר")
      setCurrentStep("edit")
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSongData({})
    setSongMetadata(null)
    setOriginalFile(null)
    setCustomCoverImage(null)
    setCoverPreview("")
    setCurrentStep("upload")
    setError("")
    setProgress(0)
    setLoading(false)
  }

  return (
    <div className="add-song-modern">
      {/* Background Effects */}
      <div className="add-song-background-effects">
        <div className="add-song-gradient-orb orb-1"></div>
        <div className="add-song-gradient-orb orb-2"></div>
        <div className="add-song-gradient-orb orb-3"></div>

        <div className="floating-add-song-notes">
          <div className="add-song-note note-1">♪</div>
          <div className="add-song-note note-2">♫</div>
          <div className="add-song-note note-3">♬</div>
          <div className="add-song-note note-4">🎤</div>
        </div>
      </div>

      {/* Header */}
      <motion.div
        className="add-song-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-icon-container">
          <Music size={36} className="header-icon" />
        </div>
        <h1 className="add-song-title">הוסף שיר חדש</h1>
        <p className="add-song-subtitle">העלה ועצב את השיר שלך</p>
      </motion.div>

      {/* Steps Indicator */}
      <motion.div
        className="steps-indicator"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className={`step ${currentStep === "upload" ? "active" : ""}`}>
          <div className="step-icon">
            <Upload size={20} />
          </div>
          <span>העלאה</span>
        </div>

        <div className="step-connector"></div>

        <div
          className={`step ${currentStep === "metadata" ? "active" : currentStep === "edit" || currentStep === "saving" ? "completed" : ""}`}
        >
          <div className="step-icon">
            <Disc3 size={20} />
          </div>
          <span>עיבוד</span>
        </div>

        <div className="step-connector"></div>

        <div className={`step ${currentStep === "edit" ? "active" : currentStep === "saving" ? "completed" : ""}`}>
          <div className="step-icon">
            <Edit3 size={20} />
          </div>
          <span>עריכה</span>
        </div>

        <div className="step-connector"></div>

        <div className={`step ${currentStep === "saving" ? "active" : ""}`}>
          <div className="step-icon">
            <Save size={20} />
          </div>
          <span>שמירה</span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="add-song-content">
        <AnimatePresence mode="wait">
          {/* Upload Step */}
          {currentStep === "upload" && (
            <motion.div
              key="upload"
              className="step-content"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <div className="upload-section">
                <div
                  className={`upload-zone ${dragOver ? "drag-over" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                    const file = e.dataTransfer.files[0]
                    if (file && file.type.startsWith("audio/")) {
                      handleFileUpload(file)
                    }
                  }}
                >
                  <div className="upload-icon-container">
                    <FileAudio size={64} className="upload-icon" />
                    <div className="upload-glow"></div>
                  </div>

                  <h3>גרור ושחרר קובץ שיר</h3>
                  <p>או לחץ לבחירת קובץ מהמחשב</p>

                  <label className="upload-button">
                    <Upload size={20} />
                    <span>בחר קובץ שיר</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                  </label>

                  <div className="supported-formats">
                    <span>פורמטים נתמכים: MP3, WAV, FLAC, M4A</span>
                  </div>
                </div>

                {error && (
                  <motion.div className="error-message" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Metadata Processing Step */}
          {currentStep === "metadata" && (
            <motion.div
              key="metadata"
              className="step-content"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <div className="processing-section">
                <div className="processing-icon-container">
                  <Disc3 size={64} className="processing-icon" />
                  <div className="processing-glow"></div>
                </div>

                <h3>מעבד את השיר...</h3>
                <p>שולף מידע מהקובץ</p>

                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <span className="progress-text">{progress}%</span>
                </div>

                {originalFile && (
                  <div className="file-info">
                    <FileAudio size={20} />
                    <span>{originalFile.name}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Edit Step */}
          {currentStep === "edit" && (
            <motion.div
              key="edit"
              className="step-content"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <div className="edit-section">
                <div className="song-preview">
                  <div className="song-cover" style={{ backgroundImage: `url(${coverPreview})` }}>
                    <div className="cover-overlay">
                      <Music size={32} />
                    </div>
                  </div>

                  <div className="song-info">
                    <h3>פרטי השיר</h3>
                    <p>ערוך את הפרטים לפני השמירה</p>

                    <label className="change-cover-button">
                      <Camera size={16} />
                      <span>החלף תמונה</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && handleCoverImageChange(e.target.files[0])}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </div>

                <div className="edit-form">
                  <div className="form-group">
                    <label>שם השיר</label>
                    <input
                      type="text"
                      value={songData.title || ""}
                      onChange={(e) => setSongData({ ...songData, title: e.target.value })}
                      placeholder="הזן שם השיר"
                    />
                  </div>

                  <div className="form-group">
                    <label>ז'אנר</label>
                    <input
                      type="text"
                      value={songData.gener || ""}
                      onChange={(e) => setSongData({ ...songData, gener: e.target.value })}
                      placeholder="הזן ז'אנר"
                    />
                  </div>

                  <div className="form-group">
                    <label>מידע נוסף</label>
                    <textarea
                      value={songData.lyrics || ""}
                      onChange={(e) => setSongData({ ...songData, lyrics: e.target.value })}
                      placeholder="הוסף מידע נוסף על השיר..."
                      rows={4}
                    />
                  </div>

                  <div className="form-group">
                    <label>הגדרות פרטיות</label>
                    <div className="privacy-options">
                      <div
                        className={`privacy-option ${!songData.isPublic ? "active" : ""}`}
                        onClick={() => setSongData({ ...songData, isPublic: false })}
                      >
                        <Lock size={20} />
                        <div>
                          <span>פרטי</span>
                          <small>רק אתה תוכל לראות</small>
                        </div>
                      </div>

                      <div
                        className={`privacy-option ${songData.isPublic ? "active" : ""}`}
                        onClick={() => setSongData({ ...songData, isPublic: true })}
                      >
                        <Globe size={20} />
                        <div>
                          <span>ציבורי</span>
                          <small>כולם יוכלו לראות</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="edit-actions">
                  <button className="back-button" onClick={resetForm}>
                    <ArrowLeft size={20} />
                    <span>חזור</span>
                  </button>

                  <button className="save-button" onClick={handleSaveSong} disabled={!songData.title}>
                    <span>שמור שיר</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Saving Step */}
          {currentStep === "saving" && (
            <motion.div
              key="saving"
              className="step-content"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <div className="saving-section">
                {loading ? (
                  <>
                    <div className="saving-icon-container">
                      <Save size={64} className="saving-icon spinning" />
                      <div className="saving-glow"></div>
                    </div>

                    <h3>מעלה ושומר...</h3>
                    <p>מעלה את הקבצים לשרת</p>

                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                      <span className="progress-text">{progress}%</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="success-icon-container">
                      <CheckCircle size={64} className="success-icon" />
                      <div className="success-glow"></div>
                    </div>

                    <h3>השיר נשמר בהצלחה!</h3>
                    <p>השיר שלך זמין עכשיו באזור האישי</p>

                    <div className="success-animation">
                      <Sparkles size={24} />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AddSong
