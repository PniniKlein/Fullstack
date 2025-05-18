// ShareSongButton.tsx
import { Share } from "@mui/icons-material";
import { Song } from "../model/Song";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getUserDataFromToken } from "./AppLayout";
import { useDispatch, useSelector } from "react-redux";
import { StoreType, Dispatch } from "../store/store";
import { sendEmail, loadUser } from "../store/userSlice";
// import { useState } from "react";
// import SnackbarGreen from "./SnackbarGreen";
import GradientIconButton from "./GradientIconButton";
import '../css/ShareSongButton.css'

const MySwal = withReactContent(Swal);

const ShareSongButton = ({ song, className }: { song: Song; className?: string }) => {
  const user = useSelector((store: StoreType) => store.user.user);
  const dispatch = useDispatch<Dispatch>();
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleShare = async () => {
    const { value: email } = await MySwal.fire({
        title: "שיתוף שיר במייל",
        input: "email",
        inputLabel: "הכנס כתובת מייל לשיתוף",
        inputPlaceholder: "someone@example.com",
        showCancelButton: true,
        confirmButtonText: "שלח",
        cancelButtonText: "ביטול",
        customClass: {
          popup: "singsong-popup",
          title: "singsong-title",
          input: "singsong-input",
          confirmButton: "singsong-confirm",
          cancelButton: "singsong-cancel"
        },
        inputValidator: (value) => {
          if (!value) return "יש להזין כתובת מייל";
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return "כתובת מייל לא תקינה";
        },
      });

    if (email) {
      const subject = "שיר ששותף איתך ב-singsong";
      const body = `
        <div style="direction: rtl; background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 35px;">
            <h2 style="color: #333; font-size: 24px; text-align: center;">
              ${user?.userName || "משתמש"} שיתף/ה איתך שיר ב-<span style="text-decoration: underline;">singsong</span>
            </h2>
            <p style="font-size: 16px; color: #333;">השיר <strong>${song.title}</strong> מחכה לך!</p>
            <p style="font-size: 16px; color: #333;">לחץ/י על הכפתור למטה כדי להאזין:</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="http://:5173/songComments/${song.id}" style="display: inline-block; padding: 10px 20px; background: linear-gradient(90deg, #D59039, #F7C26B); color: white; text-decoration: none; border-radius: 30px; font-size: 15px;">
                🎧 האזן/י לשיר
              </a>
            </div>
            <p style="font-size: 15px; color: #888; text-align: center;">נשמע טוב? תמיד אפשר לשתף גם חברים :)</p>
          </div>
        </div>
      `;

      try {
        const result = await dispatch(sendEmail({ to: [email], subject, body }));
        if (result.meta.requestStatus === "fulfilled") {
          console.log("המייל נשלח בהצלחה!");
        } else {
          console.log("שגיאה בשליחת המייל.");
        }
      } catch {
          console.log("שגיאה בשליחת המייל.");
      } finally {
        // setSnackbarOpen(true);
        const token = localStorage.getItem("authToken");
        if (token) {
          const id = getUserDataFromToken(token);
          if (id) {
            dispatch(loadUser(id));
          }
        }
      }
    }
  };

  
    return (
      <GradientIconButton
        className={className}
        onClick={() => handleShare()}
        icon={<Share sx={{ fontSize: 27 }} />}
      />
    );
  };

export default ShareSongButton;


// snackbarMessage={snackbarMessage}
// snackbarOpen={snackbarOpen}
// setSnackbarOpen={setSnackbarOpen}