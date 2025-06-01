"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Play,
  Pause,
  Heart,
  Share2,
  Music,
  Users,
  Headphones,
  Zap,
  Crown,
  FlameIcon as Fire,
  Orbit,
  Atom,
  Rocket,
  Globe,
  Eye,
  Lightbulb,
  Badge,
} from "lucide-react"
import "./css/Home.css"
import { Button, Card, CardContent } from "@mui/material"

interface Song {
  id: string
  title: string
  artist: string
  duration: string
  plays: number
  likes: number
  coverUrl: string
  isPlaying?: boolean
  genre: string
  releaseDate: string
  waveform: number[]
}

interface Artist {
  id: string
  name: string
  followers: number
  avatar: string
  isVerified: boolean
  genre: string
  level: number
}

const Home: React.FC = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set())
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioVisualizerRef = useRef<HTMLCanvasElement>(null)

  const [songs] = useState<Song[]>([
    {
      id: "1",
      title: "Cosmic Odyssey",
      artist: "Stellar Waves",
      duration: "4:23",
      plays: 8472639,
      likes: 234567,
      coverUrl: "/placeholder.svg?height=400&width=400",
      genre: "Synthwave",
      releaseDate: "2024-03-15",
      waveform: [0.2, 0.8, 0.6, 0.9, 0.4, 0.7, 0.3, 0.8, 0.5, 0.9, 0.2, 0.6],
    },
    {
      id: "2",
      title: "Neon Dreams",
      artist: "CyberPunk",
      duration: "3:47",
      plays: 6293847,
      likes: 189234,
      coverUrl: "/placeholder.svg?height=400&width=400",
      genre: "Electronic",
      releaseDate: "2024-03-10",
      waveform: [0.4, 0.6, 0.8, 0.5, 0.9, 0.3, 0.7, 0.4, 0.8, 0.6, 0.5, 0.9],
    },
    {
      id: "3",
      title: "Digital Horizon",
      artist: "Future Bass",
      duration: "5:12",
      plays: 9847293,
      likes: 345678,
      coverUrl: "/placeholder.svg?height=400&width=400",
      genre: "Future Bass",
      releaseDate: "2024-03-08",
      waveform: [0.7, 0.4, 0.9, 0.2, 0.8, 0.5, 0.6, 0.9, 0.3, 0.7, 0.4, 0.8],
    },
  ])

  const [artists] = useState<Artist[]>([
    {
      id: "1",
      name: "Stellar Waves",
      followers: 2847293,
      avatar: "/placeholder.svg?height=150&width=150",
      isVerified: true,
      genre: "Synthwave",
      level: 95,
    },
    {
      id: "2",
      name: "CyberPunk",
      followers: 1923847,
      avatar: "/placeholder.svg?height=150&width=150",
      isVerified: true,
      genre: "Electronic",
      level: 88,
    },
    {
      id: "3",
      name: "Future Bass",
      followers: 3492847,
      avatar: "/placeholder.svg?height=150&width=150",
      isVerified: true,
      genre: "Future Bass",
      level: 92,
    },
  ])

  const stats = {
    totalSongs: 847293,
    totalArtists: 23847,
    totalPlays: 847293847,
    totalUsers: 2847293,
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      opacity: number
    }> = []

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: ["#00ffff", "#ff00ff", "#ffff00", "#ff0080"][Math.floor(Math.random() * 4)],
        opacity: Math.random() * 0.8 + 0.2,
      })
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
        ctx.shadowBlur = 20
        ctx.shadowColor = particle.color
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  const togglePlay = (songId: string) => {
    setCurrentlyPlaying(currentlyPlaying === songId ? null : songId)
  }

  const toggleLike = (songId: string) => {
    setLikedSongs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(songId)) {
        newSet.delete(songId)
      } else {
        newSet.add(songId)
      }
      return newSet
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B"
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  return (
    <div className={`futuristic-home ${isLoaded ? "loaded" : ""}`}>
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* Cursor Follower */}
      <div
        className="cursor-follower"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />

      {/* Loading Screen */}
      {!isLoaded && (
        <div className="quantum-loader">
          <div className="quantum-ring">
            <div className="quantum-particle"></div>
            <div className="quantum-particle"></div>
            <div className="quantum-particle"></div>
          </div>
          <div className="loading-text">
            <span>I</span>
            <span>N</span>
            <span>I</span>
            <span>T</span>
            <span>I</span>
            <span>A</span>
            <span>L</span>
            <span>I</span>
            <span>Z</span>
            <span>I</span>
            <span>N</span>
            <span>G</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Hero Section */}
        <section className="hero-quantum">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="quantum-badge">
                <Atom className="quantum-icon" />
                <span>QUANTUM MUSIC EXPERIENCE</span>
                <div className="badge-glow"></div>
              </div>

              <h1 className="quantum-title">
                <span className="title-line">ENTER THE</span>
                <span className="title-main">SOUND</span>
                <span className="title-dimension">DIMENSION</span>
                <div className="title-hologram"></div>
              </h1>

              <p className="quantum-description">
                Experience music like never before in our immersive digital universe. Where sound meets technology and
                creativity knows no bounds.
              </p>

              <div className="quantum-actions">
                <Button className="quantum-btn primary">
                  <Rocket className="btn-icon" />
                  <span>LAUNCH EXPERIENCE</span>
                  <div className="btn-energy"></div>
                </Button>
                <Button className="quantum-btn secondary">
                  <Globe className="btn-icon" />
                  <span>EXPLORE UNIVERSE</span>
                </Button>
              </div>

              <div className="quantum-stats-mini">
                <div className="stat-mini">
                  <div className="stat-value">{formatNumber(stats.totalUsers)}</div>
                  <div className="stat-label">EXPLORERS</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-value">{formatNumber(stats.totalSongs)}</div>
                  <div className="stat-label">TRACKS</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-value">{formatNumber(stats.totalPlays)}</div>
                  <div className="stat-label">PLAYS</div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="quantum-sphere">
                <div className="sphere-core">
                  <Music className="core-icon" />
                </div>
                <div className="sphere-ring ring-1"></div>
                <div className="sphere-ring ring-2"></div>
                <div className="sphere-ring ring-3"></div>
                <div className="energy-particles">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={`energy-particle particle-${i}`}></div>
                  ))}
                </div>
              </div>

              <div className="hologram-display">
                <div className="hologram-content">
                  <div className="waveform-display">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                  <div className="frequency-text">FREQUENCY: 440Hz</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quantum Stats */}
        <section className="quantum-stats">
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon-container">
                <Music className="stat-icon" />
                <div className="icon-orbit"></div>
              </div>
              <div className="stat-data">
                <div className="stat-number">{formatNumber(stats.totalSongs)}</div>
                <div className="stat-label">QUANTUM TRACKS</div>
                <div className="stat-progress">
                  <div className="progress-bar" style={{ width: "85%" }}></div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-container">
                <Users className="stat-icon" />
                <div className="icon-orbit"></div>
              </div>
              <div className="stat-data">
                <div className="stat-number">{formatNumber(stats.totalArtists)}</div>
                <div className="stat-label">DIGITAL ARTISTS</div>
                <div className="stat-progress">
                  <div className="progress-bar" style={{ width: "92%" }}></div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-container">
                <Headphones className="stat-icon" />
                <div className="icon-orbit"></div>
              </div>
              <div className="stat-data">
                <div className="stat-number">{formatNumber(stats.totalPlays)}</div>
                <div className="stat-label">NEURAL CONNECTIONS</div>
                <div className="stat-progress">
                  <div className="progress-bar" style={{ width: "78%" }}></div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-container">
                <Orbit className="stat-icon" />
                <div className="icon-orbit"></div>
              </div>
              <div className="stat-data">
                <div className="stat-number">{formatNumber(stats.totalUsers)}</div>
                <div className="stat-label">ACTIVE MINDS</div>
                <div className="stat-progress">
                  <div className="progress-bar" style={{ width: "96%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Tracks */}
        <section className="trending-quantum">
          <div className="section-header-quantum">
            <div className="section-title-container">
              <Fire className="section-icon" />
              <h2 className="section-title">TRENDING IN THE MATRIX</h2>
              <div className="title-underline"></div>
            </div>
            <Button className="quantum-btn-small">
              <Eye className="btn-icon" />
              VIEW ALL
            </Button>
          </div>

          <div className="tracks-grid">
            {songs.map((song, index) => (
              <Card key={song.id} className="track-card-quantum" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="track-content">
                  <div className="track-rank">#{index + 1}</div>

                  <div className="track-cover-container">
                    <img src={song.coverUrl || "/placeholder.svg"} alt={song.title} className="track-cover" />
                    <div className="cover-overlay">
                      <Button className="play-btn-quantum" onClick={() => togglePlay(song.id)}>
                        {currentlyPlaying === song.id ? <Pause /> : <Play />}
                      </Button>
                    </div>
                    <div className="holographic-border"></div>
                  </div>

                  <div className="track-info">
                    <h3 className="track-title">{song.title}</h3>
                    <p className="track-artist">{song.artist}</p>

                    <div className="track-waveform">
                      {song.waveform.map((height, i) => (
                        <div
                          key={i}
                          className="waveform-bar"
                          style={{
                            height: `${height * 100}%`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        ></div>
                      ))}
                    </div>

                    <div className="track-meta">
                      <Badge className="genre-badge-quantum">{song.genre}</Badge>
                      <span className="track-duration">{song.duration}</span>
                    </div>

                    <div className="track-stats">
                      <div className="stat-item">
                        <Headphones className="stat-icon-small" />
                        <span>{formatNumber(song.plays)}</span>
                      </div>
                      <div className="track-actions">
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`action-btn ${likedSongs.has(song.id) ? "liked" : ""}`}
                          onClick={() => toggleLike(song.id)}
                        >
                          <Heart className="action-icon" />
                          <span>{formatNumber(song.likes)}</span>
                        </Button>
                        <Button size="sm" variant="ghost" className="action-btn">
                          <Share2 className="action-icon" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Artists */}
        <section className="artists-quantum">
          <div className="section-header-quantum">
            <div className="section-title-container">
              <Crown className="section-icon" />
              <h2 className="section-title">QUANTUM CREATORS</h2>
              <div className="title-underline"></div>
            </div>
          </div>

          <div className="artists-grid">
            {artists.map((artist, index) => (
              <Card key={artist.id} className="artist-card-quantum" style={{ animationDelay: `${index * 0.15}s` }}>
                <CardContent className="artist-content">
                  <div className="artist-level">LVL {artist.level}</div>

                  <div className="artist-avatar-container">
                    <Avatar className="artist-avatar-quantum">
                      <AvatarImage src={artist.avatar || "/placeholder.svg"} alt={artist.name} />
                      <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="avatar-ring"></div>
                    <div className="avatar-glow"></div>
                    {artist.isVerified && (
                      <div className="verified-badge-quantum">
                        <Zap className="verified-icon" />
                      </div>
                    )}
                  </div>

                  <div className="artist-info">
                    <h3 className="artist-name">{artist.name}</h3>
                    <Badge className="artist-genre-badge">{artist.genre}</Badge>

                    <div className="artist-stats">
                      <div className="followers-count">
                        <Users className="followers-icon" />
                        <span>{formatNumber(artist.followers)}</span>
                      </div>

                      <div className="power-level">
                        <div className="power-bar">
                          <div className="power-fill" style={{ width: `${artist.level}%` }}></div>
                        </div>
                        <span className="power-text">POWER: {artist.level}%</span>
                      </div>
                    </div>

                    <Button className="follow-btn-quantum">
                      <Lightbulb className="btn-icon" />
                      CONNECT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
