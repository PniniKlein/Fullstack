import { createBrowserRouter } from "react-router"
import Register from "./component/Register"
import AppLayout from "./component/AppLayout"
import Login from "./component/Login"
import Home from "./component/Home"

export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        errorElement: <h1>error</h1>,
        children: [
            { path: 'Login', element: <Login /> },
            { path: 'Register', element: <Register /> },
            { path: 'Home', element: <Home /> },
        ]
    }
])