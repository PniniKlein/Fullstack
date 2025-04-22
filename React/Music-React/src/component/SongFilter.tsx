import { Box, Select, MenuItem, InputAdornment } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Search from "./Search";

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
    <Box
      sx={{
        width: "50%",
        display: "flex",
        justifyContent: "flex-end",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "20px",
        position: "sticky",
        top: "80px",
        marginTop: "0px",
        marginLeft: "0px",
        right: "70%",
        padding: "0px",
        left: "0px",
        zIndex: 1000,
      }}
    >
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
              color: "white", // צבע האיקון לבן
              transform: props.open ? "rotate(180deg)" : "rotate(0deg)", // תהפוך את האיקון כשה־Select נפתח
              transition: "transform 0.3s ease",
              marginRight: "auto", // הצגת האיקון בצד שמאל
            }}
          />
        )}
        sx={{
          backgroundColor: "#222",
          borderRadius: "5px",
          color: "white",
          width: "180px",
          textAlign: "right",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          "& .MuiSelect-select": {
            color: "white",
            paddingRight: "12px",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#111", // צבע המסגרת כשה־Select בפוקוס
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              marginTop: "5px",
              backgroundColor: "#222",
              color: "white",
              borderRadius: "5px",
              "& .MuiMenuItem-root": {
                "&.Mui-selected": {
                  backgroundColor: "#FFA500",
                  color: "black",
                },
                "&:hover": {
                  backgroundColor: "#444",
                },
              },
            },
          },
        }}
      >
        <MenuItem value="title">מיין לפי שם</MenuItem>
        <MenuItem value="date">מיין לפי תאריך</MenuItem>
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
              color: "white", // צבע האיקון לבן
              transform: props.open ? "rotate(180deg)" : "rotate(0deg)", // תהפוך את האיקון כשה־Select נפתח
              transition: "transform 0.3s ease",
              marginRight: "auto", // הצגת האיקון בצד שמאל
            }}
          />
        )}
        sx={{
          backgroundColor: "#222",
          borderRadius: "5px",
          color: "white",
          width: "180px",
          textAlign: "right",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          "& .MuiSelect-select": {
            color: "white",
            paddingRight: "12px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#333",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#111", // צבע המסגרת כשה־Select בפוקוס
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: "#222",
              marginTop: "5px",
              color: "white",
              borderRadius: "5px",
              "& .MuiMenuItem-root": {
                "&.Mui-selected": {
                  backgroundColor: "#FFA500",
                  color: "black",
                },
                "&:hover": {
                  backgroundColor: "#444",
                },
              },
            },
          },
        }}
      >
        <MenuItem value="all">כל הז'אנרים</MenuItem>
        {genres.map((genre, index) => (
          <MenuItem key={index} value={genre}>
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
