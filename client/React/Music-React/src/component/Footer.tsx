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
  // const [showScrollTop, setShowScrollTop] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
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
