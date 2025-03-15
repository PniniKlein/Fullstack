import { Outlet } from "react-router"
import Header from "./Header"
const AppLayout = () => {

    return (<>
        <Header />
        <Outlet />
    </>)
}

export default AppLayout