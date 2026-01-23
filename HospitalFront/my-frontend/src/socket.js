import { io } from "socket.io-client";

const auth = JSON.parse(localStorage.getItem("auth"));

const socket = io("http://localhost:8080", {
  autoConnect: false,
  transports: ["websocket"],
  auth: {
    token: auth?.token,
    userId: auth?.user?._id,
    role: auth?.user?.role,
  },
});

export default socket;
