"use client"

import { useEffect, useState } from "react"
import { Box, InputBase, Select, MenuItem, FormControl, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import type { Song } from "../model/Song"
import {
  Search,
  ArrowDownAZ,
  ArrowUpAZ,
  Calendar,
  Music,
  SlidersHorizontal,
  Headphones,
  X,
  Grid,
  List,
  Play,
  Clock,
} from "lucide-react"
import "../css/PublicSongs.css"
import type { JSX } from "react"

const PublicSongs = () => {
  const user = useSelector((state: StoreType) => state.user.user)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const genres = ["פופ", "רוק", "אלקטרוני", "היפ הופ", "ג'אז", "קלאסי", "מזרחית", "ישראלי", "אחר"]

  useEffect(() => {
    const publicSongs = user.songs?.filter((song: Song) => song.isPublic) || []

    let filtered = [...publicSongs]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (song:Song) =>
          song.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.gener?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply genre filter
    if (selectedGenre) {
      filtered = filtered.filter((song:Song) => song.gener === selectedGenre)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a:Song, b:Song) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())
        break
      case "oldest":
        filtered.sort((a:Song, b:Song) => new Date(a.create_at).getTime() - new Date(b.create_at).getTime())
        break
      case "title_asc":
        filtered.sort((a:Song, b:Song) => a.title.localeCompare(b.title))
        break
      case "title_desc":
        filtered.sort((a:Song, b:Song) => b.title.localeCompare(a.title))
        break
      case "plays":
        filtered.sort((a:Song, b:Song) => (b.plays || 0) - (a.plays || 0))
        break
      case "genre":
        filtered.sort((a:Song, b:Song) => (a.gener || "").localeCompare(b.gener || ""))
        break
      default:
        break
    }

    setFilteredSongs(filtered)
  }, [user.songs, searchTerm, sortBy, selectedGenre])

  const handleGenreSelect = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null)
    } else {
      setSelectedGenre(genre)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("he-IL", { year: "numeric", month: "numeric", day: "numeric" })
  }

  return (
    <div className="songs-container">
      <div className="filter-bar">
        <div className="search-wrapper">
          <div className="search-field">
            <Search size={18} className="search-icon" />
            <InputBase
              placeholder="חפש לפי שם או ז'אנר..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="filter-actions">
          <div className="view-toggle">
            <button
              className={`view-button ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="תצוגת רשת"
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-button ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="תצוגת רשימה"
            >
              <List size={18} />
            </button>
          </div>

          <button
            className={`filter-toggle ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} />
            <span>סינון</span>
          </button>

          <FormControl className="sort-field">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              displayEmpty
              renderValue={(value) => {
                const options: Record<string, JSX.Element> = {
                  newest: (
                    <div className="sort-option">
                      <Calendar size={16} />
                      <span>החדש ביותר</span>
                    </div>
                  ),
                  oldest: (
                    <div className="sort-option">
                      <Calendar size={16} />
                      <span>הישן ביותר</span>
                    </div>
                  ),
                  title_asc: (
                    <div className="sort-option">
                      <ArrowDownAZ size={16} />
                      <span>שם (א-ת)</span>
                    </div>
                  ),
                  title_desc: (
                    <div className="sort-option">
                      <ArrowUpAZ size={16} />
                      <span>שם (ת-א)</span>
                    </div>
                  ),
                  plays: (
                    <div className="sort-option">
                      <Headphones size={16} />
                      <span>השמעות</span>
                    </div>
                  ),
                  genre: (
                    <div className="sort-option">
                      <Music size={16} />
                      <span>ז'אנר</span>
                    </div>
                  ),
                }
                return options[value as string] || "מיון"
              }}
            >
              <MenuItem value="newest">
                <div className="sort-option">
                  <Calendar size={16} />
                  <span>החדש ביותר</span>
                </div>
              </MenuItem>
              <MenuItem value="oldest">
                <div className="sort-option">
                  <Calendar size={16} />
                  <span>הישן ביותר</span>
                </div>
              </MenuItem>
              <MenuItem value="title_asc">
                <div className="sort-option">
                  <ArrowDownAZ size={16} />
                  <span>שם (א-ת)</span>
                </div>
              </MenuItem>
              <MenuItem value="title_desc">
                <div className="sort-option">
                  <ArrowUpAZ size={16} />
                  <span>שם (ת-א)</span>
                </div>
              </MenuItem>
              <MenuItem value="plays">
                <div className="sort-option">
                  <Headphones size={16} />
                  <span>השמעות</span>
                </div>
              </MenuItem>
              <MenuItem value="genre">
                <div className="sort-option">
                  <Music size={16} />
                  <span>ז'אנר</span>
                </div>
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-group">
            <div className="filter-label">סנן לפי ז'אנר</div>
            <div className="filter-options">
              {genres.map((genre) => (
                <div
                  key={genre}
                  className={`filter-chip ${selectedGenre === genre ? "active" : ""}`}
                  onClick={() => handleGenreSelect(genre)}
                >
                  {genre}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="results-info">
        <span className="results-count">{filteredSongs.length} שירים</span>
        {searchTerm && <span className="search-query">תוצאות עבור: "{searchTerm}"</span>}
        {selectedGenre && (
          <div className="selected-genre">
            <span>{selectedGenre}</span>
            <button className="remove-genre" onClick={() => setSelectedGenre(null)}>
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {filteredSongs.length > 0 ? (
        viewMode === "grid" ? (
          <div className="songs-grid">
            {filteredSongs.map((song) => (
              <div className="song-card" key={song.id}>
                <div className="song-image-container">
                  <img
                    src={song.pathPicture || "/placeholder.svg?height=200&width=200"}
                    alt={song.title}
                    className="song-image"
                  />
                  <div className="song-overlay">
                    <button className="play-button">
                      <Play size={20} />
                    </button>
                  </div>
                </div>
                <div className="song-info">
                  <div className="song-header">
                    <Typography className="song-title">{song.title}</Typography>
                    <div className="song-genre">{song.gener || "ללא ז'אנר"}</div>
                  </div>
                  <Typography className="song-artist">{user.userName || "אמן לא ידוע"}</Typography>
                  <div className="song-meta">
                    <div className="play-count">
                      <Headphones size={14} />
                      <span>{song.plays || 0}</span>
                    </div>
                    <div className="song-date">
                      <Clock size={14} />
                      <span>{formatDate(song.create_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="songs-list">
            {filteredSongs.map((song) => (
              <div className="song-list-item" key={song.id}>
                <div className="song-list-image">
                  <img
                    src={song.pathPicture || "/placeholder.svg?height=80&width=80"}
                    alt={song.title}
                    className="song-image"
                  />
                  <button className="play-button-small">
                    <Play size={16} />
                  </button>
                </div>
                <div className="song-list-info">
                  <div className="song-list-title">{song.title}</div>
                  <div className="song-list-artist">{user.userName || "אמן לא ידוע"}</div>
                </div>
                <div className="song-list-genre">{song.gener || "ללא ז'אנר"}</div>
                <div className="song-list-plays">
                  <Headphones size={14} />
                  <span>{song.plays || 0}</span>
                </div>
                <div className="song-list-date">{formatDate(song.create_at)}</div>
              </div>
            ))}
          </div>
        )
      ) : (
        <Box className="no-songs">
          {searchTerm ? (
            <>לא נמצאו שירים התואמים לחיפוש "{searchTerm}"</>
          ) : (
            <>אין שירים ציבוריים. הוסף שירים או הפוך שירים פרטיים לציבוריים.</>
          )}
        </Box>
      )}
    </div>
  )
}

export default PublicSongs
