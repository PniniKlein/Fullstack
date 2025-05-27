"use client"

import type React from "react"
import { useMemo } from "react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import type { Song } from "../model/Song"
import type { StoreType } from "../store/store"
import SongCard from "./SongCard"
import SongsSearchFilter from "./SongsSearchFilter"
import { Lock, Award } from "lucide-react"
import "../css/PrivateSongs.css"

const PrivateSongs = () => {
  const songs = useSelector((state: StoreType) => state.user.user.songs || [])
  const navigate = useNavigate()
  const [activeCardId, setActiveCardId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  // const privateSongs = songs.filter((song: Song) => !song.isPublic)
  const privateSongs = useMemo(() => {
    return songs?.filter((song: Song) => song.isPublic) || []
  }, [songs])
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(privateSongs)

  // Get only genres that exist in private songs
  const availableGenres = Array.from(
    new Set(privateSongs.map((song: Song) => song.gener).filter((genre): genre is string => Boolean(genre))),
  ).sort()

  useEffect(() => {
    let result = privateSongs.filter((song: Song) => song.title.toLowerCase().includes(searchTerm.toLowerCase()))

    // Apply genre filter
    if (selectedGenre) {
      result = result.filter((song: Song) => song.gener === selectedGenre)
    }

    // Sort by newest first
    result = [...result].sort((a: Song, b: Song) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())

    setFilteredSongs(result)
  }, [privateSongs, searchTerm, selectedGenre])

  const handleCardClick = (event: React.MouseEvent, songId: number) => {
    const target = event.target as HTMLElement
    if (target.closest("button, svg")) {
      return
    }
    setActiveCardId(songId)
    navigate(`/songComments/${songId}`)
  }

  return (
    <div className="public-songs-container">
      {/* Background Effects */}
      <div className="private-songs-background-wrapper">
        <div className="private-songs-gradient-circle private-songs-circle-1"></div>
        <div className="private-songs-gradient-circle private-songs-circle-2"></div>
        <div className="private-songs-gradient-circle private-songs-circle-3"></div>

        {/* Musical Notes Background */}
        <div className="private-songs-floating-notes">
          <div className="private-songs-note note-1">♪</div>
          <div className="private-songs-note note-2">♫</div>
          <div className="private-songs-note note-3">♬</div>
          <div className="private-songs-note note-4">🔒</div>
          <div className="private-songs-note note-5">♪</div>
          <div className="private-songs-note note-6">♫</div>
          <div className="private-songs-note note-7">♬</div>
          <div className="private-songs-note note-8">♪</div>
        </div>
      </div>

      {/* Search and Filter Component */}
      <SongsSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        availableGenres={availableGenres}
        componentName="private-songs"
      />

      {/* Content */}
      {filteredSongs.length === 0 ? (
        <motion.div
          className="private-songs-empty-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="private-songs-empty-icon-container">
            <div className="private-songs-empty-glow"></div>
            <Lock size={64} className="private-songs-empty-icon" />
          </div>
          <h3>{searchTerm ? `לא נמצאו שירים התואמים לחיפוש "${searchTerm}"` : "אין שירים פרטיים עדיין"}</h3>
          <p>
            {searchTerm
              ? "נסה לחפש במילות מפתח אחרות או שנה את הפילטרים"
              : "שירים פרטיים נראים רק לך ולא מופיעים בספריית המוזיקה הציבורית"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="private-songs-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence>
            {filteredSongs.map((song, index) => (
              <motion.div
                key={song.id}
                className="private-songs-card-wrapper"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                style={{ "--index": index } as React.CSSProperties}
              >
                <SongCard
                  song={song}
                  activeCardId={activeCardId}
                  onCardClick={handleCardClick}
                  setActiveCardId={setActiveCardId}
                  showActions={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
            {/* Results Info */}
      <motion.div
        className="private-songs-results-info"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Award size={16} />
        <span>
          {searchTerm || selectedGenre ? `נמצאו ${filteredSongs.length} שירים` : `${filteredSongs.length} שירים פרטיים`}
        </span>
      </motion.div>
    </div>
  )
}

export default PrivateSongs
