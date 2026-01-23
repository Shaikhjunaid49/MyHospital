import API from "./axios";

export const createRoom = (data) => API.post("/rooms", data);
export const addSDP = (roomId, data) => API.post(`/rooms/${roomId}/sdp`, data);
export const endCall = (id) => API.patch(`/rooms/${id}/end`);
