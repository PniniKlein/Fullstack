import { Outlet } from "react-router"
import Header from "./Header"
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import { loadUser } from "../store/userSlice";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import SongPlayer from "./SongPlayer";
import { loadSong } from "../store/songSlice";

export const getUserDataFromToken = (token: string) => {

    try {
      const decoded: any = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error("שגיאה בפענוח ה-Token", error);
      return null;
    }
    // try {
    //     const payload = JSON.parse(atob(token.split('.')[1])); // מפענחים את החלק השני
    //     return payload.id || null; // מחזירים את ה-id אם קיים
    // } catch (e) {
    //     console.error("Invalid token:", e);
    //     return null;
    // }
   };
const AppLayout = () => {
    const dispatch = useDispatch<Dispatch>();
    const songPlayer = useSelector((state: StoreType) => state.songPlayer.song);
    const authState = useSelector((state: StoreType) => state.user.authState);
    useEffect(() => {
      const fetchData = async () => {
        const token = localStorage.getItem("authToken");
        const song = sessionStorage.getItem("songPlayer");
        if (token != null) {
          const id = getUserDataFromToken(token);
          if (id) {
            await dispatch(loadUser(id));
          }
        }
        if (song) {
          dispatch(loadSong(JSON.parse(song)));
        }
      };
    
      fetchData();
    }, [authState]);
    return (<>
        <Header />
        <Outlet />
        {songPlayer.id!=0 && <div style={{height:"60px"}}></div>}
        {songPlayer.id!=0 && <SongPlayer />}
    </>)
}

export default AppLayout