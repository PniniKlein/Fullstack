"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Music,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Heart,
  ArrowUp,
  Send,
  Users,
  Headphones,
  Star,
  Shield,
  Award,
  Globe,
} from "lucide-react"
import "../css/Footer.css"

const Footer = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [showScrollTop, setShowScrollTop] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  const footerLinks = {
    platform: [
      { label: "גלה מוזיקה", path: "/musicLibrary/songList" },
      { label: "אמנים", path: "/musicLibrary/artistList" },
      { label: "אזור אישי", path: "/mySongs" },
      { label: "העלה שיר", path: "/mySongs" },
    ],
    company: [
      { label: "אודות", path: "/about" },
      { label: "צור קשר", path: "/contact" },
      { label: "קריירה", path: "/careers" },
      { label: "בלוג", path: "/blog" },
    ],
    support: [
      { label: "מרכז עזרה", path: "/help" },
      { label: "שאלות נפוצות", path: "/faq" },
      { label: "דווח על בעיה", path: "/report" },
      { label: "קהילה", path: "/community" },
    ],
    legal: [
      { label: "תנאי שימוש", path: "/terms" },
      { label: "מדיניות פרטיות", path: "/privacy" },
      { label: "זכויות יוצרים", path: "/copyright" },
      { label: "רישיונות", path: "/licenses" },
    ],
  }

  const socialLinks = [
    { icon: <Facebook size={20} />, url: "#", label: "Facebook", color: "#1877f2" },
    { icon: <Instagram size={20} />, url: "#", label: "Instagram", color: "#e4405f" },
    { icon: <Twitter size={20} />, url: "#", label: "Twitter", color: "#1da1f2" },
    { icon: <Youtube size={20} />, url: "#", label: "YouTube", color: "#ff0000" },
  ]

  const stats = [
    { icon: <Users size={16} />, number: "15K+", label: "משתמשים" },
    { icon: <Music size={16} />, number: "8K+", label: "שירים" },
    { icon: <Headphones size={16} />, number: "250K+", label: "השמעות" },
    { icon: <Star size={16} />, number: "4.9", label: "דירוג" },
  ]

  return (
    <footer className="footer-container">
      {/* Background Effects */}
      <div className="footer-background">
        <div className="footer-gradient-orb orb-1"></div>
        <div className="footer-gradient-orb orb-2"></div>
        <div className="footer-gradient-orb orb-3"></div>

        {/* Floating Musical Notes */}
        <div className="footer-floating-notes">
          <div className="footer-note note-1">♪</div>
          <div className="footer-note note-2">♫</div>
          <div className="footer-note note-3">♬</div>
          <div className="footer-note note-4">🎵</div>
          <div className="footer-note note-5">♪</div>
          <div className="footer-note note-6">♫</div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="newsletter-container">
          <motion.div
            className="newsletter-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="newsletter-text">
              <h3>הישאר מעודכן</h3>
              <p>קבל עדכונים על שירים חדשים, אמנים מעניינים ותכונות חדשות</p>
            </div>

            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="newsletter-input-wrapper">
                <Mail size={20} className="newsletter-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="הכנס את האימייל שלך"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-submit">
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="footer-stats"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="footer-stat">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-content">
          {/* Brand Section */}
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="brand-logo">
              <div className="logo-icon">
                <Music size={32} />
                <div className="logo-glow"></div>
              </div>
              <h2>SingSong</h2>
            </div>

            <p className="brand-description">
              הפלטפורמה המוזיקלית המובילה בישראל. מקום בו אמנים ומאזינים נפגשים, חולקים ומגלים מוזיקה מקורית ואיכותית.
            </p>

            <div className="brand-features">
              <div className="brand-feature">
                <Shield size={16} />
                <span>בטוח ומאובטח</span>
              </div>
              <div className="brand-feature">
                <Award size={16} />
                <span>איכות גבוהה</span>
              </div>
              <div className="brand-feature">
                <Globe size={16} />
                <span>קהילה גלובלית</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-links">
              <h4>עקוב אחרינו</h4>
              <div className="social-icons">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    className="social-link"
                    style={{ "--social-color": social.color } as React.CSSProperties}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    {social.icon}
                    <div className="social-glow"></div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Links Sections */}
          <div className="footer-links-grid">
            <motion.div
              className="footer-links-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4>הפלטפורמה</h4>
              <ul>
                {footerLinks.platform.map((link, index) => (
                  <li key={index}>
                    <button onClick={() => navigate(link.path)} className="footer-link">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="footer-links-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4>החברה</h4>
              <ul>
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <button onClick={() => navigate(link.path)} className="footer-link">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="footer-links-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4>תמיכה</h4>
              <ul>
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <button onClick={() => navigate(link.path)} className="footer-link">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="footer-links-section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4>משפטי</h4>
              <ul>
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <button onClick={() => navigate(link.path)} className="footer-link">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <motion.div
            className="footer-contact"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h4>צור קשר</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>support@singsong.co.il</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>03-1234567</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>תל אביב, ישראל</span>
              </div>
            </div>

            <div className="contact-hours">
              <h5>שעות פעילות</h5>
              <p>ראשון - חמישי: 9:00 - 18:00</p>
              <p>שישי: 9:00 - 14:00</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            <span>© 2024 SingSong. כל הזכויות שמורות.</span>
            <span className="made-with">
              נוצר עם <Heart size={14} fill="#d59039" color="#d59039" /> בישראל
            </span>
          </div>

          <div className="footer-bottom-links">
            <button onClick={() => navigate("/terms")} className="bottom-link">
              תנאי שימוש
            </button>
            <button onClick={() => navigate("/privacy")} className="bottom-link">
              פרטיות
            </button>
            <button onClick={() => navigate("/cookies")} className="bottom-link">
              עוגיות
            </button>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        className="scroll-to-top"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp size={20} />
      </motion.button>
    </footer>
  )
}

export default Footer
