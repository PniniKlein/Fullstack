import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreType } from "../store/store";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import UserDetails from "./UserDetails";
import { useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
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
    { label: "בית", to: "/" },
    { label: "מוזיקה", to: "/musicLibrary/songList" },
  ];

  if (authState) {
    menuItems.push({ label: "אזור אישי", to: "/mySongs" });
  }
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#1A1A1A",
        boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.4)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
        {/* כפתורים */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {menuItems.map((item) => (
            <Box
              key={item.to}
              className={`header-button-wrapper ${activeButton === item.to ? "active" : ""}`}
              sx={{ marginLeft: "10px" }}
            >
              <Button
                component={Link}
                to={item.to}
                onClick={() => setActiveButton(item.to)}
                className="header-button"
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
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box className="login-button-container">
            <Button variant="outlined"  component={Link} to="/login" className="header-button-login">
            <IconButton
            component={Link}
            to="/login"
            sx={{ color: 'white' }}
          >
            <LoginIcon />
          </IconButton>
              להתחברות
            </Button>
            </Box>
            <Button variant="contained" component={Link} to="/register" endIcon={<PersonAddIcon />} className="header-button-register">
              להרשמה
            </Button>
          </Box>
        ) : (
          <UserDetails />
        )}
        {/* {!authState ? (
          <IconButton
            component={Link}
            to="/login"
            sx={{ color: 'white' }}
          >
            <LoginIcon />
          </IconButton>
        ) : (
          <UserDetails />
        )} */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
