"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import type { StoreType } from "../store/store"
import {
  Play,
  Music,
  Users,
  Headphones,
  Star,
  ArrowRight,
  Volume2,
  Heart,
  Sparkles,
  Mic,
  Radio,
  TrendingUp,
  Award,
  Globe,
  Zap,
  Shield,
  Clock,
  Download,
  Layers,
} from "lucide-react"
// import Footer from "./Footer"
import "../css/Home.css"
import Footer from "./Footer"

const HomePage = () => {
  const navigate = useNavigate()
  const authState = useSelector((state: StoreType) => state.user.authState)
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const features = [
    {
      icon: <Music size={32} />,
      title: "העלה שירים",
      description: "שתף את היצירות שלך עם העולם",
      color: "#d59039",
    },
    {
      icon: <Users size={32} />,
      title: "קהילה חיה",
      description: "התחבר לאמנים ומאזינים",
      color: "#f7c26b",
    },
    {
      icon: <Headphones size={32} />,
      title: "האזן וגלה",
      description: "מוזיקה חדשה כל יום",
      color: "#e3aa50",
    },
  ]

  const stats = [
    { number: "15K+", label: "שירים", icon: <Music size={24} />, color: "#d59039" },
    { number: "8K+", label: "אמנים", icon: <Users size={24} />, color: "#f7c26b" },
    { number: "250K+", label: "השמעות", icon: <Play size={24} />, color: "#e3aa50" },
    { number: "75K+", label: "לייקים", icon: <Heart size={24} />, color: "#c67c28" },
  ]

  const testimonials = [
    {
      name: "דני כהן",
      role: "מוזיקאי עצמאי",
      content: "SingSong שינה לי את החיים! הצלחתי להגיע לקהל חדש ולקבל פידבק מדהים על השירים שלי.",
      avatar: "🎸",
      rating: 5,
    },
    {
      name: "מיכל לוי",
      role: "זמרת",
      content: "הפלטפורמה הכי טובה למוזיקאים! קל להעלות, יפה לשתף ומלא אנשים מעולים.",
      avatar: "🎤",
      rating: 5,
    },
    {
      name: "יוסי אברהם",
      role: "מפיק מוזיקלי",
      content: "מצאתי כאן כמה מהכישרונות הכי מבטיחים. המקום המושלם לגלות מוזיקה חדשה.",
      avatar: "🎹",
      rating: 5,
    },
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="homepage-container">
      {/* Background Effects */}
      <div className="homepage-background">
        <div className="homepage-gradient-orb orb-1"></div>
        <div className="homepage-gradient-orb orb-2"></div>
        <div className="homepage-gradient-orb orb-3"></div>
        <div className="homepage-gradient-orb orb-4"></div>
        <div className="homepage-gradient-orb orb-5"></div>

        {/* Floating Musical Elements */}
        <div className="floating-music-elements">
          <div className="music-element element-1">♪</div>
          <div className="music-element element-2">♫</div>
          <div className="music-element element-3">♬</div>
          <div className="music-element element-4">🎵</div>
          <div className="music-element element-5">🎶</div>
          <div className="music-element element-6">♪</div>
          <div className="music-element element-7">♫</div>
          <div className="music-element element-8">♬</div>
          <div className="music-element element-9">🎼</div>
          <div className="music-element element-10">🎺</div>
        </div>

        {/* Animated Lines */}
        <div className="animated-lines">
          <div className="line line-1"></div>
          <div className="line line-2"></div>
          <div className="line line-3"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>הפלטפורמה המוזיקלית החדשה של ישראל</span>
              <div className="badge-glow"></div>
            </div>

            <h1 className="hero-title">
              <span className="title-line">ברוכים הבאים ל</span>
              <span className="title-brand">
                SingSong
                <div className="brand-underline"></div>
              </span>
              <span className="title-subtitle">המקום שלך למוזיקה מקורית</span>
            </h1>

            <p className="hero-description">
              גלה, שתף והתחבר דרך המוזיקה. הצטרף לקהילה של אמנים ומאזינים שחולקים את התשוקה למוזיקה איכותית ומקורית. כאן
              כל שיר מספר סיפור, וכל אמן מוצא את הבמה שלו.
            </p>

            <div className="hero-features-mini">
              <div className="mini-feature">
                <Shield size={16} />
                <span>בטוח ומאובטח</span>
              </div>
              <div className="mini-feature">
                <Clock size={16} />
                <span>זמין 24/7</span>
              </div>
              <div className="mini-feature">
                <Download size={16} />
                <span>חינם לחלוטין</span>
              </div>
            </div>

            <div className="hero-buttons">
              <motion.button
                className="cta-button primary"
                onClick={() => navigate(authState ? "/musicLibrary/songList" : "/register")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={20} />
                <span>{authState ? "גלה מוזיקה" : "הצטרף עכשיו"}</span>
                <ArrowRight size={16} />
                <div className="button-glow"></div>
              </motion.button>

              <motion.button
                className="cta-button secondary"
                onClick={() => navigate("/musicLibrary/songList")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Headphones size={20} />
                <span>האזן עכשיו</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="hero-music-player">
              <div className="player-glow"></div>
              <div className="player-content">
                <div className="player-header">
                  <div className="player-controls">
                    <div className="control-dot red"></div>
                    <div className="control-dot yellow"></div>
                    <div className="control-dot green"></div>
                  </div>
                  <div className="player-title">SingSong Player</div>
                </div>

                <div className="player-body">
                  <div className="album-art">
                    <div className="album-glow"></div>
                    <div className="album-image">
                      <Music size={40} />
                      <div className="vinyl-effect"></div>
                    </div>
                  </div>

                  <div className="track-info">
                    <h4>השיר הבא שלך</h4>
                    <p>מחכה להתגלות...</p>
                    <div className="track-progress">
                      <div className="progress-bar">
                        <div className="progress-fill"></div>
                      </div>
                      <div className="time-stamps">
                        <span>0:00</span>
                        <span>3:24</span>
                      </div>
                    </div>
                  </div>

                  <div className="player-controls-bottom">
                    <button className="control-btn">
                      <ArrowRight size={16} style={{ transform: "rotate(180deg)" }} />
                    </button>
                    <button className="play-btn">
                      <Play size={24} />
                    </button>
                    <button className="control-btn">
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  <div className="sound-waves">
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                  </div>
                </div>
              </div>

              {/* Floating Elements Around Player */}
              <div className="player-floating-elements">
                <div className="floating-note note-1">♪</div>
                <div className="floating-note note-2">♫</div>
                <div className="floating-note note-3">♬</div>
                <div className="floating-heart">💖</div>
                <div className="floating-star">⭐</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              style={{ "--stat-color": stat.color } as React.CSSProperties}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-glow"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <motion.div
            className="features-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>למה SingSong?</h2>
            <p>הפלטפורמה המושלמת לכל חובבי המוזיקה</p>
          </motion.div>

          <div className="features-grid">
            <motion.div
              className="feature-card main-feature"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon-large">
                <Mic size={48} />
                <div className="icon-pulse"></div>
              </div>
              <h3>הקלט ושתף</h3>
              <p>העלה את השירים שלך בקלות ושתף אותם עם העולם. פלטפורמה פשוטה ואינטואיטיבית לכל אמן.</p>
              <div className="feature-highlight">
                <Zap size={16} />
                <span>העלאה מהירה ואיכותית</span>
              </div>
              <div className="feature-bg-effect"></div>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <Radio size={32} />
              </div>
              <h4>גלה מוזיקה חדשה</h4>
              <p>אלגוריתם חכם שמציע לך מוזיקה שתאהב על בסיס הטעם המוזיקלי שלך.</p>
              <div className="feature-tags">
                <span className="tag">AI מתקדם</span>
                <span className="tag">המלצות אישיות</span>
              </div>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <Globe size={32} />
              </div>
              <h4>קהילה גלובלית</h4>
              <p>התחבר לאמנים ומאזינים מכל העולם. שתף, תגיב ובנה קשרים חדשים.</p>
              <div className="feature-tags">
                <span className="tag">רשת חברתית</span>
                <span className="tag">שיתוף פעולה</span>
              </div>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h4>נתונים ותובנות</h4>
              <p>עקוב אחרי הביצועים של השירים שלך וקבל תובנות על הקהל שלך.</p>
              <div className="feature-tags">
                <span className="tag">אנליטיקה</span>
                <span className="tag">דוחות</span>
              </div>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <Award size={32} />
              </div>
              <h4>איכות גבוהה</h4>
              <p>נגן מוזיקה באיכות גבוהה עם ממשק משתמש מתקדם ונוח לשימוש.</p>
              <div className="feature-tags">
                <span className="tag">HD Audio</span>
                <span className="tag">UX מתקדם</span>
              </div>
            </motion.div>

            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">
                <Layers size={32} />
              </div>
              <h4>כלים מתקדמים</h4>
              <p>עורך מוזיקה מובנה, אפקטים ופילטרים לשיפור השירים שלך.</p>
              <div className="feature-tags">
                <span className="tag">עריכה</span>
                <span className="tag">אפקטים</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>מה אומרים עלינו</h2>
            <p>ביקורות מאמנים ומאזינים מרוצים</p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="testimonial-content">
                  <div className="quote-mark">"</div>
                  <p>{testimonial.content}</p>
                  <div className="rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#f7c26b" color="#f7c26b" />
                    ))}
                  </div>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
                <div className="testimonial-glow"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>איך זה עובד?</h2>
            <p>שלושה שלבים פשוטים להתחיל</p>
          </motion.div>

          <div className="steps-container">
            <motion.div
              className="step-card"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>הירשם</h3>
                <p>צור חשבון חינם ובנה את הפרופיל המוזיקלי שלך</p>
              </div>
              <div className="step-icon">
                <Users size={32} />
              </div>
              <div className="step-connector"></div>
            </motion.div>

            <motion.div
              className="step-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>העלה מוזיקה</h3>
                <p>שתף את השירים שלך או גלה מוזיקה חדשה מאמנים אחרים</p>
              </div>
              <div className="step-icon">
                <Music size={32} />
              </div>
              <div className="step-connector"></div>
            </motion.div>

            <motion.div
              className="step-card"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>התחבר וצמח</h3>
                <p>בנה קהילה, קבל פידבק וצמח כאמן</p>
              </div>
              <div className="step-icon">
                <Star size={32} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="final-cta-container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="cta-icon">
              <Volume2 size={48} />
              <div className="icon-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
            <h2>מוכן להתחיל את המסע המוזיקלי שלך?</h2>
            <p>הצטרף לאלפי אמנים ומאזינים שכבר חלק מהקהילה שלנו</p>

            <div className="cta-stats-mini">
              <div className="mini-stat">
                <strong>15K+</strong>
                <span>משתמשים פעילים</span>
              </div>
              <div className="mini-stat">
                <strong>250K+</strong>
                <span>השמעות חודשיות</span>
              </div>
              <div className="mini-stat">
                <strong>4.9★</strong>
                <span>דירוג ממוצע</span>
              </div>
            </div>

            <div className="cta-buttons-final">
              <motion.button
                className="cta-button primary large"
                onClick={() => navigate(authState ? "/mySongs" : "/register")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={24} />
                <span>{authState ? "התחל ליצור" : "הצטרף חינם"}</span>
                <ArrowRight size={20} />
                <div className="button-glow"></div>
              </motion.button>

              <motion.button
                className="cta-button secondary large"
                onClick={() => navigate("/musicLibrary/songList")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Headphones size={24} />
                <span>חקור מוזיקה</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage
