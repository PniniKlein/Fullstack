import axios from "axios";

const api = axios.create({
    baseURL: "https://singsong-api.onrender.com/api",
    // baseURL: "https://localhost:7093/api",
    
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken"); 
    console.log(token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;