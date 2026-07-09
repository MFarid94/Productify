import axios from "axios";

const api = axios.create({
    baseURL: "https://productify-zos97.sevalla.app",
    withCredentials: true,
})

export default api;