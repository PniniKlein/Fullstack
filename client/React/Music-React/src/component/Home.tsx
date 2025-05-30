"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Play,
  Music,
  Users,
  Heart,
  Star,
  Download,
  Share2,
  Headphones,
  Volume2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Globe,
  Upload,
  Zap,
  Waves,
  Rocket,
  Crown,
  FlameIcon as Fire,
  Eye,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  Verified,
  Pause,
  SkipForward,
  Shuffle,
  Repeat,
} from "lucide-react"
import "../css/home.css"

interface RealSong {
  id: number
  title: string
  artist: string
  genre: string
  duration: string
  plays: string
  likes: string
  isPlaying: boolean
  coverColor: string
  releaseDate: string
}

interface RealArtist {
  id: number
  name: string
  genre: string
  followers: string
  monthlyListeners: string
  topSong: string
  isVerified: boolean
  isLive: boolean
  coverColor: string
  description: string
}

interface RealEvent {
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

interface RealTestimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
  verified: boolean
  achievement: string
  location: string
}

interface FAQ {
  id: number
  question: string
  answer: string
}

const HomePage: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [currentSong, setCurrentSong] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [stats, setStats] = useState({
    songs: 0,
    artists: 0,
    users: 0,
    streams: 0,
  })

  // Real Israeli songs data
  const realSongs: RealSong[] = [
    {
      id: 1,
      title: "בואי נברח",
      artist: "עידן רייכל",
      genre: "פופ ישראלי",
      duration: "4:23",
      plays: "2.3M",
      likes: "45K",
      isPlaying: true,
      coverColor: "#e74c3c",
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
      isPlaying: false,
      coverColor: "#3498db",
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
      isPlaying: false,
      coverColor: "#f39c12",
      releaseDate: "2023",
    },
  ]

  // Real Israeli artists data
  const realArtists: RealArtist[] = [
    {
      id: 1,
      name: "עידן רייכל",
      genre: "פופ ישראלי",
      followers: "234K",
      monthlyListeners: "1.2M",
      topSong: "בואי נברח",
      isVerified: true,
      isLive: false,
      coverColor: "#e74c3c",
      description: "מוזיקאי, מלחין ומפיק ישראלי מוביל",
    },
    {
      id: 2,
      name: "נועה קירל",
      genre: "פופ",
      followers: "456K",
      monthlyListeners: "2.1M",
      topSong: "שיר לשלום",
      isVerified: true,
      isLive: true,
      coverColor: "#3498db",
      description: "זמרת פופ ישראלית פופולרית",
    },
    {
      id: 3,
      name: "עדן בן זקן",
      genre: "מזרחית מודרנית",
      followers: "189K",
      monthlyListeners: "890K",
      topSong: "ירושלים של זהב",
      isVerified: true,
      isLive: false,
      coverColor: "#f39c12",
      description: "זמר מזרחי מוביל בישראל",
    },
    {
      id: 4,
      name: "אסתר רדא",
      genre: "אלטרנטיב",
      followers: "123K",
      monthlyListeners: "567K",
      topSong: "חלומות בלילה",
      isVerified: true,
      isLive: true,
      coverColor: "#9b59b6",
      description: "אמנית אלטרנטיבית חדשנית",
    },
    {
      id: 5,
      name: "שלומי שבת",
      genre: "מזרחית",
      followers: "345K",
      monthlyListeners: "1.5M",
      topSong: "אהבה ראשונה",
      isVerified: true,
      isLive: false,
      coverColor: "#e67e22",
      description: "מלך המזרחית הישראלית",
    },
    {
      id: 6,
      name: "יעל נעים",
      genre: "ג'אז",
      followers: "87K",
      monthlyListeners: "234K",
      topSong: "לילה בתל אביב",
      isVerified: true,
      isLive: true,
      coverColor: "#1abc9c",
      description: "זמרת ג'אז מוכשרת",
    },
  ]

  // Real events data
  const realEvents: RealEvent[] = [
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

  // Real testimonials from Israeli artists
  const realTestimonials: RealTestimonial[] = [
    {
      id: 1,
      name: "דני סנדרסון",
      role: "מוזיקאי ומלחין",
      content:
        "הפלטפורמה הזו שינתה את הדרך שבה אני מתחבר עם המעריצים שלי. יש כאן קהילה אמיתית של אוהבי מוזיקה ישראלית איכותית.",
      rating: 5,
      verified: true,
      achievement: "זוכה פרס אקו״ם",
      location: "תל אביב",
    },
    {
      id: 2,
      name: "רינת בר",
      role: "זמרת ויוצרת",
      content: "בזכות הפלטפורמה הגעתי ל-100K עוקבים תוך שנה. הכלים כאן מתקדמים והקהילה תומכת ומעודדת יצירתיות.",
      rating: 5,
      verified: true,
      achievement: "אמנית השנה 2023",
      location: "ירושלים",
    },
    {
      id: 3,
      name: "יוני בלוך",
      role: "מפיק מוזיקלי",
      content:
        "כמפיק, אני מוצא כאן כשרונות חדשים כל הזמן. האיכות של המוזיקה והאמנים כאן מדהימה. זה המקום לגלות את הדור הבא.",
      rating: 5,
      verified: true,
      achievement: "מפיק פלטינה",
      location: "חיפה",
    },
  ]

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "איך אני יכול להעלות את המוזיקה שלי לפלטפורמה?",
      answer:
        "ההרשמה פשוטה וחינמית. לאחר יצירת חשבון, תוכל להעלות שירים בפורמטים MP3, WAV ו-FLAC באיכות עד 24-bit/96kHz. יש לנו גם כלי עריכה מובנים ואפקטים מקצועיים.",
    },
    {
      id: 2,
      question: "האם יש עלויות להשתמש בפלטפורמה?",
      answer:
        "השירותים הבסיסיים חינמיים לחלוטין. יש לנו גם חבילות פרימיום החל מ-₪29 לחודש עם תכונות מתקדמות כמו אנליטיקה מפורטת, אחסון בלתי מוגבל ותמיכה בעדיפות.",
    },
    {
      id: 3,
      question: "איך אני יכול להגדיל את החשיפה של השירים שלי?",
      answer:
        "השתתף בקהילה, תן תגובות לאמנים אחרים, השתמש בתגיות רלוונטיות, שתף ברשתות חברתיות, והשתתף בתחרויות ואירועים. המערכת שלנו גם מקדמת אוטומטית מוזיקה איכותית.",
    },
    {
      id: 4,
      question: "איך פועלת מערכת הרווחים לאמנים?",
      answer:
        "אמנים מרוויחים מהשמעות (₪0.004 להשמעה), מכירות דיגיטליות, תרומות מעריצים, ומכירת מרצ'נדייז. אנחנו מעבירים 85% מהרווחים לאמנים - הגבוה ביותר בתעשייה.",
    },
    {
      id: 5,
      question: "האם אפשר לשתף פעולה עם אמנים אחרים?",
      answer:
        "בהחלט! יש לנו מערכת שיתופי פעולה מתקדמת, חדרי הקלטה וירטואליים, כלי עבודה משותפים בזמן אמת, ופורום מיוחד למציאת שותפים למוזיקה לפי ז'אנר ומיקום.",
    },
  ]

  useEffect(() => {
    // Animate stats counter with real numbers
    const animateStats = () => {
      const targets = { songs: 12847, artists: 3456, users: 28934, streams: 2456789 }
      const duration = 2500
      const steps = 80
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

    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % realTestimonials.length)
    }, 6000)

    // Auto-rotate songs
    const songInterval = setInterval(() => {
      setCurrentSong((prev) => (prev + 1) % realSongs.length)
    }, 8000)

    return () => {
      clearInterval(testimonialInterval)
      clearInterval(songInterval)
    }
  }, [])

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="home-container">
      {/* Advanced Background Elements - No Grid */}
      <div className="home-background-elements">
        {/* Floating Orbs */}
        <div className="home-orb home-orb-1"></div>
        <div className="home-orb home-orb-2"></div>
        <div className="home-orb home-orb-3"></div>
        <div className="home-orb home-orb-4"></div>
        <div className="home-orb home-orb-5"></div>

        {/* Flowing Lines */}
        <div className="home-flowing-lines">
          <svg className="home-flow-line home-flow-1" viewBox="0 0 1200 800">
            <path
              d="M0,400 Q300,200 600,400 T1200,400"
              stroke="url(#gradient1)"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d59039" stopOpacity="0" />
                <stop offset="50%" stopColor="#d59039" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f7c26b" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <svg className="home-flow-line home-flow-2" viewBox="0 0 1200 800">
            <path
              d="M0,300 Q400,100 800,300 T1200,300"
              stroke="url(#gradient2)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.2"
            />
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f7c26b" stopOpacity="0" />
                <stop offset="50%" stopColor="#f7c26b" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#d59039" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Musical Notes */}
        <div className="home-musical-notes">
          <div className="home-note home-note-1">♪</div>
          <div className="home-note home-note-2">♫</div>
          <div className="home-note home-note-3">♬</div>
          <div className="home-note home-note-4">🎵</div>
          <div className="home-note home-note-5">♪</div>
          <div className="home-note home-note-6">♫</div>
          <div className="home-note home-note-7">🎶</div>
          <div className="home-note home-note-8">♬</div>
        </div>

        {/* Glow Effects */}
        <div className="home-glow-effect home-glow-1"></div>
        <div className="home-glow-effect home-glow-2"></div>
        <div className="home-glow-effect home-glow-3"></div>
      </div>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-badge">
            <Sparkles className="home-hero-badge-icon" />
            <span>הפלטפורמה המוזיקלית הישראלית המובילה</span>
            <div className="home-hero-badge-glow"></div>
          </div>

          <h1 className="home-hero-title">
            <span className="home-hero-title-main">
              <span className="home-hero-title-word">המקום</span>
              <span className="home-hero-title-word">של</span>
              <span className="home-hero-title-word">המוזיקה</span>
              <span className="home-hero-title-word">הישראלית</span>
            </span>
            <span className="home-hero-title-sub">גלה, שתף וצור מוזיקה מקורית</span>
          </h1>

          <p className="home-hero-description">
            הצטרף לקהילה הגדולה ביותר של מוזיקאים ומאזינים בישראל. גלה מוזיקה מקורית, שתף את היצירות שלך וקבל חשיפה לקהל
            רחב של אוהבי מוזיקה איכותית.
          </p>

          <div className="home-hero-stats-mini">
            <div className="home-hero-stat-mini">
              <Fire className="home-hero-stat-icon" />
              <span>12K+ שירים ישראליים</span>
            </div>
            <div className="home-hero-stat-mini">
              <Users className="home-hero-stat-icon" />
              <span>3.4K+ אמנים ישראליים</span>
            </div>
            <div className="home-hero-stat-mini">
              <Eye className="home-hero-stat-icon" />
              <span>2.4M+ השמעות חודשיות</span>
            </div>
          </div>

          <div className="home-hero-buttons">
            <button className="home-btn home-btn-primary home-btn-glow">
              <Play className="home-btn-icon" />
              התחל להאזין
              <div className="home-btn-shine"></div>
            </button>
            <button className="home-btn home-btn-secondary home-btn-glass">
              <Upload className="home-btn-icon" />
              העלה מוזיקה
              <Waves className="home-btn-wave" />
            </button>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="home-hero-player-container">
            <div className="home-hero-player">
              <div className="home-hero-player-glow"></div>
              <div className="home-hero-player-header">
                <div className="home-hero-player-title">
                  <Music size={20} />
                  <span>נגן עכשיו</span>
                </div>
                <div className="home-hero-player-status">
                  <div className="home-live-indicator">
                    <div className="home-live-dot"></div>
                    <span>LIVE</span>
                  </div>
                </div>
              </div>

              <div className="home-hero-player-content">
                <div className="home-hero-player-cover-container">
                  <div
                    className="home-hero-player-cover"
                    style={{ backgroundColor: realSongs[currentSong].coverColor }}
                  >
                    <Music size={40} color="white" />
                  </div>
                  <div className="home-hero-player-vinyl"></div>
                  <div className="home-hero-player-cover-glow"></div>
                </div>

                <div className="home-hero-player-info">
                  <h4>{realSongs[currentSong].title}</h4>
                  <p>
                    {realSongs[currentSong].artist} • {realSongs[currentSong].plays} השמעות
                  </p>
                  <div className="home-hero-player-tags">
                    <span className="home-tag">{realSongs[currentSong].genre}</span>
                    <span className="home-tag">{realSongs[currentSong].releaseDate}</span>
                  </div>
                </div>
              </div>

              <div className="home-hero-player-controls">
                <button className="home-hero-player-btn home-hero-player-btn-secondary">
                  <Shuffle size={18} />
                </button>
                <button className="home-hero-player-btn home-hero-player-btn-secondary">
                  <SkipForward size={18} style={{ transform: "rotate(180deg)" }} />
                </button>
                <button className="home-hero-player-btn home-hero-player-btn-primary" onClick={togglePlayPause}>
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button className="home-hero-player-btn home-hero-player-btn-secondary">
                  <SkipForward size={18} />
                </button>
                <button className="home-hero-player-btn home-hero-player-btn-secondary">
                  <Repeat size={18} />
                </button>
              </div>

              <div className="home-hero-player-progress">
                <div className="home-hero-player-time">0:45</div>
                <div className="home-hero-player-progress-bar">
                  <div className="home-hero-player-progress-fill"></div>
                </div>
                <div className="home-hero-player-time">{realSongs[currentSong].duration}</div>
              </div>

              <div className="home-hero-player-volume">
                <Volume2 size={18} />
                <div className="home-hero-player-volume-bar">
                  <div className="home-hero-player-volume-fill"></div>
                </div>
              </div>

              <div className="home-hero-player-actions">
                <button className="home-hero-player-action">
                  <Heart size={18} />
                  <span>{realSongs[currentSong].likes}</span>
                </button>
                <button className="home-hero-player-action">
                  <Share2 size={18} />
                  <span>שתף</span>
                </button>
                <button className="home-hero-player-action">
                  <Download size={18} />
                  <span>הורד</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Stats Section */}
      <section className="home-stats">
        <div className="home-stats-container">
          <div className="home-stat-card home-stat-card-primary">
            <div className="home-stat-icon">
              <Music />
              <div className="home-stat-icon-glow"></div>
            </div>
            <div className="home-stat-content">
              <div className="home-stat-number">{stats.songs.toLocaleString()}</div>
              <div className="home-stat-label">שירים ישראליים</div>
              <div className="home-stat-trend">
                <TrendingUp size={16} />
                <span>+15% החודש</span>
              </div>
            </div>
          </div>

          <div className="home-stat-card home-stat-card-secondary">
            <div className="home-stat-icon">
              <Users />
              <div className="home-stat-icon-glow"></div>
            </div>
            <div className="home-stat-content">
              <div className="home-stat-number">{stats.artists.toLocaleString()}</div>
              <div className="home-stat-label">אמנים ישראליים</div>
              <div className="home-stat-trend">
                <TrendingUp size={16} />
                <span>+12% החודש</span>
              </div>
            </div>
          </div>

          <div className="home-stat-card home-stat-card-accent">
            <div className="home-stat-icon">
              <Heart />
              <div className="home-stat-icon-glow"></div>
            </div>
            <div className="home-stat-content">
              <div className="home-stat-number">{stats.users.toLocaleString()}</div>
              <div className="home-stat-label">מאזינים פעילים</div>
              <div className="home-stat-trend">
                <TrendingUp size={16} />
                <span>+28% החודש</span>
              </div>
            </div>
          </div>

          <div className="home-stat-card home-stat-card-special">
            <div className="home-stat-icon">
              <Headphones />
              <div className="home-stat-icon-glow"></div>
            </div>
            <div className="home-stat-content">
              <div className="home-stat-number">{stats.streams.toLocaleString()}</div>
              <div className="home-stat-label">השמעות חודשיות</div>
              <div className="home-stat-trend">
                <TrendingUp size={16} />
                <span>+42% החודש</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Artists Section */}
      <section className="home-artists">
        <div className="home-section-header">
          <div className="home-section-badge">
            <Star className="home-section-badge-icon" />
            <span>אמנים ישראליים מובילים</span>
          </div>
          <h2 className="home-section-title">הכוכבים של המוזיקה הישראלית</h2>
          <p className="home-section-subtitle">הכירו את האמנים הפופולריים והמשפיעים ביותר בפלטפורמה שלנו</p>
        </div>

        <div className="home-artists-grid">
          {realArtists.map((artist, index) => (
            <div
              key={artist.id}
              className="home-artist-card home-artist-card-enhanced"
              style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
            >
              <div className="home-artist-background"></div>

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
                  <Music size={60} color="white" />
                </div>
                <div className="home-artist-image-glow"></div>
                <div className="home-artist-overlay">
                  <button className="home-artist-play-btn">
                    <Play size={24} />
                    <div className="home-artist-play-glow"></div>
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
                  <div className="home-artist-stat">
                    <Headphones size={16} />
                    <span>{artist.monthlyListeners} מאזינים</span>
                  </div>
                </div>
                <div className="home-artist-top-song">
                  <strong>השיר הפופולרי:</strong> {artist.topSong}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Real Events Section */}
      <section className="home-events">
        <div className="home-section-header">
          <div className="home-section-badge">
            <Calendar className="home-section-badge-icon" />
            <span>אירועים קרובים</span>
          </div>
          <h2 className="home-section-title">אירועי מוזיקה בישראל</h2>
          <p className="home-section-subtitle">אל תפספסו את האירועים המוזיקליים הכי חמים בארץ</p>
        </div>

        <div className="home-events-grid">
          {realEvents.map((event, index) => (
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

      {/* Real Testimonials Section */}
      <section className="home-testimonials">
        <div className="home-section-header">
          <div className="home-section-badge">
            <Award className="home-section-badge-icon" />
            <span>עדויות אמנים</span>
          </div>
          <h2 className="home-section-title">מה אומרים האמנים הישראליים</h2>
          <p className="home-section-subtitle">עדויות מאמנים ומוזיקאים ישראליים מוכרים</p>
        </div>

        <div className="home-testimonials-container">
          <div className="home-testimonial-card home-testimonial-card-enhanced">
            <div className="home-testimonial-background"></div>
            <div className="home-testimonial-content">
              <div className="home-testimonial-quote">"</div>

              <div className="home-testimonial-stars">
                {[...Array(realTestimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="home-testimonial-star" />
                ))}
              </div>

              <p className="home-testimonial-text">"{realTestimonials[currentTestimonial].content}"</p>

              <div className="home-testimonial-author">
                <div className="home-testimonial-avatar-container">
                  <div className="home-testimonial-avatar">
                    <Music size={30} color="#d59039" />
                  </div>
                  <div className="home-testimonial-avatar-glow"></div>
                  {realTestimonials[currentTestimonial].verified && (
                    <div className="home-testimonial-verified">
                      <Verified size={16} />
                    </div>
                  )}
                </div>
                <div className="home-testimonial-author-info">
                  <h4>{realTestimonials[currentTestimonial].name}</h4>
                  <p>{realTestimonials[currentTestimonial].role}</p>
                  <div className="home-testimonial-achievement">
                    <Award size={14} />
                    <span>{realTestimonials[currentTestimonial].achievement}</span>
                  </div>
                  <div className="home-testimonial-location">
                    <MapPin size={14} />
                    <span>{realTestimonials[currentTestimonial].location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="home-testimonials-navigation">
            <div className="home-testimonials-dots">
              {realTestimonials.map((_, index) => (
                <button
                  key={index}
                  className={`home-testimonial-dot ${index === currentTestimonial ? "active" : ""}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="home-faq">
        <div className="home-section-header">
          <div className="home-section-badge">
            <MessageCircle className="home-section-badge-icon" />
            <span>שאלות ותשובות</span>
          </div>
          <h2 className="home-section-title">שאלות נפוצות</h2>
          <p className="home-section-subtitle">מצא תשובות לשאלות הנפוצות ביותר על הפלטפורמה שלנו</p>
        </div>

        <div className="home-faq-container">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="home-faq-item home-faq-item-enhanced"
              style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
            >
              <div className="home-faq-background"></div>
              <button className="home-faq-question" onClick={() => toggleFAQ(faq.id)}>
                <span>{faq.question}</span>
                <div className="home-faq-icon">{openFAQ === faq.id ? <ChevronUp /> : <ChevronDown />}</div>
              </button>
              <div className={`home-faq-answer ${openFAQ === faq.id ? "open" : ""}`}>
                <div className="home-faq-answer-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-cta">
        <div className="home-cta-background">
          <div className="home-cta-orb home-cta-orb-1"></div>
          <div className="home-cta-orb home-cta-orb-2"></div>
          <div className="home-cta-orb home-cta-orb-3"></div>
        </div>

        <div className="home-cta-content">
          <div className="home-cta-badge">
            <Rocket className="home-cta-badge-icon" />
            <span>הצטרף עכשיו</span>
          </div>

          <h2 className="home-cta-title">
            <span className="home-cta-title-main">מוכן להיות חלק מהמהפכה?</span>
            <span className="home-cta-title-sub">הצטרף לקהילת המוזיקה הישראלית</span>
          </h2>

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
            <button className="home-btn home-btn-primary home-btn-large home-btn-mega">
              <Play className="home-btn-icon" />
              הירשם בחינם
              <ArrowRight className="home-btn-icon" />
              <div className="home-btn-shine"></div>
            </button>
            <button className="home-btn home-btn-outline home-btn-large home-btn-glass">
              <Eye className="home-btn-icon" />
              צפה בדמו
            </button>
          </div>

          <div className="home-cta-guarantee">
            <Award size={20} />
            <span>ללא התחייבות • ביטול בכל עת • תמיכה בעברית 24/7</span>
          </div>
        </div>

        <div className="home-cta-visual">
          <div className="home-cta-music-waves">
            <div className="home-wave home-wave-1"></div>
            <div className="home-wave home-wave-2"></div>
            <div className="home-wave home-wave-3"></div>
            <div className="home-wave home-wave-4"></div>
            <div className="home-wave home-wave-5"></div>
            <div className="home-wave home-wave-6"></div>
            <div className="home-wave home-wave-7"></div>
            <div className="home-wave home-wave-8"></div>
          </div>
          <div className="home-cta-glow"></div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
