"use client"
import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "../model/User"
import { addFollowee, getArtistByIdFull, removeFollowee } from "../services/UserService"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { Song } from "../model/Song"
import type { Dispatch } from "../store/store"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import SongCard from "./SongCard"
import {
  UserIcon,
  Calendar,
  Music,
  UserPlus,
  UserMinus,
  Mail,
  LogIn,
  ExternalLink,
  Users,
  Headphones,
  Heart,
  Award,
} from "lucide-react"
import "../css/ArtistSongs.css"

const ArtistSongs = () => {
  const { id } = useParams()
  const [artist, setArtist] = useState<User | null>(null)
  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()
  const [activeCardId, setActiveCardId] = useState<number | null>(null)
  const { user } = useSelector((state: StoreType) => state.user)
  const authState = useSelector((state: StoreType) => state.user.authState)
  const isFollow = user.followees?.some((f: number) => (id ? +id === f : false))
  const countP = artist?.songs?.reduce((acc, song: Song) => acc + (song.plays || 0), 0) || 0
  const [countPlays, setCountPlays] = useState(countP)
  const [isFollowing, setIsFollowing] = useState(isFollow)
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    const fetchArtist = async () => {
      setIsLoading(true)
      try {
        const response = await getArtistByIdFull(id ? +id : 0)
        setArtist(response)
        if (authState && user.followees) {
          const isFollowee = user.followees.some((f: number) => (id ? +id === f : false))
          setIsFollowing(isFollowee)
        }
      } catch (error) {
        console.error("Error fetching artist:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchArtist()
  }, [id, authState])

  useEffect(() => {
    const totalPlays = artist?.songs.reduce((acc, song: Song) => acc + (song.plays || 0), 0)
    setCountPlays(totalPlays ? totalPlays : 0)
  }, [user.songs])

  useEffect(() => {
    if (authState && user.followees) {
      const isFollowee = user.followees.some((f: number) => (id ? +id === f : false))
      setIsFollowing(isFollowee)
    }
  }, [authState, id, user.followees])

  if (isLoading) {
    return (
      <div className="artist-songs-beautiful">
        <div className="artist-songs-background-effects">
          <div className="artist-songs-gradient-orb orb-1"></div>
          <div className="artist-songs-gradient-orb orb-2"></div>
        </div>

        <div className="artist-songs-loading-beautiful">
          <motion.div
            className="artist-songs-loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loading-spinner-beautiful"></div>
            <div className="loading-text-beautiful">טוען פרטי אמן...</div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="artist-songs-beautiful">
        <div className="artist-songs-background-effects">
          <div className="artist-songs-gradient-orb orb-1"></div>
          <div className="artist-songs-gradient-orb orb-2"></div>
        </div>

        <motion.div
          className="artist-songs-empty-beautiful"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <UserIcon size={48} className="empty-icon" />
          <h3>האמן לא נמצא</h3>
          <p>נסה לחפש אמן אחר או חזור לדף הראשי</p>
        </motion.div>
      </div>
    )
  }

  const handleCardClick = (event: React.MouseEvent, songId: number) => {
    const target = event.target as HTMLElement
    if (target.closest("button, svg")) {
      return
    }
    setActiveCardId(songId)
    navigate(`/songComments/${songId}`)
  }

  const handleFollowToggle = async () => {
    if (!authState) {
      setShowLoginPrompt(true)
      return
    }

    try {
      if (isFollowing) {
        await removeFollowee(artist.id)
        dispatch({ type: "user/removeFollowee", payload: artist })
      } else {
        await addFollowee(artist.id, user.id)
        dispatch({ type: "user/addFollowee", payload: artist })
      }
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error("שגיאה בעדכון מעקב:", error)
    }
  }

  const handleLoginRedirect = () => {
    navigate("/login")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })
  }

  return (
    <div className="artist-songs-beautiful">
      {/* Background Effects */}
      <div className="artist-songs-background-effects">
        <div className="artist-songs-gradient-orb orb-1"></div>
        <div className="artist-songs-gradient-orb orb-2"></div>

        {/* Floating Musical Notes */}
        <div className="floating-artist-songs-notes">
          <div className="artist-songs-note note-1">♪</div>
          <div className="artist-songs-note note-2">♫</div>
          <div className="artist-songs-note note-3">♬</div>
          <div className="artist-songs-note note-4">🎤</div>
        </div>
      </div>

      {/* Beautiful Artist Profile Card */}
      <motion.div
        className="artist-profile-card-beautiful"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Card Background Effects */}
        <div className="card-background-beautiful">
          <div className="card-gradient-orb-beautiful"></div>
          <div className="card-shimmer-beautiful"></div>
          <div className="card-glow-beautiful"></div>
        </div>

        {/* Main Content */}
        <div className="artist-profile-content-beautiful">
          {/* Left Side - Avatar & Status */}
          <div className="artist-avatar-section-beautiful">
            <div className="avatar-container-beautiful">
              <div className="avatar-rings-beautiful">
                <div className="avatar-ring ring-1"></div>
                <div className="avatar-ring ring-2"></div>
                <div className="avatar-ring ring-3"></div>
              </div>

              <div
                className="artist-avatar-beautiful"
                style={{
                  backgroundImage: `url(${artist.pathProfile || "/placeholder.svg?height=120&width=120"})`,
                }}
              >
                {!artist.pathProfile && (
                  <div className="avatar-placeholder-beautiful">
                    <UserIcon size={40} />
                  </div>
                )}
              </div>
              <div className="status-badges-beautiful">

                <motion.div
                  className="status-badge artist-badge"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Music size={12} />
                  <span>אמן</span>
                </motion.div>
              </div>

              <div className="floating-hearts-beautiful">
                <Heart className="floating-heart heart-1" size={12} />
                <Heart className="floating-heart heart-2" size={10} />
                <Heart className="floating-heart heart-3" size={14} />
              </div>
            </div>
          </div>

          {/* Center - Info & Stats */}
          <div className="artist-info-section-beautiful">
            <div className="artist-header-beautiful">
              <h1 className="artist-name-beautiful">{artist.userName}</h1>
            </div>

            {/* Circular Stats */}
            <div className="artist-stats-beautiful">
              <motion.div
                className="stat-circle-beautiful"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="stat-circle-inner">
                  <Users size={20} />
                  <span className="stat-number">{user.followers?.length || 0}</span>
                  <span className="stat-label">עוקבים</span>
                </div>
                <div className="stat-circle-border"></div>
              </motion.div>

              <motion.div
                className="stat-circle-beautiful"
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="stat-circle-inner">
                  <Music size={20} />
                  <span className="stat-number">{artist.songs?.length || 0}</span>
                  <span className="stat-label">שירים</span>
                </div>
                <div className="stat-circle-border"></div>
              </motion.div>

              <motion.div
                className="stat-circle-beautiful"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="stat-circle-inner">
                  <Headphones size={20} />
                  <span className="stat-number">{artist?.songs.reduce((acc, song: Song) => acc + (song.plays || 0), 0)}</span>
                  <span className="stat-label">השמעות</span>
                </div>
                <div className="stat-circle-border"></div>
              </motion.div>
            </div>

            {/* Meta Info */}
            <div className="artist-meta-beautiful">
              <div className="meta-pill-beautiful">
                <Mail size={14} />
                <span>{artist.email}</span>
              </div>
              <div className="meta-pill-beautiful">
                <Calendar size={14} />
                <span>הצטרף ב{formatDate(artist.create_at)}</span>
              </div>
            </div>
          </div>
          <div className="artist-actions-section-beautiful">
            {user.id !== artist.id && (
              <motion.button
                className={`follow-button-beautiful ${isFollowing ? "following" : ""}`}
                onClick={handleFollowToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="button-glow-beautiful"></div>
                {authState ? (
                  isFollowing ? (
                    <>
                      <UserMinus size={18} />
                      <span>ביטול מעקב</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      <span>עקוב</span>
                    </>
                  )
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>עקוב</span>
                  </>
                )}
              </motion.button>
            )}

            {/* Decorative Elements */}
            <div className="decorative-elements-beautiful">
              <div className="decorative-circle circle-1"></div>
              <div className="decorative-circle circle-2"></div>
              <div className="decorative-circle circle-3"></div>
              <div className="decorative-circle circle-4"></div>
              <div className="decorative-circle circle-5"></div>
              <div className="decorative-circle circle-6"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Login Prompt */}
      <AnimatePresence>
        {showLoginPrompt && !authState && (
          <motion.div
            className="login-prompt-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="login-prompt-card-beautiful"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              <div className="login-prompt-content">
                <div className="login-prompt-icon">
                  <LogIn size={24} />
                </div>
                <div className="login-prompt-text">
                  <h3>נדרשת התחברות</h3>
                  <p>כדי לעקוב אחרי אמנים ולהנות מכל התכונות</p>
                </div>
                <div className="login-prompt-actions">
                  <motion.button
                    className="login-redirect-button"
                    onClick={handleLoginRedirect}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogIn size={16} />
                    <span>התחבר עכשיו</span>
                    <ExternalLink size={14} />
                  </motion.button>
                  <motion.button
                    className="close-prompt-button"
                    onClick={() => setShowLoginPrompt(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    אולי מאוחר יותר
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Songs Section */}
      <motion.div
        className="artist-songs-section-beautiful"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {artist.songs && artist.songs.length > 0 ? ( <>
          <motion.div
            className="artist-songs-grid-beautiful"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatePresence>
              {artist.songs.map((song: Song, index) => (
                <motion.div
                  key={song.id}
                  className="artist-song-card-wrapper-beautiful"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={(e) => handleCardClick(e, song.id)}
                >
                  <SongCard
                    song={song}
                    activeCardId={activeCardId}
                    onCardClick={handleCardClick}
                    setActiveCardId={setActiveCardId}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
                  <motion.div
              className="song-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Award size={16} />
              <span>סה"כ {artist?.songs.length} שירים ל{artist.userName}</span>
            </motion.div>
           </>
        ) : (
          <motion.div
            className="no-songs-beautiful"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Music size={48} className="no-songs-icon" />
            <h4>אין שירים עדיין</h4>
            <p>האמן עדיין לא העלה שירים לספרייה</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default ArtistSongs
