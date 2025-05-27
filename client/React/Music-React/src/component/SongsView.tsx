import type React from "react"
import { useMemo, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import type { StoreType } from "../store/store"
import type { Song } from "../model/Song"
import SongCard from "./SongCard"
import { Globe, Lock, Award } from "lucide-react"
import SongsSearchFilter from "./SongsSearchFilter"
import "../css/SongsView.css"

type SongsViewProps = {
  mode: "public" | "private"
}

const SongsView = ({ mode }: SongsViewProps) => {
  const user = useSelector((state: StoreType) => state.user.user)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
  const [activeCardId, setActiveCardId] = useState<number | null>(null)

  const songs = useMemo(() => {
    if (!user.songs) return []
    return user.songs.filter((song:Song) =>
      mode === "public" ? song.isPublic : !song.isPublic
    )
  }, [user.songs, mode])

  const availableGenres = Array.from(
    new Set(songs.map((song: Song) => song.gener).filter((g): g is string => Boolean(g)))
  ).sort()

  useEffect(() => {
    let filtered = [...songs]
    if (searchTerm) {
      filtered = filtered.filter((song:Song) =>
        song.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.gener?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedGenre) {
      filtered = filtered.filter((song:Song) => song.gener === selectedGenre)
    }
    filtered.sort((a:Song, b:Song) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())
    setFilteredSongs(filtered)
  }, [songs, searchTerm, selectedGenre])

  const icon = mode === "public" ? <Globe size={64} /> : <Lock size={64} />
  const emptyTitle = mode === "public" ? "אין שירים ציבוריים עדיין" : "אין שירים פרטיים עדיין"
  const emptyText = mode === "public"
    ? "הוסף שירים או הפוך שירים פרטיים לציבוריים"
    : "הוסף שירים או שמור שירים כפרטיים"

  return (
    <div className="public-songs-container">
      <div className="public-songs-background-wrapper">
        {/* רקעים ואפקטים */}
      </div>

      <SongsSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        availableGenres={availableGenres}
        componentName="public-songs"
      />

      {filteredSongs.length === 0 ? (
        <motion.div className="public-songs-empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="public-songs-empty-icon-container">
            <div className="public-songs-empty-glow"></div>
            {icon}
          </div>
          <h3>{searchTerm ? `לא נמצאו תוצאות עבור "${searchTerm}"` : emptyTitle}</h3>
          <p>{searchTerm ? "נסה מילת חיפוש אחרת או שנה פילטרים" : emptyText}</p>
        </motion.div>
      ) : (
        <motion.div className="public-songs-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AnimatePresence>
            {filteredSongs.map((song, index) => (
              <motion.div
                key={song.id}
                className="public-songs-card-wrapper"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <SongCard
                  song={song}
                  activeCardId={activeCardId}
                  onCardClick={(e) => {
                    if (!(e.target as HTMLElement).closest("button, svg")) {
                      setActiveCardId(song.id)
                    }
                  }}
                  setActiveCardId={setActiveCardId}
                  showActions={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <motion.div className="public-songs-results-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Award size={16} />
        <span>
          {searchTerm || selectedGenre
            ? `נמצאו ${filteredSongs.length} שירים`
            : `${filteredSongs.length} שירים ${mode === "public" ? "ציבוריים" : "פרטיים"}`}
        </span>
      </motion.div>
    </div>
  )
}

export default SongsView
