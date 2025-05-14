import { Delete } from "@mui/icons-material";
import GradientIconButton from "./GradientIconButton"; // עדכן את הנתיב אם צריך
import { Song } from "../model/Song";
import { loadUser } from "../store/userSlice";
import { getUserDataFromToken } from "./AppLayout";
import { deleteSong } from "../services/SongsService";
import SnackbarGreen from "./SnackbarGreen";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useState } from "react";
import { resetSong } from "../store/songSlice";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
const MySwal = withReactContent(Swal);


const DeleteSong = ({ song, className }: { song: Song; className?: string }) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const dispatch = useDispatch<Dispatch>();
    const songPlayer = useSelector((state: StoreType) => state.songPlayer.song);

    const handleDelete = async (songId: number) => {
        const result = await MySwal.fire({
            title: "האם אתה בטוח?",
            text: "לא תוכל לשחזר את השיר לאחר מחיקה!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "כן, מחק!",
            cancelButtonText: "ביטול",
            customClass: {
              popup: "singsong-popup",
              title: "singsong-title",
              confirmButton: "singsong-confirm",
              cancelButton: "singsong-cancel"
            },
            didOpen: () => {
              const style = document.createElement("style");
              style.innerHTML = `
                .singsong-popup {
                  background: #1A1A1A !important;
                  border-radius: 20px;
                  color: white;
                  font-family: 'Assistant', sans-serif;
                  direction: rtl;
                }
                .singsong-title {
                  color: white;
                  font-weight: bold;
                  font-size: 22px;
                }
                .singsong-confirm {
                  background: linear-gradient(90deg, #D59039, #F7C26B) !important;
                  color: white !important;
                  border-radius: 10px !important;
                  padding: 10px 25px !important;
                  font-size: 16px !important;
                  border: none !important;
                }
                .singsong-cancel {
                  background-color: #333 !important;
                  color: white !important;
                  border-radius: 10px !important;
                  padding: 10px 25px !important;
                  font-size: 16px !important;
                  border: none !important;
                }
              `;
              document.head.appendChild(style);
            }
          });
          

        if (result.isConfirmed) {
            if (await deleteSong(songId)) {
                if (songId == songPlayer.id)
                    dispatch(resetSong())
                setSnackbarMessage("השיר נמחק בהצלחה!");
                const token = localStorage.getItem("authToken");
                if (token) {
                    const id = getUserDataFromToken(token);
                    if (id) {
                        dispatch(loadUser(id));
                    }
                }
                setSnackbarOpen(true);
            } else {
                setSnackbarMessage("שגיאה במחיקת השיר");
                setSnackbarOpen(true);
            }
        }
    };
    return (<>
        <GradientIconButton
            className={className}
            onClick={() => handleDelete(song.id)}
            icon={<Delete sx={{ fontSize: 28 }} />}
        />
        <SnackbarGreen snackbarMessage={snackbarMessage} snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} />
    </>);
};
export default DeleteSong;