import axios from "axios";

// axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default API;
