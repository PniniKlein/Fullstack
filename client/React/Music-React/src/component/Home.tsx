"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { StoreType, Dispatch } from "../store/store"
import {
  Play,
  Music,
  Users,
  Headphones,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Upload,
  Eye,
  Verified,
  Star,
  Clock,
  FlameIcon as Fire,
  Zap,
  Crown,
  Share2,
  Volume2,
  Pause,
  SkipForward,
  Shuffle,
  Repeat,
  ChevronRight,
  ChevronLeft,
  AudioWaveformIcon as Waveform,
  Mic2,
  Globe,
  MessageCircle,
} from "lucide-react"
import { getAllPublic } from "../services/SongsService"
import { artistList } from "../services/UserService"
import type { Song } from "../model/Song"
import type { UserWithCountList } from "../model/userWithCountList"
import SongCard from "./SongCard"
import { loadSong } from "../store/songSlice"
import "../css/Home.css"

const Home: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<Dispatch>()
  const user = useSelector((state: StoreType) => state.user.user)
  const currentSong = useSelector((state: StoreType) => state.songPlayer.song)

  const [recentSongs, setRecentSongs] = useState<Song[]>([])
  const [topArtists, setTopArtists] = useState<UserWithCountList[]>([])
  const [popularSongs, setPopularSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalArtists: 0,
    totalPlays: 0,
    activeUsers: 0,
  })

  // רפרנסים לאנימציות
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const songsRef = useRef<HTMLDivElement>(null)
  const artistsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadRealData()
    initScrollAnimations()

    // אנימציית רקע
    const interval = setInterval(() => {
      const orbs = document.querySelectorAll(".home-orb-premium")
      orbs.forEach((orb) => {
        const randomX = Math.random() * 10 - 5
        const randomY = Math.random() * 10 - 5
        orb.animate(
          [
            { transform: `translate(${randomX}px, ${randomY}px)` },
            { transform: `translate(${-randomX}px, ${-randomY}px)` },
          ],
          {
            duration: 10000,
            easing: "ease-in-out",
            fill: "forwards",
          },
        )
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // החלפת שקופיות אוטומטית
    const slideInterval = setInterval(() => {
      if (recentSongs.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % recentSongs.length)
      }
    }, 5000)

    return () => clearInterval(slideInterval)
  }, [recentSongs])

  const initScrollAnimations = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const sections = document.querySelectorAll(".animate-on-scroll")
    sections.forEach((section) => {
      observer.observe(section)
    })
  }

  const loadRealData = async () => {
    setLoading(true)
    try {
      // טעינת שירים אמיתיים
      const songsData = await getAllPublic()

      // שירים חדשים - לפי תאריך
      const sortedByDate = [...songsData].sort(
        (a: Song, b: Song) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime(),
      )
      setRecentSongs(sortedByDate.slice(0, 8))

      // שירים פופולריים - לפי השמעות
      const sortedByPlays = [...songsData].sort((a: Song, b: Song) => (b.plays || 0) - (a.plays || 0))
      setPopularSongs(sortedByPlays.slice(0, 6))

      // טעינת אמנים אמיתיים
      const artistsData = await artistList()
      const sortedArtists = [...artistsData].sort(
        (a: UserWithCountList, b: UserWithCountList) => (b.countSongs || 0) - (a.countSongs || 0),
      )
      setTopArtists(sortedArtists.slice(0, 8))

      // חישוב סטטיסטיקות אמיתיות
      const totalPlays = songsData.reduce((sum: number, song: Song) => sum + (song.plays || 0), 0)

      // אנימציית ספירה לסטטיסטיקות
      animateStats({
        totalSongs: songsData.length,
        totalArtists: artistsData.length,
        totalPlays: totalPlays,
        activeUsers: artistsData.filter((artist: UserWithCountList) => artist.countSongs > 0).length,
      })
    } catch (error) {
      console.error("שגיאה בטעינת נתונים:", error)
    } finally {
      setLoading(false)
    }
  }

  const animateStats = (finalStats: typeof stats) => {
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setStats({
        totalSongs: Math.floor(finalStats.totalSongs * progress),
        totalArtists: Math.floor(finalStats.totalArtists * progress),
        totalPlays: Math.floor(finalStats.totalPlays * progress),
        activeUsers: Math.floor(finalStats.activeUsers * progress),
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setStats(finalStats)
      }
    }, stepDuration)
  }

  const handlePlaySong = (song: Song) => {
    dispatch(loadSong(song))
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const nextSlide = () => {
    if (recentSongs.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % recentSongs.length)
    }
  }

  const prevSlide = () => {
    if (recentSongs.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + recentSongs.length) % recentSongs.length)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div className="home-loading-premium">
        <div className="loading-logo-premium">
          <Music size={60} className="loading-icon-premium" />
          <div className="loading-waves-premium">
            <div className="loading-wave-premium"></div>
            <div className="loading-wave-premium"></div>
            <div className="loading-wave-premium"></div>
            <div className="loading-wave-premium"></div>
            <div className="loading-wave-premium"></div>
          </div>
        </div>
        <p className="loading-text-premium">טוען את עולם המוזיקה שלך...</p>
      </div>
    )
  }

  return (
    <div className="home-container-premium">
      {/* רקע מתקדם */}
      <div className="home-background-premium">
        <div className="home-orb-premium home-orb-1"></div>
        <div className="home-orb-premium home-orb-2"></div>
        <div className="home-orb-premium home-orb-3"></div>
        <div className="home-orb-premium home-orb-4"></div>
        <div className="home-orb-premium home-orb-5"></div>

        <div className="home-grid-lines">
          <div className="home-grid-line"></div>
          <div className="home-grid-line"></div>
          <div className="home-grid-line"></div>
          <div className="home-grid-line"></div>
          <div className="home-grid-line"></div>
        </div>

        <div className="home-floating-notes">
          <div className="home-note">♪</div>
          <div className="home-note">♫</div>
          <div className="home-note">♬</div>
          <div className="home-note">🎵</div>
          <div className="home-note">🎶</div>
        </div>
      </div>

      {/* סקציית גיבור מרשימה */}
      <section ref={heroRef} className="home-hero-premium animate-on-scroll">
        <div className="home-hero-content-premium">
          <div className="home-hero-badge-premium">
            <Sparkles className="badge-icon-premium" />
            <span>הפלטפורמה המוזיקלית המובילה בישראל</span>
          </div>

          <h1 className="home-hero-title-premium">
            <span className="home-title-line">גלה את</span>
            <span className="home-title-line">
              <span className="home-title-highlight">המוזיקה הישראלית</span>
            </span>
            <span className="home-title-line">האותנטית</span>
          </h1>

          <p className="home-hero-description-premium">
            <span className="home-hero-stat-premium">{stats.totalSongs}</span> שירים אמיתיים מ-
            <span className="home-hero-stat-premium">{stats.totalArtists}</span> אמנים ישראליים.
            <br />
            הצטרף לקהילה שכבר צברה <span className="home-hero-stat-premium">{formatNumber(stats.totalPlays)}</span>{" "}
            השמעות!
          </p>

          <div className="home-hero-buttons-premium">
            <button
              className="home-btn-premium home-btn-primary-premium"
              onClick={() => navigate("/musicLibrary/songList")}
            >
              <Play className="btn-icon-premium" />
              <span>גלה שירים</span>
              <div className="btn-glow-premium"></div>
            </button>
            {user?.id ? (
              <button className="home-btn-premium home-btn-secondary-premium" onClick={() => navigate("/mySongs")}>
                <Upload className="btn-icon-premium" />
                <span>השירים שלי</span>
              </button>
            ) : (
              <button className="home-btn-premium home-btn-secondary-premium" onClick={() => navigate("/register")}>
                <Users className="btn-icon-premium" />
                <span>הצטרף עכשיו</span>
              </button>
            )}
          </div>

          <div className="home-hero-features-premium">
            <div className="home-hero-feature-premium">
              <div className="feature-icon-container-premium">
                <Music className="feature-icon-premium" />
              </div>
              <span>שירים איכותיים</span>
            </div>
            <div className="home-hero-feature-premium">
              <div className="feature-icon-container-premium">
                <Users className="feature-icon-premium" />
              </div>
              <span>קהילה תומכת</span>
            </div>
            <div className="home-hero-feature-premium">
              <div className="feature-icon-container-premium">
                <Zap className="feature-icon-premium" />
              </div>
              <span>חשיפה מקסימלית</span>
            </div>
          </div>
        </div>

        {/* סליידר שירים מרשים */}
        <div className="home-hero-slider-premium">
          {recentSongs.length > 0 && (
            <>
              <div className="home-slider-controls-premium">
                <button className="home-slider-arrow-premium" onClick={prevSlide}>
                  <ChevronRight />
                </button>
                <div className="home-slider-indicators-premium">
                  {recentSongs.slice(0, 5).map((_, index) => (
                    <div
                      key={index}
                      className={`home-slider-dot-premium ${index === currentSlide % 5 ? "active" : ""}`}
                      onClick={() => setCurrentSlide(index)}
                    ></div>
                  ))}
                </div>
                <button className="home-slider-arrow-premium" onClick={nextSlide}>
                  <ChevronLeft />
                </button>
              </div>

              <div className="home-slider-container-premium">
                <div className="home-slider-track-premium" style={{ transform: `translateX(${currentSlide * 100}%)` }}>
                  {recentSongs.map((song, index) => (
                    <div
                      key={song.id}
                      className={`home-slider-slide-premium ${index === currentSlide ? "active" : ""}`}
                      onClick={() => handlePlaySong(song)}
                    >
                      <div className="home-slide-content-premium">
                        <div
                          className="home-slide-image-premium"
                          style={{
                            backgroundImage: song.pathPicture ? `url(${song.pathPicture})` : "none",
                            backgroundColor: song.pathPicture ? "transparent" : "#d59039",
                          }}
                        >
                          {!song.pathPicture && <Music size={40} color="white" />}
                        </div>
                        <div className="home-slide-info-premium">
                          <h3>{song.title}</h3>
                          <p>{song.gener || "כללי"}</p>
                          <div className="home-slide-stats-premium">
                            <div className="home-slide-stat-premium">
                              <Headphones size={16} />
                              <span>{song.plays || 0}</span>
                            </div>
                            <div className="home-slide-stat-premium">
                              <Clock size={16} />
                              <span>{formatDate(song.create_at)}</span>
                            </div>
                          </div>
                          <button className="home-slide-play-premium">
                            <Play size={20} />
                            <span>נגן עכשיו</span>
                          </button>
                        </div>
                      </div>
                      <div className="home-slide-vinyl-premium">
                        <div className="home-vinyl-disc-premium">
                          <div className="home-vinyl-center-premium"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* נגן מרשים */}
      {currentSong && (
        <div className="home-current-player-premium">
          <div className="home-player-visualizer-premium">
            <div className="home-visualizer-bar-premium"></div>
            <div className="home-visualizer-bar-premium"></div>
            <div className="home-visualizer-bar-premium"></div>
            <div className="home-visualizer-bar-premium"></div>
            <div className="home-visualizer-bar-premium"></div>
            <div className="home-visualizer-bar-premium"></div>
            <div className="home-visualizer-bar-premium"></div>
          </div>

          <div className="home-player-content-premium">
            <div
              className="home-player-cover-premium"
              style={{
                backgroundImage: currentSong.pathPicture ? `url(${currentSong.pathPicture})` : "none",
                backgroundColor: currentSong.pathPicture ? "transparent" : "#d59039",
              }}
            >
              {!currentSong.pathPicture && <Music size={32} color="white" />}
              <div className="home-player-disc-premium"></div>
            </div>

            <div className="home-player-info-premium">
              <div className="home-player-title-premium">
                <Music className="home-player-icon-premium" />
                <span>מנגן עכשיו</span>
              </div>
              <h4>{currentSong.title}</h4>
              <p>{currentSong.gener || "כללי"}</p>
            </div>

            <div className="home-player-controls-premium">
              <button className="home-player-btn-premium">
                <Shuffle size={16} />
              </button>
              <button className="home-player-btn-premium">
                <SkipForward size={16} style={{ transform: "rotate(180deg)" }} />
              </button>
              <button className="home-player-btn-premium home-player-btn-primary-premium" onClick={togglePlayPause}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button className="home-player-btn-premium">
                <SkipForward size={16} />
              </button>
              <button className="home-player-btn-premium">
                <Repeat size={16} />
              </button>
            </div>

            <div className="home-player-progress-premium">
              <div className="home-player-progress-bar-premium">
                <div className="home-player-progress-fill-premium"></div>
                <div className="home-player-progress-handle-premium"></div>
              </div>
            </div>

            <div className="home-player-volume-premium">
              <Volume2 size={16} />
              <div className="home-player-volume-bar-premium">
                <div className="home-player-volume-fill-premium"></div>
                <div className="home-player-volume-handle-premium"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* סטטיסטיקות מרשימות */}
      <section ref={statsRef} className="home-stats-premium animate-on-scroll">
        <div className="home-stats-grid-premium">
          <div className="home-stat-card-premium">
            <div className="home-stat-icon-premium">
              <Music className="stat-icon-inner-premium" />
              <div className="stat-icon-glow-premium"></div>
            </div>
            <div className="home-stat-number-premium">{stats.totalSongs}</div>
            <div className="home-stat-label-premium">שירים ישראליים</div>
            <div className="home-stat-desc-premium">מכל הז'אנרים</div>
            <div className="home-stat-trend-premium">
              <TrendingUp size={16} />
              <span>+15% החודש</span>
            </div>
          </div>
          <div className="home-stat-card-premium">
            <div className="home-stat-icon-premium">
              <Users className="stat-icon-inner-premium" />
              <div className="stat-icon-glow-premium"></div>
            </div>
            <div className="home-stat-number-premium">{stats.totalArtists}</div>
            <div className="home-stat-label-premium">אמנים רשומים</div>
            <div className="home-stat-desc-premium">יוצרים פעילים</div>
            <div className="home-stat-trend-premium">
              <TrendingUp size={16} />
              <span>+12% החודש</span>
            </div>
          </div>
          <div className="home-stat-card-premium">
            <div className="home-stat-icon-premium">
              <Headphones className="stat-icon-inner-premium" />
              <div className="stat-icon-glow-premium"></div>
            </div>
            <div className="home-stat-number-premium">{formatNumber(stats.totalPlays)}</div>
            <div className="home-stat-label-premium">השמעות כולל</div>
            <div className="home-stat-desc-premium">מאז ההקמה</div>
            <div className="home-stat-trend-premium">
              <TrendingUp size={16} />
              <span>+42% החודש</span>
            </div>
          </div>
          <div className="home-stat-card-premium">
            <div className="home-stat-icon-premium">
              <Fire className="stat-icon-inner-premium" />
              <div className="stat-icon-glow-premium"></div>
            </div>
            <div className="home-stat-number-premium">{stats.activeUsers}</div>
            <div className="home-stat-label-premium">אמנים פעילים</div>
            <div className="home-stat-desc-premium">עם שירים</div>
            <div className="home-stat-trend-premium">
              <TrendingUp size={16} />
              <span>+28% החודש</span>
            </div>
          </div>
        </div>
      </section>

      {/* שירים פופולריים */}
      <section ref={songsRef} className="home-popular-songs-premium animate-on-scroll">
        <div className="home-section-header-premium">
          <div className="home-section-badge-premium">
            <Fire className="badge-icon-premium" />
            <span>שירים פופולריים</span>
          </div>
          <h2 className="home-section-title-premium">
            <span className="home-title-highlight">השירים החמים</span> ביותר
          </h2>
          <p className="home-section-subtitle-premium">השירים עם הכי הרבה השמעות בפלטפורמה</p>
        </div>

        {popularSongs.length > 0 ? (
          <div className="home-songs-grid-premium">
            {popularSongs.map((song, index) => (
              <div
                key={song.id}
                className="home-song-card-wrapper-premium"
                style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
              >
                <SongCard song={song} showActions={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="home-empty-state-premium">
            <Music size={64} />
            <h3>אין שירים עדיין</h3>
            <p>היה הראשון להעלות שיר!</p>
            <button className="home-btn-premium home-btn-primary-premium" onClick={() => navigate("/mySongs")}>
              <Upload size={20} />
              <span>העלה שיר ראשון</span>
            </button>
          </div>
        )}

        <div className="home-section-cta-premium">
          <button
            className="home-btn-premium home-btn-outline-premium"
            onClick={() => navigate("/musicLibrary/songList")}
          >
            <Music size={20} />
            <span>צפה בכל השירים ({stats.totalSongs})</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* אמנים מובילים */}
      <section ref={artistsRef} className="home-top-artists-premium animate-on-scroll">
        <div className="home-section-header-premium">
          <div className="home-section-badge-premium">
            <Star className="badge-icon-premium" />
            <span>אמנים מובילים</span>
          </div>
          <h2 className="home-section-title-premium">
            <span className="home-title-highlight">האמנים המובילים</span> בישראל
          </h2>
          <p className="home-section-subtitle-premium">האמנים עם הכי הרבה שירים ועוקבים</p>
        </div>

        {topArtists.length > 0 ? (
          <div className="home-artists-grid-premium">
            {topArtists.map((artist, index) => (
              <div
                key={artist.id}
                className="home-artist-card-premium"
                style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
                onClick={() => navigate(`/artists/${artist.id}`)}
              >
                <div className="home-artist-card-glow-premium"></div>
                <div className="home-artist-image-premium">
                  {artist.pathProfile ? (
                    <img src={artist.pathProfile || "/placeholder.svg"} alt={artist.userName} />
                  ) : (
                    <div className="home-artist-placeholder-premium">
                      <Users size={40} />
                    </div>
                  )}
                </div>

                <div className="home-artist-info-premium">
                  <div className="home-artist-name-premium">
                    {artist.userName}
                    <Verified className="home-verified-icon-premium" />
                  </div>
                  <div className="home-artist-stats-premium">
                    <div className="home-artist-stat-premium">
                      <Music size={14} />
                      <span>{artist.countSongs || 0} שירים</span>
                    </div>
                    <div className="home-artist-stat-premium">
                      <Users size={14} />
                      <span>{artist.countFollowers || 0} עוקבים</span>
                    </div>
                  </div>
                </div>

                <div className="home-artist-overlay-premium">
                  <button className="home-artist-play-btn-premium">
                    <Play size={24} />
                  </button>
                </div>

                {/* אפקטים מיוחדים */}
                <div className="home-artist-effects-premium">
                  <div className="home-artist-note-premium">♪</div>
                  <div className="home-artist-note-premium">♫</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="home-empty-state-premium">
            <Users size={64} />
            <h3>אין אמנים עדיין</h3>
            <p>היה הראשון להירשם כאמן!</p>
            <button className="home-btn-premium home-btn-primary-premium" onClick={() => navigate("/register")}>
              <Users size={20} />
              <span>הירשם כאמן</span>
            </button>
          </div>
        )}

        <div className="home-section-cta-premium">
          <button
            className="home-btn-premium home-btn-outline-premium"
            onClick={() => navigate("/musicLibrary/artistList")}
          >
            <Users size={20} />
            <span>צפה בכל האמנים ({stats.totalArtists})</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* תכונות מרשימות */}
      <section className="home-features-premium animate-on-scroll">
        <div className="home-section-header-premium">
          <div className="home-section-badge-premium">
            <Zap className="badge-icon-premium" />
            <span>תכונות הפלטפורמה</span>
          </div>
          <h2 className="home-section-title-premium">
            <span className="home-title-highlight">למה לבחור</span> בנו?
          </h2>
          <p className="home-section-subtitle-premium">הכלים והתכונות שיעזרו לך להצליח</p>
        </div>

        <div className="home-features-grid-premium">
          <div className="home-feature-card-premium">
            <div className="home-feature-icon-premium">
              <Upload className="feature-icon-inner-premium" />
              <div className="feature-icon-glow-premium"></div>
            </div>
            <h3>העלאה פשוטה</h3>
            <p>העלה שירים בקלות ובמהירות עם ממשק פשוט וידידותי</p>
            <div className="feature-card-shine-premium"></div>
          </div>
          <div className="home-feature-card-premium">
            <div className="home-feature-icon-premium">
              <TrendingUp className="feature-icon-inner-premium" />
              <div className="feature-icon-glow-premium"></div>
            </div>
            <h3>מעקב אחר ביצועים</h3>
            <p>עקוב אחר מספר ההשמעות והפופולריות של השירים שלך</p>
            <div className="feature-card-shine-premium"></div>
          </div>
          <div className="home-feature-card-premium">
            <div className="home-feature-icon-premium">
              <Users className="feature-icon-inner-premium" />
              <div className="feature-icon-glow-premium"></div>
            </div>
            <h3>קהילה ישראלית</h3>
            <p>התחבר עם אמנים ומאזינים ישראליים אחרים</p>
            <div className="feature-card-shine-premium"></div>
          </div>
          <div className="home-feature-card-premium">
            <div className="home-feature-icon-premium">
              <Share2 className="feature-icon-inner-premium" />
              <div className="feature-icon-glow-premium"></div>
            </div>
            <h3>שיתוף קל</h3>
            <p>שתף את המוזיקה שלך בקלות ברשתות חברתיות ובמייל</p>
            <div className="feature-card-shine-premium"></div>
          </div>
          <div className="home-feature-card-premium">
            <div className="home-feature-icon-premium">
              <Waveform className="feature-icon-inner-premium" />
              <div className="feature-icon-glow-premium"></div>
            </div>
            <h3>איכות סאונד מעולה</h3>
            <p>השמע את המוזיקה שלך באיכות גבוהה ללא דחיסה</p>
            <div className="feature-card-shine-premium"></div>
          </div>
          <div className="home-feature-card-premium">
            <div className="home-feature-icon-premium">
              <MessageCircle className="feature-icon-inner-premium" />
              <div className="feature-icon-glow-premium"></div>
            </div>
            <h3>תגובות ומשוב</h3>
            <p>קבל משוב מקהילת המאזינים והאמנים</p>
            <div className="feature-card-shine-premium"></div>
          </div>
        </div>
      </section>

      {/* קריאה לפעולה מרשימה */}
      <section className="home-cta-premium animate-on-scroll">
        <div className="home-cta-background-premium">
          <div className="home-cta-orb-premium home-cta-orb-1"></div>
          <div className="home-cta-orb-premium home-cta-orb-2"></div>
          <div className="home-cta-orb-premium home-cta-orb-3"></div>

          <div className="home-cta-waves-premium">
            <div className="home-cta-wave-premium"></div>
            <div className="home-cta-wave-premium"></div>
            <div className="home-cta-wave-premium"></div>
          </div>
        </div>

        <div className="home-cta-content-premium">
          <div className="home-cta-badge-premium">
            <Crown className="badge-icon-premium" />
            <span>הצטרף עכשיו</span>
          </div>

          <h2 className="home-cta-title-premium">
            <span className="home-title-highlight">מוכן להתחיל</span> את המסע המוזיקלי שלך?
          </h2>
          <p className="home-cta-description-premium">
            הצטרף ל-{stats.totalArtists} האמנים שכבר בחרו בנו ותהיה חלק מהקהילה המוזיקלית הישראלית הגדלה והמתפתחת
          </p>

          <div className="home-cta-features-premium">
            <div className="home-cta-feature-premium">
              <div className="cta-feature-icon-premium">
                <Crown />
              </div>
              <span>חשבון חינם לחלוטין</span>
            </div>
            <div className="home-cta-feature-premium">
              <div className="cta-feature-icon-premium">
                <Mic2 />
              </div>
              <span>כלי הקלטה מתקדמים</span>
            </div>
            <div className="home-cta-feature-premium">
              <div className="cta-feature-icon-premium">
                <Globe />
              </div>
              <span>חשיפה מקסימלית</span>
            </div>
          </div>

          <div className="home-cta-buttons-premium">
            {user?.id ? (
              <>
                <button
                  className="home-btn-premium home-btn-primary-premium home-btn-large-premium"
                  onClick={() => navigate("/mySongs")}
                >
                  <Upload size={20} />
                  <span>העלה שיר חדש</span>
                  <ArrowRight size={20} />
                  <div className="btn-glow-premium"></div>
                </button>
                <button
                  className="home-btn-premium home-btn-outline-premium home-btn-large-premium"
                  onClick={() => navigate("/musicLibrary/songList")}
                >
                  <Eye size={20} />
                  <span>גלה מוזיקה חדשה</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="home-btn-premium home-btn-primary-premium home-btn-large-premium"
                  onClick={() => navigate("/register")}
                >
                  <Users size={20} />
                  <span>הירשם בחינם</span>
                  <ArrowRight size={20} />
                  <div className="btn-glow-premium"></div>
                </button>
                <button
                  className="home-btn-premium home-btn-outline-premium home-btn-large-premium"
                  onClick={() => navigate("/musicLibrary/songList")}
                >
                  <Eye size={20} />
                  <span>צפה בשירים</span>
                </button>
              </>
            )}
          </div>

          <div className="home-cta-guarantee-premium">
            <Award size={16} />
            <span>חינם לחלוטין • ללא התחייבות • תמיכה בעברית</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
