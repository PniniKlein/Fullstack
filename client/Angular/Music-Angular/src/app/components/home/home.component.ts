import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import  { DisplayUserService } from "../../services/display-user/display-user.service"
import  { SongService } from "../../services/song/song.service"
import  { User } from "../../models/User"
import  { Song } from "../../models/Song"
import  { Comment } from "../../models/Comment"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit {
  users: User[] = []
  songs: Song[] = []
  comments: Comment[] = []

  // Dashboard statistics
  totalUsers = 0
  totalSongs = 0
  totalComments = 0
  activeUsers = 0

  // Top artists (users with most public songs)
  topArtists: { user: User; songCount: number; commentCount: number }[] = []

  // Popular songs
  popularSongs: { song: Song; artist: string; commentCount: number; averageRating: number }[] = []

  // Recent activity
  recentActivity: {
    type: string
    user: User
    song?: Song
    comment?: Comment
    time: string
  }[] = []

  // Loading states
  isLoading = true

  constructor(
    private displayUserService: DisplayUserService,
    private songService: SongService,
  ) {}

  ngOnInit(): void {
    this.loadData()
  }

  loadData(): void {
    // Load both users and songs data
    this.isLoading = true

    // Get users first
    this.displayUserService.getUsers()
    this.displayUserService.users.subscribe((users) => {
      this.users = users || []

      // Then get songs
      this.songService.getSongs()
      this.songService.songs.subscribe((songs) => {
        this.songs = songs || []

        // Process the data
        this.calculateStatistics()
        this.findTopArtists()
        this.findPopularSongs()
        this.generateRecentActivity()

        this.isLoading = false
      })
    })
  }

  calculateStatistics(): void {
    // Total users
    this.totalUsers = this.users.length

    // Total songs
    this.totalSongs = this.songs.length

    // Total comments
    this.totalComments = this.songs.reduce((total, song) => {
      return total + (song.comments?.length || 0)
    }, 0)

    // Active users (users who have uploaded songs)
    const userIdsWithSongs = new Set(this.songs.map((song) => song.userId))
    this.activeUsers = userIdsWithSongs.size
  }

  findTopArtists(): void {
    // Create a map to count public songs per user
    const userPublicSongCount = new Map<number, number>()
    const userCommentCount = new Map<number, number>()

    // Count public songs per user
    this.songs.forEach((song) => {
      if (song.isPublic) {
        const userId = song.userId
        userPublicSongCount.set(userId, (userPublicSongCount.get(userId) || 0) + 1)
        userCommentCount.set(userId, (userCommentCount.get(userId) || 0) + (song.comments?.length || 0))
      }
    })

    // Convert to array and sort by song count
    const artistStats = Array.from(userPublicSongCount.entries()).map(([userId, songCount]) => {
      const user = this.users.find((u) => u.id === userId)
      return {
        user: user!,
        songCount,
        commentCount: userCommentCount.get(userId) || 0,
      }
    })

    // Sort by public song count (descending)
    artistStats.sort((a, b) => b.songCount - a.songCount)

    // Take top 5
    this.topArtists = artistStats.slice(0, 8)
  }

  findPopularSongs(): void {
    // Create array of songs with additional info
    const songsWithStats = this.songs.map((song) => {
      const artist = this.users.find((user) => user.id === song.userId)
      const commentCount = song.comments?.length || 0

      // Calculate average rating
      let averageRating = 0
      if (song.comments && song.comments.length > 0) {
        const totalStars = song.comments.reduce((sum, comment) => sum + comment.star, 0)
        averageRating = totalStars / song.comments.length
      }

      return {
        song,
        artist: artist ? artist.userName : "Unknown Artist",
        commentCount,
        averageRating,
      }
    })

    // Sort by average rating (descending)
    songsWithStats.sort((a, b) => b.averageRating - a.averageRating)

    // Take top 5
    this.popularSongs = songsWithStats.slice(0, 5)
  }

  generateRecentActivity(): void {
    const activities = []

    // Get recent songs (sort by creation date)
    const recentSongs = [...this.songs]
      .sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())
      .slice(0, 3)

    // Add song uploads to activities
    for (const song of recentSongs) {
      const user = this.users.find((u) => u.id === song.userId)
      if (user) {
        activities.push({
          type: "song_upload",
          user,
          song,
          time: this.getRelativeTime(new Date(song.create_at)),
        })
      }
    }

    // Get all comments from all songs
    const allComments: { comment: Comment; song: Song }[] = []
    this.songs.forEach((song) => {
      if (song.comments && song.comments.length > 0) {
        song.comments.forEach((comment) => {
          allComments.push({ comment, song })
        })
      }
    })

    // Sort comments by date
    allComments.sort((a, b) => new Date(b.comment.create_at).getTime() - new Date(a.comment.create_at).getTime())

    // Add recent comments to activities
    for (const { comment, song } of allComments.slice(0, 3)) {
      const user = this.users.find((u) => u.id === comment.userId)
      if (user) {
        activities.push({
          type: "comment",
          user,
          song,
          comment,
          time: this.getRelativeTime(new Date(comment.create_at)),
        })
      }
    }

    // Get recent users (sort by creation date)
    const recentUsers = [...this.users]
      .sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())
      .slice(0, 2)

    // Add user joins to activities
    for (const user of recentUsers) {
      activities.push({
        type: "user_joined",
        user,
        time: this.getRelativeTime(new Date(user.create_at)),
      })
    }

    // Sort all activities by estimated time
    activities.sort((a, b) => {
      // Convert relative time strings to approximate timestamps for sorting
      const getTimeValue = (timeStr: string) => {
        if (timeStr.includes("minutes") || timeStr.includes("דקות")) return 1
        if (timeStr.includes("hours") || timeStr.includes("שעות")) return 2
        if (timeStr.includes("yesterday") || timeStr.includes("אתמול")) return 3
        if (timeStr.includes("days") || timeStr.includes("ימים")) return 4
        return 5 // older
      }

      return getTimeValue(a.time) - getTimeValue(b.time)
    })

    // // Make sure we have at least one activity
    // if (activities.length === 0) {
    //   // If no real activities, create a fallback activity
    //   if (this.users.length > 0) {
    //     const randomUser = this.users[Math.floor(Math.random() * this.users.length)]
    //     activities.push({
    //       type: "user_joined",
    //       user: randomUser,
    //       time: "1 hour ago",
    //     })
    //   }
    // }

    this.recentActivity = activities.slice(0, 5)
  }

  getRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins} minutes ago`
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`
    } else if (diffDays === 1) {
      return `yesterday`
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString("en-US")
    }
  }

  // Helper method to get user avatar URL
  getUserAvatar(user: User): string {
    return (
      user.pathProfile ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.userName)}&background=D59039&color=fff`
    )
  }

  // Helper method to get song cover URL
  getSongCover(song: Song): string {
    return (
      song.pathPicture ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(song.title.charAt(0))}&background=D59039&color=fff`
    )
  }

  // Helper method to format numbers with commas
  formatNumber(num: number): string {
    return num.toLocaleString()
  }

  // Helper method to get star rating display
  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5

    let stars = "★".repeat(fullStars)
    if (halfStar) stars += "½"
    stars += "☆".repeat(5 - Math.ceil(rating))

    return stars
  }
}
