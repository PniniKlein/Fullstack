"use client"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Heart,
  ArrowUp
} from "lucide-react"
import "../css/Footer.css"

const Footer = () => {
  const navigate = useNavigate()
  // const [showScrollTop, setShowScrollTop] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="footer-container">
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            <span>© 2025 SingSong. כל הזכויות שמורות.</span>
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
