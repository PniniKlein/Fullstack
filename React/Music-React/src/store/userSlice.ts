import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../model/User";
import axios from "axios";
import { AuthLogin } from "../model/AuthLogin";
import { AuthRegister } from "../model/AuthRegister";

let userEmpty: User={
    id:0,
    email:"",
    password: "",
    create_at:"",
}

export const loginUser = createAsyncThunk('user/login',
    async(user:AuthLogin,thunkAPI)=>{
        try{
            const response = await axios.post('https://localhost:7093/api/Auth/login',user)
            console.log(response.data)
            sessionStorage.setItem("authToken", response.data.token);
            return response.data
        }
        catch(e:any){
            alert(e.message)
            return thunkAPI.rejectWithValue(e.ErrorMessage)
        }
    }
)

export const registerUser = createAsyncThunk('user/register',
    async(user:AuthRegister,thunkAPI)=>{
        try{
            const response = await axios.post('https://localhost:7093/api/Auth/register',user)
            sessionStorage.setItem("authToken", response.data.token);
            return response.data
        }
        catch(e:any){
            
            alert(e.ErrorMessage)
            console.log(e)
            return thunkAPI.rejectWithValue(e.ErrorMessage)
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: {user:userEmpty,authState:false},
    reducers: {
        logout: (state) => {
            state.user = userEmpty;
            sessionStorage.removeItem("authToken");
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(loginUser.fulfilled,
                (state,action)=>{
                    console.log(action)
                    state.user = action.payload.user
                    state.authState = true
                    console.log(state.user)
                }
            )    
            .addCase(loginUser.rejected,
                (_,action)=>{
                    console.log(action);
                    console.log('failed');
                }
            )    
            .addCase(registerUser.fulfilled,
                (state,action)=>{
                    console.log(action)
                    state.user = action.payload.user
                    state.authState = true
                    console.log(state.user)
                }
            )    
            .addCase(registerUser.rejected,
                (_,action)=>{
                    console.log(action);
                    console.log('failed');
                }
            )    
        }
})

export default userSlice