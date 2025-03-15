import { FormEvent, useState } from "react"
import { useDispatch } from "react-redux";
import { AddDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../store/userSlice";
import { AuthRegister } from "../model/AuthRegister";

const Register = () => {
    const emptyUser:AuthRegister ={
        userName:'',
        email:'',
        password:'',
        pathProfile:'aaaaa',
    }

    const dispatch = useDispatch<AddDispatch>();
    const [formData,setFormData] = useState<AuthRegister>(emptyUser)
    const navigate = useNavigate();

    const handleChange = (id: string, value: string) => {
        setFormData({ ...formData, [id]: value });
    }

    const handleSubmit = (e: FormEvent) =>{
        e.preventDefault()
        dispatch(registerUser(formData));
        navigate("/Home");
    }

    return (<>
       <form onSubmit={handleSubmit}>
        <input type="text" 
               placeholder="userName"
               value={formData.userName}
               id="userName"
               onChange={(e) => handleChange(e.target.id, e.target.value)}
               />
        <input type="text" 
               placeholder="email"
               value={formData.email}
               id="email"
               onChange={(e) => handleChange(e.target.id, e.target.value)}
               />
        <input type="text" 
               placeholder="password"
               value={formData.password}
               id="password"
               onChange={(e) => handleChange(e.target.id, e.target.value)}/>
        <button type="submit">SAVE</button>
       </form>
    </>)
}

export default Register