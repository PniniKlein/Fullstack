// ShareSongButton.tsx
import { Share } from "@mui/icons-material";
import { Song } from "../model/Song";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
import { getUserDataFromToken } from "./AppLayout";
import { useDispatch, useSelector } from "react-redux";
import { StoreType, Dispatch } from "../store/store";
import { sendEmail, loadUser } from "../store/userSlice";
// import { useState } from "react";
// import SnackbarGreen from "./SnackbarGreen";
import GradientIconButton from "./GradientIconButton";
import '../css/ShareSong.css'
import { useState } from "react";
import { Mail } from "lucide-react";

// const MySwal = withReactContent(Swal);

const ShareSong = ({ song, className }: { song: Song; className?: string }) => {

  const user = useSelector((store: StoreType) => store.user.user);
  const [openShare, setOpenShare] = useState(false);
  const [shareEmails, setShareEmails] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch<Dispatch>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const sendEmailShare = async (emailList:string[]) => {
    if (shareEmails) {
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
        const result = await dispatch(sendEmail({ to: emailList, subject, body }));
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

    const handleShare = async () => {
    if (!shareEmails.trim()) return

    setIsLoading(true)
    try {
      const emailList = shareEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email)
      await sendEmailShare(emailList)
      setSnackbarMessage("השיר נשלח בהצלחה!")
      setSnackbarOpen(true)
      setOpenShare(false)
      setShareEmails("")
    } catch (error) {
      setSnackbarMessage("שגיאה בשליחת השיר")
      setSnackbarOpen(true)
    } finally {
      setIsLoading(false)
    }
  }


  return (<>
    <GradientIconButton
      className={className}
      // onClick={() => handleShare()}
      onClick={() => setOpenShare(true)}
      icon={<Share sx={{ fontSize: 27 }} />}
    />
    {openShare && (
      <div
        className="share-comp-dialog-overlay"
        onClick={() => setOpenShare(false)}
      >
        <div className="share-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="share-dialog-header">
            <Mail size={20} />
            <h3>שיתוף השיר במייל</h3>
            <button className="share-close-button" onClick={() => setOpenShare(false)}>
              ×
            </button>
          </div>
          <div className="share-dialog-content">
            <div className="share-song-share-info">
              <div className="share-song-share-image" style={{ backgroundImage: `url(${song.pathPicture})` }}></div>
              <div className="share-song-share-details">
                <h4>{song.title}</h4>
                <p>{song.gener || "כללי"}</p>
              </div>
            </div>
            <div className="share-input-container">
              <label htmlFor="share-emails">כתובות אימייל (הפרד בפסיקים)</label>
              <input
                id="share-emails"
                type="text"
                value={shareEmails}
                onChange={(e) => setShareEmails(e.target.value)}
                placeholder="example@mail.com, another@mail.com"
                dir="ltr"
              />
            </div>
            <button
              className="share-submit-button"
              onClick={handleShare}
              disabled={isLoading || !shareEmails.trim()}
            >
              {isLoading ? (
                <div className="share-loading-spinner"></div>
              ) : (
                <>
                  <Mail size={16} />
                  <span>שלח</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default ShareSong;


// snackbarMessage={snackbarMessage}
// snackbarOpen={snackbarOpen}
// setSnackbarOpen={setSnackbarOpen}