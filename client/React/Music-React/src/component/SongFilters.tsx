"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, ChevronDown, Music } from "lucide-react"
import "../css/SongFilters.css"

interface SongFiltersProps {
  sortOption: string
  setSortOption: (value: string) => void
  genreFilter: string
  setGenreFilter: (value: string) => void
  searchTerm: string
  setSearchTerm: (value: string) => void
  genres: string[]
}

const SongFilters = ({
  sortOption,
  setSortOption,
  genreFilter,
  setGenreFilter,
  searchTerm,
  setSearchTerm,
  genres,
}: SongFiltersProps) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showGenreDropdown, setShowGenreDropdown] = useState(false)

  return (
    <div className="song-filters-simple">
      {/* Background Effects */}
      <div className="filters-background-simple">
        <div className="floating-notes-simple">
          <div className="note note-1">♪</div>
          <div className="note note-2">♫</div>
          <div className="note note-3">♬</div>
          <div className="note note-4">🎵</div>
        </div>
      </div>

      <div className="filters-content-simple">
        <div className="filters-right-simple">
          <div className="search-container-simple">
            <div className="search-wrapper-simple">
              <Search size={18} className="search-icon-simple" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="חיפוש שירים..."
                className="search-input-simple"
              />
            </div>
          </div>
        </div>
        {/* Left Side - Dropdowns */}
        <div className="filters-left-simple">
          
          {/* Sort Dropdown */}
          <div className="filter-dropdown-simple">
            <button
              className="filter-button-simple"
              onClick={() => {
                setShowSortDropdown(!showSortDropdown)
                setShowGenreDropdown(false)
              }}
            >
              <SlidersHorizontal size={18} className="dropdown-icon-simple" />
              <span>{sortOption === "title" ? "מיין לפי: שם" : "מיין לפי: תאריך"}</span>
              <ChevronDown size={16} className={`arrow-icon-simple ${showSortDropdown ? "open" : ""}`} />
            </button>

            {showSortDropdown && (
              <div className="filter-menu-simple">
                <div
                  className={`menu-item-simple ${sortOption === "title" ? "selected" : ""}`}
                  onClick={() => {
                    setSortOption("title")
                    setShowSortDropdown(false)
                  }}
                >
                  <span>מיין לפי שם</span>
                  {sortOption === "title" && <div className="selected-dot"></div>}
                </div>
                <div
                  className={`menu-item-simple ${sortOption === "date" ? "selected" : ""}`}
                  onClick={() => {
                    setSortOption("date")
                    setShowSortDropdown(false)
                  }}
                >
                  <span>מיין לפי תאריך</span>
                  {sortOption === "date" && <div className="selected-dot"></div>}
                </div>
              </div>
            )}
          </div>

          {/* Genre Dropdown */}
          <div className="filter-dropdown-simple">
            <button
              className="filter-button-simple"
              onClick={() => {
                setShowGenreDropdown(!showGenreDropdown)
                setShowSortDropdown(false)
              }}
            >
              <Music size={18} className="dropdown-icon-simple" />
              <span>{genreFilter === "all" ? "ז'אנר: הכל" : `ז'אנר: ${genreFilter}`}</span>
              <ChevronDown size={16} className={`arrow-icon-simple ${showGenreDropdown ? "open" : ""}`} />
            </button>

            {showGenreDropdown && (
              <div className="filter-menu-simple">
                <div
                  className={`menu-item-simple ${genreFilter === "all" ? "selected" : ""}`}
                  onClick={() => {
                    setGenreFilter("all")
                    setShowGenreDropdown(false)
                  }}
                >
                  <span>כל הז'אנרים</span>
                  {genreFilter === "all" && <div className="selected-dot"></div>}
                </div>
                {genres.map((genre, index) => (
                  <div
                    key={index}
                    className={`menu-item-simple ${genreFilter === genre ? "selected" : ""}`}
                    onClick={() => {
                      setGenreFilter(genre)
                      setShowGenreDropdown(false)
                    }}
                  >
                    <span>{genre}</span>
                    {genreFilter === genre && <div className="selected-dot"></div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default SongFilters

// "use client"

// import { Box, Select, MenuItem } from "@mui/material"
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
// import Search from "./Search"
// import "../css/SongFilters.css"

// interface SongFiltersProps {
//   sortOption: string
//   setSortOption: (value: string) => void
//   genreFilter: string
//   setGenreFilter: (value: string) => void
//   searchTerm: string
//   setSearchTerm: (value: string) => void
//   genres: string[]
// }

// const SongFilters = ({
//   sortOption,
//   setSortOption,
//   genreFilter,
//   setGenreFilter,
//   searchTerm,
//   setSearchTerm,
//   genres,
// }: SongFiltersProps) => {
//   return (
//     <Box className="song-filters-container">
//       <Box className="song-filters-wrapper">
//         {/* Sort by */}
//         <Select
//           value={sortOption}
//           onChange={(e) => setSortOption(e.target.value)}
//           size="small"
//           dir="rtl"
//           renderValue={() => (sortOption === "title" ? "מיין לפי: שם" : "מיין לפי: תאריך")}
//           IconComponent={(props) => (
//             <ExpandMoreIcon {...props} className={`select-icon ${props.className} ${props.open ? "open" : ""}`} />
//           )}
//           className="filter-select"
//         >
//           <MenuItem value="title" className={`filter-menu-item ${sortOption === "title" ? "selected" : ""}`}>
//             מיין לפי שם
//           </MenuItem>
//           <MenuItem value="date" className={`filter-menu-item ${sortOption === "date" ? "selected" : ""}`}>
//             מיין לפי תאריך
//           </MenuItem>
//         </Select>

//         {/* Genre */}
//         <Select
//           value={genreFilter}
//           onChange={(e) => setGenreFilter(e.target.value)}
//           size="small"
//           dir="rtl"
//           renderValue={() => (genreFilter === "all" ? "ז'אנר: הכל" : `ז'אנר: ${genreFilter}`)}
//           IconComponent={(props) => (
//             <ExpandMoreIcon {...props} className={`select-icon ${props.className} ${props.open ? "open" : ""}`} />
//           )}
//           className="filter-select"
//         >
//           <MenuItem value="all" className={`filter-menu-item ${genreFilter === "all" ? "selected" : ""}`}>
//             כל הז'אנרים
//           </MenuItem>
//           {genres.map((genre, index) => (
//             <MenuItem
//               key={index}
//               value={genre}
//               className={`filter-menu-item ${genreFilter === genre ? "selected" : ""}`}
//             >
//               {genre}
//             </MenuItem>
//           ))}
//         </Select>

//         {/* Search */}
//         <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//       </Box>
//     </Box>
//   )
// }

// export default SongFilters
