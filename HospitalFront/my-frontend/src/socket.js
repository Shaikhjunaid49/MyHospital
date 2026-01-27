import { io } from "socket.io-client";

export const createSocket = (auth) => {
  if (!auth || !auth.user) return null;

  const SOCKET_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  const socket = io(SOCKET_URL, {
    auth: {
      userId: auth.user._id,
      role: auth.user.role,
    },
    transports: ["websocket"],
    withCredentials: true,
  });

  return socket;
};
