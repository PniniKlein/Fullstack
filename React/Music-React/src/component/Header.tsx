import { Link } from "react-router-dom";
import {  useSelector } from "react-redux";
import {  StoreType } from "../store/store";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
// import { logOut } from "../store/userSlice";
import UserDetails from "./UserDetails";

const Header = () => {
  const authState = useSelector((store: StoreType) => store.user.authState);
  // const dispatch = useDispatch<Dispatch>();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#2C2C2C", // צבע כהה שמתואם לכרטיסים
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)", // צל חזק שמתואם לכרטיסים
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
        {/* כפתורי התחברות/הרשמה - בצד שמאל */}
        {authState&&<Button
          component={Link}
          to="mySongs"
          variant="outlined"
          sx={{
            marginLeft:"10px",
            borderColor: "rgba(255, 255, 255, 0.5)", // מסגרת עדינה
            color: "rgba(255, 255, 255, 0.8)", // צבע טקסט בהיר
            "&:hover": {
              borderColor: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)", // רקע בהובר
            },
          }}
        >
          השירים שלי
        </Button>}
        <Button
          component={Link}
          to="musicLibrary/songList"
          variant="outlined"
          sx={{
            marginLeft:"10px",
            borderColor: "rgba(255, 255, 255, 0.5)", // מסגרת עדינה
            color: "rgba(255, 255, 255, 0.8)", // צבע טקסט בהיר
            "&:hover": {
              borderColor: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)", // רקע בהובר
            },
          }}
        >
          מוזיקה
        </Button>
        <Button
          component={Link}
          to="/about"
          variant="outlined"
          sx={{
            marginLeft:"10px",
            borderColor: "rgba(255, 255, 255, 0.5)", // מסגרת עדינה
            color: "rgba(255, 255, 255, 0.8)", // צבע טקסט בהיר
            "&:hover": {
              borderColor: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)", // רקע בהובר
            },
          }}
        >
          אודות
        </Button>
        <Button
          component={Link}
          to="/"
          variant="outlined"
          sx={{
            marginLeft:"10px",
            borderColor: "rgba(255, 255, 255, 0.5)", // מסגרת עדינה
            color: "rgba(255, 255, 255, 0.8)", // צבע טקסט בהיר
            "&:hover": {
              borderColor: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)", // רקע בהובר
            },
          }}
        >
          בית
        </Button>
        

        {/* כותרת האפליקציה */}
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
          Music App 🎵
        </Typography>
        {!authState?  (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                borderColor: "rgba(255, 255, 255, 0.5)", // מסגרת עדינה
                color: "rgba(255, 255, 255, 0.8)", // צבע טקסט בהיר
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // רקע בהובר
                },
              }}
            >
              להתחברות
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              sx={{
                borderColor: "rgba(255, 255, 255, 0.5)", // מסגרת עדינה
                color: "rgba(255, 255, 255, 0.8)", // צבע טקסט בהיר
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // רקע בהובר
                },
              }}
            >
              להרשמה
            </Button>
          </Box>
        ):( <>
          <UserDetails/>
          </>)}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
