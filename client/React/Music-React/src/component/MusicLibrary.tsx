"use client"

import type React from "react"

import { useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { Music, Users } from "lucide-react"
import "../css/MusicLibrary.css"

const MusicLibrary = () => {
  const location = useLocation()
  const [animateTitle] = useState(true)

  return (
    <div className="music-library-container">
      <div className="music-library-header">
        <div className="music-library-title-container">
          <h1 className={`music-library-title ${animateTitle ? "animate-gradient" : ""}`}>מוזיקה</h1>
        </div>

        <div className="music-library-nav">
          <NavLink to="/musicLibrary/songList" active={location.pathname.includes("songList")}>
            <Music size={20} className="nav-icon" />
            <span>שירים</span>
          </NavLink>
          <NavLink to="/musicLibrary/artistList" active={location.pathname.includes("artistList")}>
            <Users size={20} className="nav-icon" />
            <span>אמנים</span>
          </NavLink>
        </div>
      </div>

      <div className="music-library-content">
  <div className="gradient-wrapper">
    <div className="music-library-gradient-circle circle-1"></div>
    <div className="music-library-gradient-circle circle-2"></div>
  </div>
  <Outlet />
</div>
    </div>
  )
}

const NavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
  <Link to={to} className={`nav-link ${active ? "active" : ""}`}>
    {children}
    {active && <div className="nav-link-indicator"></div>}
  </Link>
)

export default MusicLibrary
// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { Link, Outlet, useLocation } from "react-router-dom"
// import { Music, Users, Sparkles } from "lucide-react"
// import "../css/MusicLibrary.css"

// const MusicLibrary = () => {
//   const location = useLocation()
//   const [animateTitle, setAnimateTitle] = useState(true)
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   return (
//     <div className="music-library-container">
//       {/* Animated Background */}
//       <div className="music-library-background">
//         <div className="music-library-gradient-circle circle-1"></div>
//         <div className="music-library-gradient-circle circle-2"></div>
//         <div className="music-library-gradient-circle circle-3"></div>

//         {/* Floating Musical Notes */}
//         <div className="floating-notes">
//           <div className="note note-1">♪</div>
//           <div className="note note-2">♫</div>
//           <div className="note note-3">♪</div>
//           <div className="note note-4">♫</div>
//         </div>
//       </div>

//       <div className={`music-library-header ${mounted ? "animate-in" : ""}`}>
//         <div className="music-library-title-container">
//           <div className="title-glow"></div>
//           <h1 className={`music-library-title ${animateTitle ? "animate-gradient" : ""}`}>
//             <Sparkles className="title-icon" size={48} />
//             ספריית מוזיקה
//           </h1>
//           <p className="title-subtitle">גלה מוזיקה חדשה ואמנים מוכשרים</p>
//         </div>

//         <div className="music-library-nav">
//           <NavLink to="/musicLibrary/songList" active={location.pathname.includes("songList")}>
//             <Music size={20} className="nav-icon" />
//             <span>שירים</span>
//             <div className="nav-glow"></div>
//           </NavLink>
//           <NavLink to="/musicLibrary/artistList" active={location.pathname.includes("artistList")}>
//             <Users size={20} className="nav-icon" />
//             <span>אמנים</span>
//             <div className="nav-glow"></div>
//           </NavLink>
//         </div>
//       </div>

//       <div className="music-library-content">
//         <Outlet />
//       </div>
//     </div>
//   )
// }

// const NavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
//   <Link to={to} className={`nav-link ${active ? "active" : ""}`}>
//     <div className="nav-link-content">{children}</div>
//     {active && <div className="nav-link-indicator"></div>}
//     <div className="nav-link-ripple"></div>
//   </Link>
// )

// export default MusicLibrary
