// import { Outlet } from "react-router"
// import Header from "./Sidebar"
// import { useDispatch, useSelector } from "react-redux";
// import { Dispatch, StoreType } from "../store/store";
// import { loadUser } from "../store/userSlice";
// import { jwtDecode } from "jwt-decode";
// import { useEffect } from "react";
// import SongPlayer from "./SongPlayer";
// import { loadSong } from "../store/songSlice";

// export const getUserDataFromToken = (token: string) => {

//     try {
//       const decoded: any = jwtDecode(token);
//       return decoded.id;
//     } catch (error) {
//       console.error("שגיאה בפענוח ה-Token", error);
//       return null;
//     }
//     // try {
//     //     const payload = JSON.parse(atob(token.split('.')[1])); // מפענחים את החלק השני
//     //     return payload.id || null; // מחזירים את ה-id אם קיים
//     // } catch (e) {
//     //     console.error("Invalid token:", e);
//     //     return null;
//     // }
//    };
// const AppLayout = () => {
//     const dispatch = useDispatch<Dispatch>();
//     const songPlayer = useSelector((state: StoreType) => state.songPlayer.song);
//     const authState = useSelector((state: StoreType) => state.user.authState);
//     useEffect(() => {
//       const fetchData = async () => {
//         const token = localStorage.getItem("authToken");
//         const song = sessionStorage.getItem("songPlayer");
//         if (token != null) {
//           const id = getUserDataFromToken(token);
//           if (id) {
//             await dispatch(loadUser(id));
//           }
//         }
//         if (song) {
//           dispatch(loadSong(JSON.parse(song)));
//         }
//       };
    
//       fetchData();
//     }, [authState]);
//     return (<>
//         <Header />
//         <Outlet />
//         {songPlayer.id!=0 && <div style={{height:"60px"}}></div>}
//         {songPlayer.id!=0 && <SongPlayer />}
//     </>)
// }

// export default AppLayout

"use client"

import { Outlet } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import type { Dispatch, StoreType } from "../store/store"
import { loadUser } from "../store/userSlice"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react"
import SongPlayer from "./SongPlayer"
import { loadSong } from "../store/songSlice"
import MainSidebar from "./MainSidebar"
import "../css/AppLayout.css"
import Loader from "./ui/Loader"

export const getUserDataFromToken = (token: string) => {
  try {
    const decoded: any = jwtDecode(token)
    return decoded.id
  } catch (error) {
    console.error("שגיאה בפענוח ה-Token", error)
    return null
  }
}

const AppLayout = () => {
  const dispatch = useDispatch<Dispatch>()
  const songPlayer = useSelector((state: StoreType) => state.songPlayer.song)
  const authState = useSelector((state: StoreType) => state.user.authState)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const token = localStorage.getItem("authToken")
      const song = sessionStorage.getItem("songPlayer")
      if (token != null) {
        const id = await getUserDataFromToken(token)
        if (id) {
          await dispatch(loadUser(id))
        }
      }
      if (song) {
        dispatch(loadSong(JSON.parse(song)))
      }
      setIsLoading(false)
    }

    fetchData()
  }, [authState])
  return (
    <div className="app-layout">
      <MainSidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      {isLoading ? (
        <div className="load"><Loader text="טוען נתונים..."/></div>
      ):
      <main className={`main-content ${sidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
        <Outlet />
        {songPlayer.id != 0 && <div style={{ height: "80px" }}></div>}
        {songPlayer.id != 0 && <SongPlayer />}
      </main>}
    </div>
  )
}

export default AppLayout


