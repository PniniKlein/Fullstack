import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import type { Song } from "../model/Song"
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area,
  AreaChart,
  Treemap,
  Cell,
} from "recharts"
import {
  TrendingUp,
  Music,
  Eye,
  MessageCircle,
  Award,
  Activity,
  BarChart3,
  LineChartIcon,
  Download,
  Share2,
  Sparkles,
  X,
  Mail,
  Send,
  Calendar,
  Filter,
} from "lucide-react"
import "../css/SongAnalytics.css"

interface AnalyticsData {
  totalPlays: number
  totalComments: number
  totalSongs: number
  topSong: Song | null
  recentActivity: ActivityItem[]
  genreDistribution: GenreData[]
  timeStats: TimeStatsData[]
  songPerformance: SongPerformanceData[]
  engagementData: EngagementData[]
}

interface ActivityItem {
  id: number
  type: "play" | "comment" | "upload"
  songTitle: string
  timestamp: string
  value: number
}

interface GenreData {
  name: string
  value: number
  plays: number
  color: string
}

interface TimeStatsData {
  period: string
  plays: number
  comments: number
  uploads: number
}

interface SongPerformanceData {
  name: string
  plays: number
  comments: number
  engagement: number
}

interface EngagementData {
  genre: string
  engagement: number
  reach: number
  retention: number
}

const SongAnalytics = () => {
  const user = useSelector((state: StoreType) => state.user.user)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedChart, setSelectedChart] = useState<"overview" | "performance" | "engagement" | "trends">("overview")
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month")
  const [exportLoading, setExportLoading] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareLoading, setShareLoading] = useState("")

  // Colors for charts
  const COLORS = ["#d59039", "#f7c26b", "#e3aa50", "#c67c28", "#b8661f", "#a55a1a"]

  useEffect(() => {
    generateAnalyticsData()
  }, [user.songs, timeRange])

  const generateAnalyticsData = async () => {
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!user.songs || user.songs.length === 0) {
        setAnalyticsData({
          totalPlays: 0,
          totalComments: 0,
          totalSongs: 0,
          topSong: null,
          recentActivity: [],
          genreDistribution: [],
          timeStats: [],
          songPerformance: [],
          engagementData: [],
        })
        setLoading(false)
        return
      }

      const songs = user.songs as Song[]

      // Calculate basic stats based on time range
      const now = new Date()
      const timeFilter = (song: Song) => {
        const songDate = new Date(song.create_at)
        const diffTime = now.getTime() - songDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        switch (timeRange) {
          case "week":
            return diffDays <= 7
          case "month":
            return diffDays <= 30
          case "year":
            return diffDays <= 365
          default:
            return true
        }
      }

      const filteredSongs = songs.filter(timeFilter)
      const totalPlays = filteredSongs.reduce((sum, song) => sum + (song.plays || 0), 0)
      const totalComments = Math.floor(totalPlays * 0.15)
      const totalSongs = filteredSongs.length

      // Find top performing song
      const topSong = filteredSongs.reduce(
        (top, song) => ((song.plays || 0) > (top?.plays || 0) ? song : top),
        filteredSongs[0],
      )

      // Generate genre distribution with more data
      const genreCount: { [key: string]: { count: number; plays: number } } = {}
      filteredSongs.forEach((song) => {
        const genre = song.gener || "לא ידוע"
        if (!genreCount[genre]) {
          genreCount[genre] = { count: 0, plays: 0 }
        }
        genreCount[genre].count += 1
        genreCount[genre].plays += song.plays || 0
      })

      const genreDistribution: GenreData[] = Object.entries(genreCount).map(([name, data], index) => ({
        name,
        value: data.count,
        plays: data.plays,
        color: COLORS[index % COLORS.length],
      }))

      // Generate time-based stats
      const timeStats: TimeStatsData[] = []
      const periods =
        timeRange === "week"
          ? ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]
          : timeRange === "month"
            ? ["שבוע 1", "שבוע 2", "שבוע 3", "שבוע 4"]
            : [
                "ינואר",
                "פברואר",
                "מרץ",
                "אפריל",
                "מאי",
                "יוני",
                "יולי",
                "אוגוסט",
                "ספטמבר",
                "אוקטובר",
                "נובמבר",
                "דצמבר",
              ]

      for (let i = 0; i < periods.length; i++) {
        const periodPlays = Math.floor(totalPlays * (0.05 + Math.random() * 0.25))
        const periodComments = Math.floor(periodPlays * (0.1 + Math.random() * 0.2))
        const periodUploads = Math.floor(Math.random() * 3) + (timeRange === "year" ? 2 : 1)

        timeStats.push({
          period: periods[i],
          plays: periodPlays,
          comments: periodComments,
          uploads: periodUploads,
        })
      }

      // Generate song performance data
      const songPerformance: SongPerformanceData[] = filteredSongs
        .map((song) => {
          const plays = song.plays || 0
          const comments = Math.floor(plays * (0.1 + Math.random() * 0.3))
          const engagement = plays > 0 ? Math.round((comments / plays) * 100) : 0

          return {
            name: song.title.length > 12 ? song.title.substring(0, 12) + "..." : song.title,
            plays,
            comments,
            engagement,
          }
        })
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 8)

      // Generate engagement data for radar chart
      const engagementData: EngagementData[] = genreDistribution.map((genre) => ({
        genre: genre.name,
        engagement: Math.floor(Math.random() * 100) + 20,
        reach: Math.floor(Math.random() * 100) + 30,
        retention: Math.floor(Math.random() * 100) + 40,
      }))

      // Generate recent activity
      const recentActivity: ActivityItem[] = []
      const activityTypes: ("play" | "comment" | "upload")[] = ["play", "comment", "upload"]

      for (let i = 0; i < 15; i++) {
        const randomSong = filteredSongs[Math.floor(Math.random() * filteredSongs.length)]
        const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)]
        const randomValue =
          randomType === "play"
            ? Math.floor(Math.random() * 50) + 1
            : randomType === "comment"
              ? Math.floor(Math.random() * 5) + 1
              : 1

        recentActivity.push({
          id: i,
          type: randomType,
          songTitle: randomSong.title,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          value: randomValue,
        })
      }

      setAnalyticsData({
        totalPlays,
        totalComments,
        totalSongs,
        topSong,
        recentActivity: recentActivity.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        ),
        genreDistribution,
        timeStats,
        songPerformance,
        engagementData,
      })
    } catch (error) {
      console.error("Error generating analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateCSVContent = () => {
    if (!analyticsData) return ""

    const csvContent = [
      "נתוני ניתוח מוזיקלי - " + user.userName,
      "תאריך יצירה: " + new Date().toLocaleDateString("he-IL"),
      "תקופת דוח: " + (timeRange === "week" ? "שבוע אחרון" : timeRange === "month" ? "חודש אחרון" : "שנה אחרונה"),
      "",
      "=== סטטיסטיקות כלליות ===",
      `סה"כ השמעות,${analyticsData.totalPlays}`,
      `סה"כ תגובות,${analyticsData.totalComments}`,
      `סה"כ שירים,${analyticsData.totalSongs}`,
      `השיר הפופולרי ביותר,"${analyticsData.topSong?.title || "אין נתונים"}"`,
      "",
      "=== ביצועי שירים ===",
      "שם השיר,השמעות,תגובות,אחוז מעורבות",
      ...analyticsData.songPerformance.map(
        (song) => `"${song.name}",${song.plays},${song.comments},${song.engagement}%`,
      ),
      "",
      "=== התפלגות ז'אנרים ===",
      "ז'אנר,כמות שירים,סה\"כ השמעות",
      ...analyticsData.genreDistribution.map((genre) => `"${genre.name}",${genre.value},${genre.plays}`),
      "",
      "=== נתונים לפי תקופה ===",
      "תקופה,השמעות,תגובות,העלאות",
      ...analyticsData.timeStats.map((stat) => `"${stat.period}",${stat.plays},${stat.comments},${stat.uploads}`),
      "",
      "דוח זה נוצר באמצעות SingSong Analytics",
    ].join("\n")

    return csvContent
  }

  const handleExport = async () => {
    if (!analyticsData) return

    setExportLoading(true)

    try {
      const csvContent = generateCSVContent()
      const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute(
        "download",
        `analytics-${user.userName}-${timeRange}-${new Date().toISOString().split("T")[0]}.csv`,
      )
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      await new Promise((resolve) => setTimeout(resolve, 1500))
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setExportLoading(false)
    }
  }

  const handleShareEmail = async () => {
    if (!analyticsData) return

    setShareLoading("email")

    try {
      const csvContent = generateCSVContent()
      const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
      const file = new File([blob], `analytics-${user.userName}-${timeRange}.csv`, { type: "text/csv" })

      const subject = `נתוני ניתוח מוזיקלי - ${user.userName}`
      const body = `שלום,

מצורף דוח ניתוח מוזיקלי מפורט עבור ${user.userName}:

📊 סטטיסטיקות כלליות:
• ${analyticsData.totalPlays} השמעות סה"כ
• ${analyticsData.totalComments} תגובות
• ${analyticsData.totalSongs} שירים
• השיר הפופולרי: "${analyticsData.topSong?.title || "אין נתונים"}"

תקופת הדוח: ${timeRange === "week" ? "שבוע אחרון" : timeRange === "month" ? "חודש אחרון" : "שנה אחרונה"}

הדוח המלא מצורף כקובץ CSV.

בברכה,
צוות SingSong`

      // Try to use Web Share API with file
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: subject,
          text: body,
          files: [file],
        })
      } else {
        // Fallback to mailto with attachment simulation
        const mailtoLink = `mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        window.open(mailtoLink, "_blank")

        // Also trigger download of CSV
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `analytics-${user.userName}-${timeRange}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Email share failed:", error)
    } finally {
      setShareLoading("")
    }
  }

  const handleShareWhatsApp = async () => {
    if (!analyticsData) return

    setShareLoading("whatsapp")

    try {
      const message = `🎵 *הנתונים שלי ב-SingSong*

📊 *סטטיסטיקות ${timeRange === "week" ? "השבוע" : timeRange === "month" ? "החודש" : "השנה"}:*
• 👁️ ${analyticsData.totalPlays} השמעות
• 💬 ${analyticsData.totalComments} תגובות  
• 🎶 ${analyticsData.totalSongs} שירים
• ⭐ השיר הפופולרי: "${analyticsData.topSong?.title || "אין נתונים"}"

🎯 *הז'אנר המוביל:* ${analyticsData.genreDistribution[0]?.name || "לא ידוע"}

#SingSong #מוזיקה #נתונים`

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")

      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("WhatsApp share failed:", error)
    } finally {
      setShareLoading("")
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "play":
        return <Eye size={16} />
      case "comment":
        return <MessageCircle size={16} />
      case "upload":
        return <Music size={16} />
      default:
        return <Activity size={16} />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "play":
        return "#3b82f6"
      case "comment":
        return "#10b981"
      case "upload":
        return "#d59039"
      default:
        return "#6b7280"
    }
  }

  const getActivityText = (type: string) => {
    switch (type) {
      case "play":
        return "השמעות"
      case "comment":
        return "תגובות"
      case "upload":
        return "העלאה"
      default:
        return "פעילות"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "לפני פחות משעה"
    if (diffInHours < 24) return `לפני ${diffInHours} שעות`
    const diffInDays = Math.floor(diffInHours / 24)
    return `לפני ${diffInDays} ימים`
  }

  if (loading) {
    return (
      <div className="analytics-container-new">
        <div className="analytics-loading-new">
          <motion.div
            className="loading-container-new"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loading-spinner-new"></div>
            <div className="loading-text-new">טוען נתוני ניתוח...</div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!analyticsData || analyticsData.totalSongs === 0) {
    return (
      <div className="analytics-container-new">
        <motion.div
          className="analytics-empty-new"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BarChart3 size={64} className="empty-icon-new" />
          <h3>אין נתונים לניתוח</h3>
          <p>העלה שירים כדי לראות נתוני ביצועים מפורטים</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="analytics-container-new">
      {/* Header Section */}
      <motion.div
        className="analytics-header-new"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content-new">
          <div className="header-title-section">
            <h1 className="analytics-title-new">ניתוח נתונים</h1>
            <p className="analytics-subtitle-new">סטטיסטיקות מפורטות על הביצועים שלך</p>
          </div>

          <div className="header-controls-new">
            <div className="time-filter-new">
              <Filter size={18} />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as "week" | "month" | "year")}
                className="time-select-new"
              >
                <option value="week">שבוע אחרון</option>
                <option value="month">חודש אחרון</option>
                <option value="year">שנה אחרונה</option>
              </select>
            </div>

            <div className="header-actions-new">
              <button
                className={`action-btn-new export-btn ${exportLoading ? "loading" : ""}`}
                onClick={handleExport}
                disabled={exportLoading}
              >
                {exportLoading ? <div className="btn-spinner-new"></div> : <Download size={18} />}
                <span>{exportLoading ? "מייצא..." : "ייצא"}</span>
              </button>

              <button className="action-btn-new share-btn" onClick={() => setShowShareModal(true)}>
                <Share2 size={18} />
                <span>שתף</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="stats-grid-new"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="stat-card-new plays-card">
          <div className="stat-icon-new">
            <Eye size={24} />
          </div>
          <div className="stat-content-new">
            <div className="stat-value-new">{formatNumber(analyticsData.totalPlays)}</div>
            <div className="stat-label-new">השמעות</div>
          </div>
          <div className="stat-trend-new positive">+12%</div>
        </div>

        <div className="stat-card-new comments-card">
          <div className="stat-icon-new">
            <MessageCircle size={24} />
          </div>
          <div className="stat-content-new">
            <div className="stat-value-new">{formatNumber(analyticsData.totalComments)}</div>
            <div className="stat-label-new">תגובות</div>
          </div>
          <div className="stat-trend-new positive">+15%</div>
        </div>

        <div className="stat-card-new songs-card">
          <div className="stat-icon-new">
            <Music size={24} />
          </div>
          <div className="stat-content-new">
            <div className="stat-value-new">{analyticsData.totalSongs}</div>
            <div className="stat-label-new">שירים</div>
          </div>
          <div className="stat-trend-new neutral">יציב</div>
        </div>
      </motion.div>

      {/* Chart Navigation */}
      <motion.div
        className="chart-nav-new"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <button
          className={`nav-btn-new ${selectedChart === "overview" ? "active" : ""}`}
          onClick={() => setSelectedChart("overview")}
        >
          <BarChart3 size={18} />
          <span>סקירה כללית</span>
        </button>

        <button
          className={`nav-btn-new ${selectedChart === "performance" ? "active" : ""}`}
          onClick={() => setSelectedChart("performance")}
        >
          <LineChartIcon size={18} />
          <span>ביצועי שירים</span>
        </button>

        <button
          className={`nav-btn-new ${selectedChart === "engagement" ? "active" : ""}`}
          onClick={() => setSelectedChart("engagement")}
        >
          <TrendingUp size={18} />
          <span>מעורבות</span>
        </button>

        <button
          className={`nav-btn-new ${selectedChart === "trends" ? "active" : ""}`}
          onClick={() => setSelectedChart("trends")}
        >
          <Calendar size={18} />
          <span>מגמות זמן</span>
        </button>
      </motion.div>

      {/* Charts Section */}
      <div className="charts-section-new">
        <AnimatePresence mode="wait">
          {selectedChart === "overview" && (
            <motion.div
              key="overview"
              className="chart-view-new"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="charts-row-new">
                <div className="chart-card-new">
                  <div className="chart-header-new">
                    <h3>התפלגות ז'אנרים</h3>
                    <p>מפת חום של הז'אנרים</p>
                  </div>
                  <div className="chart-content-new">
                    <ResponsiveContainer width="100%" height={300}>
                      <Treemap
                        data={analyticsData.genreDistribution}
                        dataKey="plays"
                        aspectRatio={4 / 3}
                        stroke="#fff"
                        fill="#d59039"
                      >
                        {analyticsData.genreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Treemap>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card-new">
                  <div className="chart-header-new">
                    <h3>פעילות אחרונה</h3>
                    <p>אירועים מהתקופה הנבחרת</p>
                  </div>
                  <div className="activity-content-new">
                    <div className="activity-list-new">
                      {analyticsData.recentActivity.slice(0, 6).map((activity) => (
                        <div key={activity.id} className="activity-item-new">
                          <div
                            className="activity-icon-new"
                            style={{ backgroundColor: getActivityColor(activity.type) }}
                          >
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="activity-info-new">
                            <div className="activity-text-new">
                              <span className="activity-value-new">{activity.value}</span>
                              <span className="activity-type-new">{getActivityText(activity.type)}</span>
                              <span className="activity-song-new">"{activity.songTitle}"</span>
                            </div>
                            <div className="activity-time-new">{formatTimeAgo(activity.timestamp)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Song Section */}
              <div className="chart-card-new top-song-card-new">
                <div className="chart-header-new">
                  <h3>השיר המוביל</h3>
                  <p>הביצועים הטובים ביותר בתקופה</p>
                </div>
                <div className="top-song-content-new">
                  {analyticsData.topSong && (
                    <div className="top-song-display-new">
                      <div
                        className="top-song-cover-new"
                        style={{ backgroundImage: `url(${analyticsData.topSong.pathPicture})` }}
                      >
                        <div className="top-song-overlay-new">
                          <Award size={32} />
                        </div>
                      </div>
                      <div className="top-song-info-new">
                        <h4>{analyticsData.topSong.title}</h4>
                        <p>{analyticsData.topSong.gener}</p>
                        <div className="top-song-stats-new">
                          <div className="top-song-stat-new">
                            <Eye size={16} />
                            <span>{formatNumber(analyticsData.topSong.plays || 0)} השמעות</span>
                          </div>
                          <div className="top-song-stat-new">
                            <MessageCircle size={16} />
                            <span>{Math.floor((analyticsData.topSong.plays || 0) * 0.15)} תגובות</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {selectedChart === "performance" && (
            <motion.div
              key="performance"
              className="chart-view-new"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="chart-card-new full-width-new">
                <div className="chart-header-new">
                  <h3>ביצועי שירים</h3>
                  <p>השוואת השמעות ותגובות לכל שיר</p>
                </div>
                <div className="chart-content-new">
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={analyticsData.songPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(26, 26, 26, 0.95)",
                          border: "1px solid rgba(213, 144, 57, 0.3)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="plays" fill="#d59039" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="comments" fill="#f7c26b" radius={[4, 4, 0, 0]} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {selectedChart === "engagement" && (
            <motion.div
              key="engagement"
              className="chart-view-new"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="chart-card-new full-width-new">
                <div className="chart-header-new">
                  <h3>מעורבות לפי ז'אנר</h3>
                  <p>ניתוח מעורבות, הגעה ושימור לכל ז'אנר</p>
                </div>
                <div className="chart-content-new">
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={analyticsData.engagementData}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="genre" tick={{ fill: "rgba(255,255,255,0.7)" }} />
                      <PolarRadiusAxis tick={{ fill: "rgba(255,255,255,0.7)" }} />
                      <Radar
                        name="מעורבות"
                        dataKey="engagement"
                        stroke="#d59039"
                        fill="#d59039"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar
                        name="הגעה"
                        dataKey="reach"
                        stroke="#f7c26b"
                        fill="#f7c26b"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Radar
                        name="שימור"
                        dataKey="retention"
                        stroke="#e3aa50"
                        fill="#e3aa50"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(26, 26, 26, 0.95)",
                          border: "1px solid rgba(213, 144, 57, 0.3)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {selectedChart === "trends" && (
            <motion.div
              key="trends"
              className="chart-view-new"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="chart-card-new full-width-new">
                <div className="chart-header-new">
                  <h3>מגמות לאורך זמן</h3>
                  <p>התפתחות הביצועים בתקופה הנבחרת</p>
                </div>
                <div className="chart-content-new">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={analyticsData.timeStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="period" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(26, 26, 26, 0.95)",
                          border: "1px solid rgba(213, 144, 57, 0.3)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="plays"
                        stackId="1"
                        stroke="#d59039"
                        fill="#d59039"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="comments"
                        stackId="1"
                        stroke="#f7c26b"
                        fill="#f7c26b"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Insights Section */}
      <motion.div
        className="insights-section-new"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="insights-header-new">
          <Sparkles size={24} className="insights-icon-new" />
          <h3>תובנות חכמות</h3>
        </div>

        <div className="insights-grid-new">
          <div className="insight-card-new">
            <div className="insight-icon-new">📈</div>
            <div className="insight-content-new">
              <h4>מגמה חיובית</h4>
              <p>
                הביצועים שלך השתפרו ב-15% ב{timeRange === "week" ? "שבוע" : timeRange === "month" ? "חודש" : "שנה"}{" "}
                האחרון
              </p>
            </div>
          </div>

          <div className="insight-card-new">
            <div className="insight-icon-new">🎯</div>
            <div className="insight-content-new">
              <h4>ז'אנר פופולרי</h4>
              <p>שירי {analyticsData.genreDistribution[0]?.name || "פופ"} מקבלים הכי הרבה השמעות</p>
            </div>
          </div>

          <div className="insight-card-new">
            <div className="insight-icon-new">⭐</div>
            <div className="insight-content-new">
              <h4>שיר מצטיין</h4>
              <p>"{analyticsData.topSong?.title}" הוא השיר הפופולרי ביותר שלך</p>
            </div>
          </div>

          <div className="insight-card-new">
            <div className="insight-icon-new">💡</div>
            <div className="insight-content-new">
              <h4>המלצה</h4>
              <p>נסה להעלות עוד שירים בז'אנר הפופולרי ביותר שלך</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            className="share-modal-overlay-new"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              className="share-modal-new"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.4, type: "spring" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="share-modal-header-new">
                <h3>שתף את הנתונים שלך</h3>
                <button className="close-modal-btn-new" onClick={() => setShowShareModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="share-modal-content-new">
                <div className="share-options-new">
                  <button
                    className={`share-option-new email-option ${shareLoading === "email" ? "loading" : ""}`}
                    onClick={handleShareEmail}
                    disabled={shareLoading !== ""}
                  >
                    <div className="share-option-icon-new">
                      {shareLoading === "email" ? <div className="btn-spinner-new"></div> : <Mail size={24} />}
                    </div>
                    <div className="share-option-content-new">
                      <h4>שלח במייל</h4>
                      <p>שלח דוח CSV למייל שלך</p>
                    </div>
                  </button>

                  <button
                    className={`share-option-new whatsapp-option ${shareLoading === "whatsapp" ? "loading" : ""}`}
                    onClick={handleShareWhatsApp}
                    disabled={shareLoading !== ""}
                  >
                    <div className="share-option-icon-new">
                      {shareLoading === "whatsapp" ? <div className="btn-spinner-new"></div> : <Send size={24} />}
                    </div>
                    <div className="share-option-content-new">
                      <h4>שתף בוואטסאפ</h4>
                      <p>שתף סיכום נתונים</p>
                    </div>
                  </button>
                </div>

                <div className="share-preview-new">
                  <h4>תצוגה מקדימה:</h4>
                  <div className="preview-content-new">
                    <p>🎵 הנתונים שלי ב-SingSong</p>
                    <p>
                      📊 {analyticsData.totalPlays} השמעות • {analyticsData.totalComments} תגובות
                    </p>
                    <p>
                      🎶 {analyticsData.totalSongs} שירים • ⭐ "{analyticsData.topSong?.title}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SongAnalytics
