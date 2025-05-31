"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Play,
  Music,
  Users,
  Heart,
  Headphones,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Upload,
  Crown,
  Eye,
  Verified,
  Pause,
  SkipForward,
  Shuffle,
  Repeat,
  Share2,
  Download,
  Star,
  Calendar,
  Clock,
  MapPin,
  FlameIcon as Fire,
  Mic,
  Zap,
  Globe,
} from "lucide-react"
import "../css/Home.css"

interface Song {
  id: number
  title: string
  artist: string
  genre: string
  duration: string
  plays: string
  likes: string
  coverColor: string
  releaseDate: string
}

interface Artist {
  id: number
  name: string
  genre: string
  followers: string
  isVerified: boolean
  isLive: boolean
  coverColor: string
  description: string
}

interface Event {
  id: number
  title: string
  artist: string
  date: string
  time: string
  venue: string
  city: string
  price: string
  category: string
  isPopular: boolean
}

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [currentSong, setCurrentSong] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [stats, setStats] = useState({
    songs: 0,
    artists: 0,
    users: 0,
    streams: 0,
  })

  // נתוני שירים ישראליים אמיתיים
  const songs: Song[] = [
    {
      id: 1,
      title: "בואי נברח",
      artist: "עידן רייכל",
      genre: "פופ ישראלי",
      duration: "4:23",
      plays: "2.3M",
      likes: "45K",
      coverColor: "#d59039",
      releaseDate: "2023",
    },
    {
      id: 2,
      title: "שיר לשלום",
      artist: "נועה קירל",
      genre: "פופ",
      duration: "3:45",
      plays: "1.8M",
      likes: "32K",
      coverColor: "#f7c26b",
      releaseDate: "2023",
    },
    {
      id: 3,
      title: "ירושלים של זהב",
      artist: "עדן בן זקן",
      genre: "מזרחית מודרנית",
      duration: "5:12",
      plays: "3.1M",
      likes: "67K",
      coverColor: "#d59039",
      releaseDate: "2023",
    },
  ]

  // נתוני אמנים ישראליים
  const artists: Artist[] = [
    {
      id: 1,
      name: "עידן רייכל",
      genre: "פופ ישראלי",
      followers: "234K",
      isVerified: true,
      isLive: false,
      coverColor: "#d59039",
      description: "מוזיקאי, מלחין ומפיק ישראלי מוביל",
    },
    {
      id: 2,
      name: "נועה קירל",
      genre: "פופ",
      followers: "456K",
      isVerified: true,
      isLive: true,
      coverColor: "#f7c26b",
      description: "זמרת פופ ישראלית פופולרית",
    },
    {
      id: 3,
      name: "עדן בן זקן",
      genre: "מזרחית מודרנית",
      followers: "189K",
      isVerified: true,
      isLive: false,
      coverColor: "#d59039",
      description: "זמר מזרחי מוביל בישראל",
    },
    {
      id: 4,
      name: "שלומי שבת",
      genre: "מזרחית",
      followers: "345K",
      isVerified: true,
      isLive: true,
      coverColor: "#f7c26b",
      description: "מלך המזרחית הישראלית",
    },
  ]

  // נתוני אירועים
  const events: Event[] = [
    {
      id: 1,
      title: "קונצרט עידן רייכל",
      artist: "עידן רייכל",
      date: "15 בפברואר",
      time: "20:00",
      venue: "היכל התרבות",
      city: "תל אביב",
      price: "₪180-350",
      category: "קונצרט",
      isPopular: true,
    },
    {
      id: 2,
      title: "פסטיבל המוזיקה הישראלית",
      artist: "אמנים שונים",
      date: "22-24 במרץ",
      time: "19:00",
      venue: "פארק הירקון",
      city: "תל אביב",
      price: "₪120-280",
      category: "פסטיבל",
      isPopular: true,
    },
    {
      id: 3,
      title: "ערב מזרחית עם שלומי שבת",
      artist: "שלומי שבת",
      date: "8 במרץ",
      time: "21:00",
      venue: "קיסריה אמפיתיאטרון",
      city: "קיסריה",
      price: "₪150-400",
      category: "קונצרט",
      isPopular: false,
    },
  ]

  useEffect(() => {
    // אנימציית ספירת הסטטיסטיקות
    const animateStats = () => {
      const targets = { songs: 12847, artists: 3456, users: 28934, streams: 2456789 }
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setStats({
          songs: Math.floor(targets.songs * progress),
          artists: Math.floor(targets.artists * progress),
          users: Math.floor(targets.users * progress),
          streams: Math.floor(targets.streams * progress),
        })

        if (currentStep >= steps) {
          clearInterval(interval)
          setStats(targets)
        }
      }, stepDuration)
    }

    animateStats()

    // החלפת שירים אוטומטית
    const songInterval = setInterval(() => {
      setCurrentSong((prev) => (prev + 1) % songs.length)
    }, 5000)

    return () => {
      clearInterval(songInterval)
    }
  }, [])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <div className="home-container">
      {/* רקע פשוט */}
      <div className="home-background">
        <div className="home-gradient-orb home-gradient-orb-1"></div>
        <div className="home-gradient-orb home-gradient-orb-2"></div>
      </div>

      {/* סקציית גיבור */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-badge">
            <Sparkles size={20} />
            <span>הפלטפורמה המוזיקלית הישראלית המובילה</span>
          </div>

          <h1 className="home-hero-title">המקום של המוזיקה הישראלית</h1>

          <p className="home-hero-description">
            גלה, שתף וצור מוזיקה מקורית. הצטרף לקהילה הגדולה ביותר של מוזיקאים ומאזינים בישראל.
          </p>

          <div className="home-hero-stats-mini">
            <div className="home-hero-stat-mini">
              <Fire size={20} />
              <span>12K+ שירים ישראליים</span>
            </div>
            <div className="home-hero-stat-mini">
              <Users size={20} />
              <span>3.4K+ אמנים ישראליים</span>
            </div>
            <div className="home-hero-stat-mini">
              <Eye size={20} />
              <span>2.4M+ השמעות חודשיות</span>
            </div>
          </div>

          <div className="home-hero-buttons">
            <button className="home-btn home-btn-primary" onClick={() => handleNavigate("/musicLibrary/songList")}>
              <Play size={20} />
              התחל להאזין
            </button>
            <button className="home-btn home-btn-secondary" onClick={() => handleNavigate("/mySongs")}>
              <Upload size={20} />
              העלה מוזיקה
            </button>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="home-player">
            <div className="home-player-header">
              <div className="home-player-title">
                <Music size={18} />
                <span>נגן עכשיו</span>
              </div>
              <div className="home-live-badge">
                <div className="home-live-dot"></div>
                <span>LIVE</span>
              </div>
            </div>

            <div className="home-player-content">
              <div className="home-player-cover" style={{ backgroundColor: songs[currentSong].coverColor }}>
                <Music size={32} color="white" />
              </div>
              <div className="home-player-info">
                <h4>{songs[currentSong].title}</h4>
                <p>{songs[currentSong].artist}</p>
                <div className="home-player-stats">
                  <span>{songs[currentSong].plays} השמעות</span>
                  <span>{songs[currentSong].likes} לייקים</span>
                </div>
              </div>
            </div>

            <div className="home-player-controls">
              <button className="home-player-btn">
                <Shuffle size={16} />
              </button>
              <button className="home-player-btn">
                <SkipForward size={16} style={{ transform: "rotate(180deg)" }} />
              </button>
              <button className="home-player-btn home-player-btn-primary" onClick={togglePlayPause}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button className="home-player-btn">
                <SkipForward size={16} />
              </button>
              <button className="home-player-btn">
                <Repeat size={16} />
              </button>
            </div>

            <div className="home-player-progress">
              <div className="home-player-time">1:23</div>
              <div className="home-player-progress-bar">
                <div className="home-player-progress-fill"></div>
              </div>
              <div className="home-player-time">{songs[currentSong].duration}</div>
            </div>

            <div className="home-player-actions">
              <button className="home-player-action">
                <Heart size={16} />
                <span>{songs[currentSong].likes}</span>
              </button>
              <button className="home-player-action">
                <Share2 size={16} />
                <span>שתף</span>
              </button>
              <button className="home-player-action">
                <Download size={16} />
                <span>הורד</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* סקציית סטטיסטיקות */}
      <section className="home-stats">
        <div className="home-stats-grid">
          <div className="home-stat-card">
            <div className="home-stat-icon">
              <Music size={24} />
            </div>
            <div className="home-stat-number">{stats.songs.toLocaleString()}</div>
            <div className="home-stat-label">שירים ישראליים</div>
            <div className="home-stat-trend">
              <TrendingUp size={16} />
              <span>+15% החודש</span>
            </div>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-icon">
              <Users size={24} />
            </div>
            <div className="home-stat-number">{stats.artists.toLocaleString()}</div>
            <div className="home-stat-label">אמנים ישראליים</div>
            <div className="home-stat-trend">
              <TrendingUp size={16} />
              <span>+12% החודש</span>
            </div>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-icon">
              <Heart size={24} />
            </div>
            <div className="home-stat-number">{stats.users.toLocaleString()}</div>
            <div className="home-stat-label">מאזינים פעילים</div>
            <div className="home-stat-trend">
              <TrendingUp size={16} />
              <span>+28% החודש</span>
            </div>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-icon">
              <Headphones size={24} />
            </div>
            <div className="home-stat-number">{stats.streams.toLocaleString()}</div>
            <div className="home-stat-label">השמעות חודשיות</div>
            <div className="home-stat-trend">
              <TrendingUp size={16} />
              <span>+42% החודש</span>
            </div>
          </div>
        </div>
      </section>

      {/* סקציית אמנים מובילים */}
      <section className="home-artists">
        <div className="home-section-header">
          <div className="home-section-badge">
            <Star size={16} />
            <span>אמנים ישראליים מובילים</span>
          </div>
          <h2 className="home-section-title">הכוכבים של המוזיקה הישראלית</h2>
          <p className="home-section-subtitle">הכירו את האמנים הפופולריים והמשפיעים ביותר בפלטפורמה שלנו</p>
        </div>

        <div className="home-artists-grid">
          {artists.map((artist, index) => (
            <div
              key={artist.id}
              className="home-artist-card"
              style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
            >
              {artist.isLive && (
                <div className="home-artist-live-badge">
                  <div className="home-live-dot"></div>
                  <span>LIVE</span>
                </div>
              )}

              {artist.isVerified && (
                <div className="home-artist-verified-badge">
                  <Verified size={16} />
                  <span>מאומת</span>
                </div>
              )}

              <div className="home-artist-image-container">
                <div className="home-artist-image" style={{ backgroundColor: artist.coverColor }}>
                  <Music size={40} color="white" />
                </div>
                <div className="home-artist-overlay">
                  <button className="home-artist-play-btn" onClick={() => handleNavigate("/musicLibrary/artistList")}>
                    <Play size={24} />
                  </button>
                </div>
              </div>

              <div className="home-artist-info">
                <h3 className="home-artist-name">{artist.name}</h3>
                <p className="home-artist-genre">{artist.genre}</p>
                <p className="home-artist-description">{artist.description}</p>
                <div className="home-artist-stats">
                  <div className="home-artist-stat">
                    <Users size={16} />
                    <span>{artist.followers} עוקבים</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="home-section-cta">
          <button className="home-btn home-btn-outline" onClick={() => handleNavigate("/musicLibrary/artistList")}>
            <Users size={20} />
            צפה בכל האמנים
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* סקציית אירועים קרובים */}
      <section className="home-events">
        <div className="home-section-header">
          <div className="home-section-badge">
            <Calendar size={16} />
            <span>אירועים קרובים</span>
          </div>
          <h2 className="home-section-title">אירועי מוזיקה בישראל</h2>
          <p className="home-section-subtitle">אל תפספסו את האירועים המוזיקליים הכי חמים בארץ</p>
        </div>

        <div className="home-events-grid">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="home-event-card"
              style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
            >
              {event.isPopular && (
                <div className="home-event-popular-badge">
                  <Fire size={16} />
                  <span>פופולרי</span>
                </div>
              )}

              <div className="home-event-category">{event.category}</div>

              <div className="home-event-content">
                <h3 className="home-event-title">{event.title}</h3>
                <p className="home-event-artist">{event.artist}</p>

                <div className="home-event-details">
                  <div className="home-event-detail">
                    <Calendar size={16} />
                    <span>{event.date}</span>
                  </div>
                  <div className="home-event-detail">
                    <Clock size={16} />
                    <span>{event.time}</span>
                  </div>
                  <div className="home-event-detail">
                    <MapPin size={16} />
                    <span>
                      {event.venue}, {event.city}
                    </span>
                  </div>
                </div>

                <div className="home-event-price">{event.price}</div>

                <button className="home-event-btn">
                  <span>רכישת כרטיסים</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* סקציית תכונות */}
      <section className="home-features">
        <div className="home-section-header">
          <div className="home-section-badge">
            <Zap size={16} />
            <span>תכונות מתקדמות</span>
          </div>
          <h2 className="home-section-title">למה לבחור בנו?</h2>
          <p className="home-section-subtitle">הכלים והתכונות הטובים ביותר לאמנים ומאזינים</p>
        </div>

        <div className="home-features-grid">
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <Upload size={32} />
            </div>
            <h3>העלאה קלה</h3>
            <p>העלה את המוזיקה שלך בקלות ובמהירות עם הכלים המתקדמים שלנו</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <TrendingUp size={32} />
            </div>
            <h3>אנליטיקה מתקדמת</h3>
            <p>עקוב אחר הביצועים של השירים שלך עם דוחות מפורטים ותובנות</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <Users size={32} />
            </div>
            <h3>קהילה תומכת</h3>
            <p>הצטרף לקהילה של אמנים ומאזינים שתומכים זה בזה</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <Crown size={32} />
            </div>
            <h3>רווחים הוגנים</h3>
            <p>קבל את הרווחים הגבוהים ביותר בתעשייה מהמוזיקה שלך</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <Globe size={32} />
            </div>
            <h3>חשיפה גלובלית</h3>
            <p>הגע לקהל בינלאומי והפץ את המוזיקה שלך ברחבי העולם</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">
              <Mic size={32} />
            </div>
            <h3>כלי הקלטה מקצועיים</h3>
            <p>השתמש בכלי הקלטה ועריכה מתקדמים ישירות מהדפדפן</p>
          </div>
        </div>
      </section>

      {/* סקציית קריאה לפעולה */}
      <section className="home-cta">
        <div className="home-cta-content">
          <div className="home-cta-badge">
            <Sparkles size={20} />
            <span>הצטרף עכשיו</span>
          </div>

          <h2 className="home-cta-title">מוכן להיות חלק מהמהפכה?</h2>
          <p className="home-cta-description">
            הצטרף אלינו היום וקבל גישה לכלים המתקדמים ביותר, קהילה תומכת של אמנים ישראליים ואפשרויות חשיפה ורווח בלתי
            מוגבלות.
          </p>

          <div className="home-cta-features">
            <div className="home-cta-feature">
              <Crown size={20} />
              <span>חשבון פרימיום חינם לחודש ראשון</span>
            </div>
            <div className="home-cta-feature">
              <Zap size={20} />
              <span>כלי הקלטה ועריכה מתקדמים</span>
            </div>
            <div className="home-cta-feature">
              <Globe size={20} />
              <span>חשיפה לקהל ישראלי ובינלאומי</span>
            </div>
          </div>

          <div className="home-cta-buttons">
            <button className="home-btn home-btn-primary home-btn-large" onClick={() => handleNavigate("/register")}>
              <Play size={20} />
              הירשם בחינם
              <ArrowRight size={20} />
            </button>
            <button
              className="home-btn home-btn-outline home-btn-large"
              onClick={() => handleNavigate("/musicLibrary/songList")}
            >
              <Eye size={20} />
              צפה בדמו
            </button>
          </div>

          <div className="home-cta-guarantee">
            <Award size={16} />
            <span>ללא התחייבות • ביטול בכל עת • תמיכה בעברית 24/7</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
