import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
  autoConnect: false,
  transports: ["websocket"],
  auth: {
    token: auth?.token,
    userId: auth?.user?._id,
    role: auth?.user?.role,
  },
});


export default socket;
