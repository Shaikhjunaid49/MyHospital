import API from "./axios";

export const createAppointment = (data) => API.post("/appointments", data);
export const getAppointments = () => API.get("/appointments");
export const getAppointmentById = (id) => API.get(`/appointments/${id}`);
export const updateAppointment = (id, data) => API.put(`/appointments/${id}`, data);
export const cancelAppointment = (id) => API.patch(`/appointments/${id}/cancel`);
export const completeAppointment = (id) => API.patch(`/appointments/${id}/complete`);
