import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreType } from "../store/store";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import UserDetails from "./UserDetails";
import { useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import "../css/Header.css";

const Header = () => {
  const authState = useSelector((store: StoreType) => store.user.authState);
  const location = useLocation();

  const [activeButton, setActiveButton] = useState("/");

  useEffect(() => {
    setActiveButton(location.pathname);
  }, [location]);


  const menuItems = [
    { label: "", to: "/", icon: <HomeIcon className="home-icon header-icon" /> },
    { label: "מוזיקה", to: "/musicLibrary/songList", icon: <LibraryMusicIcon className="header-icon" /> },
  ];

  if (authState) {
    menuItems.push({ label: "אזור אישי", to: "/mySongs", icon: <PersonIcon className="header-icon" /> });
  }
  return (
    <AppBar
      position="fixed"
      sx={{
        margin: '0px',
        backgroundColor: "#1A1A1A",
        boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.4)",
      }}
    >
      <Toolbar sx={{ backgroundColor: "#1A1A1A", display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
        {/* כפתורים */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link to="/">
            <img src='/avatars/music3.jpg' alt="Logo" className="header-logo" />
          </Link>
          {menuItems.map((item) => (
            <Box
              key={item.to}
              sx={{ marginLeft: "10px" }}
              className={`header-button-wrapper ${activeButton === item.to ? "active" : ""}`}
            >
              <Button
                component={Link}
                to={item.to}
                onClick={() => setActiveButton(item.to)}
                className="header-button"
                startIcon={item.icon} // ← כאן מציבים את האיקון
              >
                {item.label}
              </Button>
            </Box>
          ))}
        </Box>

        {/* כותרת */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            textAlign: "center",
            fontWeight: "bold",
            letterSpacing: "1px",
            color: "white",
          }}
        >
          {/* SingSong */}
        </Typography>

        {/* התחברות / משתמש */}
        {!authState ? (
          <Box className="login-button-container">
            <Link to="/login" className="header-button-login">
                <LoginIcon />
              להתחברות
            </Link>
          </Box>
        ) : (
          <UserDetails />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

// "use client"

// import { Link, useLocation } from "react-router-dom"
// import { useSelector } from "react-redux"
// import type { StoreType } from "../store/store"
// import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
// import UserDetails from "./UserDetails"
// import { useEffect, useState } from "react"
// import HomeIcon from "@mui/icons-material/Home"
// import LibraryMusicIcon from "@mui/icons-material/LibraryMusic"
// import PersonIcon from "@mui/icons-material/Person"
// import LoginIcon from "@mui/icons-material/Login"
// import "../css/Header.css"

// const Header = () => {
//   const authState = useSelector((store: StoreType) => store.user.authState)
//   const location = useLocation()
//   const [activeButton, setActiveButton] = useState("/")
//   const [scrolled, setScrolled] = useState(false)

//   useEffect(() => {
//     setActiveButton(location.pathname)
//   }, [location])

//   useEffect(() => {
//     const handleScroll = () => {
//       const isScrolled = window.scrollY > 10
//       if (isScrolled !== scrolled) {
//         setScrolled(isScrolled)
//       }
//     }

//     window.addEventListener("scroll", handleScroll)
//     return () => {
//       window.removeEventListener("scroll", handleScroll)
//     }
//   }, [scrolled])

//   const menuItems = [
//     { label: "", to: "/", icon: <HomeIcon className="home-icon header-icon" /> },
//     { label: "מוזיקה", to: "/musicLibrary/songList", icon: <LibraryMusicIcon className="header-icon" /> },
//   ]

//   if (authState) {
//     menuItems.push({ label: "אזור אישי", to: "/mySongs", icon: <PersonIcon className="header-icon" /> })
//   }

//   return (
//     <AppBar position="fixed" className={`app-header ${scrolled ? "scrolled" : ""}`}>
//       <Toolbar className="header-toolbar">
//         {/* Logo and Navigation */}
//         <Box className="header-nav-container">
//           <Link to="/" className="logo-link">
//             <img src="/avatars/music3.jpg" alt="Logo" className="header-logo" />
//             <div className="logo-glow"></div>
//           </Link>

//           <Box className="header-nav-buttons">
//             {menuItems.map((item) => (
//               <Box
//                 key={item.to}
//                 className={`header-button-wrapper ${activeButton.startsWith(item.to) ? "active" : ""}`}
//               >
//                 <Button
//                   component={Link}
//                   to={item.to}
//                   onClick={() => setActiveButton(item.to)}
//                   className="header-button"
//                   startIcon={item.icon}
//                 >
//                   {item.label}
//                 </Button>
//                 {activeButton.startsWith(item.to) && <div className="button-indicator"></div>}
//               </Box>
//             ))}
//           </Box>
//         </Box>

//         {/* App Title - Hidden but kept for structure */}
//         <Typography variant="h6" className="header-title">
//           {/* SingSong */}
//         </Typography>

//         {/* Login or User Details */}
//         {!authState ? (
//           <Box className="login-button-container">
//             <Link to="/login" className="header-button-login">
//               <LoginIcon className="login-icon" />
//               <span className="login-text">להתחברות</span>
//             </Link>
//           </Box>
//         ) : (
//           <UserDetails />
//         )}
//       </Toolbar>
//     </AppBar>
//   )
// }

// export default Header
