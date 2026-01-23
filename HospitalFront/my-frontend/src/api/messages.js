import API from "./axios";

export const sendMessage = (data) => API.post("/messages", data);
export const getRoomMessages = (roomId) => API.get(`/messages/${roomId}`);
export const markMessagesRead = (roomId) => API.post(`/messages/${roomId}/read`);
