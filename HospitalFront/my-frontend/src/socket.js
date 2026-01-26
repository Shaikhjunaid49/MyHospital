import { io } from "socket.io-client";

export const createSocket = (auth) => {
  if (!auth || !auth.user) return null;

  const socket = io(import.meta.env.VITE_API_URL, {
    auth: {
      userId: auth.user._id,
      role: auth.user.role,
    },
  });

  return socket;
};
