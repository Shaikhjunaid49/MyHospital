import API from "./axios";

//signup Flow
export const sendOtp = (data) => API.post("/auth/signup/send-otp", data);
export const verifyOtp = (data) => API.post("/auth/signup/verify-otp", data);
export const setPassword = (data) => API.post("/auth/signup/set-password", data);

//Login
export const loginUser = (data) => API.post("/auth/login", data);

//Fetch logged-in user
export const getProfile = () => API.get("/auth/me");
