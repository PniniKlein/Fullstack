import { Box, Typography } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";

const MusicLibrary = () => {
  const location = useLocation();

  return (
    <Box sx={{ minHeight: "100vh", color: "white", padding: 3, marginTop: "60px" }}>
      {/* כותרת */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "right", marginRight: "5%" ,position: "sticky",
          top: 62,  // דואג שהאלמנט יישאר למעלה
          backgroundColor: "#212121", // אם רוצים צבע רקע כדי שהאלמנט יהיה תמיד בולט
          zIndex: 1,paddingBottom:"5px"}}>
      <Typography variant="h3" fontWeight="bold" fontSize="60px">
          מוזיקה
        </Typography>
        {/* ניווט בין שירים ואמנים */}
        <Box sx={{ display: "flex", gap: "40px", marginRight: "5%" }}>
          <NavLink to="/musicLibrary/songList" active={location.pathname.includes("songList")}>
            שירים
          </NavLink>
          <NavLink to="/musicLibrary/artistList" active={location.pathname.includes("artistList")}>
            אמנים
          </NavLink>
        </Box>
        
      </Box>

      <Outlet />
    </Box>
  );
};


const NavLink = ({ to, active, children }:{to:string, active:boolean, children:React.ReactNode}) => (
  <Typography
    component={Link}
    to={to}
    sx={{
      color: "white",
      fontSize: "20px",
      fontWeight: "bold",
      textDecoration: "none",
      position: "relative",
      paddingBottom: "5px",

      "&::after": {
        content: '""',
        display: "block",
        width: active ? "60%" : "0%", // הפס רק בלשונית הפעילה
        height: "3px",
        backgroundColor: "#FFA726",
        borderRadius: "2px", // קצוות מעוגלים
        position: "absolute",
        bottom: "0",
        left: "50%",
        transform: "translateX(-50%)",
      },
    }}
  >
    {children}
  </Typography>
);

export default MusicLibrary;
