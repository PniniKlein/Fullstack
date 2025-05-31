import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../model/User";
import axios from "axios";
import { AuthLogin } from "../model/AuthLogin";
import { UserPostModel } from "../model/PostModel/UserPostModel";
import Swal from "sweetalert2"; // ייבוא SweetAlert2
import api from "../interceptor/axiosConfig";

let userEmpty: User = {
    id: 0,
    userName: "",
    email: "",
    password: "",
    create_at: "",
    songs: [],
    followees: [],
};

// const baseURL = 'https://singsong-api.onrender.com/api/Auth';
const baseURL = 'https://localhost:7093/api/Auth';
 

export const loginUser = createAsyncThunk('user/login',
    async (user: AuthLogin, thunkAPI) => {
        try {
            const response = await axios.post(baseURL + '/login', user);
            console.log(response.data);
            localStorage.setItem("authToken", response.data.token);
            return response.data;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
);

export const registerUser = createAsyncThunk('user/register',
    async (user: UserPostModel, thunkAPI) => {
        try {
            const response = await axios.post(baseURL + '/register', user);
            localStorage.setItem("authToken", response.data.token);
            return response.data;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
);

export const loadUser = createAsyncThunk('user/load',
    async (id: number, thunkAPI) => {
        console.log(id);
        try {
            const response = await api.get('/User/' + id + '/Full');
            return response.data;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
);

export const updateUser = createAsyncThunk('user/update',
    async ({ id, userPostModl }: { id: number, userPostModl: UserPostModel }, thunkAPI) => {
        try {
            const response = await api.put('/User/' + id, userPostModl);
            return response.data;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.response.data);
        }
    }
);

export const fetchDownloadUrl = createAsyncThunk(
    "user/DownloadUrl",
    async (fileName: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/User/download-url/${fileName}`);
            return response.data.downloadUrl;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Error fetching download URL");
        }
    }
);

export const sendEmail = createAsyncThunk(
    "emailRegister",
    async ({ to, subject, body }: { to: string[], subject: string, body: string }, thunkAPI) => {
        try {
            console.log("send email");
            const response = await api.post(`/Email/send`, { to, subject, body }, {
                headers: { "Content-Type": "application/json" }
            });
            console.log(response.data);
            return response.data;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);


const userSlice = createSlice({
    name: 'user',
    initialState: { user: userEmpty, authState: false, downloadUrl: null },
    reducers: {
        logOut: (state) => {
            state.user = userEmpty;
            localStorage.removeItem("authToken");
            state.authState = false;
        },
        addFollowee: (state, action) => {
            state.user.followees.push(action.payload.id);
        },
        removeFollowee: (state, action) => {
            state.user.followees = state.user.followees.filter((f: number) => f !== action.payload.id);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled,
                (state, action) => {
                    console.log(action);
                    state.user = action.payload.user;
                    state.authState = true;
                    console.log(state.user);
                }
            )
            .addCase(loginUser.rejected,
                (_, action) => {
                    console.log(action);
                    console.log('failed');
                    const errorMessage = action.payload || 'שגיאה לא ידועה';
                    Swal.fire({
                        icon: 'error',
                        title: 'התחברות נכשלה',
                        text: ` ${errorMessage} :שגיאה`,
                    });
                }
            )
            .addCase(registerUser.fulfilled,
                (state, action) => {
                    console.log(action);
                    state.user = action.payload.user;
                    state.authState = true;
                    console.log(state.user);
                    Swal.fire({
                        icon: 'success',
                        title: 'הרשמה הצליחה',
                        text: '!נרשמת בהצלחה',
                    });
                }
            )
            .addCase(registerUser.rejected,
                (_, action) => {
                    console.log(action);
                    console.log('failed');
                    const errorMessage = action.payload || 'שגיאה לא ידועה';
                    Swal.fire({
                        icon: 'error',
                        title: 'הרשמה נכשלה',
                        text: `${errorMessage} :שגיאה`,
                    });
                }
            )
            .addCase(loadUser.fulfilled,
                (state, action) => {
                    state.user = action.payload;
                    state.authState = true;
                    console.log(state.user)
                    console.log(state.authState)
                }
            )
            .addCase(loadUser.rejected,
                (state) => {
                    state.user = userEmpty;
                    state.authState = false;
                }
            )
            .addCase(updateUser.fulfilled,
                (state, action) => {
                    state.user = action.payload;
                    console.log(action);
                    Swal.fire({
                        icon: 'success',
                        title: 'עדכון הצליח',
                        text: '!המשתמש עודכן בהצלחה',
                    });
                }
            )
            .addCase(updateUser.rejected,
                (_, action) => {
                    console.log(action);
                    console.log('failed');
                    const errorMessage = action.payload || 'שגיאה לא ידועה';
                    Swal.fire({
                        icon: 'error',
                        title: 'עדכון נכשל',
                        text: `${errorMessage} :שגיאה`,
                    });
                }
            )
            .addCase(fetchDownloadUrl.fulfilled, (state, action) => {
                state.downloadUrl = action.payload;
            })
            .addCase(fetchDownloadUrl.rejected, (state, action) => {
                state.downloadUrl = null;
                console.log(action.payload);
            })

    }
});

export const { logOut } = userSlice.actions;
export default userSlice;