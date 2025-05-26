// import './App.css'
import store from './store/store'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
import { router } from './Router'



function App() {

  return (
    <>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
    </>
  )
}

export default App

// "use client"
// import { Routes, Route } from "react-router-dom"
// import "./css/theme.css"
// // import AppWrapper from "./component/AppWrapper"
// import AppLayout from "./component/AppLayout"
// import Login from "./component/Login"
// import Home from "./component/Home"
// import Register from "./component/Register"
// import MusicLibrary from "./component/MusicLibrary"
// import ArtistsList from "./component/ArtistsList"
// import SongsList from "./component/SongsList"
// import ArtistSongs from "./component/ArtistSongs"
// import SongComments from "./component/SongComments"
// import MySongs from "./component/MySongs"
// import UpdateSong from "./component/UpdateSong"
// import UpdateUser from "./component/UpdateUser"
// import Settings from "./component/Settings"
// import AddSong from "./component/AddSong"

// function App() {
//   return (
//     <AppWrapper>
//       <Routes>
//         <Route path="/" element={<AppLayout />}>
//           <Route index element={<Home />} />
//           <Route path="login" element={<Login />} />
//           <Route path="register" element={<Register />} />
//           <Route path="musicLibrary" element={<MusicLibrary />}>
//             <Route path="songList" element={<SongsList />} />
//             <Route path="artistList" element={<ArtistsList />} />
//           </Route>
//           <Route path="artists/:id" element={<ArtistSongs />} />
//           <Route path="songComments/:songId" element={<SongComments />} />
//           <Route path="mySongs" element={<MySongs />} />
//           <Route path="updateSong" element={<UpdateSong />} />
//           <Route path="update" element={<UpdateUser />} />
//           <Route path="settings" element={<Settings />} />
//           <Route path="add-song" element={<AddSong />} />
//         </Route>
//       </Routes>
//     </AppWrapper>
//   )
// }

// export default App

