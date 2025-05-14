import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import Chart from "chart.js/auto"
import { DisplayUserService } from "../../services/display-user/display-user.service"
import { SongService } from "../../services/song/song.service"
import { User } from "../../models/User"
import { Song } from "../../models/Song"
import * as XLSX from "xlsx"

@Component({
  selector: "app-graphes",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./graphes.component.html",
  styleUrl: "./graphes.component.css",
})
export class GraphesComponent implements OnInit, AfterViewInit {
  @ViewChild("userGrowthChart") userGrowthChartRef!: ElementRef
  @ViewChild("songUploadsChart") songUploadsChartRef!: ElementRef
  @ViewChild("userEngagementChart") userEngagementChartRef!: ElementRef
  @ViewChild("genresChart") genresChartRef!: ElementRef

  // Data from services
  users: User[] = []
  songs: Song[] = []

  // Dashboard statistics
  totalUsers = 0
  totalSongs = 0
  totalComments = 0
  activeUsers = 0

  // Chart settings
  selectedPeriod = "month"
  userGrowthView = "weekly"
  songUploadsView = "weekly"

  // Charts
  userGrowthChart: any
  songUploadsChart: any
  userEngagementChart: any
  genresChart: any

  // Loading state
  isLoading = true

  // Top songs table data
  topSongs: {
    name: string
    artist: string
    thumbnail: string
    plays: number
    rating: number
    conversion: number
  }[] = []

  // Active users table data
  activeUsersList: {
    name: string
    avatar: string
    songs: number
    followers: number
    activity: number
    lastActive: string
  }[] = []

  // Chart data
  userGrowthData: number[] = []
  songUploadsData: number[] = []
  userEngagementData: number[] = []
  genreData: Record<string, number> = {}

  // Flag to track if charts are initialized
  chartsInitialized = false

  constructor(
    private displayUserService: DisplayUserService,
    private songService: SongService,
  ) {}

  ngOnInit(): void {
    // Always load data from services first
    this.loadData()
  }

  ngAfterViewInit(): void {
    // If data is already loaded, initialize charts
    if (!this.isLoading && !this.chartsInitialized) {
      setTimeout(() => {
        this.initCharts()
      }, 100)
    }
  }

  loadData(): void {
    this.isLoading = true
    this.displayUserService.getUsers()
    this.displayUserService.users.subscribe((users) => {
      this.users = users || []
      this.songService.getSongs()
      this.songService.songs.subscribe((songs) => {
        this.songs = songs || []
        this.calculateStatistics()
        this.generateTopSongs()
        this.generateActiveUsers()
        this.prepareChartData()
        this.saveDataToLocalStorage()
        this.isLoading = false
        this.initCharts()
      })
    })
  }

  prepareChartData(): void {
    this.userGrowthData = this.getUserGrowthData()
    this.songUploadsData = this.getSongUploadsData()
    this.userEngagementData = this.getUserEngagementData()
    this.genreData = this.getGenreData()
  }

  saveDataToLocalStorage(): void {
    try {
      const dataToSave = {
        stats: {
          totalUsers: this.totalUsers,
          totalSongs: this.totalSongs,
          totalComments: this.totalComments,
          activeUsers: this.activeUsers,
        },
        chartData: {
          userGrowth: this.userGrowthData,
          songUploads: this.songUploadsData,
          userEngagement: this.userEngagementData,
          genres: this.genreData,
        },
        topSongs: this.topSongs,
        activeUsersList: this.activeUsersList,
        timestamp: new Date().getTime(),
      }

      localStorage.setItem("singsong_charts_data", JSON.stringify(dataToSave))
      console.log("Chart data saved to localStorage")
    } catch (error) {
      console.error("Error saving data to localStorage:", error)
    }
  }

  loadDataFromLocalStorage(): boolean {
    try {
      const savedData = localStorage.getItem("singsong_charts_data")
      if (!savedData) return false
      const parsedData = JSON.parse(savedData)
      if (parsedData.stats) {
        this.totalUsers = parsedData.stats.totalUsers || 0
        this.totalSongs = parsedData.stats.totalSongs || 0
        this.totalComments = parsedData.stats.totalComments || 0
        this.activeUsers = parsedData.stats.activeUsers || 0
      }
      if (parsedData.chartData) {
        this.userGrowthData = parsedData.chartData.userGrowth || []
        this.songUploadsData = parsedData.chartData.songUploads || []
        this.userEngagementData = parsedData.chartData.userEngagement || []
        this.genreData = parsedData.chartData.genres || {}
      }
      if (parsedData.topSongs) this.topSongs = parsedData.topSongs
      if (parsedData.activeUsersList) this.activeUsersList = parsedData.activeUsersList
      console.log("Chart data loaded from localStorage")
      return true
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
      return false
    }
  }

  calculateStatistics(): void {
    this.totalUsers = this.users.length
    this.totalSongs = this.songs.length
    this.totalComments = this.songs.reduce((total, song) => {
      return total + (song.comments?.length || 0)
    }, 0)
    const userIdsWithSongs = new Set(this.songs.map((song) => song.userId))
    this.activeUsers = userIdsWithSongs.size
  }

  generateTopSongs(): void {
    const songsWithStats = this.songs.map((song) => {
      const artist = this.users.find((user) => user.id === song.userId)
      const commentCount = song.comments?.length || 0
      let averageRating = 0
      if (song.comments && song.comments.length > 0) {
        const totalStars = song.comments.reduce((sum, comment) => sum + comment.star, 0)
        averageRating = totalStars / song.comments.length
      }
      const plays = song.plays
      const rating = averageRating
      const conversion = plays > 0 ? Math.round((averageRating / 5) * 100) : 0
      return {
        name: song.title,
        artist: artist ? artist.userName : "Unknown Artist",
        thumbnail:
          song.pathPicture ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(song.title.charAt(0))}&background=D59039&color=fff`,
        plays,
        rating: averageRating,
        conversion,
      }
    })
    songsWithStats.sort((a, b) => b.plays - a.plays)
    this.topSongs = songsWithStats.slice(0, 4)
  }

  generateActiveUsers(): void {
    const userSongCount = new Map<number, number>()
    this.songs.forEach((song) => {
      const userId = song.userId
      userSongCount.set(userId, (userSongCount.get(userId) || 0) + 1)
    })
    const usersWithStats = this.users
      .filter((user) => userSongCount.has(user.id))
      .map((user) => {
        const songCount = userSongCount.get(user.id) || 0
        const followers = user.followers?.length ||0
        const maxSongs = Math.max(...Array.from(userSongCount.values()))
        const activity = maxSongs > 0 ? Math.round((songCount / maxSongs) * 100) : 0
        const lastActive = this.getRandomLastActive()
        return {
          name: user.userName,
          avatar:
            user.pathProfile ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&background=D59039&color=fff`,
          songs: songCount,
          followers,
          activity,
          lastActive,
        }
      })
    usersWithStats.sort((a, b) => b.activity - a.activity)
    this.activeUsersList = usersWithStats.slice(0, 4)
  }

  getRandomLastActive(): string {
    const options = ["Today", "Today", "Today", "Yesterday", "Yesterday", "2 days ago", "3 days ago"]
    return options[Math.floor(Math.random() * options.length)]
  }

  initCharts(): void {
    if (
      !this.userGrowthChartRef?.nativeElement ||
      !this.songUploadsChartRef?.nativeElement ||
      !this.userEngagementChartRef?.nativeElement ||
      !this.genresChartRef?.nativeElement
    ) {
      console.warn("Chart references not available, retrying in 100ms")
      setTimeout(() => this.initCharts(), 100)
      return
    }

    try {
      // Check if we need to load data from localStorage
      if (this.userGrowthData.length === 0) {
        // Try to load from localStorage first
        const loaded = this.loadDataFromLocalStorage()

        // If loading failed and we still don't have data, generate it
        if (!loaded || this.userGrowthData.length === 0) {
          this.prepareChartData()
        }
      }

      // User Growth Chart
      const userGrowthCtx = this.userGrowthChartRef.nativeElement.getContext("2d")
      if (this.userGrowthChart) {
        this.userGrowthChart.destroy()
      }
      this.userGrowthChart = new Chart(userGrowthCtx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "New Users",
              data: this.userGrowthData,
              borderColor: "#d59039",
              backgroundColor: "rgba(213, 144, 57, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: this.getChartOptions("Users"),
      })

      // Song Uploads Chart
      const songUploadsCtx = this.songUploadsChartRef.nativeElement.getContext("2d")
      if (this.songUploadsChart) {
        this.songUploadsChart.destroy()
      }
      this.songUploadsChart = new Chart(songUploadsCtx, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Song Uploads",
              data: this.songUploadsData,
              backgroundColor: "rgba(213, 144, 57, 0.7)",
              borderColor: "rgba(213, 144, 57, 1)",
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: this.getChartOptions("Songs"),
      })

      // User Engagement Chart
      const userEngagementCtx = this.userEngagementChartRef.nativeElement.getContext("2d")
      if (this.userEngagementChart) {
        this.userEngagementChart.destroy()
      }
      this.userEngagementChart = new Chart(userEngagementCtx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Active Users",
              data: this.userEngagementData,
              borderColor: "#5ac8fa",
              backgroundColor: "rgba(90, 200, 250, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: this.getChartOptions("Users"),
      })

      // Genres Chart
      const genresCtx = this.genresChartRef.nativeElement.getContext("2d")
      if (this.genresChart) {
        this.genresChart.destroy()
      }
      this.genresChart = new Chart(genresCtx, {
        type: "doughnut",
        data: {
          labels: Object.keys(this.genreData),
          datasets: [
            {
              data: Object.values(this.genreData),
              backgroundColor: ["#d59039", "#5ac8fa", "#ff6b6b", "#4cd964", "#ffcc00", "#8e8e93"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                color: "#a0a0a0",
                font: {
                  size: 12,
                },
                padding: 20,
              },
            },
          },
        },
      })

      this.chartsInitialized = true
      console.log("Charts initialized successfully")

      // Save data to localStorage after successful initialization
      this.saveDataToLocalStorage()
    } catch (error) {
      console.error("Error initializing charts:", error)
    }
  }

  getUserGrowthData(): number[] {
    const usersByMonth = Array(12).fill(0)

    this.users.forEach((user) => {
      const date = new Date(user.create_at)
      const month = date.getMonth()
      usersByMonth[month]++
    })

    return usersByMonth
  }

  getSongUploadsData(): number[] {
    const songsByMonth = Array(12).fill(0)

    this.songs.forEach((song) => {
      const date = new Date(song.create_at)
      const month = date.getMonth()
      songsByMonth[month]++
    })

    return songsByMonth
  }

  getUserEngagementData(): number[] {
    // For this example, we'll create simulated engagement data
    // In a real app, you might have user login data or activity logs
    const daysOfWeek = Array(7).fill(0)

    // Distribute active users across days of week
    const activeUserCount = this.activeUsers

    // Create a realistic distribution with higher activity on weekends
    daysOfWeek[0] = Math.floor(activeUserCount * 0.7) // Monday
    daysOfWeek[1] = Math.floor(activeUserCount * 0.65) // Tuesday
    daysOfWeek[2] = Math.floor(activeUserCount * 0.7) // Wednesday
    daysOfWeek[3] = Math.floor(activeUserCount * 0.75) // Thursday
    daysOfWeek[4] = Math.floor(activeUserCount * 0.85) // Friday
    daysOfWeek[5] = Math.floor(activeUserCount * 0.95) // Saturday
    daysOfWeek[6] = Math.floor(activeUserCount * 0.9) // Sunday

    return daysOfWeek
  }

  getGenreData(): Record<string, number> {
    const genres: Record<string, number> = {}

    this.songs.forEach((song) => {
      const genre = song.gener || "Other"
      if (!genres[genre]) {
        genres[genre] = 0
      }
      genres[genre]++
    })

    // If we have too many genres, consolidate the smaller ones into "Other"
    const sortedGenres = Object.entries(genres).sort((a, b) => b[1] - a[1])

    if (sortedGenres.length > 6) {
      const topGenres = sortedGenres.slice(0, 5)
      const otherGenres = sortedGenres.slice(5)

      const result: Record<string, number> = {}
      topGenres.forEach(([genre, count]) => {
        result[genre] = count
      })

      result["Other"] = otherGenres.reduce((sum, [_, count]) => sum + count, 0)
      return result
    }

    return genres
  }

  getChartOptions(yAxisLabel: string) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
          },
          ticks: {
            color: "#a0a0a0",
            font: {
              size: 12,
            },
          },
          title: {
            display: true,
            text: yAxisLabel,
            color: "#a0a0a0",
            font: {
              size: 12,
            },
          },
        },
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.05)",
          },
          ticks: {
            color: "#a0a0a0",
            font: {
              size: 12,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(30, 30, 30, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "#333333",
          borderWidth: 1,
          padding: 12,
          displayColors: false,
        },
      },
    }
  }

  exportData() {
    try {
      // יצירת workbook חדש
      const workbook = XLSX.utils.book_new()

      // הוספת גיליון סטטיסטיקות
      const statsData = [
        ["SingSong Analytics Report", ""],
        ["Generated on", new Date().toLocaleString()],
        ["Period", this.selectedPeriod],
        [""],
        ["Key Statistics", ""],
        ["Total Users", this.totalUsers],
        ["Total Songs", this.totalSongs],
        ["Total Comments", this.totalComments],
        ["Active Users", this.activeUsers],
      ]
      const statsSheet = XLSX.utils.aoa_to_sheet(statsData)
      XLSX.utils.book_append_sheet(workbook, statsSheet, "Statistics")

      // הוספת גיליון שירים מובילים
      const songsHeaders = ["Song Name", "Artist", "Plays", "Rating", "Conversion Rate (%)"]
      const songsData = this.topSongs.map((song) => [
        song.name,
        song.artist,
        song.plays,
        song.rating.toFixed(1),
        song.conversion,
      ])
      const songsSheet = XLSX.utils.aoa_to_sheet([songsHeaders, ...songsData])
      XLSX.utils.book_append_sheet(workbook, songsSheet, "Top Songs")

      // הוספת גיליון משתמשים פעילים
      const usersHeaders = ["User Name", "Songs", "Followers", "Activity (%)", "Last Active"]
      const usersData = this.activeUsersList.map((user) => [
        user.name,
        user.songs,
        user.followers,
        user.activity,
        user.lastActive,
      ])
      const usersSheet = XLSX.utils.aoa_to_sheet([usersHeaders, ...usersData])
      XLSX.utils.book_append_sheet(workbook, usersSheet, "Active Users")

      // הוספת גיליון ז'אנרים
      const genreData = this.getGenreData()
      const genresHeaders = ["Genre", "Count"]
      const genresData = Object.entries(genreData).map(([genre, count]) => [genre, count])
      const genresSheet = XLSX.utils.aoa_to_sheet([genresHeaders, ...genresData])
      XLSX.utils.book_append_sheet(workbook, genresSheet, "Genres")

      // הוספת גיליון כל המשתמשים
      const allUsersHeaders = ["ID", "Username", "Email", "Created At", "Songs Count"]
      const allUsersData = this.users.map((user) => [
        user.id,
        user.userName,
        user.email,
        new Date(user.create_at).toLocaleDateString(),
        this.songs.filter((s) => s.userId === user.id).length,
      ])
      const allUsersSheet = XLSX.utils.aoa_to_sheet([allUsersHeaders, ...allUsersData])
      XLSX.utils.book_append_sheet(workbook, allUsersSheet, "All Users")

      // הוספת גיליון כל השירים
      const allSongsHeaders = ["ID", "Title", "Artist", "Genre", "Created At", "Public", "Plays"]
      const allSongsData = this.songs.map((song) => {
        const artist = this.users.find((u) => u.id === song.userId)
        return [
          song.id,
          song.title,
          artist?.userName || "Unknown",
          song.gener || "Unknown",
          new Date(song.create_at).toLocaleDateString(),
          song.isPublic ? "Yes" : "No",
          song.plays || 0,
        ]
      })
      const allSongsSheet = XLSX.utils.aoa_to_sheet([allSongsHeaders, ...allSongsData])
      XLSX.utils.book_append_sheet(workbook, allSongsSheet, "All Songs")

      // ייצוא הקובץ
      XLSX.writeFile(workbook, `singsong-analytics-${new Date().toISOString().split("T")[0]}.xlsx`)
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("Failed to export data. Please try again.")
    }
  }
}
