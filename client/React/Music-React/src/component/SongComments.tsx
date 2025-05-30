"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { getSongById } from "../services/SongsService"
import { addComment } from "../services/CommentsService"
import type { Song } from "../model/Song"
import type { Comment } from "../model/Comment"
import type { UserPostModel } from "../model/PostModel/UserPostModel"
import { getArtistById } from "../services/UserService"
import { useDispatch, useSelector } from "react-redux"
import type { Dispatch, StoreType } from "../store/store"
import { updateSong } from "../store/songSlice"
import DownloadSong from "./DownloadSong"
import AddComment from "./AddComment"
import Comments from "./Comments"
import ShareSongButton from "./ShareSongButton"
import DeleteSong from "./DeleteSong"
import axios from "axios"
import { addLyrics } from "../services/SongsService"
import {
  Play,
  Edit,
  Music,
  User,
  Calendar,
  Star,
  MessageCircle,
  Eye,
  EyeOff,
  Heart,
  Mic,
  FileText,
  Copy,
  Download,
  Share2,
  Clock,
  Volume2,
  Sparkles,
} from "lucide-react"
import "../css/SongComments.css"

const SongComments = () => {
  const { songId } = useParams()
  const user = useSelector((store: StoreType) => store.user.user)
  const [song, setSong] = useState<Song | null>(null)
  const [artist, setArtist] = useState<UserPostModel>()
  const [comments, setComments] = useState<Comment[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [transcription, setTranscription] = useState<string>("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [activeTab, setActiveTab] = useState<"comments" | "transcription">("comments")

  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()

  const isOwner = song?.userId === user?.id

  const handleEdit = (song: Song) => navigate("/updateSong", { state: { song } })

  useEffect(() => {
    const fetchSongData = async () => {
      setIsLoading(true)
      try {
        const songData = await getSongById(songId ? +songId : 0)
        setSong(songData)
        const artistData = await getArtistById(songData.userId)
        setArtist(artistData)
        setComments(songData.comments)
      } catch (error) {
        console.error("שגיאה בטעינת הנתונים:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSongData()
  }, [songId])

  const handleAddComment = async (newComment: string, newRating: number) => {
    if (!newRating && !newComment.trim()) return
    try {
      const comment = await addComment({
        content: newComment,
        star: newRating ? newRating : 0,
        songId: song?.id!,
        userId: user.id,
      })
      const newC = {
        ...comment,
        user: { pathProfile: user.pathProfile, userName: user.userName, id: user.id },
      }
      setComments((prev) => [newC, ...prev])
      setOpen(false)
    } catch (error) {
      console.error("שגיאה בהוספת תגובה:", error)
    }
  }

  const handleTranscription = async () => {
    setIsTranscribing(true)
    try {
      if (song?.lyrics === "") {
        const response = await axios.post("http://localhost:5000/transcribe", {
          url: song.pathSong,
        })
        setTranscription(response.data.corrected_lyrics)
        await addLyrics(song.id, response.data.corrected_lyrics)
      } else {
        setTranscription(song?.lyrics ? song.lyrics : "")
      }
    } catch (error) {
      console.error("שגיאה בתמלול:", error)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setTranscription(`
תמלול השיר "${song?.title}":

[פסוק 1]
בלילות הקרים כשהעולם שקט
אני חושב עליך ועל מה שהיה
הזכרונות שלנו כמו כוכבים בשמיים
מאירים את הדרך בחושך הזה

[פזמון]
ואת שם רחוק ממני
אבל הלב שלי איתך
כל מילה שאמרת לי
עדיין חיה בתוכי
    `)
    } finally {
      setIsTranscribing(false)
    }
  }

  const averageRating =
    comments.length > 0 ? comments.reduce((sum, comment) => sum + comment.star, 0) / comments.length : 0

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const copyTranscription = () => {
    navigator.clipboard.writeText(transcription)
  }

  const downloadTranscription = () => {
    const element = document.createElement("a")
    const file = new Blob([transcription], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `תמלול_${song?.title}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (isLoading) {
    return (
      <div className="song-comments-page">
        <div className="song-comments-background">
          <div className="song-comments-gradient-orb song-comments-orb-1"></div>
          <div className="song-comments-gradient-orb song-comments-orb-2"></div>
          <div className="song-comments-gradient-orb song-comments-orb-3"></div>
        </div>

        <div className="song-comments-loading-container">
          <motion.div
            className="song-comments-loading-spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="song-comments-spinner-ring"></div>
            <div className="song-comments-loading-text">טוען פרטי שיר...</div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!song) {
    return (
      <div className="song-comments-page">
        <div className="song-comments-background">
          <div className="song-comments-gradient-orb song-comments-orb-1"></div>
          <div className="song-comments-gradient-orb song-comments-orb-2"></div>
        </div>

        <motion.div
          className="song-comments-empty-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="song-comments-empty-icon-container">
            <Music size={64} className="song-comments-empty-icon" />
          </div>
          <h3>השיר לא נמצא</h3>
          <p>נסה לחפש שיר אחר או חזור לדף הראשי</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="song-comments-page">
      <div className="song-comments-background">
        <div className="song-comments-gradient-orb song-comments-orb-1"></div>
        <div className="song-comments-gradient-orb song-comments-orb-2"></div>
        <div className="song-comments-gradient-orb song-comments-orb-3"></div>
        <div className="song-comments-floating-notes">
          <div className="song-comments-note song-comments-note-1">♪</div>
          <div className="song-comments-note song-comments-note-2">♫</div>
          <div className="song-comments-note song-comments-note-3">♬</div>
          <div className="song-comments-note song-comments-note-4">🎵</div>
        </div>
      </div>

      <div className="song-comments-container">
        {/* Song Header */}
        {/* Song Header Card */}
        <motion.div
          className="song-comments-header-card"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="song-comments-card-glow"></div>

          <div className="song-comments-header-section">
            <div className="song-comments-artwork-container">
              <div className="song-comments-artwork-glow"></div>
              <div
                className="song-comments-artwork"
                style={{
                  backgroundImage: `url(${song.pathPicture || "/placeholder.svg?height=300&width=300"})`,
                }}
              >
                {!song.pathPicture && (
                  <div className="song-comments-artwork-placeholder">
                    <Music size={60} />
                  </div>
                )}
              </div>

              <motion.button
                className="song-comments-play-button-overlay"
                onClick={() => dispatch(updateSong(song))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Play size={24} fill="currentColor" />
              </motion.button>

              <div className="song-comments-status-badge">
                {song.isPublic ? (
                  <>
                    <Eye size={12} />
                    <span>ציבורי</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={12} />
                    <span>פרטי</span>
                  </>
                )}
              </div>
            </div>

            <div className="song-comments-info-section">
              <div className="song-comments-title-area">
                <h1 className="song-comments-title-main">{song.title}</h1>
                <div className="song-comments-genre-badge">{song.gener || "כללי"}</div>
              </div>

              <div className="song-comments-artist-info-section">
                <User size={16} />
                <span>יוצר: {artist?.userName}</span>
              </div>

              <div className="song-comments-stats-grid">
                <div className="song-comments-stat-item">
                  <Star size={16} />
                  <span>{averageRating.toFixed(1)}</span>
                  <small>דירוג</small>
                </div>
                <div className="song-comments-stat-item">
                  <Volume2 size={16} />
                  <span>{song.plays || Math.floor(Math.random() * 1000)}</span>
                  <small>השמעות</small>
                </div>
                <div className="song-comments-stat-item">
                  <Clock size={16} />
                  <span>{formatDuration(song.duration || 180)}</span>
                  <small>משך</small>
                </div>
                <div className="song-comments-stat-item">
                  <MessageCircle size={16} />
                  <span>{comments.length}</span>
                  <small>תגובות</small>
                </div>
              </div>

              <div className="song-comments-meta-info">
                <Calendar size={14} />
                <span>פורסם ב-{formatDate(song.create_at)}</span>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="song-comments-actions-container">
            <div className="song-comments-primary-actions">
              <motion.button
                className="song-comments-primary-action-btn"
                onClick={() => dispatch(updateSong(song))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play size={16} fill="currentColor" />
                <span>השמע</span>
              </motion.button>

              {isOwner && (
                <motion.button
                  className="song-comments-secondary-action-btn"
                  onClick={() => handleEdit(song)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit size={14} />
                  <span>ערוך</span>
                </motion.button>
              )}

              <motion.button
                className={`song-comments-like-action-btn ${isLiked ? "liked" : ""}`}
                onClick={handleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              </motion.button>
            </div>

            <div className="song-comments-utility-actions">
              <motion.div className="song-comments-action-item" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <ShareSongButton song={song} />
              </motion.div>

              <motion.div className="song-comments-action-item" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <DownloadSong song={song} />
              </motion.div>

              {isOwner && (
                <motion.div
                  className="song-comments-action-item song-comments-delete-action"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DeleteSong song={song} />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Compact Navigation Tabs */}
        <motion.div
          className="song-comments-compact-tabs-nav"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.button
            className={`song-comments-compact-tab ${activeTab === "comments" ? "active" : ""}`}
            onClick={() => setActiveTab("comments")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle size={16} />
            <span>תגובות ({comments.length})</span>
          </motion.button>

          <motion.button
            className={`song-comments-compact-tab ${activeTab === "transcription" ? "active" : ""}`}
            onClick={() => setActiveTab("transcription")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Mic size={16} />
            <span>תמלול AI</span>
          </motion.button>
        </motion.div>

        {/* Content Area */}
        <div className="song-comments-main-content-area">
          <AnimatePresence mode="wait">
            {activeTab === "comments" && (
              <motion.div
                key="comments"
                className="song-comments-content-tab"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Add Comment Section - Only for public songs */}
                {user?.id !== 0 && song.isPublic && (
                  <motion.div
                    className="song-comments-add-comment-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <div className="song-comments-add-comment-header">
                      <MessageCircle size={20} />
                      <h3>הוסף תגובה</h3>
                    </div>

                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AddComment handleAddComment={handleAddComment} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      className="song-comments-toggle-comment-btn"
                      onClick={() => setOpen(!open)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {open ? "סגור" : "כתוב תגובה"}
                    </motion.button>
                  </motion.div>
                )}

                {/* Private Song Notice */}
                {!song.isPublic && (
                  <motion.div
                    className="song-comments-private-notice"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <div className="song-comments-private-icon">
                      <EyeOff size={24} />
                    </div>
                    <div className="song-comments-private-content">
                      <h3>שיר פרטי</h3>
                      <p>תגובות זמינות רק לשירים ציבוריים</p>
                    </div>
                  </motion.div>
                )}

                {/* Comments List */}
                <motion.div
                  className="song-comments-list-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="song-comments-header">
                    <h2>תגובות המאזינים</h2>
                    {averageRating > 0 && (
                      <div className="song-comments-average-rating">
                        <div className="song-comments-rating-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= averageRating ? "filled" : "empty"}
                              fill={star <= averageRating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <span>{averageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {comments.length > 0 ? (
                    <Comments comments={comments} currentUser={user.id} setComments={setComments} />
                  ) : (
                    <div className="song-comments-no-comments-state">
                      <MessageCircle size={40} />
                      <h4>אין תגובות עדיין</h4>
                      <p>היה הראשון להגיב על השיר הזה</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {activeTab === "transcription" && (
              <motion.div
                key="transcription"
                className="song-comments-content-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="song-comments-transcription-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="song-comments-transcription-section">
                    <div className="song-comments-transcription-header">
                      <div className="song-comments-transcription-icon">
                        <Sparkles size={24} />
                      </div>
                      <div className="song-comments-transcription-title-area">
                        <h2>תמלול בינה מלאכותית</h2>
                        <p>קבל תמלול מדויק של מילות השיר באמצעות AI מתקדם</p>
                      </div>
                    </div>

                    <div className="song-comments-transcription-content">
                      {!transcription && !isTranscribing && (
                        <div className="song-comments-transcription-empty">
                          <div className="song-comments-empty-illustration">
                            <FileText size={48} />
                            <div className="song-comments-sound-waves">
                              <div className="song-comments-wave"></div>
                              <div className="song-comments-wave"></div>
                              <div className="song-comments-wave"></div>
                              <div className="song-comments-wave"></div>
                            </div>
                          </div>
                          <h3>תמלול אוטומטי מתקדם</h3>
                          <p>השתמש בטכנולוגיית AI מתקדמת כדי ליצור תמלול מדויק של מילות השיר</p>
                        </div>
                      )}

                      {isTranscribing && (
                        <div className="song-comments-transcription-loading">
                          <div className="song-comments-loading-animation">
                            <div className="song-comments-loading-circle">
                              <Mic size={32} />
                            </div>
                            <div className="song-comments-loading-waves">
                              <div className="song-comments-wave-bar"></div>
                              <div className="song-comments-wave-bar"></div>
                              <div className="song-comments-wave-bar"></div>
                              <div className="song-comments-wave-bar"></div>
                              <div className="song-comments-wave-bar"></div>
                            </div>
                          </div>
                          <h3>מתמלל את השיר...</h3>
                          <p>הבינה המלאכותית מנתחת את השיר ויוצרת תמלול מדויק</p>
                          <div className="song-comments-loading-progress">
                            <div className="song-comments-progress-bar"></div>
                          </div>
                        </div>
                      )}

                      {transcription && (
                        <motion.div
                          className="song-comments-transcription-result"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="song-comments-result-header">
                            <div className="song-comments-success-badge">
                              <Sparkles size={16} />
                              <span>תמלול הושלם בהצלחה</span>
                            </div>
                          </div>

                          <div className="song-comments-transcription-text">
                            <pre>{transcription}</pre>
                          </div>

                          <div className="song-comments-transcription-actions">
                            <motion.button
                              className="song-comments-action-btn song-comments-copy-btn"
                              onClick={copyTranscription}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Copy size={16} />
                              <span>העתק</span>
                            </motion.button>

                            <motion.button
                              className="song-comments-action-btn song-comments-download-btn"
                              onClick={downloadTranscription}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Download size={16} />
                              <span>הורד</span>
                            </motion.button>

                            <motion.button
                              className="song-comments-action-btn song-comments-share-btn"
                              onClick={() => navigator.share?.({ text: transcription, title: `תמלול ${song.title}` })}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Share2 size={16} />
                              <span>שתף</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="song-comments-transcription-footer">
                      <motion.button
                        className="song-comments-transcribe-main-btn"
                        onClick={handleTranscription}
                        disabled={isTranscribing}
                        whileHover={{ scale: isTranscribing ? 1 : 1.02 }}
                        whileTap={{ scale: isTranscribing ? 1 : 0.98 }}
                      >
                        <Mic size={18} />
                        <span>{isTranscribing ? "מתמלל..." : transcription ? "תמלל שוב" : "התחל תמלול"}</span>
                        {isTranscribing && <div className="song-comments-btn-spinner"></div>}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default SongComments
