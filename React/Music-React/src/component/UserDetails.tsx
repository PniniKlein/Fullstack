import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../store/store";
import { logOut } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { Avatar, Popover, Typography, IconButton, Button, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { resetSong } from "../store/songSlice";

const UserDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: StoreType) => state.user.user); // מאזין ישירות לשינויי המשתמש

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logOut());
        dispatch(resetSong())
        sessionStorage.removeItem('songPlayer');
        handleClose();
    };

    const handleUpdateProfile = () => {
        navigate("/update");
        handleClose();
    };

    const open = Boolean(anchorEl);

    return (
        <>
            {/* אייקון הפרופיל */}
            <Avatar
                sx={{
                    fontSize: 20,
                    width: 40,
                    height: 40,
                    marginRight: 2,
                    bgcolor: user?.pathProfile ? "transparent" : "gray",
                    cursor: "pointer",
                    border: "2px solid #ff9800",
                    transition: "border 0.3s ease",
                }}
                onClick={handleClick}
                src={user?.pathProfile || ""}
            >
                {!user?.pathProfile && user?.userName ? user.userName[0] : ""}
            </Avatar>

            {/* תפריט פרופיל */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: {
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: 4,
                        padding: 3,
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                        minWidth: 220,
                        textAlign: "center",
                        backgroundColor: "#1e1e1e",
                        color: "white",
                        marginTop: 1.5,
                    },
                }}
            >
                {/* כפתור סגירה */}
                <IconButton sx={{ position: "absolute", top: 5, left: 5, color: "white" }} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>

                {/* תמונת משתמש */}
                <Avatar
                    sx={{
                        fontSize: 20,
                        width: 60,
                        height: 60,
                        marginTop: 4,
                        border: "2px solid #ff9800",
                        boxShadow: "0 2px 5px rgba(255,152,0,0.5)",
                        bgcolor: user?.pathProfile ? "transparent" : "gray",
                    }}
                    src={user?.pathProfile || ""}
                >
                    {!user?.pathProfile && user?.userName ? user.userName[0] : ""}
                </Avatar>

                {/* שם המשתמש */}
                <Typography variant="h6" sx={{ marginTop: 1.5, fontWeight: "bold", color: "#ff9800" }}>
                    {user?.userName || "שם משתמש"}
                </Typography>

                {/* אימייל */}
                <Typography variant="body2" color="gray" sx={{ marginTop: 1 }}>
                    {user?.email || ""}
                </Typography>

                {/* כפתורים */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, width: "100%", marginTop: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleUpdateProfile}
                        sx={{ width: "50%", backgroundColor: "#ff9800", color: "white" }}
                    >
                        עדכון
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleLogout}
                        sx={{ width: "50%", borderColor: "#ff9800", color: "#ff9800" }}
                    >
                        יציאה
                    </Button>
                </Box>
            </Popover>
        </>
    );
};

export default UserDetails;
