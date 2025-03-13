import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../model/User";
import axios from "axios";
import { UserLogin } from "../model/UserLogin";
let userEmpty: User={
    id:0,
    email:"",
    password: "",
    create_at:"",
}

export const loginUser = createAsyncThunk('user/login',
    async(user:UserLogin,thunkAPI)=>{
        try{
            const response = await axios.post('https://localhost:7093/api/Auth/login',user)
            return response.data
        }
        catch(e:any){
            alert(e.message)
            return thunkAPI.rejectWithValue(e.ErrorMessage)
        }
    }
)

export const registerUser = createAsyncThunk('user/register',
    async(user:UserLogin,thunkAPI)=>{
        try{
            const response = await axios.post('https://localhost:7093/api/Auth/login',user)
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
    initialState: {user:userEmpty},
    reducers: {},
    extraReducers:(builder)=>{
        builder
            .addCase(loginUser.fulfilled,
                (state,action)=>{
                    console.log(action)
                    state.user = action.payload.user
                }
            )    
            .addCase(loginUser.rejected,
                (action)=>{
                    console.log(action);
                    console.log('failed');
                }
            )    
        }
})

export default userSlice