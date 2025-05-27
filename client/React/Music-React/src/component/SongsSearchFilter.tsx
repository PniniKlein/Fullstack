"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Music, ChevronDown, Filter } from "lucide-react"
import "../css/SongsSearchFilter.css"

interface SongsSearchFilterProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedGenre: string | null
  setSelectedGenre: (genre: string | null) => void
  availableGenres: string[]
  componentName: string
}

const SongsSearchFilter = ({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
  availableGenres,
  componentName,
}: SongsSearchFilterProps) => {
  const [showGenreDropdown, setShowGenreDropdown] = useState(false)

  const handleGenreSelect = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null)
    } else {
      setSelectedGenre(genre)
    }
    setShowGenreDropdown(false)
  }

  return (
    <div className={`songs-search-filter-container ${componentName}-search-filter`}>
      {/* Background Musical Notes */}
      <div className="songs-search-filter-notes">
        <div className="search-filter-note note-1">♪</div>
        <div className="search-filter-note note-2">♫</div>
        <div className="search-filter-note note-3">♬</div>
        <div className="search-filter-note note-4">♬</div>
        <div className="search-filter-note note-5">♪</div>
        <div className="search-filter-note note-6">♫</div>
      </div>

      {/* Search Section */}
      <motion.div
        className="songs-search-filter-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="songs-search-filter-main">
          <div className="songs-search-filter-wrapper">
            <div className="songs-search-filter-input-container">
              <Search size={20} className="songs-search-filter-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="חפש שירים..."
                className="songs-search-filter-input"
              />
              {searchTerm && (
                <button className="songs-search-filter-clear" onClick={() => setSearchTerm("")}>
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="songs-search-filter-glow"></div>
          </div>

          {/* {availableGenres.length > 0 && (
            <div className="genre-dropdown-container">
              <button
                className={`genre-dropdown-toggle ${showGenreDropdown ? "active" : ""} ${selectedGenre ? "has-selection" : ""}`}
                onClick={() => setShowGenreDropdown(!showGenreDropdown)}
              >
                <Filter size={16} />
                <span>{selectedGenre || "כל הז'אנרים"}</span>
                <ChevronDown size={16} className={`dropdown-arrow ${showGenreDropdown ? "open" : ""}`} />
                <div className="genre-toggle-glow"></div>
              </button>

              <AnimatePresence>
                {showGenreDropdown && (
                  <motion.div
                    className="genre-dropdown-menu"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <div className="genre-dropdown-header">
                      <Music size={16} />
                      <span>בחר ז'אנר</span>
                    </div>

                    <div className="genre-dropdown-content">
                      <motion.div
                        className={`genre-option all-genres ${!selectedGenre ? "selected" : ""}`}
                        onClick={() => handleGenreSelect("")}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="genre-option-content">
                          <div className="genre-icon-wrapper">
                            <div className="genre-icon all-icon">♬</div>
                          </div>
                          <span>כל הז'אנרים</span>
                        </div>
                        {!selectedGenre && <div className="selection-indicator"></div>}
                      </motion.div>

                      <div className="genre-divider"></div>

                      <div className="genre-list">
                        {availableGenres.map((genre, index) => (
                          <motion.div
                            key={genre}
                            className={`genre-option ${selectedGenre === genre ? "selected" : ""}`}
                            onClick={() => handleGenreSelect(genre)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="genre-option-content">
                              <div className="genre-icon-wrapper">
                                <div className="genre-icon">♪</div>
                              </div>
                              <span>{genre}</span>
                            </div>
                            {selectedGenre === genre && <div className="selection-indicator"></div>}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )} */}
        </div>
      </motion.div>

      {/* Selected Genre Display */}
      {/* <AnimatePresence>
        {selectedGenre && (
          <motion.div
            className="songs-search-filter-selected"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="selected-genre-display">
              <Music size={14} />
              <span>מסונן לפי: {selectedGenre}</span>
              <button className="remove-selected-genre" onClick={() => setSelectedGenre(null)}>
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  )
}

export default SongsSearchFilter
