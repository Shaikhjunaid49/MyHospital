import API from "./axios";

export const getPendingProviders = () => API.get("/admin/providers/pending");
export const verifyProvider = (id) => API.patch(`/admin/providers/${id}/verify`);
export const rejectProvider = (id) => API.patch(`/admin/providers/${id}/reject`);

export const createServiceAdmin = (data) => API.post("/admin/service", data);
export const getAdminServices = () => API.get("/admin/services");
export const updateServiceAdmin = (id, data) => API.patch(`/admin/service/${id}`, data);
export const deleteServiceAdmin = (id) => API.delete(`/admin/service/${id}`);

export const getAdminAppointments = () => API.get("/admin/appointments");

export const getDashboardStats = () => API.get("/admin/dashboard");

export const createProvider = (data) => API.post("/admin/providers", data);
