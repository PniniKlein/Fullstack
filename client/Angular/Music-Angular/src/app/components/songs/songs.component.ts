import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { SongService } from "../../services/song/song.service"
import { Song } from "../../models/Song"

@Component({
  selector: "app-songs",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./songs.component.html",
  styleUrl: "./songs.component.css",
})
export class SongsComponent implements OnInit {
  songs = this.songService.songs
  searchTerm = ""
  activeFilter = "all"
  sortBy = "date"
  sortDirection: "asc" | "desc" = "desc"
  showConfirmDialog = false
  songToDelete: number | null = null
  isLoading = true // הוספת משתנה לניהול מצב הטעינה

  // Player state
  currentlyPlaying: any | null = null
  isPlaying = false
  currentTime = "0:00"
  progressPercent = 0
  audioElement: HTMLAudioElement | null = null

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.loadSongs()
  }

  loadSongs(): void {
    this.isLoading = true // מגדיר את מצב הטעינה לפני הבקשה
    this.songService.getSongs()

    // מאזין לשינויים בנתונים
    this.songService.songs.subscribe({
      next: () => {
        // כאשר הנתונים מגיעים, מעדכן את מצב הטעינה
        // setTimeout(() => {
          this.isLoading = false
        // }, 1000) // השהייה קטנה כדי להראות את אנימציית הטעינה
      },
      error: () => {
        this.isLoading = false // במקרה של שגיאה, מעדכן את מצב הטעינה
      },
    })
  }

  get filteredSongs() {
    let result = [...this.songs.value]

    // Filter by search term
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase()
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(searchLower) ||
          (song.gener && song.gener.toLowerCase().includes(searchLower)),
      )
    }

    // Filter by active filter
    if (this.activeFilter === "popular") {
      // Sort by play count (highest first)
      result = result.sort((a, b) => (b.plays || 0) - (a.plays || 0))
      result = result.slice(0, 15) // Only show 15 most popular songs
    } else if (this.activeFilter === "recent") {
      result = result.sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())
      result = result.slice(0, 15) // Only show 15 most recent songs
    } else if (this.activeFilter === "public") {
      // Show only public songs
      result = result.filter((song) => song.isPublic === true)
    } else if (this.activeFilter === "private") {
      // Show only private songs
      result = result.filter((song) => song.isPublic === false)
    }

    // Sort by selected field
    result.sort((a, b) => {
      let comparison = 0

      switch (this.sortBy) {
        case "name":
          comparison = a.title.localeCompare(b.title)
          break
        case "plays":
          comparison = (b.plays || 0) - (a.plays || 0)
          break
        case "visibility":
          comparison = a.isPublic === b.isPublic ? 0 : a.isPublic ? -1 : 1
          break
        case "date":
        default:
          comparison = new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
          break
      }

      return this.sortDirection === "asc" ? -comparison : comparison
    })

    return result
  }

  calculateStarRating(song: Song): number {
    if (!song.comments || song.comments.length === 0) {
      return 0
    }

    const totalStars = song.comments.reduce((sum, comment) => sum + (comment.star || 0), 0)
    return totalStars / song.comments.length
  }

  getStarArray(song: Song): number[] {
    const rating = this.calculateStarRating(song)
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = Array(5).fill(0)

    for (let i = 0; i < fullStars; i++) {
      stars[i] = 1
    }

    if (hasHalfStar && fullStars < 5) {
      stars[fullStars] = 0.5
    }

    return stars
  }

  setFilter(filter: string): void {
    this.activeFilter = filter
  }

  sortSongs(field: string): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc"
    } else {
      this.sortBy = field
      this.sortDirection = "asc"
    }
  }

  deleteSong(id: number): void {
    this.songToDelete = id
    this.showConfirmDialog = true
  }

  confirmDelete(): void {
    if (this.songToDelete !== null) {
      this.songService.deleteSong(this.songToDelete)
      this.cancelDelete()
    }
  }

  cancelDelete(): void {
    this.songToDelete = null
    this.showConfirmDialog = false
  }

  playSong(song: any): void {
    // If we're already playing this song, just toggle play/pause
    if (this.currentlyPlaying && this.currentlyPlaying.id === song.id) {
      this.togglePlay()
      return
    }

    // Stop current audio if any
    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement = null
    }

    this.currentlyPlaying = song

    // Create new audio element
    this.audioElement = new Audio(song.pathSong || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3")

    // Set up event listeners
    this.audioElement.addEventListener("timeupdate", this.updateProgress.bind(this))
    this.audioElement.addEventListener("ended", this.onSongEnded.bind(this))
    this.audioElement.addEventListener("canplay", () => {
      if (this.audioElement) {
        this.audioElement.play()
        this.isPlaying = true
      }
    })

    // Load and play
    this.audioElement.load()
    this.progressPercent = 0
    this.currentTime = "0:00"
  }

  togglePlay(): void {
    if (!this.audioElement) return

    if (this.isPlaying) {
      this.audioElement.pause()
    } else {
      this.audioElement.play()
    }

    this.isPlaying = !this.isPlaying
  }

  stopPlayback(): void {
    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement = null
    }
    this.currentlyPlaying = null
    this.isPlaying = false
  }

  updateProgress(): void {
    if (!this.audioElement) return

    const duration = this.audioElement.duration
    const currentTime = this.audioElement.currentTime

    if (duration) {
      // Update progress percentage
      this.progressPercent = (currentTime / duration) * 100

      // Update current time display
      this.currentTime = this.secondsToTime(Math.floor(currentTime))
    }
  }

  onSongEnded(): void {
    this.progressPercent = 100
    this.isPlaying = false

    // Auto-play next song
    this.navigateToNextSong()
  }

  seekToPosition(event: MouseEvent): void {
    if (!this.audioElement) return

    const timeline = event.currentTarget as HTMLElement
    const rect = timeline.getBoundingClientRect()
    const clickPosition = (event.clientX - rect.left) / rect.width

    // Set the current time based on click position
    this.audioElement.currentTime = this.audioElement.duration * clickPosition
  }

  setVolume(event: Event): void {
    if (!this.audioElement) return

    const volumeSlider = event.target as HTMLInputElement
    this.audioElement.volume = Number(volumeSlider.value) / 100
  }

  // Helper functions
  durationToSeconds(duration: string): number {
    if (!duration) return 0

    const parts = duration.split(":")
    return Number.parseInt(parts[0]) * 60 + Number.parseInt(parts[1])
  }

  secondsToTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  getArtistName(userId: number): string {

    const artistMap: { [key: number]: string } = {
      1: "John Doe",
      2: "Sarah Johnson",
      3: "Michael Brown",
    }
    return artistMap[userId] || "Unknown Artist"
  }

  getCommentCount(song: Song): number {
    return song.comments?.length || 0
  }

  getVisibilityLabel(isPublic: boolean): string {
    return isPublic ? "Public" : "Private"
  }

  navigateToPreviousSong(): void {
    if (!this.currentlyPlaying) return
    const currentSongs = this.filteredSongs
    const currentIndex = currentSongs.findIndex((song) => song.id === this.currentlyPlaying.id)
    if (currentIndex > 0) {
      this.playSong(currentSongs[currentIndex - 1])
    }
  }
  navigateToNextSong(): void {
    if (!this.currentlyPlaying) return
    const currentSongs = this.filteredSongs
    const currentIndex = currentSongs.findIndex((song) => song.id === this.currentlyPlaying.id)
    if (currentIndex < currentSongs.length - 1) {
      this.playSong(currentSongs[currentIndex + 1])
    }
  }
}
