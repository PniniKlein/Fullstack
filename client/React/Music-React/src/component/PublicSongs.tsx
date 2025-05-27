"use client"

import type React from "react"
import { useMemo } from "react"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import type { StoreType } from "../store/store"
import type { Song } from "../model/Song"
import SongCard from "./SongCard"
// import SongsSearchFilter from "."
import { Globe, Award } from "lucide-react"
import "../css/PublicSongs.css"
import SongsSearchFilter from "./SongsSearchFilter"

const PublicSongs = () => {
  const user = useSelector((state: StoreType) => state.user.user)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [activeCardId, setActiveCardId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // const publicSongs = user.songs?.filter((song: Song) => song.isPublic) || []

  const publicSongs = useMemo(() => {
  return user.songs?.filter((song: Song) => song.isPublic) || []
}, [user.songs])

  // Get only genres that exist in public songs
  const availableGenres = Array.from(
    new Set(publicSongs.map((song: Song) => song.gener).filter((genre): genre is string => Boolean(genre))),
  ).sort()

  useEffect(() => {
    let filtered = [...publicSongs]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (song: Song) =>
          song.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.gener?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply genre filter
    if (selectedGenre) {
      filtered = filtered.filter((song: Song) => song.gener === selectedGenre)
    }

    // Sort by newest first
    filtered.sort((a: Song, b: Song) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())

    setFilteredSongs(filtered)
  }, [publicSongs, searchTerm, selectedGenre])

  const handleCardClick = (event: React.MouseEvent, songId: number) => {
    const target = event.target as HTMLElement
    if (target.closest("button, svg")) {
      return
    }
    setActiveCardId(songId)
  }

  return (
    <div className="public-songs-container">
      {/* Background Effects */}
      <div className="public-songs-background-wrapper">
        <div className="public-songs-gradient-circle public-songs-circle-1"></div>
        <div className="public-songs-gradient-circle public-songs-circle-2"></div>
        <div className="public-songs-gradient-circle public-songs-circle-3"></div>

        {/* Musical Notes Background */}
        <div className="public-songs-floating-notes">
          <div className="public-songs-note note-1">♪</div>
          <div className="public-songs-note note-2">♫</div>
          <div className="public-songs-note note-3">♬</div>
          <div className="public-songs-note note-4">♫</div>
          <div className="public-songs-note note-5">♪</div>
          <div className="public-songs-note note-6">♫</div>
          <div className="public-songs-note note-7">♬</div>
          <div className="public-songs-note note-8">♪</div>
        </div>
      </div>

      {/* Search and Filter Component */}
      <SongsSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        availableGenres={availableGenres}
        componentName="public-songs"
      />


      {/* Content */}
      {filteredSongs.length === 0 ? (
        <motion.div
          className="public-songs-empty-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="public-songs-empty-icon-container">
            <div className="public-songs-empty-glow"></div>
            <Globe size={64} className="public-songs-empty-icon" />
          </div>
          <h3>{searchTerm ? `לא נמצאו שירים התואמים לחיפוש "${searchTerm}"` : "אין שירים ציבוריים עדיין"}</h3>
          <p>
            {searchTerm ? "נסה לחפש במילות מפתח אחרות או שנה את הפילטרים" : "הוסף שירים או הפוך שירים פרטיים לציבוריים"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="public-songs-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence>
            {filteredSongs.map((song, index) => (
              <motion.div
                key={song.id}
                className="public-songs-card-wrapper"
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
      <motion.div
        className="public-songs-results-info"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Award size={16} />
        <span>
          {searchTerm || selectedGenre
            ? `נמצאו ${filteredSongs.length} שירים`
            : `${filteredSongs.length} שירים ציבוריים`}
        </span>
      </motion.div>
    </div>
  )
}

export default PublicSongs
