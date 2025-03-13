import { createBrowserRouter } from "react-router"
import App from "./App"
import { Login } from "@mui/icons-material"
import Register from "./component/Register"

export const router = createBrowserRouter([
    {
        path: '/', element: <App />,
        errorElement: <h1>error</h1>,
        children: [
            { path: 'Login', element: <Login /> },
            { path: 'Register', element: <Register /> },
        ]
    }
])