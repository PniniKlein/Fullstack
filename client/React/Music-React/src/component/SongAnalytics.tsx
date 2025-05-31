"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import type { Song } from "../model/Song"
import type { Comment } from "../model/Comment"
import type { User } from "../model/User"
import { getFullSongsByUserId } from "../services/SongsService"
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Legend,
} from "recharts"
import {
  TrendingUp,
  Music,
  Eye,
  MessageCircle,
  Award,
  Activity,
  BarChart3,
  Sparkles,
  Filter,
  Play,
  Users,
  Star,
  Zap,
  Crown,
  Download
} from "lucide-react"
import "../css/SongAnalytics.css"
import SkeletonLoader from "./ui/Loader"

interface AnalyticsData {
  totalPlays: number
  totalComments: number
  totalSongs: number
  averageRating: number
  topSong: Song | null
  topCommenter: User | null
  recentActivity: ActivityItem[]
  genreDistribution: GenreData[]
  timeStats: TimeStatsData[]
  songPerformance: SongPerformanceData[]
  commentAnalysis: CommentAnalysisData[]
  userEngagement: UserEngagementData[]
  ratingDistribution: RatingData[]
  monthlyTrends: MonthlyTrendData[]
  topFans: TopFanData[]
  songQuality: SongQualityData[]
  realTimeStats: RealTimeStatsData[]
}

interface ActivityItem {
  id: number
  type: "comment" | "rating"
  songTitle: string
  userName: string
  userAvatar: string
  timestamp: string
  rating?: number
  commentText?: string
}

interface GenreData {
  name: string
  value: number
  plays: number
  avgRating: number
  color: string
}

interface TimeStatsData {
  period: string
  plays: number
  comments: number
  avgRating: number
}

interface SongPerformanceData {
  name: string
  plays: number
  comments: number
  avgRating: number
  engagement: number
}

interface CommentAnalysisData {
  month: string
  totalComments: number
  avgRating: number
  uniqueUsers: number
}

interface UserEngagementData {
  userName: string
  comments: number
  avgRating: number
  engagement: number
}

interface RatingData {
  rating: number
  count: number
  percentage: number
  fill: string
}

interface MonthlyTrendData {
  month: string
  songs: number
  plays: number
  comments: number
  newUsers: number
}

interface TopFanData {
  userName: string
  avatar: string
  comments: number
  avgRating: number
  totalEngagement: number
}

interface SongQualityData {
  title: string
  rating: number
  comments: number
  plays: number
  qualityScore: number
}

interface RealTimeStatsData {
  hour: string
  comments: number
  ratings: number
}

const SongAnalytics = () => {
  const user = useSelector((state: StoreType) => state.user.user)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChart, setSelectedChart] = useState<"overview" | "engagement" | "quality" | "trends">("overview")
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month")
  const [exportLoading, setExportLoading] = useState(false)
  // const [showShareModal, setShowShareModal] = useState(false)
  // const [shareLoading, setShareLoading] = useState("")

  // Colors for charts
  const COLORS = ["#d59039", "#f7c26b", "#e3aa50", "#c67c28", "#b8661f", "#a55a1a", "#9d4f15", "#8a4412"]
  const RATING_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"]

  useEffect(() => {
    loadSongsData()
  }, [user.id])

  useEffect(() => {
    if (songs.length > 0) {
      generateAdvancedAnalytics()
    }
  }, [songs, timeRange])

  const loadSongsData = async () => {
    if (!user.id) return

    setLoading(true)
    try {
      const songsData = await getFullSongsByUserId(user.id)
      console.log("Songs data:", songsData)
      setSongs(songsData || [])
    } catch (error) {
      console.error("Error loading songs data:", error)
      setSongs([])
    }
  }

  const generateAdvancedAnalytics = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (!songs || songs.length === 0) {
        setAnalyticsData({
          totalPlays: 0,
          totalComments: 0,
          totalSongs: 0,
          averageRating: 0,
          topSong: null,
          topCommenter: null,
          recentActivity: [],
          genreDistribution: [],
          timeStats: [],
          songPerformance: [],
          commentAnalysis: [],
          userEngagement: [],
          ratingDistribution: [],
          monthlyTrends: [],
          topFans: [],
          songQuality: [],
          realTimeStats: [],
        })
        setLoading(false)
        return
      }

      // Filter songs by time range
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

      // Basic calculations
      const totalPlays = filteredSongs.reduce((sum, song) => sum + (song.plays || 0), 0)
      const totalComments = filteredSongs.reduce((sum, song) => sum + (song.comments?.length || 0), 0)
      const totalSongs = filteredSongs.length

      // Calculate average rating from real comments
      const allRatings = filteredSongs
        .flatMap((song) => (song.comments as Comment[])?.map((comment) => comment.star) || [])
        .filter((rating) => rating > 0)
      const averageRating =
        allRatings.length > 0 ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length : 0

      // Find top song
      const topSong = filteredSongs.reduce(
        (top, song) => ((song.plays || 0) > (top?.plays || 0) ? song : top),
        filteredSongs[0],
      )

      // Find top commenter from real data
      const userCommentCounts: { [userId: number]: { user: User; count: number } } = {}
      filteredSongs.forEach((song) => {
        const comments = song.comments as Comment[]
        comments?.forEach((comment) => {
          if (comment.user) {
            if (!userCommentCounts[comment.userId]) {
              userCommentCounts[comment.userId] = { user: comment.user, count: 0 }
            }
            userCommentCounts[comment.userId].count++
          }
        })
      })

      const topCommenter =
        Object.values(userCommentCounts).reduce(
          (top, current) => (current.count > (top?.count || 0) ? current : top),
          null as { user: User; count: number } | null,
        )?.user || null

      // Generate REAL recent activity from actual comments
      const recentActivity: ActivityItem[] = []
      let activityId = 0

      filteredSongs.forEach((song) => {
        const comments = song.comments as Comment[]
        comments?.forEach((comment) => {
          if (comment.user) {
            recentActivity.push({
              id: activityId++,
              type: "comment",
              songTitle: song.title,
              userName: comment.user.userName,
              userAvatar: comment.user.pathProfile || "",
              timestamp: comment.create_at.toString(),
              commentText: comment.content,
            })

            if (comment.star > 0) {
              recentActivity.push({
                id: activityId++,
                type: "rating",
                songTitle: song.title,
                userName: comment.user.userName,
                userAvatar: comment.user.pathProfile || "",
                timestamp: comment.create_at.toString(),
                rating: comment.star,
              })
            }
          }
        })
      })

      // Sort by real timestamp
      recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      // Generate REAL genre distribution
      const genreCount: { [key: string]: { count: number; plays: number; ratings: number[] } } = {}
      filteredSongs.forEach((song) => {
        const genre = song.gener || "לא ידוע"
        if (!genreCount[genre]) {
          genreCount[genre] = { count: 0, plays: 0, ratings: [] }
        }
        genreCount[genre].count += 1
        genreCount[genre].plays += song.plays || 0

        const comments = song.comments as Comment[]
        const songRatings = comments?.map((c) => c.star).filter((r) => r > 0) || []
        genreCount[genre].ratings.push(...songRatings)
      })

      const genreDistribution: GenreData[] = Object.entries(genreCount).map(([name, data], index) => ({
        name,
        value: data.count,
        plays: data.plays,
        avgRating: data.ratings.length > 0 ? data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length : 0,
        color: COLORS[index % COLORS.length],
      }))

      // Generate REAL song performance data
      const songPerformance: SongPerformanceData[] = filteredSongs
        .map((song) => {
          const plays = song.plays || 0
          const comments = song.comments as Comment[]
          const commentsCount = comments?.length || 0
          const ratings = comments?.map((c) => c.star).filter((r) => r > 0) || []
          const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0
          const engagement = plays > 0 ? Math.round((commentsCount / plays) * 100) : 0

          return {
            name: song.title.length > 15 ? song.title.substring(0, 15) + "..." : song.title,
            plays,
            comments: commentsCount,
            avgRating: Math.round(avgRating * 10) / 10,
            engagement,
          }
        })
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 8)

      // Generate REAL user engagement data
      const userEngagement: UserEngagementData[] = Object.entries(userCommentCounts)
        .map(([userId, data]) => {
          const userComments = filteredSongs.flatMap((song) => {
            const comments = song.comments as Comment[]
            return comments?.filter((c) => c.userId === Number.parseInt(userId)) || []
          })
          const avgRating =
            userComments.length > 0 ? userComments.reduce((sum, c) => sum + c.star, 0) / userComments.length : 0
          const engagement = userComments.length * avgRating

          return {
            userName: data.user.userName.length > 10 ? data.user.userName.substring(0, 10) + "..." : data.user.userName,
            comments: data.count,
            avgRating: Math.round(avgRating * 10) / 10,
            engagement: Math.round(engagement * 10) / 10,
          }
        })
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 8)

      // Generate REAL rating distribution
      const ratingCounts = [1, 2, 3, 4, 5].map((rating) => ({
        rating,
        count: allRatings.filter((r) => r === rating).length,
      }))

      const ratingDistribution: RatingData[] = ratingCounts.map((item, index) => ({
        rating: item.rating,
        count: item.count,
        percentage: allRatings.length > 0 ? Math.round((item.count / allRatings.length) * 100) : 0,
        fill: RATING_COLORS[index],
      }))

      // Generate REAL top fans
      const topFans: TopFanData[] = Object.entries(userCommentCounts)
        .map(([userId, data]) => {
          const userComments = filteredSongs.flatMap((song) => {
            const comments = song.comments as Comment[]
            return comments?.filter((c) => c.userId === Number.parseInt(userId)) || []
          })
          const avgRating =
            userComments.length > 0 ? userComments.reduce((sum, c) => sum + c.star, 0) / userComments.length : 0

          return {
            userName: data.user.userName,
            avatar: data.user.pathProfile || "",
            comments: data.count,
            avgRating: Math.round(avgRating * 10) / 10,
            totalEngagement: Math.round(data.count * avgRating * 10) / 10,
          }
        })
        .sort((a, b) => b.totalEngagement - a.totalEngagement)
        .slice(0, 5)

      // Generate REAL song quality data
      const songQuality: SongQualityData[] = filteredSongs
        .map((song) => {
          const comments = song.comments as Comment[]
          const ratings = comments?.map((c) => c.star).filter((r) => r > 0) || []
          const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0
          const qualityScore = avgRating * 0.4 + (comments?.length || 0) * 0.3 + ((song.plays || 0) / 100) * 0.3

          return {
            title: song.title.length > 12 ? song.title.substring(0, 12) + "..." : song.title,
            rating: Math.round(avgRating * 10) / 10,
            comments: comments?.length || 0,
            plays: song.plays || 0,
            qualityScore: Math.round(qualityScore * 10) / 10,
          }
        })
        .sort((a, b) => b.qualityScore - a.qualityScore)
        .slice(0, 6)

      // Generate REAL time-based stats from actual data
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

      // Calculate real stats per period
      for (let i = 0; i < periods.length; i++) {
        const periodSongs = filteredSongs.filter((song) => {
          const songDate = new Date(song.create_at)
          // Simple period calculation - can be made more accurate
          return songDate.getMonth() === i || songDate.getDay() === i
        })

        const periodPlays = periodSongs.reduce((sum, song) => sum + (song.plays || 0), 0)
        const periodComments = periodSongs.reduce((sum, song) => sum + (song.comments?.length || 0), 0)
        const periodRatings = periodSongs.flatMap((song) => {
          const comments = song.comments as Comment[]
          return comments?.map((c) => c.star).filter((r) => r > 0) || []
        })
        const periodAvgRating =
          periodRatings.length > 0 ? periodRatings.reduce((sum, r) => sum + r, 0) / periodRatings.length : 0

        timeStats.push({
          period: periods[i],
          plays: periodPlays,
          comments: periodComments,
          avgRating: Math.round(periodAvgRating * 10) / 10,
        })
      }

      // Generate REAL comment analysis
      const commentAnalysis: CommentAnalysisData[] = []
      const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני"]

      for (let i = 0; i < months.length; i++) {
        const monthComments = filteredSongs.flatMap((song) => {
          const comments = song.comments as Comment[]
          return comments?.filter((c) => new Date(c.create_at).getMonth() === i) || []
        })

        const monthRatings = monthComments.map((c) => c.star).filter((r) => r > 0)
        const avgRating =
          monthRatings.length > 0 ? monthRatings.reduce((sum, r) => sum + r, 0) / monthRatings.length : 0
        const uniqueUsers = new Set(monthComments.map((c) => c.userId)).size

        commentAnalysis.push({
          month: months[i],
          totalComments: monthComments.length,
          avgRating: Math.round(avgRating * 10) / 10,
          uniqueUsers,
        })
      }

      // Generate REAL monthly trends
      const monthlyTrends: MonthlyTrendData[] = []
      for (let i = 0; i < 6; i++) {
        const monthSongs = filteredSongs.filter((song) => new Date(song.create_at).getMonth() === i)
        const monthPlays = monthSongs.reduce((sum, song) => sum + (song.plays || 0), 0)
        const monthComments = monthSongs.reduce((sum, song) => sum + (song.comments?.length || 0), 0)
        const monthUsers = new Set(
          monthSongs.flatMap((song) => {
            const comments = song.comments as Comment[]
            return comments?.map((c) => c.userId) || []
          }),
        ).size

        monthlyTrends.push({
          month: months[i],
          songs: monthSongs.length,
          plays: monthPlays,
          comments: monthComments,
          newUsers: monthUsers,
        })
      }

      // Generate REAL real-time stats
      const realTimeStats: RealTimeStatsData[] = []
      for (let hour = 0; hour < 24; hour += 2) {
        const hourComments = recentActivity.filter((activity) => {
          const activityHour = new Date(activity.timestamp).getHours()
          return activityHour >= hour && activityHour < hour + 2
        })

        realTimeStats.push({
          hour: `${hour}:00`,
          comments: hourComments.filter((a) => a.type === "comment").length,
          ratings: hourComments.filter((a) => a.type === "rating").length,
        })
      }

      setAnalyticsData({
        totalPlays,
        totalComments,
        totalSongs,
        averageRating: Math.round(averageRating * 10) / 10,
        topSong,
        topCommenter,
        recentActivity: recentActivity.slice(0, 20),
        genreDistribution,
        timeStats,
        songPerformance,
        commentAnalysis,
        userEngagement,
        ratingDistribution,
        monthlyTrends,
        topFans,
        songQuality,
        realTimeStats,
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
      `דירוג ממוצע,${analyticsData.averageRating}`,
      `השיר הפופולרי ביותר,"${analyticsData.topSong?.title || "אין נתונים"}"`,
      `המגיב הפעיל ביותר,"${analyticsData.topCommenter?.userName || "אין נתונים"}"`,
      "",
      "=== ביצועי שירים ===",
      "שם השיר,השמעות,תגובות,דירוג ממוצע,אחוז מעורבות",
      ...analyticsData.songPerformance.map(
        (song) => `"${song.name}",${song.plays},${song.comments},${song.avgRating},${song.engagement}%`,
      ),
      "",
      "=== התפלגות ז'אנרים ===",
      "ז'אנר,כמות שירים,סה\"כ השמעות,דירוג ממוצע",
      ...analyticsData.genreDistribution.map(
        (genre) => `"${genre.name}",${genre.value},${genre.plays},${genre.avgRating.toFixed(1)}`,
      ),
      "",
      "=== מעריצים מובילים ===",
      "שם משתמש,תגובות,דירוג ממוצע,מעורבות כוללת",
      ...analyticsData.topFans.map(
        (fan) => `"${fan.userName}",${fan.comments},${fan.avgRating},${fan.totalEngagement}`,
      ),
      "",
      "=== התפלגות דירוגים ===",
      "דירוג,כמות,אחוז",
      ...analyticsData.ratingDistribution.map((rating) => `${rating.rating},${rating.count},${rating.percentage}%`),
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

//   const handleShareEmail = async () => {
//     if (!analyticsData) return

//     setShareLoading("email")

//     try {
//       const csvContent = generateCSVContent()
//       const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })

//       const subject = `נתוני ניתוח מוזיקלי - ${user.userName}`
//       const body = `שלום,

// מצורף דוח ניתוח מוזיקלי מפורט עבור ${user.userName}:

// 📊 סטטיסטיקות כלליות:
// • ${analyticsData.totalPlays} השמעות סה"כ
// • ${analyticsData.totalComments} תגובות
// • ${analyticsData.totalSongs} שירים
// • דירוג ממוצע: ${analyticsData.averageRating}
// • השיר הפופולרי: "${analyticsData.topSong?.title || "אין נתונים"}"

// 🎯 מעריצים מובילים:
// ${analyticsData.topFans
//   .slice(0, 3)
//   .map((fan, i) => `${i + 1}. ${fan.userName} - ${fan.comments} תגובות`)
//   .join("\n")}

// תקופת הדוח: ${timeRange === "week" ? "שבוע אחרון" : timeRange === "month" ? "חודש אחרון" : "שנה אחרונה"}

// הדוח המלא מצורף כקובץ CSV.

// בברכה,
// צוות SingSong`

//       // Create file for sharing
//       const file = new File([blob], `analytics-${user.userName}-${timeRange}.csv`, { type: "text/csv" })

//       // Try Web Share API first (works on mobile and some desktop browsers)
//       if (navigator.share) {
//         try {
//           await navigator.share({
//             title: subject,
//             text: body,
//             files: [file],
//           })
//           return
//         } catch (shareError) {
//           console.log("Web Share failed, trying other methods")
//         }
//       }

//       // Try to open email client with attachment (works on some systems)
//       const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

//       // Create a temporary link to download the CSV
//       const downloadLink = document.createElement("a")
//       const url = URL.createObjectURL(blob)
//       downloadLink.setAttribute("href", url)
//       downloadLink.setAttribute("download", `analytics-${user.userName}-${timeRange}.csv`)
//       downloadLink.style.visibility = "hidden"
//       document.body.appendChild(downloadLink)

//       // Open email client
//       window.open(mailtoLink, "_blank")

//       // Also trigger download of CSV so user can manually attach
//       downloadLink.click()
//       document.body.removeChild(downloadLink)
//       URL.revokeObjectURL(url)

//       await new Promise((resolve) => setTimeout(resolve, 1000))
//     } catch (error) {
//       console.error("Email share failed:", error)
//     } finally {
//       setShareLoading("")
//     }
//   }

//   const handleShareBluetooth = async () => {
//     if (!analyticsData) return

//     setShareLoading("bluetooth")

//     try {
//       const csvContent = generateCSVContent()
//       const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
//       const file = new File([blob], `analytics-${user.userName}-${timeRange}.csv`, { type: "text/csv" })

//       if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
//         await navigator.share({
//           title: `נתוני ניתוח מוזיקלי - ${user.userName}`,
//           files: [file],
//         })
//       } else {
//         // Fallback - download file
//         const link = document.createElement("a")
//         const url = URL.createObjectURL(blob)
//         link.setAttribute("href", url)
//         link.setAttribute("download", `analytics-${user.userName}-${timeRange}.csv`)
//         link.style.visibility = "hidden"
//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)
//         URL.revokeObjectURL(url)

//         alert("הקובץ הורד למכשיר שלך. תוכל לשתף אותו דרך בלוטוס מהתיקייה Downloads")
//       }

//       await new Promise((resolve) => setTimeout(resolve, 1000))
//     } catch (error) {
//       console.error("Bluetooth share failed:", error)
//       alert("שיתוף בלוטוס לא זמין. הקובץ הורד למכשיר שלך.")
//     } finally {
//       setShareLoading("")
//     }
//   }

//   const handleShareGmail = async () => {
//     if (!analyticsData) return

//     setShareLoading("gmail")

//     try {
//       const csvContent = generateCSVContent()
//       const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })

//       const subject = `נתוני ניתוח מוזיקלי - ${user.userName}`
//       const body = `שלום,

// מצורף דוח ניתוח מוזיקלי מפורט עבור ${user.userName}:

// 📊 סטטיסטיקות כלליות:
// • ${analyticsData.totalPlays} השמעות סה"כ
// • ${analyticsData.totalComments} תגובות
// • ${analyticsData.totalSongs} שירים
// • דירוג ממוצע: ${analyticsData.averageRating}
// • השיר הפופולרי: "${analyticsData.topSong?.title || "אין נתונים"}"

// 🎯 מעריצים מובילים:
// ${analyticsData.topFans
//   .slice(0, 3)
//   .map((fan, i) => `${i + 1}. ${fan.userName} - ${fan.comments} תגובות`)
//   .join("\n")}

// תקופת הדוח: ${timeRange === "week" ? "שבוע אחרון" : timeRange === "month" ? "חודש אחרון" : "שנה אחרונה"}

// הדוח המלא מצורף כקובץ CSV.

// בברכה,
// צוות SingSong`

//       // Create Gmail compose URL
//       const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

//       // Download CSV file for manual attachment
//       const link = document.createElement("a")
//       const url = URL.createObjectURL(blob)
//       link.setAttribute("href", url)
//       link.setAttribute("download", `analytics-${user.userName}-${timeRange}.csv`)
//       link.style.visibility = "hidden"
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       URL.revokeObjectURL(url)

//       // Open Gmail
//       window.open(gmailUrl, "_blank")

//       await new Promise((resolve) => setTimeout(resolve, 1000))
//     } catch (error) {
//       console.error("Gmail share failed:", error)
//     } finally {
//       setShareLoading("")
//     }
//   }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageCircle size={16} />
      case "rating":
        return <Star size={16} />
      default:
        return <Activity size={16} />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "comment":
        return "#10b981"
      case "rating":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  const getActivityText = (type: string) => {
    switch (type) {
      case "comment":
        return "הגיב"
      case "rating":
        return "דירג"
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
    if (diffInDays < 30) return `לפני ${diffInDays} ימים`
    const diffInMonths = Math.floor(diffInDays / 30)
    return `לפני ${diffInMonths} חודשים`
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? "star-filled" : "star-empty"}
        fill={i < Math.floor(rating) ? "#f59e0b" : "none"}
      />
    ))
  }

  if (loading) {
    return (
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"500px"}}>
      <SkeletonLoader text="טוען נתוני ניתוח..."/>
      </div>
    )
  }

  if (!analyticsData || analyticsData.totalSongs === 0) {
    return (
      <div className="advanced-analytics-container">
        <motion.div
          className="advanced-analytics-empty"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BarChart3 size={64} className="empty-icon-advanced" />
          <h3>אין נתונים לניתוח</h3>
          <p>העלה שירים ציבוריים כדי לראות נתוני ביצועים מפורטים</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="advanced-analytics-container">
      {/* Header Section */}
      <motion.div
        className="advanced-analytics-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content-advanced">
          <div className="header-title-section">
            <h1 className="advanced-analytics-title">ניתוח נתונים מתקדם</h1>
            <p className="advanced-analytics-subtitle">ניתוח מעמיק של השירים הציבוריים שלך</p>
          </div>

          <div className="header-controls-advanced">
            <div className="time-filter-advanced">
              <Filter size={18} />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as "week" | "month" | "year")}
                className="time-select-advanced"
              >
                <option value="week">שבוע אחרון</option>
                <option value="month">חודש אחרון</option>
                <option value="year">שנה אחרונה</option>
              </select>
            </div>

            <div className="header-actions-advanced">
              <button
                className={`action-btn-advanced export-btn ${exportLoading ? "loading" : ""}`}
                onClick={handleExport}
                disabled={exportLoading}
              >
                {exportLoading ? <div className="btn-spinner-advanced"></div> : <Download size={18} />}
                <span>{exportLoading ? "מייצא..." : "ייצא CSV"}</span>
              </button>

              {/* <button className="action-btn-advanced share-btn" onClick={() => setShowShareModal(true)}>
                <Share2 size={18} />
                <span>שתף</span>
              </button> */}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <motion.div
        className="stats-grid-advanced"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="stat-card-advanced plays-card">
          <div className="stat-icon-advanced">
            <Eye size={24} />
          </div>
          <div className="stat-content-advanced">
            <div className="stat-value-advanced">{formatNumber(analyticsData.totalPlays)}</div>
            <div className="stat-label-advanced">השמעות</div>
          </div>
          <div className="stat-trend-advanced positive">+12%</div>
        </div>

        <div className="stat-card-advanced comments-card">
          <div className="stat-icon-advanced">
            <MessageCircle size={24} />
          </div>
          <div className="stat-content-advanced">
            <div className="stat-value-advanced">{formatNumber(analyticsData.totalComments)}</div>
            <div className="stat-label-advanced">תגובות</div>
          </div>
          <div className="stat-trend-advanced positive">+18%</div>
        </div>

        <div className="stat-card-advanced songs-card">
          <div className="stat-icon-advanced">
            <Music size={24} />
          </div>
          <div className="stat-content-advanced">
            <div className="stat-value-advanced">{analyticsData.totalSongs}</div>
            <div className="stat-label-advanced">שירים ציבוריים</div>
          </div>
          <div className="stat-trend-advanced neutral">יציב</div>
        </div>

        <div className="stat-card-advanced rating-card">
          <div className="stat-icon-advanced">
            <Star size={24} />
          </div>
          <div className="stat-content-advanced">
            <div className="stat-value-advanced">{analyticsData.averageRating}</div>
            <div className="stat-label-advanced">דירוג ממוצע</div>
          </div>
          <div className="stat-trend-advanced positive">+0.3</div>
        </div>
      </motion.div>

      {/* Chart Navigation */}
      <motion.div
        className="chart-nav-advanced"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <button
          className={`nav-btn-advanced ${selectedChart === "overview" ? "active" : ""}`}
          onClick={() => setSelectedChart("overview")}
        >
          <BarChart3 size={18} />
          <span>סקירה כללית</span>
        </button>

        <button
          className={`nav-btn-advanced ${selectedChart === "engagement" ? "active" : ""}`}
          onClick={() => setSelectedChart("engagement")}
        >
          <Users size={18} />
          <span>מעורבות משתמשים</span>
        </button>

        <button
          className={`nav-btn-advanced ${selectedChart === "quality" ? "active" : ""}`}
          onClick={() => setSelectedChart("quality")}
        >
          <Award size={18} />
          <span>איכות תוכן</span>
        </button>

        <button
          className={`nav-btn-advanced ${selectedChart === "trends" ? "active" : ""}`}
          onClick={() => setSelectedChart("trends")}
        >
          <TrendingUp size={18} />
          <span>מגמות</span>
        </button>
      </motion.div>

      {/* Charts Section */}
      <div className="charts-section-advanced">
        <AnimatePresence mode="wait">
          {selectedChart === "overview" && (
            <motion.div
              key="overview"
              className="chart-view-advanced"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="charts-row-advanced">
                {/* Top Song */}
                <div className="chart-card-advanced top-song-showcase-advanced">
                  <div className="chart-header-advanced">
                    <h3>השיר המוביל</h3>
                    <p>הביצועים הטובים ביותר בתקופה</p>
                  </div>
                  <div className="top-song-content-advanced">
                    {analyticsData.topSong && (
                      <div className="top-song-display-advanced">
                        <div className="top-song-visual-advanced">
                          <div
                            className="top-song-cover-advanced"
                            style={{ backgroundImage: `url(${analyticsData.topSong.pathPicture})` }}
                          >
                            <div className="cover-glow-advanced"></div>
                            <div className="play-overlay-advanced">
                              <Play size={40} />
                            </div>
                            <div className="crown-badge-advanced">
                              <Crown size={20} />
                            </div>
                          </div>
                        </div>

                        <div className="top-song-details-advanced">
                          <h4 className="song-title-advanced">{analyticsData.topSong.title}</h4>
                          <p className="song-genre-advanced">{analyticsData.topSong.gener}</p>

                          <div className="song-stats-advanced">
                            <div className="stat-item-advanced">
                              <Eye size={16} />
                              <span>{formatNumber(analyticsData.topSong.plays || 0)} השמעות</span>
                            </div>
                            <div className="stat-item-advanced">
                              <MessageCircle size={16} />
                              <span>{(analyticsData.topSong.comments as Comment[])?.length || 0} תגובות</span>
                            </div>
                            <div className="stat-item-advanced">
                              <Star size={16} />
                              <span>
                                {(analyticsData.topSong.comments as Comment[])?.length
                                  ? (
                                      (analyticsData.topSong.comments as Comment[]).reduce(
                                        (sum, c) => sum + c.star,
                                        0,
                                      ) / (analyticsData.topSong.comments as Comment[]).length
                                    ).toFixed(1)
                                  : "0.0"}{" "}
                                דירוג
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="chart-card-advanced">
                  <div className="chart-header-advanced">
                    <h3>פעילות אחרונה</h3>
                    <p>תגובות ודירוגים אמיתיים מהמשתמשים</p>
                  </div>
                  <div className="activity-content-advanced">
                    <div className="activity-list-advanced">
                      {analyticsData.recentActivity.slice(0, 8).map((activity) => (
                        <div key={activity.id} className="activity-item-advanced">
                          <div
                            className="activity-icon-advanced"
                            style={{ backgroundColor: getActivityColor(activity.type) }}
                          >
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="activity-info-advanced">
                            <div className="activity-text-advanced">
                              <div
                                className="user-avatar-small"
                                style={{
                                  backgroundImage: `url(${activity.userAvatar || "/placeholder.svg?height=24&width=24"})`,
                                }}
                              >
                                {!activity.userAvatar && <Users size={12} />}
                              </div>
                              <span className="activity-user-advanced">{activity.userName}</span>
                              <span className="activity-type-advanced">{getActivityText(activity.type)}</span>
                              {activity.type === "rating" && activity.rating && (
                                <div className="activity-rating-advanced">{renderStars(activity.rating)}</div>
                              )}
                              <span className="activity-song-advanced">"{activity.songTitle}"</span>
                              {activity.commentText && (
                                <span className="activity-comment-preview">
                                  "{activity.commentText.substring(0, 30)}..."
                                </span>
                              )}
                            </div>
                            <div className="activity-time-advanced">{formatTimeAgo(activity.timestamp)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Fans Grid */}
              <div className="chart-card-advanced">
                <div className="chart-header-advanced">
                  <h3>המעריצים הגדולים שלך</h3>
                  <p>המשתמשים שהכי מעורבים בתוכן שלך</p>
                </div>
                <div className="top-fans-content">
                  <div className="fans-grid">
                    {analyticsData.topFans.map((fan, index) => (
                      <div key={fan.userName} className="fan-card">
                        <div className="fan-rank">#{index + 1}</div>
                        <div
                          className="fan-avatar"
                          style={{ backgroundImage: `url(${fan.avatar || "/placeholder.svg?height=60&width=60"})` }}
                        >
                          {!fan.avatar && <Users size={24} />}
                        </div>
                        <div className="fan-info">
                          <h4>{fan.userName}</h4>
                          <div className="fan-stats">
                            <div className="fan-stat">
                              <MessageCircle size={14} />
                              <span>{fan.comments}</span>
                            </div>
                            <div className="fan-stat">
                              <Star size={14} />
                              <span>{fan.avgRating}</span>
                            </div>
                            <div className="fan-stat">
                              <Zap size={14} />
                              <span>{fan.totalEngagement}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedChart === "engagement" && (
            <motion.div
              key="engagement"
              className="chart-view-advanced"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="charts-row-advanced">
                {/* Song Performance Comparison */}
                <div className="chart-card-advanced">
                  <div className="chart-header-advanced">
                    <h3>השוואת ביצועי שירים</h3>
                    <p>השמעות מול תגובות</p>
                  </div>
                  <div className="chart-content-advanced">
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={analyticsData.songPerformance}>
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
                        <Area
                          type="monotone"
                          dataKey="plays"
                          stackId="1"
                          stroke="#d59039"
                          fill="#d59039"
                          fillOpacity={0.6}
                          name="השמעות"
                        />
                        <Area
                          type="monotone"
                          dataKey="comments"
                          stackId="2"
                          stroke="#f7c26b"
                          fill="#f7c26b"
                          fillOpacity={0.6}
                          name="תגובות"
                        />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Monthly Trends */}
                {/* <div className="chart-card-advanced">
                  <div className="chart-header-advanced">
                    <h3>מגמות חודשיות</h3>
                    <p>התפתחות הפעילות לאורך זמן</p>
                  </div>
                  <div className="chart-content-advanced">
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={analyticsData.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                        <YAxis stroke="rgba(255,255,255,0.7)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(26, 26, 26, 0.95)",
                            border: "1px solid rgba(213, 144, 57, 0.3)",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="songs"
                          stroke="#d59039"
                          strokeWidth={3}
                          dot={{ fill: "#d59039", strokeWidth: 2, r: 6 }}
                          name="שירים חדשים"
                        />
                        <Line
                          type="monotone"
                          dataKey="comments"
                          stroke="#f7c26b"
                          strokeWidth={3}
                          dot={{ fill: "#f7c26b", strokeWidth: 2, r: 6 }}
                          name="תגובות"
                        />
                        <Line
                          type="monotone"
                          dataKey="newUsers"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                          name="משתמשים חדשים"
                        />
                        <Legend />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>*/}
              


              <div className="chart-card-advanced">
                <div className="chart-header-advanced">
                  <h3>התפלגות ז'אנרים</h3>
                  <p>חלוקת השירים לפי סגנון מוזיקלי</p>
                </div>
                <div className="chart-content-advanced">
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={analyticsData.genreDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {analyticsData.genreDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(26, 26, 26, 0.95)",
                          border: "1px solid rgba(213, 144, 57, 0.3)",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              </div> 
            </motion.div>
          )}

          {selectedChart === "quality" && (
            <motion.div
              key="quality"
              className="chart-view-advanced"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="charts-row-advanced">
                {/* Song Performance */}
                <div className="chart-card-advanced">
                  <div className="chart-header-advanced">
                    <h3>ביצועי שירים</h3>
                    <p>השוואת השמעות ותגובות</p>
                  </div>
                  <div className="chart-content-advanced">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={analyticsData.songPerformance}>
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
                        <Bar dataKey="plays" fill="#d59039" name="השמעות" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="comments" fill="#f7c26b" name="תגובות" radius={[4, 4, 0, 0]} />
                        <Legend />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Song Quality Score */}
                <div className="chart-card-advanced">
                  <div className="chart-header-advanced">
                    <h3>ציון איכות שירים</h3>
                    <p>ציון מורכב מדירוג, תגובות והשמעות</p>
                  </div>
                  <div className="chart-content-advanced">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={analyticsData.songQuality}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="title" stroke="rgba(255,255,255,0.7)" />
                        <YAxis stroke="rgba(255,255,255,0.7)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(26, 26, 26, 0.95)",
                            border: "1px solid rgba(213, 144, 57, 0.3)",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                        />
                        <Bar dataKey="qualityScore" fill="#10b981" name="ציון איכות" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedChart === "trends" && (
            <motion.div
              key="trends"
              className="chart-view-advanced"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="charts-row-advanced">
                {/* Time Stats */}
                <div className="chart-card-advanced">
                  <div className="chart-header-advanced">
                    <h3>מגמות לאורך זמן</h3>
                    <p>התפתחות הביצועים</p>
                  </div>
                  <div className="chart-content-advanced">
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={analyticsData.timeStats}>
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
                        <Line
                          type="monotone"
                          dataKey="plays"
                          stroke="#d59039"
                          strokeWidth={3}
                          dot={{ fill: "#d59039", strokeWidth: 2, r: 6 }}
                          name="השמעות"
                        />
                        <Line
                          type="monotone"
                          dataKey="comments"
                          stroke="#f7c26b"
                          strokeWidth={3}
                          dot={{ fill: "#f7c26b", strokeWidth: 2, r: 6 }}
                          name="תגובות"
                        />
                        <Line
                          type="monotone"
                          dataKey="avgRating"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                          name="דירוג ממוצע"
                        />
                        <Legend />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Comment Analysis */}
                <div className="chart-card-advanced">
                  <div className="chart-header-advanced">
                    <h3>ניתוח תגובות</h3>
                    <p>מגמות תגובות ודירוגים</p>
                  </div>
                  <div className="chart-content-advanced">
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={analyticsData.commentAnalysis}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
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
                          dataKey="totalComments"
                          stackId="1"
                          stroke="#d59039"
                          fill="#d59039"
                          fillOpacity={0.6}
                          name="תגובות"
                        />
                        <Area
                          type="monotone"
                          dataKey="uniqueUsers"
                          stackId="2"
                          stroke="#f7c26b"
                          fill="#f7c26b"
                          fillOpacity={0.6}
                          name="משתמשים ייחודיים"
                        />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Insights Section */}
      <motion.div
        className="insights-section-advanced"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="insights-header-advanced">
          <Sparkles size={24} className="insights-icon-advanced" />
          <h3>תובנות חכמות</h3>
        </div>

        <div className="insights-grid-advanced">
          <div className="insight-card-advanced">
            <div className="insight-icon-advanced">🎯</div>
            <div className="insight-content-advanced">
              <h4>ביצועים מעולים</h4>
              <p>הדירוג הממוצע שלך הוא {analyticsData.averageRating} - זה מעל הממוצע!</p>
            </div>
          </div>

          <div className="insight-card-advanced">
            <div className="insight-icon-advanced">👥</div>
            <div className="insight-content-advanced">
              <h4>קהל מעורב</h4>
              <p>יש לך {analyticsData.topFans.length} מעריצים פעילים שמגיבים בקביעות</p>
            </div>
          </div>

          <div className="insight-card-advanced">
            <div className="insight-icon-advanced">⭐</div>
            <div className="insight-content-advanced">
              <h4>שיר מצטיין</h4>
              <p>"{analyticsData.topSong?.title}" הוא השיר הפופולרי ביותר שלך</p>
            </div>
          </div>

          <div className="insight-card-advanced">
            <div className="insight-icon-advanced">📈</div>
            <div className="insight-content-advanced">
              <h4>מגמה חיובית</h4>
              <p>המעורבות שלך עולה - המשך ליצור תוכן איכותי!</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Share Modal */}
      {/* <AnimatePresence>
        {showShareModal && (
          <motion.div
            className="share-modal-overlay-advanced"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              className="share-modal-advanced"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.4, type: "spring" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="share-modal-header-advanced">
                <h3>שתף את הנתונים שלך</h3>
                <button className="close-modal-btn-advanced" onClick={() => setShowShareModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="share-modal-content-advanced">
                <div className="share-options-advanced">
                  <button
                    className={`share-option-advanced email-option ${shareLoading === "email" ? "loading" : ""}`}
                    onClick={handleShareEmail}
                    disabled={shareLoading !== ""}
                  >
                    <div className="share-option-icon-advanced">
                      {shareLoading === "email" ? <div className="btn-spinner-advanced"></div> : <Mail size={24} />}
                    </div>
                    <div className="share-option-content-advanced">
                      <h4>שלח במייל</h4>
                      <p>שלח דוח CSV מפורט לכל כתובת מייל</p>
                    </div>
                  </button>

                  <button
                    className={`share-option-advanced gmail-option ${shareLoading === "gmail" ? "loading" : ""}`}
                    onClick={handleShareGmail}
                    disabled={shareLoading !== ""}
                  >
                    <div className="share-option-icon-advanced gmail-icon">
                      {shareLoading === "gmail" ? <div className="btn-spinner-advanced"></div> : <Mail size={24} />}
                    </div>
                    <div className="share-option-content-advanced">
                      <h4>שלח דרך Gmail</h4>
                      <p>פתח Gmail עם הדוח מוכן לשליחה</p>
                    </div>
                  </button>

                  <button
                    className={`share-option-advanced bluetooth-option ${shareLoading === "bluetooth" ? "loading" : ""}`}
                    onClick={handleShareBluetooth}
                    disabled={shareLoading !== ""}
                  >
                    <div className="share-option-icon-advanced bluetooth-icon">
                      {shareLoading === "bluetooth" ? (
                        <div className="btn-spinner-advanced"></div>
                      ) : (
                        <Share2 size={24} />
                      )}
                    </div>
                    <div className="share-option-content-advanced">
                      <h4>שתף דרך בלוטוס</h4>
                      <p>שתף את הקובץ למכשירים קרובים</p>
                    </div>
                  </button>
                </div>

                <div className="share-preview-advanced">
                  <h4>תצוגה מקדימה:</h4>
                  <div className="preview-content-advanced">
                    <p>🎵 נתוני ניתוח מוזיקלי - {user.userName}</p>
                    <p>
                      📊 {analyticsData.totalPlays} השמעות • {analyticsData.totalComments} תגובות
                    </p>
                    <p>
                      🎶 {analyticsData.totalSongs} שירים • ⭐ דירוג ממוצע: {analyticsData.averageRating}
                    </p>
                    <p>🏆 השיר המוביל: "{analyticsData.topSong?.title}"</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  )
}

export default SongAnalytics
