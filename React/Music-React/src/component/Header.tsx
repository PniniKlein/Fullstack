import { useState } from "react"
import { useSelector } from "react-redux";
import { Link } from "react-router"
import { StoreType } from "../store/store";

const Header =()=>{
    const authState = useSelector((store: StoreType) => store.user.authState);
    return(<>
      {!authState && <Link to='/Login'><button>להתחברות</button></Link>}
      {!authState && <Link to='/Register'><button>להרשמה</button></Link>}
    </>)
}
export default Header