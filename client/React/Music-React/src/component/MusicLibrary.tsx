import { Box, Typography } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";

const MusicLibrary = () => {
  const location = useLocation();

  return (
    <Box sx={{ minHeight: "100vh", color: "white", padding: 3, marginTop: "60px" }}>
      {/* כותרת */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "right", paddingRight: "7%", position: "sticky",
        top: 62,  // דואג שהאלמנט יישאר למעלה
        backgroundColor: "#1A1A1A", // אם רוצים צבע רקע כדי שהאלמנט יהיה תמיד בולט
        zIndex: 100, paddingBottom: "10px"
      }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          fontSize="60px"
          sx={{
            background: "linear-gradient(90deg, #D59039, #F7C26B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginLeft: "20px", // ריווח מהניווט אם צריך
          }}
        >
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


const NavLink = ({ to, active, children }: { to: string, active: boolean, children: React.ReactNode }) => (
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
        width: active ? "60%" : "0%",
        height: "3px",
        background: "linear-gradient(90deg, #D59039, #F7C26B)",
        borderRadius: "2px",
        position: "absolute",
        bottom: "0",
        left: "50%",
        transform: "translateX(-50%)",
        transition: "width 0.3s ease", // אנימציה חלקה
      },
    }}
  >
    {children}
  </Typography>
);

export default MusicLibrary;

// import type React from "react"
// import { Box, Typography } from "@mui/material"
// import { Link, Outlet, useLocation } from "react-router-dom"
// import "../css/MusicLibrary.css"

// const MusicLibrary = () => {
//   const location = useLocation()

//   return (
//     <Box className="music-library-container">
//       {/* Header with navigation */}
//       <Box className="music-library-header">
//         <Box className="music-library-nav">
//           <NavLink to="/musicLibrary/songList" active={location.pathname.includes("songList")}>
//             שירים
//           </NavLink>
//           <NavLink to="/musicLibrary/artistList" active={location.pathname.includes("artistList")}>
//             אמנים
//           </NavLink>
//         </Box>

//         <Typography variant="h3" className="music-library-title">
//           מוזיקה
//         </Typography>
//       </Box>

//       {/* Content area */}
//       <Box className="music-library-content">
//         <Outlet />
//       </Box>
//     </Box>
//   )
// }

// const NavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
//   <Typography component={Link} to={to} className={`nav-link ${active ? "active" : ""}`}>
//     {children}
//     {active && <span className="nav-link-indicator"></span>}
//   </Typography>
// )

// export default MusicLibrary
