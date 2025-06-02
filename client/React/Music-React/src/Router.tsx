// import { createBrowserRouter } from "react-router"
// import Register from "./component/Register"
// import AppLayout from "./component/AppLayout"
// import Login from "./component/Login"
// import Home from "./component/Home"
// import UpdateUser from "./component/UpdateUser"
// import ArtistsList from "./component/ArtistsList"
// import SongsList from "./component/SongsList"
// import MusicLibrary from "./component/MusicLibrary"
// import About from "./component/About"
// import MySongs from "./component/MySongs"
// import UpdateSong from "./component/UpdateSong"
// import MediaPlayer from "./component/SongPlayer"
// import SongComments from "./component/SongComments"
// import ArtistSongs from "./component/ArtistSongs"

// export const router = createBrowserRouter([
//     {
//         path: '/', element: <AppLayout />,
//         errorElement: <h1>error</h1>,
//         children: [
//             { path: '', element: <Home /> },
//             { path: 'login', element: <Login /> },
//             { path: 'register', element: <Register /> },
//             { path: 'update', element: <UpdateUser /> },
//             { path: 'about', element: <About /> },
//             { path: 'mySongs', element: <MySongs /> ,},
//             { path: 'updateSong', element: <UpdateSong />} ,
//             { path: 'musicLibrary', element: <MusicLibrary /> ,
//             children: [
//                 { path: 'songList', element: <SongsList />} ,
//                 { path: 'artistList', element: <ArtistsList />} ,
//             ]
//             },
//             { path: 'artists/:id', element: <ArtistSongs /> },
//             { path: 'mediaPlayer', element: <MediaPlayer /> },
//             { path: 'songComments/:songId', element: <SongComments /> }
//             // { path: 'artists/:artistId', element: <SongList /> },
            
//         ]
//     }
// ])

import { createBrowserRouter } from "react-router"
import Register from "./component/Register"
import AppLayout from "./component/AppLayout"
import Login from "./component/Login"
import Home from "./component/Home"
import UpdateUser from "./component/UpdateUser"
import ArtistsList from "./component/ArtistsList"
import SongsList from "./component/SongsList"
import MusicLibrary from "./component/MusicLibrary"
// import About from "./component/About"
import MySongs from "./component/MySongs"
import UpdateSong from "./component/UpdateSong"
import MediaPlayer from "./component/SongPlayer"
import SongComments from "./component/SongComments"
import ArtistSongs from "./component/ArtistSongs"
import AddSong from "./component/AddSong"
import About from "./component/About"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <h1>error</h1>,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "update", element: <UpdateUser /> },
      // { path: "about", element: <About /> },
      { path: "mySongs", element: <MySongs /> },
      { path: "updateSong", element: <UpdateSong /> },
      { path:"updateUser" ,element:<UpdateUser />},
      { path:"addSong" ,element:<AddSong />},
      { path: "about", element: <About /> },
      {
        path: "musicLibrary",
        element: <MusicLibrary />,
        children: [
          { path: "songList", element: <SongsList /> },
          { path: "artistList", element: <ArtistsList /> },
        ],
      },
      { path: "artists/:id", element: <ArtistSongs /> },
      { path: "mediaPlayer", element: <MediaPlayer /> },
      { path: "songComments/:songId", element: <SongComments /> },
    ],
  },
])
