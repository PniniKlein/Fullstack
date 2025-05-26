"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Music, Headphones, Users, Star, Sparkles, Play, Heart, TrendingUp, Award } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import NewSongs from "./NewSongs"
import About from "./About"
import "../css/Home.css"

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [stats, setStats] = useState({ songs: 0, artists: 0, plays: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9])
  const navigate = useNavigate()
  const authState = useSelector((state: StoreType) => state.user.authState)

  const heroSlides = [
    {
      title: "גלה מוזיקה חדשה",
      description: "פלטפורמה מוזיקלית שמחברת בין יוצרים למאזינים ברחבי העולם",
      gradient: "linear-gradient(135deg, #d59039, #f7c26b)",
      icon: <Music size={60} />,
    },
    {
      title: "שתף את המוזיקה שלך",
      description: "העלה שירים, קבל משוב וצור קהילה של מעריצים",
      gradient: "linear-gradient(135deg, #ff6b6b, #ffa726)",
      icon: <Headphones size={60} />,
    },
    {
      title: "הצטרף לקהילה",
      description: "חבר עם אמנים אחרים, שתף חוויות ולמד מהטובים ביותר",
      gradient: "linear-gradient(135deg, #667eea, #764ba2)",
      icon: <Users size={60} />,
    },
  ]

  const features = [
    {
      icon: <Music size={32} />,
      title: "ספריית מוזיקה ענקית",
      description: "אלפי שירים מכל הז'אנרים",
      color: "#d59039",
    },
    {
      icon: <Users size={32} />,
      title: "קהילת יוצרים",
      description: "התחבר עם אמנים מכל העולם",
      color: "#ff6b6b",
    },
    {
      icon: <Star size={32} />,
      title: "איכות גבוהה",
      description: "סטרימינג באיכות מקצועית",
      color: "#667eea",
    },
    {
      icon: <Heart size={32} />,
      title: "פלייליסטים אישיים",
      description: "צור ושתף פלייליסטים",
      color: "#ff9800",
    },
  ]

  const testimonials = [
    {
      name: "יוסי כהן",
      role: "מוזיקאי",
      content: "SingSong שינה לי את החיים! מצאתי כאן קהל נאמן ואמנים מדהימים לשיתוף פעולה.",
      avatar: "יכ",
      rating: 5,
    },
    {
      name: "מיכל לוי",
      role: "זמרת",
      content: "הפלטפורמה הכי טובה להעלאת מוזיקה. הממשק פשוט והקהילה תומכת ומעודדת.",
      avatar: "מל",
      rating: 5,
    },
    {
      name: "דני אברהם",
      role: "מפיק מוזיקלי",
      content: "מצאתי כאן כישרונות חדשים ומדהימים. המקום המושלם לגלות מוזיקה איכותית.",
      avatar: "דא",
      rating: 4,
    },
  ]

  useEffect(() => {
    setIsLoaded(true)

    // Animate stats
    const animateStats = () => {
      const targetStats = { songs: 15420, artists: 2847, plays: 892340 }
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setStats({
          songs: Math.floor(targetStats.songs * progress),
          artists: Math.floor(targetStats.artists * progress),
          plays: Math.floor(targetStats.plays * progress),
        })

        if (currentStep >= steps) {
          clearInterval(interval)
          setStats(targetStats)
        }
      }, stepDuration)
    }

    const timer = setTimeout(animateStats, 1000)

    // Auto-rotate slides
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearInterval(slideInterval)
    }
  }, [heroSlides.length])

  const goTo = (path: string) => {
    if (path.startsWith("#")) {
      const element = document.querySelector(path)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      if (!authState && path !== "/login" && path !== "/register") {
        return navigate("/login")
      }
      navigate(path)
    }
  }

  return (
    <div className="home-page-modern">
        <div className="floating-music-elements">
        <div className="music-note note-1">♪</div>
        <div className="music-note note-2">♫</div>
        <div className="music-note note-3">♬</div>
        <div className="music-note note-4">♩</div>
        <div className="music-note note-5">♭</div>
        <div className="music-note note-6">♯</div>
        <div className="music-note note-7">🎵</div>
        <div className="music-note note-8">🎶</div>
      </div>

      <section className="hero-section-modern">
        <div className="hero-background-effects">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <motion.div
          className="hero-content-modern"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          style={{ opacity, scale }}
          ref={heroRef}
        >
          <motion.div
            className="hero-logo-section"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="logo-glow-effect"></div>
            <div className="hero-logo">
              <Music size={80} className="logo-icon" />
              <h1 className="logo-text">SingSong</h1>
            </div>
            <p className="hero-subtitle">המקום שלך למוזיקה</p>
          </motion.div>

          <div className="hero-slider-modern">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="slide-content-modern"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="slide-icon" style={{ background: heroSlides[currentSlide].gradient }}>
                  {heroSlides[currentSlide].icon}
                </div>
                <h2 className="slide-title">{heroSlides[currentSlide].title}</h2>
                <p className="slide-description">{heroSlides[currentSlide].description}</p>
              </motion.div>
            </AnimatePresence>

            <div className="slider-dots">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="stat-item">
              <div className="stat-number">{stats.songs.toLocaleString()}</div>
              <div className="stat-label">שירים</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{stats.artists.toLocaleString()}</div>
              <div className="stat-label">אמנים</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{stats.plays.toLocaleString()}</div>
              <div className="stat-label">השמעות</div>
            </div>
          </motion.div>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {!authState ? (
              <>
                <button className="primary-action-btn" onClick={() => goTo("/register")}>
                  <Sparkles size={20} />
                  <span>הצטרף עכשיו</span>
                </button>
                <button className="secondary-action-btn" onClick={() => goTo("/login")}>
                  <span>התחבר</span>
                </button>
              </>
            ) : (
              <>
                <button className="primary-action-btn" onClick={() => goTo("/mySongs")}>
                  <Music size={20} />
                  <span>השירים שלי</span>
                </button>
                <button className="secondary-action-btn" onClick={() => goTo("/musicLibrary/songList")}>
                  <span>גלה מוזיקה</span>
                </button>
              </>
            )}
          </motion.div>

          <motion.div
            className="scroll-indicator-modern"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          >
            <span>גלול למטה</span>
            <div className="scroll-arrow">↓</div>
          </motion.div>
        </motion.div>
      </section>

   
      <section className="features-section-modern">
        <div className="section-header-modern">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            למה SingSong?
          </motion.h2>
          <motion.div
            className="section-divider-modern"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="divider-line"></div>
            <Music size={24} />
            <div className="divider-line"></div>
          </motion.div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="new-songs-section">
        <div className="section-header-modern">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            השירים החדשים ביותר
          </motion.h2>
          <motion.div
            className="section-divider-modern"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="divider-line"></div>
            <TrendingUp size={24} />
            <div className="divider-line"></div>
          </motion.div>
        </div>

        {/* <NewSongs /> */}

        <motion.div
          className="section-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <button className="cta-button" onClick={() => goTo("/musicLibrary/songList")}>
            <Play size={20} />
            <span>גלה עוד שירים</span>
          </button>
        </motion.div>
      </section>

      <section className="how-it-works-modern">
        <div className="section-header-modern">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            איך זה עובד?
          </motion.h2>
          <motion.div
            className="section-divider-modern"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="divider-line"></div>
            <Headphones size={24} />
            <div className="divider-line"></div>
          </motion.div>
        </div>

        <div className="steps-container-modern">
          <motion.div
            className="step-modern"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>הירשם לפלטפורמה</h3>
              <p>צור חשבון חינם והצטרף לקהילת המוזיקה הגדולה ביותר</p>
            </div>
          </motion.div>

          <div className="step-connector-modern"></div>

          <motion.div
            className="step-modern"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>העלה או גלה מוזיקה</h3>
              <p>שתף את היצירות שלך או גלה שירים חדשים מאמנים מכל העולם</p>
            </div>
          </motion.div>

          <div className="step-connector-modern"></div>

          <motion.div
            className="step-modern"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>התחבר עם הקהילה</h3>
              <p>עקוב אחרי אמנים, הגב על שירים וצור קשרים מוזיקליים חדשים</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="testimonials-modern">
        <div className="section-header-modern">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            מה המשתמשים אומרים
          </motion.h2>
          <motion.div
            className="section-divider-modern"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="divider-line"></div>
            <Award size={24} />
            <div className="divider-line"></div>
          </motion.div>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="testimonial-content">
                <p>"{testimonial.content}"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.role}</span>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < testimonial.rating ? "star-filled" : "star-empty"} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="about" className="about-section-modern">
        <About />
      </section>

      <section className="final-cta-modern">
        <motion.div
          className="cta-content-modern"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>מוכן להתחיל את המסע המוזיקלי שלך?</h2>
          <p>הצטרף לאלפי אמנים ומאזינים שכבר חלק מהקהילה שלנו</p>
          <div className="cta-buttons">
            {!authState ? (
              <>
                <button className="primary-cta-btn" onClick={() => goTo("/register")}>
                  <Music size={24} />
                  <span>הצטרף עכשיו</span>
                </button>
                <button className="secondary-cta-btn" onClick={() => goTo("/login")}>
                  <span>התחבר</span>
                </button>
              </>
            ) : (
              <button className="primary-cta-btn" onClick={() => goTo("/mySongs")}>
                <Music size={24} />
                <span>התחל ליצור</span>
              </button>
            )}
          </div>
        </motion.div>
      </section>

      <footer className="footer-modern">
        <div className="footer-content-modern">
          <div className="footer-logo-modern">
            <Music size={36} />
            <h3>SingSong</h3>
          </div>
          <p>© 2025 SingSong. כל הזכויות שמורות.</p>
          <div className="footer-links-modern">
            <a href="#" onClick={() => goTo("#about")}>
              אודות
            </a>
            <a href="#">תנאי שימוש</a>
            <a href="#">מדיניות פרטיות</a>
            <a href="#">צור קשר</a>
          </div>
        </div>
      </footer> 
    </div>
  )
}

export default Home
