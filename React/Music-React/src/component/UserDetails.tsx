import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../store/store";
import { logOut } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { Avatar, Popover, Typography, IconButton, Button, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { resetSong } from "../store/songSlice";
import '../css/UserDetails.css';  // ייבוא קובץ ה-CSS

const UserDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: StoreType) => state.user.user);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logOut());
        dispatch(resetSong());
        sessionStorage.removeItem("songPlayer");
        navigate("/");
        handleClose();
    };

    const handleUpdateProfile = () => {
        navigate("/update");
        handleClose();
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Avatar
                className="avatar"
                onClick={handleClick}
                src={user?.pathProfile || ""}
            >
                {!user?.pathProfile && user?.userName ? user.userName[0] : ""}
            </Avatar>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    className: "popover-paper",
                }}
            >
                <IconButton className="close-button" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>

                <Avatar
                 sx={{
                    width: 60,
                    height: 60,
                    marginTop:'40px'
                }}
                    className="avatar-large"
                    src={user?.pathProfile || ""}
                >
                    {!user?.pathProfile && user?.userName ? user.userName[0] : ""}
                </Avatar>

                <Typography className="username">
                    {user?.userName || "שם משתמש"}
                </Typography>

                <Typography variant="body2" className="email">
                    {user?.email || ""}
                </Typography>

                <Box className="buttons-container">
                    <Button
                        variant="contained"
                        onClick={handleUpdateProfile}
                        className="update-button"
                    >
                        עדכון
                    </Button>
                    <Box className="logout-button-container">
                        <Button
                            variant="outlined"
                            onClick={handleLogout}
                            className="logout-button"
                        >
                            יציאה
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

export default UserDetails;