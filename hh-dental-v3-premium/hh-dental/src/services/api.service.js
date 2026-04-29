import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

const requestConfig = {
  timeout: 12000,
  headers: { "Content-Type": "application/json" }
};

api.interceptors.request.use((config) => {
  console.log("API CALL:", config.url);
  return config;
});

function normalizePayload(payload) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }
  return payload;
}

async function getResource(path) {
  const res = await api.get(path, requestConfig);
  return normalizePayload(res.data);
}

export const getClinics = () => getResource("/clinics");
export const getDoctors = () => getResource("/doctors");
export const getServices = () => getResource("/services");
export const getServiceById = (id) => getResource(`/services/${id}`);

export async function submitAppointment(payload) {
  const res = await api.post("/appointments", payload, requestConfig);
  return normalizePayload(res.data);
}

export const postAppointment = submitAppointment;

export const getTestimonials = () => getResource("/testimonials");

export async function submitReview(payload) {
  const res = await api.post("/reviews", payload, requestConfig);
  return normalizePayload(res.data);
}

export default api;
