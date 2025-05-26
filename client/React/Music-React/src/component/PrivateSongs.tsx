"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Box, Typography, Grid, InputBase, MenuItem, Select, FormControl } from "@mui/material"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { Song } from "../model/Song"
import type { StoreType } from "../store/store"
import SongCard from "./SongCard"
import { Search, ArrowDownAZ, ArrowUpAZ, Calendar, Music, SlidersHorizontal, Headphones, X } from "lucide-react"
import "../css/PrivateSongs.css"

const PrivateSongs = () => {
  const songs = useSelector((state: StoreType) => state.user.user.songs || [])
  const navigate = useNavigate()
  const [activeCardId, setActiveCardId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  const privateSongs = songs.filter((song: Song) => !song.isPublic)
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(privateSongs)

  const genres = ["פופ", "רוק", "אלקטרוני", "היפ הופ", "ג'אז", "קלאסי", "מזרחית", "ישראלי", "אחר"]

  useEffect(() => {
    let result = privateSongs.filter((song:Song) => song.title.toLowerCase().includes(searchTerm.toLowerCase()))

    // Apply genre filter
    if (selectedGenre) {
      result = result.filter((song:Song) => song.gener === selectedGenre)
    }

    // Sort the songs
    switch (sortBy) {
      case "newest":
        result = [...result].sort((a:Song, b:Song) => b.id - a.id)
        break
      case "oldest":
        result = [...result].sort((a:Song, b:Song) => a.id - b.id)
        break
      case "title_asc":
        result = [...result].sort((a:Song, b:Song) => a.title.localeCompare(b.title))
        break
      case "title_desc":
        result = [...result].sort((a:Song, b:Song) => b.title.localeCompare(a.title))
        break
      case "plays":
        result = [...result].sort((a:Song, b:Song) => (b.plays || 0) - (a.plays || 0))
        break
      case "genre":
        result = [...result].sort((a:Song, b:Song) => (a.gener || "").localeCompare(b.gener || ""))
        break
      default:
        break
    }

    setFilteredSongs(result)
  }, [privateSongs, searchTerm, sortBy, selectedGenre])

  const handleCardClick = (event: React.MouseEvent, songId: number) => {
    const target = event.target as HTMLElement
    if (target.closest("button, svg")) {
      return
    }
    setActiveCardId(songId)
    navigate(`/songComments/${songId}`)
  }

  const handleGenreSelect = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null)
    } else {
      setSelectedGenre(genre)
    }
  }

  return (
    <Box className="private-songs-section">
      <Box className="songs-header">
        <Typography variant="h4" className="section-title">
          השירים הפרטיים שלי
        </Typography>

        <Box className="songs-tools">
          <Box className="search-box">
            <Search className="search-icon" />
            <InputBase
              placeholder="חיפוש שירים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                <X size={16} />
              </button>
            )}
          </Box>

          <button
            className={`filter-toggle ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} />
            <span>סינון</span>
          </button>

          <FormControl className="sort-control">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              displayEmpty
              renderValue={(value) => {
                const options: Record<string, React.ReactNode> = {
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
                      <span>לפי השמעות</span>
                    </div>
                  ),
                  genre: (
                    <div className="sort-option">
                      <Music size={16} />
                      <span>לפי ז'אנר</span>
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
                  <span>לפי השמעות</span>
                </div>
              </MenuItem>
              <MenuItem value="genre">
                <div className="sort-option">
                  <Music size={16} />
                  <span>לפי ז'אנר</span>
                </div>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

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

      {filteredSongs.length === 0 ? (
        <Box className="no-songs-message">
          {searchTerm ? (
            <>
              <Typography variant="h6">לא נמצאו שירים התואמים לחיפוש</Typography>
              <Typography variant="body1">נסה לחפש מונחים אחרים</Typography>
            </>
          ) : (
            <>
              <Typography variant="h6">אין לך שירים פרטיים עדיין</Typography>
              <Typography variant="body1">שירים פרטיים נראים רק לך ולא מופיעים בספריית המוזיקה הציבורית</Typography>
            </>
          )}
        </Box>
      ) : (
        <Grid container spacing={3} className="songs-grid">
          {filteredSongs.map((song: Song) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={song.id}>
              <SongCard
                song={song}
                activeCardId={activeCardId}
                onCardClick={handleCardClick}
                setActiveCardId={setActiveCardId}
                showActions={true}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default PrivateSongs
