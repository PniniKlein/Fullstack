import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Search = ({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: Function }) => {
  return (
    <TextField
      placeholder="חיפוש"
      variant="outlined"
      size="small"
      sx={{
        zIndex: 100,
        backgroundColor: '#222',
        borderRadius: '5px',
        color: 'white',
        width: '150px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        '& label': { color: 'gray' },
        '&:hover': { backgroundColor: '#333' },
        input: { color: "white" },
        "& .MuiOutlinedInput-root": {
                backgroundColor: "#212121",
                borderRadius: "5px",
                color: "#f1f1f1",
                '& fieldset': {
                    borderColor: 'transparent', // ללא מסגרת ברירת מחדל
                  },
                '&:hover fieldset': {
                  borderColor: '#111',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#111',//#F7C26B
                },
              },
              '& .MuiInputBase-input': {
                color: '#fff',
              },
              "& input": {
                color: "#f1f1f1",
              },
              "& fieldset": {
                borderColor: "#444",
              },
              "&:hover fieldset": {
                borderColor: "#666",
              },
      }}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#aaa' }} />
          </InputAdornment>
        )
      }}
    />
  );
};

export default Search;
