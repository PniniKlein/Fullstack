import { FormEvent, useRef } from "react"
import { useDispatch } from "react-redux";
import { AddDispatch } from "../store/store";
import { loginUser } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Login =()=>{
    const dispatch = useDispatch<AddDispatch>();
    const navigate = useNavigate();
    
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const handleSubmit = (e: FormEvent) =>{
        e.preventDefault()
        const userLog = {
            email: emailRef.current?.value?emailRef.current?.value:'',
            password: passwordRef.current?.value?passwordRef.current?.value:''
        }
        dispatch(loginUser(userLog));
        navigate("/Home");
    }

    return (<>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="email" ref={emailRef}/> <br />
            <input type="text" placeholder="password" ref={passwordRef}/> <br />
            <p>
            <Link to='/Register'>להרשמה</Link>
            </p>
            <button type="submit">SAVE</button>
        </form>
     </>)
}
export default Login