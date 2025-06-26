import axios from 'axios';

const api = axios.create({
    baseURL: "https://primestays-oxct.onrender.com/api",
    baseURL:"http://localhost:3030/api",
    withCredentials: true  // Important for authentication & sessions
});

export default api;
