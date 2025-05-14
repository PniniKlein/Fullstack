import { Box, Select, MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Search from "./Search";
import '../css/SongFilters.css'; // ייבוא קובץ ה-CSS

interface SongFiltersProps {
  sortOption: string;
  setSortOption: (value: string) => void;
  genreFilter: string;
  setGenreFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  genres: string[];
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
  return (
    <Box className="song-filters">
      {/* מיין לפי */}
      <Select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        size="small"
        dir="rtl"
        renderValue={() =>
          sortOption === "title" ? "מיין לפי: שם" : "מיין לפי: תאריך"
        }
        IconComponent={(props) => (
          <ExpandMoreIcon
            {...props}
            sx={{
              transform: props.open ? "rotate(180deg)" : "rotate(0deg)", // תהפוך את האיקון כשה־Select נפתח
              transition: "transform 0.3s ease",
              color:"white"
            }}
          />
        )}
        className="select-input"
        sx={{
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#111", // צבע המסגרת כשה־Select בפוקוס
          },
        }}
      >
        <MenuItem value="title" className={`menu-item ${sortOption === "title" ? "selected" : ""}`}>
          מיין לפי שם
        </MenuItem>
        <MenuItem value="date" className={`menu-item ${sortOption === "date" ? "selected" : ""}`}>
          מיין לפי תאריך
        </MenuItem>
      </Select>

      {/* ז'אנר */}
      <Select
        value={genreFilter}
        onChange={(e) => setGenreFilter(e.target.value)}
        size="small"
        dir="rtl"
        renderValue={() =>
          genreFilter === "all" ? "ז'אנר: הכל" : `ז'אנר: ${genreFilter}`
        }
        IconComponent={(props) => (
          <ExpandMoreIcon
            {...props}
            sx={{
              transform: props.open ? "rotate(180deg)" : "rotate(0deg)", // תהפוך את האיקון כשה־Select נפתח
              transition: "transform 0.3s ease",
              color:"white"
            }}
          />
        )}
        className="select-input"
        sx={{
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#111", // צבע המסגרת כשה־Select בפוקוס
          },
        }}
      >
        <MenuItem value="all" className={`menu-item ${genreFilter === "all" ? "selected" : ""}`}>
          כל הז'אנרים
        </MenuItem>
        {genres.map((genre, index) => (
          <MenuItem
            key={index}
            value={genre}
            className={`menu-item ${genreFilter === genre ? "selected" : ""}`}
          >
            {genre}
          </MenuItem>
        ))}
      </Select>

      {/* חיפוש */}
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </Box>
  );
};

export default SongFilters;

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
