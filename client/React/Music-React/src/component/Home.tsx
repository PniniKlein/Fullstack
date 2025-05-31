"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
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
  Eye,
  Verified,
  Star,
  Clock,
  FlameIcon as Fire,
  Zap,
  Crown,
  Share2,
  Download,
} from "lucide-react"
import { getAllPublic } from "../services/SongsService"
import { artistList } from "../services/UserService"
import type { Song } from "../model/Song"
import type { UserWithCountList } from "../model/userWithCountList"
import SongCard from "./SongCard"
// import { loadSong } from "../store/songSlice"
import "../css/Home.css"

const Home: React.FC = () => {
  const navigate = useNavigate()
  // const dispatch = useDispatch<Dispatch>()
  const user = useSelector((state: StoreType) => state.user.user)
  const currentSong = useSelector((state: StoreType) => state.songPlayer.song)

  const [recentSongs, setRecentSongs] = useState<Song[]>([])
  const [topArtists, setTopArtists] = useState<UserWithCountList[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalArtists: 0,
    totalPlays: 0,
    activeUsers: 0,
  })

  useEffect(() => {
    loadRealData()
  }, [])

  const loadRealData = async () => {
    setLoading(true)
    try {
      // טעינת שירים אמיתיים
      const songsData = await getAllPublic()
      const sortedSongs = songsData
        .sort((a: Song, b: Song) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())
        .slice(0, 6)
      setRecentSongs(sortedSongs)

      // טעינת אמנים אמיתיים
      const artistsData = await artistList()
      const sortedArtists = artistsData
        .sort((a: UserWithCountList, b: UserWithCountList) => (b.countSongs || 0) - (a.countSongs || 0))
        .slice(0, 8)
      setTopArtists(sortedArtists)

      // חישוב סטטיסטיקות אמיתיות
      const totalPlays = songsData.reduce((sum: number, song: Song) => sum + (song.plays || 0), 0)
      setStats({
        totalSongs: songsData.length,
        totalArtists: artistsData.length,
        totalPlays: totalPlays,
        activeUsers: artistsData.filter((artist: UserWithCountList) => artist.countSongs > 0).length,
      })
    } catch (error) {
      console.error("שגיאה בטעינת נתונים:", error)
    } finally {
      setLoading(false)
    }
  }

  // const handlePlaySong = (song: Song) => {
  //   dispatch(loadSong(song))
  // }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner-large"></div>
        <p>טוען נתונים אמיתיים...</p>
      </div>
    )
  }

  return (
    <div className="home-container-real">
      {/* רקע */}
      <div className="home-background-real">
        <div className="home-gradient-orb-real home-gradient-orb-1"></div>
        <div className="home-gradient-orb-real home-gradient-orb-2"></div>
      </div>

      {/* סקציית גיבור */}
      <section className="home-hero-real">
        <div className="home-hero-content-real">
          <div className="home-hero-badge-real">
            <Sparkles size={20} />
            <span>פלטפורמת המוזיקה הישראלית שלך</span>
          </div>

          <h1 className="home-hero-title-real">
            גלה את המוזיקה
            <br />
            <span className="home-hero-highlight">הישראלית האמיתית</span>
          </h1>

          <p className="home-hero-description-real">
            {stats.totalSongs} שירים אמיתיים מ-{stats.totalArtists} אמנים ישראליים.
            <br />
            הצטרף לקהילה שכבר צברה {formatNumber(stats.totalPlays)} השמעות!
          </p>

          <div className="home-hero-buttons-real">
            <button className="home-btn-real home-btn-primary-real" onClick={() => navigate("/musicLibrary/songList")}>
              <Play size={20} />
              גלה שירים ({stats.totalSongs})
            </button>
            {user?.id ? (
              <button className="home-btn-real home-btn-secondary-real" onClick={() => navigate("/mySongs")}>
                <Upload size={20} />
                השירים שלי
              </button>
            ) : (
              <button className="home-btn-real home-btn-secondary-real" onClick={() => navigate("/register")}>
                <Users size={20} />
                הצטרף אלינו
              </button>
            )}
          </div>
        </div>

        {/* נגן אמיתי */}
        {currentSong && (
          <div className="home-current-player-real">
            <div className="home-player-header-real">
              <div className="home-player-title-real">
                <Music size={18} />
                <span>מנגן עכשיו</span>
              </div>
              <div className="home-live-badge-real">
                <div className="home-live-dot-real"></div>
                <span>LIVE</span>
              </div>
            </div>

            <div className="home-player-content-real">
              <div
                className="home-player-cover-real"
                style={{
                  backgroundImage: currentSong.pathPicture ? `url(${currentSong.pathPicture})` : "none",
                  backgroundColor: currentSong.pathPicture ? "transparent" : "#d59039",
                }}
              >
                {!currentSong.pathPicture && <Music size={32} color="white" />}
              </div>
              <div className="home-player-info-real">
                <h4>{currentSong.title}</h4>
                <p>{currentSong.gener || "כללי"}</p>
                <div className="home-player-stats-real">
                  <span>{currentSong.plays || 0} השמעות</span>
                  <span>נוצר: {formatDate(currentSong.create_at)}</span>
                </div>
              </div>
            </div>

            <div className="home-player-actions-real">
              <button className="home-player-action-real">
                <Heart size={16} />
                <span>אהבתי</span>
              </button>
              <button className="home-player-action-real">
                <Share2 size={16} />
                <span>שתף</span>
              </button>
              <button className="home-player-action-real">
                <Download size={16} />
                <span>הורד</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* סטטיסטיקות אמיתיות */}
      <section className="home-stats-real">
        <div className="home-stats-grid-real">
          <div className="home-stat-card-real">
            <div className="home-stat-icon-real">
              <Music size={24} />
            </div>
            <div className="home-stat-number-real">{stats.totalSongs}</div>
            <div className="home-stat-label-real">שירים ישראליים</div>
            <div className="home-stat-desc-real">מכל הז'אנרים</div>
          </div>
          <div className="home-stat-card-real">
            <div className="home-stat-icon-real">
              <Users size={24} />
            </div>
            <div className="home-stat-number-real">{stats.totalArtists}</div>
            <div className="home-stat-label-real">אמנים רשומים</div>
            <div className="home-stat-desc-real">יוצרים פעילים</div>
          </div>
          <div className="home-stat-card-real">
            <div className="home-stat-icon-real">
              <Headphones size={24} />
            </div>
            <div className="home-stat-number-real">{formatNumber(stats.totalPlays)}</div>
            <div className="home-stat-label-real">השמעות כולל</div>
            <div className="home-stat-desc-real">מאז ההקמה</div>
          </div>
          <div className="home-stat-card-real">
            <div className="home-stat-icon-real">
              <Fire size={24} />
            </div>
            <div className="home-stat-number-real">{stats.activeUsers}</div>
            <div className="home-stat-label-real">אמנים פעילים</div>
            <div className="home-stat-desc-real">עם שירים</div>
          </div>
        </div>
      </section>

      {/* שירים חדשים אמיתיים */}
      <section className="home-recent-songs-real">
        <div className="home-section-header-real">
          <div className="home-section-badge-real">
            <Clock size={16} />
            <span>שירים חדשים</span>
          </div>
          <h2 className="home-section-title-real">השירים החדשים ביותר</h2>
          <p className="home-section-subtitle-real">השירים שהועלו לאחרונה על ידי האמנים שלנו</p>
        </div>

        {recentSongs.length > 0 ? (
          <div className="home-songs-grid-real">
            {recentSongs.map((song, index) => (
              <div
                key={song.id}
                className="home-song-card-wrapper-real"
                style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
              >
                <SongCard song={song} showActions={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="home-empty-state-real">
            <Music size={64} />
            <h3>אין שירים עדיין</h3>
            <p>היה הראשון להעלות שיר!</p>
            <button className="home-btn-real home-btn-primary-real" onClick={() => navigate("/mySongs")}>
              <Upload size={20} />
              העלה שיר ראשון
            </button>
          </div>
        )}

        <div className="home-section-cta-real">
          <button className="home-btn-real home-btn-outline-real" onClick={() => navigate("/musicLibrary/songList")}>
            <Music size={20} />
            צפה בכל השירים ({stats.totalSongs})
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* אמנים מובילים אמיתיים */}
      <section className="home-top-artists-real">
        <div className="home-section-header-real">
          <div className="home-section-badge-real">
            <Star size={16} />
            <span>אמנים מובילים</span>
          </div>
          <h2 className="home-section-title-real">האמנים הפעילים ביותר</h2>
          <p className="home-section-subtitle-real">האמנים עם הכי הרבה שירים ועוקבים</p>
        </div>

        {topArtists.length > 0 ? (
          <div className="home-artists-grid-real">
            {topArtists.map((artist, index) => (
              <div
                key={artist.id}
                className="home-artist-card-real"
                style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
                onClick={() => navigate(`/artists/${artist.id}`)}
              >
                <div className="home-artist-image-real">
                  {artist.pathProfile ? (
                    <img src={artist.pathProfile || "/placeholder.svg"} alt={artist.userName} />
                  ) : (
                    <div className="home-artist-placeholder-real">
                      <Users size={40} />
                    </div>
                  )}
                </div>

                <div className="home-artist-info-real">
                  <div className="home-artist-name-real">
                    {artist.userName}
                    <Verified size={16} className="home-verified-icon-real" />
                  </div>
                  <div className="home-artist-stats-real">
                    <div className="home-artist-stat-real">
                      <Music size={14} />
                      <span>{artist.countSongs || 0} שירים</span>
                    </div>
                    <div className="home-artist-stat-real">
                      <Users size={14} />
                      <span>{50} עוקבים</span>
                    </div>
                  </div>
                </div>

                <div className="home-artist-overlay-real">
                  <button className="home-artist-play-btn-real">
                    <Play size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="home-empty-state-real">
            <Users size={64} />
            <h3>אין אמנים עדיין</h3>
            <p>היה הראשון להירשם כאמן!</p>
            <button className="home-btn-real home-btn-primary-real" onClick={() => navigate("/register")}>
              <Users size={20} />
              הירשם כאמן
            </button>
          </div>
        )}

        <div className="home-section-cta-real">
          <button className="home-btn-real home-btn-outline-real" onClick={() => navigate("/musicLibrary/artistList")}>
            <Users size={20} />
            צפה בכל האמנים ({stats.totalArtists})
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* תכונות הפלטפורמה */}
      <section className="home-features-real">
        <div className="home-section-header-real">
          <div className="home-section-badge-real">
            <Zap size={16} />
            <span>תכונות הפלטפורמה</span>
          </div>
          <h2 className="home-section-title-real">למה לבחור בנו?</h2>
          <p className="home-section-subtitle-real">הכלים והתכונות שיעזרו לך להצליח</p>
        </div>

        <div className="home-features-grid-real">
          <div className="home-feature-card-real">
            <div className="home-feature-icon-real">
              <Upload size={32} />
            </div>
            <h3>העלאה פשוטה</h3>
            <p>העלה שירים בקלות ובמהירות עם ממשק פשוט וידידותי</p>
          </div>
          <div className="home-feature-card-real">
            <div className="home-feature-icon-real">
              <TrendingUp size={32} />
            </div>
            <h3>מעקב אחר ביצועים</h3>
            <p>עקוב אחר מספר ההשמעות והפופולריות של השירים שלך</p>
          </div>
          <div className="home-feature-card-real">
            <div className="home-feature-icon-real">
              <Users size={32} />
            </div>
            <h3>קהילה ישראלית</h3>
            <p>התחבר עם אמנים ומאזינים ישראליים אחרים</p>
          </div>
          <div className="home-feature-card-real">
            <div className="home-feature-icon-real">
              <Share2 size={32} />
            </div>
            <h3>שיתוף קל</h3>
            <p>שתף את המוזיקה שלך בקלות ברשתות חברתיות ובמייל</p>
          </div>
        </div>
      </section>

      {/* קריאה לפעולה */}
      <section className="home-cta-real">
        <div className="home-cta-content-real">
          <div className="home-cta-badge-real">
            <Crown size={20} />
            <span>הצטרף עכשיו</span>
          </div>

          <h2 className="home-cta-title-real">מוכן להתחיל את המסע המוזיקלי שלך?</h2>
          <p className="home-cta-description-real">
            הצטרף ל-{stats.totalArtists} האמנים שכבר בחרו בנו ותהיה חלק מהקהילה המוזיקלית הישראלית הגדלה והמתפתחת
          </p>

          <div className="home-cta-buttons-real">
            {user?.id ? (
              <>
                <button
                  className="home-btn-real home-btn-primary-real home-btn-large-real"
                  onClick={() => navigate("/mySongs")}
                >
                  <Upload size={20} />
                  העלה שיר חדש
                  <ArrowRight size={20} />
                </button>
                <button
                  className="home-btn-real home-btn-outline-real home-btn-large-real"
                  onClick={() => navigate("/musicLibrary/songList")}
                >
                  <Eye size={20} />
                  גלה מוזיקה חדשה
                </button>
              </>
            ) : (
              <>
                <button
                  className="home-btn-real home-btn-primary-real home-btn-large-real"
                  onClick={() => navigate("/register")}
                >
                  <Users size={20} />
                  הירשם בחינם
                  <ArrowRight size={20} />
                </button>
                <button
                  className="home-btn-real home-btn-outline-real home-btn-large-real"
                  onClick={() => navigate("/musicLibrary/songList")}
                >
                  <Eye size={20} />
                  צפה בשירים
                </button>
              </>
            )}
          </div>

          <div className="home-cta-guarantee-real">
            <Award size={16} />
            <span>חינם לחלוטין • ללא התחייבות • תמיכה בעברית</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
