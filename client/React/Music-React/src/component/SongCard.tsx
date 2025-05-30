"use client"

import type React from "react"
import { useState } from "react"
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

interface SongCardProps {
  song: Song
  activeCardId?: number | null
  onCardClick?: (event: React.MouseEvent, songId: number) => void
  setActiveCardId?: Function
  showActions?: boolean
}

const SongCard = ({ song, activeCardId, onCardClick, setActiveCardId, showActions = true }: SongCardProps) => {
  const [showOptions, setShowOptions] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [shareEmails, setShareEmails] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const user = useSelector((state: StoreType) => state.user.user)

  const sendEmailShare = async (emails: string[], song: Song) => {
    const subject = "שיר ששותף איתך ב-singsong";
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
      `;

    try {
      const result = await dispatch(sendEmail({ to: emails, subject, body }));
      if (result.meta.requestStatus === "fulfilled") {
        console.log("המייל נשלח בהצלחה!");
      } else {
        console.log("שגיאה בשליחת המייל.");
      }
    } catch {
      console.log("שגיאה בשליחת המייל.");
    } finally {
      // setSnackbarOpen(true);
      const token = localStorage.getItem("authToken");
      if (token) {
        const id = getUserDataFromToken(token);
        if (id) {
          dispatch(loadUser(id));
        }
      }
    }
  }

  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()
  const songPlayer = useSelector((state: StoreType) => state.songPlayer?.song)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", { year: "numeric", month: "numeric", day: "numeric" })
  }

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(updateSong(song))
  }

  const handleDownload2 = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLoading(true)
    try {
      await handleDownload(song)
      setSnackbarMessage("השיר הורד בהצלחה!")
      setSnackbarOpen(true)
    } catch (error) {
      setSnackbarMessage("שגיאה בהורדת השיר")
      setSnackbarOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowOptions(false)
    setShowShareDialog(true)
  }

  const handleSendShare = async () => {
    if (!shareEmails.trim()) return

    setIsLoading(true)
    try {
      const emailList = shareEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email)
      await sendEmailShare(emailList, song)
      setSnackbarMessage("השיר נשלח בהצלחה!")
      setSnackbarOpen(true)
      setShowShareDialog(false)
      setShareEmails("")
    } catch (error) {
      setSnackbarMessage("שגיאה בשליחת השיר")
      setSnackbarOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate("/updateSong", { state: { song } })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowOptions(false)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    setIsLoading(true)
    try {
      if (await deleteSong(song.id)) {
        if (song.id == songPlayer.id)
          dispatch(resetSong())
        setSnackbarMessage("השיר נמחק בהצלחה!");
        const token = localStorage.getItem("authToken");
        if (token) {
          const id = getUserDataFromToken(token);
          if (id) {
            dispatch(loadUser(id));
          }
        }
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("שגיאה במחיקת השיר");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("שגיאה במחיקת השיר")
      setSnackbarOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMakePublic = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLoading(true)
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
          dispatch(loadUser(id));
        }
      }

      setSnackbarMessage("השיר הפך לציבורי!")
      setSnackbarOpen(true)
      setShowOptions(false)
    } catch (error) {
      setSnackbarMessage("שגיאה בהפיכת השיר לציבורי")
      setSnackbarOpen(true)
    } finally {
      setIsLoading(false)
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
    setShowOptions(false)

    switch (action) {
      case "view":
        navigate(`/songComments/${song.id}`)
        break
      case "edit":
        handleEdit(e)
        break
      case "delete":
        handleDelete(e)
        break
      case "play":
        handlePlay(e)
        break
      case "download":
        handleDownload2(e)
        break
      case "share":
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
          <IconButton className="play-button-modern" onClick={handlePlay}>
            <Play size={24} />
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
                      <Eye size={16} />
                      <span>צפה בפרטים</span>
                      <div className="option-glow"></div>
                    </div>)}
                  {user.id !== song.userId && (
                    <div className="option-item-modern" onClick={(e) => handleOptionClick("play", e)}>
                      <Play size={16} />
                      <span>נגן עכשיו</span>
                    </div>)}

                  <div className="option-item-modern" onClick={(e) => handleOptionClick("download", e)}>
                    <Download size={16} />
                    <span>הורד שיר</span>
                  </div>
                  {song.isPublic && (
                    < div className="option-item-modern" onClick={(e) => handleOptionClick("share", e)}>
                      <Mail size={16} />
                      <span>שתף במייל</span>
                    </div>)}

                  {user.id == song.userId && (
                    <>
                      <div className="option-item-modern" onClick={(e) => handleOptionClick("edit", e)}>
                        <Edit size={16} />
                        <span>ערוך שיר</span>
                      </div>

                      <div className="option-item-modern" onClick={(e) => handleOptionClick("delete", e)}>
                        <Trash2 size={16} />
                        <span>מחק שיר</span>
                      </div>

                      {!song.isPublic && (
                        <div className="option-item-modern" onClick={(e) => handleOptionClick("makePublic", e)}>
                          <Globe size={16} />
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

        <div className="song-card-action-buttons-elegant">
          <button className="song-card-action-button-elegant" onClick={(e) => handleOptionClick("view", e)}>
            <Eye size={14} />
            <span>פרטים</span>
          </button>
          <button className="song-card-action-button-elegant" onClick={handleDownload2}>
            <Download size={14} />
            <span>הורדה</span>
          </button>
        </div>
      </div>

      {/* Floating Notes */}
      <div className="floating-notes">
        <div className="note note-1">♪</div>
        <div className="note note-2">♫</div>
      </div>
    </div >
  )
}

export default SongCard