"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Grid, MenuItem, Select, FormControl } from "@mui/material"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import type { Song } from "../model/Song"
import { PlayCircle, MessageSquare, Music, Calendar, BarChart2, Users } from "lucide-react"
import "../css/SongAnalytics.css"

const SongAnalytics = () => {
  const songs = useSelector((state: StoreType) => state.user.user.songs || [])
  const [selectedSong, setSelectedSong] = useState<string>("all")
  const [chartData, setChartData] = useState<any>({})
  const [timeRange, setTimeRange] = useState<string>("week")

  // Generate analytics data
  useEffect(() => {
    // Mock data for analytics
    const generateMockData = () => {
      const isAll = selectedSong === "all"

      // Total plays and comments
      const totalPlays = isAll
        ? songs.reduce((sum, song:Song) => sum + (song.plays || Math.floor(Math.random() * 100)), 0)
        : Math.floor(Math.random() * 500) + 50

      const totalComments = isAll
        ? songs.reduce((sum, song:Song) => sum + (song.comments?.length || Math.floor(Math.random() * 20)), 0)
        : Math.floor(Math.random() * 100) + 5

      // Weekly data
      const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]
      const weeklyPlays = days.map((day) => ({
        day,
        plays: Math.floor(Math.random() * 30) + 1,
      }))

      // Monthly data
      const months = [
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
      const monthlyPlays = months.map((month) => ({
        month,
        plays: Math.floor(Math.random() * 200) + 20,
      }))

      // Daily data for the last 30 days
      const dailyPlays = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        return {
          date: date.toLocaleDateString("he-IL", { day: "numeric", month: "numeric" }),
          plays: Math.floor(Math.random() * 20) + 1,
        }
      })

      // Genre distribution
      const genres = {
        פופ: Math.floor(Math.random() * 40) + 10,
        רוק: Math.floor(Math.random() * 30) + 10,
        מזרחית: Math.floor(Math.random() * 25) + 5,
        אלקטרוני: Math.floor(Math.random() * 20) + 5,
        אחר: Math.floor(Math.random() * 15) + 5,
      }

      // Top listeners
      const topListeners = [
        { name: "יוסי כהן", plays: Math.floor(Math.random() * 50) + 20 },
        { name: "רונית לוי", plays: Math.floor(Math.random() * 40) + 15 },
        { name: "אבי מזרחי", plays: Math.floor(Math.random() * 30) + 10 },
        { name: "מיכל דוד", plays: Math.floor(Math.random() * 25) + 5 },
        { name: "דני אבידן", plays: Math.floor(Math.random() * 20) + 5 },
      ]

      return {
        totalPlays,
        totalComments,
        weeklyPlays,
        monthlyPlays,
        dailyPlays,
        genres,
        topListeners,
      }
    }

    setChartData(generateMockData())
  }, [selectedSong, songs, timeRange])

  // Get time series data based on selected time range
  const getTimeSeriesData = () => {
    switch (timeRange) {
      case "week":
        return chartData.weeklyPlays || []
      case "month":
        return chartData.dailyPlays || []
      case "year":
        return chartData.monthlyPlays || []
      default:
        return chartData.weeklyPlays || []
    }
  }

  const timeSeriesData = getTimeSeriesData()
  const maxValue = Math.max(...(timeSeriesData || []).map((item: any) => item.plays))

  return (
    <Box className="analytics-section">
      <Box className="analytics-header">
        <Typography variant="h4" className="section-title">
          ניתוח נתונים
        </Typography>

        <div className="analytics-controls">
          <FormControl className="song-selector">
            <Select
              value={selectedSong}
              onChange={(e) => setSelectedSong(e.target.value as string)}
              className="analytics-select"
              displayEmpty
              renderValue={(value) =>
                value === "all" ? "כל השירים" : songs.find((s:Song) => s.id.toString() === value)?.title || ""
              }
            >
              <MenuItem value="all">כל השירים</MenuItem>
              {songs.map((song: Song) => (
                <MenuItem key={song.id} value={song.id.toString()}>
                  {song.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="time-range-selector">
            <button
              className={`time-range-button ${timeRange === "week" ? "active" : ""}`}
              onClick={() => setTimeRange("week")}
            >
              שבוע
            </button>
            <button
              className={`time-range-button ${timeRange === "month" ? "active" : ""}`}
              onClick={() => setTimeRange("month")}
            >
              חודש
            </button>
            <button
              className={`time-range-button ${timeRange === "year" ? "active" : ""}`}
              onClick={() => setTimeRange("year")}
            >
              שנה
            </button>
          </div>
        </div>
      </Box>

      <Grid container spacing={3} className="stats-cards">
        <Grid item xs={12} md={4}>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <PlayCircle className="stat-icon" />
            </div>
            <div className="stat-content">
              <Typography variant="h3" className="stat-value">
                {chartData.totalPlays || 0}
              </Typography>
              <Typography variant="body1" className="stat-label">
                סה"כ השמעות
              </Typography>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <MessageSquare className="stat-icon" />
            </div>
            <div className="stat-content">
              <Typography variant="h3" className="stat-value">
                {chartData.totalComments || 0}
              </Typography>
              <Typography variant="body1" className="stat-label">
                סה"כ תגובות
              </Typography>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Music className="stat-icon" />
            </div>
            <div className="stat-content">
              <Typography variant="h3" className="stat-value">
                {selectedSong === "all" ? songs.length : 1}
              </Typography>
              <Typography variant="body1" className="stat-label">
                שירים
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={3} className="charts-container">
        <Grid item xs={12} lg={8}>
          <div className="chart-card">
            <div className="chart-header">
              <Typography variant="h6" className="chart-title">
                {timeRange === "week"
                  ? "השמעות לפי יום בשבוע"
                  : timeRange === "month"
                    ? "השמעות ב-30 הימים האחרונים"
                    : "השמעות לפי חודש"}
              </Typography>
              <Calendar size={18} className="chart-icon" />
            </div>
            <div className="time-series-chart">
              {timeSeriesData?.map((item: any) => (
                <div key={item.day || item.month || item.date} className="chart-bar-container">
                  <div className="chart-bar-label">{item.plays}</div>
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(item.plays / maxValue) * 100}%`,
                      background: `linear-gradient(to top, #ff6b00, #ff9d45)`,
                    }}
                  />
                  <div className="chart-bar-day">{item.day || item.month || item.date}</div>
                </div>
              ))}
            </div>
          </div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <div className="chart-card">
            <div className="chart-header">
              <Typography variant="h6" className="chart-title">
                התפלגות ז'אנרים
              </Typography>
              <BarChart2 size={18} className="chart-icon" />
            </div>
            <div className="pie-chart">
              {chartData.genres &&
                Object.entries(chartData.genres).map(([genre, value]: [string, any], index) => (
                  <div key={genre} className="pie-segment">
                    <div className="pie-label">{genre}</div>
                    <div className="pie-bar-container">
                      <div
                        className="pie-bar"
                        style={{
                          width: `${value}%`,
                          background: `linear-gradient(to right, #ff6b00, #ff9d45)`,
                          opacity: 0.5 + index * 0.1,
                        }}
                      />
                      <div className="pie-value">{value}%</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Grid>

        <Grid item xs={12}>
          <div className="chart-card">
            <div className="chart-header">
              <Typography variant="h6" className="chart-title">
                המאזינים המובילים
              </Typography>
              <Users size={18} className="chart-icon" />
            </div>
            <div className="listeners-chart">
              {chartData.topListeners?.map((listener: any, index: number) => (
                <div key={index} className="listener-item">
                  <div className="listener-rank">{index + 1}</div>
                  <div className="listener-name">{listener.name}</div>
                  <div className="listener-bar-container">
                    <div
                      className="listener-bar"
                      style={{
                        width: `${(listener.plays / chartData.topListeners[0].plays) * 100}%`,
                        background: `linear-gradient(to right, #ff6b00, #ff9d45)`,
                      }}
                    />
                  </div>
                  <div className="listener-plays">{listener.plays} השמעות</div>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SongAnalytics
