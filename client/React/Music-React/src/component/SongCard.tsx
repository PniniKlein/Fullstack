"use client"

import type React from "react"
import { useState, useRef } from "react"
import { IconButton } from "@mui/material"
import { Play, MoreVertical, Headphones, Download, Music, Edit, Trash2, Globe, Eye, Mail, Calendar } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { Dispatch, StoreType } from "../store/store"
import type { Song } from "../model/Song"
import { loadSong, resetSong, updateSong } from "../store/songSlice"
import { useNavigate } from "react-router-dom"
import "../css/SongCard.css"
import { deleteSong, handleDownload, updateSongToPublic } from "../services/SongsService"
import { getUserDataFromToken } from "./AppLayout"
import { loadUser, sendEmail } from "../store/userSlice"
import SnackbarWarn from "./SnackbarWarn"

interface SongCardProps {
  song: Song
  activeCardId?: number | null
  onCardClick?: (event: React.MouseEvent, songId: number) => void
  setActiveCardId?: Function
  showActions?: boolean
}

const SongCard = ({ song, activeCardId, onCardClick, setActiveCardId, showActions = true }: SongCardProps) => {
  const [showOptions, setShowOptions] = useState(false)
  const [shareEmails, setShareEmails] = useState("")
  const [loadingStates, setLoadingStates] = useState({
    play: false,
    download: false,
    share: false,
    edit: false,
    delete: false,
    makePublic: false,
    view: false,
  })
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarColor, setSnackbarColor] = useState("green")

  const shareDialogRef = useRef<HTMLDialogElement>(null)
  const deleteDialogRef = useRef<HTMLDialogElement>(null)

  const user = useSelector((state: StoreType) => state.user.user)
  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()
  const songPlayer = useSelector((state: StoreType) => state.songPlayer?.song)

  const setLoading = (action: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [action]: isLoading }))
  }

  const showSnackbar = (message: string, isSuccess = true) => {
    setSnackbarMessage(message)
    setSnackbarColor(isSuccess ? "green" : "red")
    setSnackbarOpen(true)
  }

  const sendEmailShare = async (emails: string[], song: Song) => {
    const subject = "שיר ששותף איתך ב-singsong"
    const body = `
        <div style="direction: rtl; background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 35px;">
            <h2 style="color: #333; font-size: 24px; text-align: center;">
              ${user?.userName || "משתמש"} שיתף/ה איתך שיר ב-<span style="text-decoration: underline;">singsong</span>
            </h2>
            <p style="font-size: 16px; color: #333;">השיר <strong>${song.title}</strong> מחכה לך!</p>
            <p style="font-size: 16px; color: #333;">לחץ/י על הכפתור למטה כדי להאזין:</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${song.pathSong}" style="display: inline-block; padding: 10px 20px; background: linear-gradient(90deg, #D59039, #F7C26B); color: white; text-decoration: none; border-radius: 30px; font-size: 15px;">
                🎧 האזן/י לשיר
              </a>
            </div>
            <p style="font-size: 15px; color: #888; text-align: center;">נשמע טוב? תמיד אפשר לשתף גם חברים :)</p>
          </div>
        </div>
      `

    try {
      const result = await dispatch(sendEmail({ to: emails, subject, body }))
      if (result.meta.requestStatus === "fulfilled") {
        return true
      } else {
        return false
      }
    } catch {
      return false
    } finally {
      const token = localStorage.getItem("authToken")
      if (token) {
        const id = getUserDataFromToken(token)
        if (id) {
          dispatch(loadUser(id))
        }
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", { year: "numeric", month: "numeric", day: "numeric" })
  }

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation()
    // setLoading("play", true)
    try {
      dispatch(updateSong(song))
    } catch (error) {
      showSnackbar("שגיאה בהפעלת השיר", false)
    } finally {
      setTimeout(() => setLoading("play", false), 500)
    }
  }

  const handleDownload2 = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoading("download", true)
    try {
      await handleDownload(song)
      showSnackbar("השיר הורד בהצלחה!")
    } catch (error) {
      showSnackbar("שגיאה בהורדת השיר", false)
    } finally {
      setLoading("download", false)
      setShowOptions(false)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowOptions(false)
    shareDialogRef.current?.showModal()
  }

  const handleSendShare = async () => {
    if (!shareEmails.trim()) return

    setLoading("share", true)
    try {
      const emailList = shareEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email)

      const success = await sendEmailShare(emailList, song)
      if (success) {
        showSnackbar("השיר נשלח בהצלחה!")
        shareDialogRef.current?.close()
        setShareEmails("")
      } else {
        showSnackbar("שגיאה בשליחת השיר", false)
      }
    } catch (error) {
      showSnackbar("שגיאה בשליחת השיר", false)
    } finally {
      setLoading("share", false)
    }
  }

  const handleEdit = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoading("edit", true)
    try {
      navigate("/updateSong", { state: { song } })
    } catch (error) {
      showSnackbar("שגיאה בפתיחת עריכת השיר", false)
    } finally {
      setTimeout(() => setLoading("edit", false), 500)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowOptions(false)
    deleteDialogRef.current?.showModal()
  }

  const confirmDelete = async () => {
    setLoading("delete", true)
    try {
      if (await deleteSong(song.id)) {
        if (song.id == songPlayer.id) dispatch(resetSong())
        showSnackbar("השיר נמחק בהצלחה!")
        const token = localStorage.getItem("authToken")
        if (token) {
          const id = getUserDataFromToken(token)
          if (id) {
            dispatch(loadUser(id))
          }
        }
        deleteDialogRef.current?.close()
      } else {
        showSnackbar("שגיאה במחיקת השיר", false)
      }
    } catch (error) {
      showSnackbar("שגיאה במחיקת השיר", false)
    } finally {
      setLoading("delete", false)
    }
  }

  const handleMakePublic = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoading("makePublic", true)
    try {
      await updateSongToPublic(song.id)
      if (songPlayer?.id === song.id) {
        const updatedSong = { ...songPlayer, isPublic: true }
        dispatch(loadSong(updatedSong))
      }

      const token = localStorage.getItem("authToken")
      if (token) {
        const id = getUserDataFromToken(token)
        if (id) {
          dispatch(loadUser(id))
        }
      }

      showSnackbar("השיר הפך לציבורי!")
      setShowOptions(false)
    } catch (error) {
      showSnackbar("שגיאה בהפיכת השיר לציבורי", false)
    } finally {
      setLoading("makePublic", false)
      setShowOptions(false)
    }
  }

  const handleView = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoading("view", true)
    try {
      navigate(`/songComments/${song.id}`)
    } catch (error) {
      showSnackbar("שגיאה בפתיחת פרטי השיר", false)
    } finally {
      setTimeout(() => setLoading("view", false), 500)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (onCardClick) {
      onCardClick(e, song.id)
    } else {
      navigate(`/songComments/${song.id}`)
    }
  }

  const handleOptionClick = (action: string, e: React.MouseEvent) => {
    e.stopPropagation()

    switch (action) {
      case "view":
        setShowOptions(false)
        handleView(e)
        break
      case "edit":
        setShowOptions(false)
        handleEdit(e)
        break
      case "delete":
        setShowOptions(false)
        handleDelete(e)
        break
      case "play":
        setShowOptions(false)
        handlePlay(e)
        break
      case "download":
        handleDownload2(e)

        break
      case "share":
        setShowOptions(false)
        handleShare(e)
        break
      case "makePublic":
        handleMakePublic(e)
        break
      default:
        break
    }
  }

  return (
    <div className="modern-song-card">
      {/* Background Effects */}
      <div className="card-background-effects">
        <div className="card-gradient-orb"></div>
        <div className="card-shimmer"></div>
      </div>

      {/* Top Section - Image & Controls */}
      <div className="card-image-section">
        <div className="card-image-wrapper">
          <div className="card-image" style={{ backgroundImage: `url(${song.pathPicture})` }}></div>
          <div className="card-overlay"></div>

          {/* Play Button */}
          <IconButton className="play-button-modern" onClick={handlePlay} disabled={loadingStates.play}>
            {loadingStates.play ? <div className="loading-spinner-small"></div> : <Play size={24} />}
          </IconButton>

          {/* Stats Badge */}
          <div className="stats-badge">
            <Headphones size={14} />
            <span>{song.plays || 0}</span>
          </div>

          {/* More Options */}
          <div className="options-container">
            <IconButton
              className="options-button"
              onClick={(e) => {
                e.stopPropagation()
                setShowOptions(!showOptions)
              }}
            >
              <MoreVertical size={18} />
            </IconButton>

            {showOptions && (
              <div className="options-dropdown-modern">
                <div className="options-header">
                  <Music size={16} />
                  <span>אפשרויות שיר</span>
                </div>

                <div className="options-list">
                  {user.id !== song.userId && song.isPublic && (
                    <div className="option-item-modern primary-option" onClick={(e) => handleOptionClick("view", e)}>
                      {loadingStates.view ? <div className="loading-spinner-tiny"></div> : <Eye size={16} />}
                      <span>צפה בפרטים</span>
                      <div className="option-glow"></div>
                    </div>
                  )}
                  {user.id !== song.userId && (
                    <div className="option-item-modern" onClick={(e) => handleOptionClick("play", e)}>
                      {loadingStates.play ? <div className="loading-spinner-tiny"></div> : <Play size={16} />}
                      <span>נגן עכשיו</span>
                    </div>
                  )}

                  <div className="option-item-modern" onClick={(e) => handleOptionClick("download", e)}>
                    {loadingStates.download ? <div className="loading-spinner-tiny"></div> : <Download size={16} />}
                    <span>הורד שיר</span>
                  </div>
                  {song.isPublic && (
                    <div className="option-item-modern" onClick={(e) => handleOptionClick("share", e)}>
                      {loadingStates.share ? <div className="loading-spinner-tiny"></div> : <Mail size={16} />}
                      <span>שתף במייל</span>
                    </div>
                  )}

                  {user.id == song.userId && (
                    <>
                      <div className="option-item-modern" onClick={(e) => handleOptionClick("edit", e)}>
                        {loadingStates.edit ? <div className="loading-spinner-tiny"></div> : <Edit size={16} />}
                        <span>ערוך שיר</span>
                      </div>

                      <div className="option-item-modern" onClick={(e) => handleOptionClick("delete", e)}>
                        {loadingStates.delete ? <div className="loading-spinner-tiny"></div> : <Trash2 size={16} />}
                        <span>מחק שיר</span>
                      </div>

                      {!song.isPublic && (
                        <div className="option-item-modern" onClick={(e) => handleOptionClick("makePublic", e)}>
                          {loadingStates.makePublic ? (
                            <div className="loading-spinner-tiny"></div>
                          ) : (
                            <Globe size={16} />
                          )}
                          <span>הפוך לציבורי</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="card-content-modern" onClick={handleCardClick}>
        <div className="song-title-modern">{song.title}</div>

        {/* Genre */}
        <div className="genre-text-modern">
          <Music size={14} />
          <span className="genre-value">{song.gener || "כללי"}</span>
        </div>

        <div className="song-date-modern">
          <Calendar size={12} />
          <span className="date-value">{formatDate(song.create_at)}</span>
        </div>

        <div className="song-card-elegant-divider">
          <div className="divider-line"></div>
        </div>

        <div className="action-buttons-elegant">
          <button className="action-button-elegant" onClick={handleView} disabled={loadingStates.view}>
            {loadingStates.view ? <div className="loading-spinner-tiny"></div> : <Eye size={14} />}
            <span>פרטים</span>
          </button>
          <button className="action-button-elegant" onClick={handleDownload2} disabled={loadingStates.download}>
            {loadingStates.download ? <div className="loading-spinner-tiny"></div> : <Download size={14} />}
            <span>הורדה</span>
          </button>
        </div>
      </div>

      {/* Floating Notes */}
      <div className="floating-notes">
        <div className="note note-1">♪</div>
        <div className="note note-2">♫</div>
      </div>

      {/* Share Dialog */}
      <dialog ref={shareDialogRef} className="share-dialog">
        <div className="share-dialog-header">
          <Mail size={20} />
          <h3>שיתוף השיר במייל</h3>
          <button className="close-button" onClick={() => shareDialogRef.current?.close()}>
            ×
          </button>
        </div>
        <div className="share-dialog-content">
          <div className="song-share-info">
            <div className="song-share-image" style={{ backgroundImage: `url(${song.pathPicture})` }}></div>
            <div className="song-share-details">
              <h4>{song.title}</h4>
              <p>{song.gener || "כללי"}</p>
            </div>
          </div>
          <div className="share-input-container">
            <label htmlFor="share-emails">כתובות אימייל (הפרד בפסיקים)</label>
            <input
              id="share-emails"
              type="text"
              value={shareEmails}
              onChange={(e) => setShareEmails(e.target.value)}
              placeholder="example@mail.com, another@mail.com"
              dir="ltr"
            />
          </div>
          <button
            className="share-submit-button"
            onClick={handleSendShare}
            disabled={loadingStates.share || !shareEmails.trim()}
          >
            {loadingStates.share ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <Mail size={16} />
                <span>שלח</span>
              </>
            )}
          </button>
        </div>
      </dialog>

      {/* Delete Confirmation Dialog */}
      <dialog ref={deleteDialogRef} className="delete-dialog">
        <div className="delete-dialog-header">
          <Trash2 size={20} color="#d32f2f" />
          <h3>מחיקת שיר</h3>
          <button className="close-button" onClick={() => deleteDialogRef.current?.close()}>
            ×
          </button>
        </div>
        <div className="delete-dialog-content">
          <div className="song-delete-info">
            <div className="song-delete-image" style={{ backgroundImage: `url(${song.pathPicture})` }}></div>
            <div className="song-delete-details">
              <h4>{song.title}</h4>
              <p>{song.gener || "כללי"}</p>
            </div>
          </div>
          <p className="delete-warning">האם אתה בטוח שברצונך למחוק את השיר? פעולה זו אינה ניתנת לביטול.</p>
          <div className="delete-actions">
            <button className="cancel-button" onClick={() => deleteDialogRef.current?.close()}>
              ביטול
            </button>
            <button className="confirm-delete-button" onClick={confirmDelete} disabled={loadingStates.delete}>
              {loadingStates.delete ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>מחק</span>
                </>
              )}
            </button>
          </div>
        </div>
      </dialog>

      {/* Snackbar */}
      <SnackbarWarn
        snackbarMessage={snackbarMessage}
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        col={snackbarColor}
      />
    </div>
  )
}

export default SongCard
