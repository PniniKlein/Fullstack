"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { StoreType } from "../store/store"
import { logOut } from "../store/userSlice"
import { resetSong } from "../store/songSlice"
import { Avatar, Tooltip, Menu, MenuItem, Divider } from "@mui/material"
import {Info, Home, Music, Settings, LogIn, MenuIcon, ChevronRight, LogOut, Edit, Library, Users } from "lucide-react"
import { useIsMobile } from "../hooks/use-mobile"
import MicrophoneIcon from "./icons/MicrophoneIcon"
import "../css/MainSidebar.css"

interface MainSidebarProps {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}

const MainSidebar = ({ expanded, setExpanded }: MainSidebarProps) => {
  const authState = useSelector((store: StoreType) => store.user.authState)
  const user = useSelector((store: StoreType) => store.user.user)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isMobile = useIsMobile()

  const [activeItem, setActiveItem] = useState<string>("/")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const [menuItemsWithIndex, setMenuItemsWithIndex] = useState<any[]>([])

  useEffect(() => {
    setActiveItem(location.pathname)
  }, [location])

  useEffect(() => {
    if (isMobile) {
      setExpanded(false)
    }
  }, [isMobile, setExpanded])

  const handleLogout = () => {
    dispatch(logOut())
    dispatch(resetSong())
    sessionStorage.removeItem("songPlayer")
    navigate("/login")
    setUserMenuAnchor(null)
  }

  const handleProfileUpdate = () => {
    navigate("/updateUser")
    setUserMenuAnchor(null)
    if (isMobile) setMobileOpen(false)
  }

  const menuItems = [
    { label: "דף הבית", to: "/", icon: <Home size={22} /> },
    { label: "אודות", to: "/about", icon: <Info size={22} /> },
    { label: "ספריית מוזיקה", to: "/musicLibrary/songList", icon: <Library size={22} /> },
    { label: "אמנים", to: "/musicLibrary/artistList", icon: <Users size={22} /> },
  ]

  if (authState) {
    menuItems.push({ label: "אזור אישי", to: "/mySongs", icon: <Music size={22} /> })
  }
  useEffect(() => {
    // Add index for animation delay
    setMenuItemsWithIndex(menuItems.map((item, index) => ({ ...item, index })))
  }, [authState])

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setExpanded(!expanded)
    }
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  return (
    <>
      <button className="mobile-menu-button" onClick={toggleSidebar}>
        <MenuIcon size={24} />
      </button>

      <aside className={`main-sidebar ${expanded ? "expanded" : "collapsed"} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-glow"></div>
            {expanded && <h1 className="sidebar-logo-text">SingSong</h1>}
            <div className="microphone-container">
              <MicrophoneIcon />
            </div>
          </div>

          {expanded && (
            <div className="section-divider">
              <div className="divider-line"></div>
              <div className="divider-space"></div>
              <h2 className="sidebar-subtitle">מוזיקה</h2>
              <div className="divider-space"></div>
              <div className="divider-line"></div>
            </div>
          )}

          <button className="toggle-button" onClick={() => setExpanded(!expanded)}>
            <ChevronRight size={18} className={expanded ? "rotate-180" : ""} />
          </button>
        </div>

        <div className="sidebar-content">
          <div className="sidecar-gradient-wrapper">
          <div className="sidebar-gradient-circle circle-sidebar-1"></div>
          {/* <div className="sidebar-gradient-circle circle-sidebar-2"></div> */}
          </div>

          <nav className="sidebar-nav">
            {menuItemsWithIndex.map((item) => (
              <Tooltip
                key={item.to}
                title={!expanded ? item.label : ""}
                placement="left"
                arrow
                disableHoverListener={expanded}
              >
                <Link
                  to={item.to}
                  className={`nav-item ${activeItem === item.to ? "active" : ""}`}
                  onClick={() => {
                    setActiveItem(item.to)
                    if (isMobile) setMobileOpen(false)
                  }}
                  style={{ "--index": item.index } as React.CSSProperties}
                >
                  <div className="nav-item-content">
                    <span className="nav-icon">{item.icon}</span>
                    {expanded && <span className="nav-label">{item.label}</span>}
                  </div>
                  {activeItem === item.to && <div className="active-indicator"></div>}
                </Link>
              </Tooltip>
            ))}
          </nav>

          <div className="sound-waves-sidebar">
            <div className="wave-sidebar wave-sidebar-1"></div>
            <div className="wave-sidebar wave-sidebar-2"></div>
            <div className="wave-sidebar wave-sidebar-3"></div>
            <div className="wave-sidebar wave-sidebar-4"></div>
          </div>
        </div>

        <div className="sidebar-footer">
          {!authState ? (
            <Link
              to="/login"
              className="login-button"
              onClick={() => {
                if (isMobile) setMobileOpen(false)
              }}
            >
              <span className="login-icon">
                <LogIn size={20} />
              </span>
              {expanded && <span className="login-text">התחברות</span>}
            </Link>
          ) : (
            <>
              <div className={`user-profile${expanded?"-expanded":""}`} onClick={handleUserMenuOpen} aria-controls="user-menu" aria-haspopup="true">
                <Avatar src={user?.pathProfile || ""} alt={user?.userName} className={`user-avatar-${expanded ? "expanded" : ""}`}>
                  {!user?.pathProfile && user?.userName ? user.userName[0] : ""}
                </Avatar>
                {expanded && (
                  <div className="user-info">
                    <span className="user-name">{user?.userName || "משתמש"}</span>
                  </div>
                )}
                {expanded && <ChevronRight size={16} className="user-menu-arrow rotate-90" />}
              </div>

              <Menu
                id="user-menu"
                anchorEl={userMenuAnchor}
                keepMounted
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                className="user-dropdown-menu"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
              >
                <MenuItem onClick={handleProfileUpdate} className="user-menu-item">
                  <Edit size={18} className="menu-item-icon" />
                  <span>עדכון פרופיל</span>
                </MenuItem>
                <Divider className="menu-divider" />
                <MenuItem onClick={handleLogout} className="user-menu-item logout-item">
                  <LogOut size={18} className="menu-item-icon" />
                  <span>התנתקות</span>
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

export default MainSidebar
