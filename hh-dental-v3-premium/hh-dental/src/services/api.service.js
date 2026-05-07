import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "https://venraj-final.onrender.com";
const API_BASE_URL = `${API_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for Render cold start
});

// Retry mechanism for Render cold starts
api.interceptors.response.use(null, async (error) => {
  const { config, response } = error;
  
  // Retry 3 times for network errors or 503/504 (often seen during cold starts)
  if (!config || !config.retry) config.retry = 0;
  
  const shouldRetry = !response || response.status === 503 || response.status === 504 || response.status === 502;
  
  if (shouldRetry && config.retry < 3) {
    config.retry += 1;
    const delay = config.retry * 2000; // 2s, 4s, 6s
    console.log(`Retrying API call (${config.retry}/3) in ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return api(config);
  }

  // Safe Error Handling
  let message = "An unexpected error occurred";
  if (error.message === "Network Error") {
    message = "Backend server is sleeping or unreachable. Please wait...";
  } else if (response?.status >= 500) {
    message = "Server is currently busy. Please try again in a moment.";
  } else if (error.code === "ECONNABORTED") {
    message = "Connection timed out. The server might be waking up.";
  }
  
  error.friendlyMessage = message;
  return Promise.reject(error);
});

api.interceptors.request.use((config) => {
  if (import.meta.env.DEV) console.log("API CALL:", config.url);
  return config;
});

function normalizePayload(payload) {
  if (payload && typeof payload === "object") {
    if ("data" in payload) {
      return payload.data;
    }
  }
  return payload;
}

const pendingRequests = new Map();

async function getResource(path) {
  if (pendingRequests.has(path)) {
    return pendingRequests.get(path);
  }

  const promise = api.get(path)
    .then((res) => normalizePayload(res.data))
    .finally(() => {
      pendingRequests.delete(path);
    });

  pendingRequests.set(path, promise);
  return promise;
}

export const getClinics = () => getResource("/clinics");
export const getDoctors = () => getResource("/doctors");
export const getServices = () => getResource("/services");
export const getServiceById = (id) => getResource(`/services/${id}`);

export async function submitAppointment(payload) {
  const res = await api.post("/appointments", payload);
  return normalizePayload(res.data);
}

export const postAppointment = submitAppointment;

export const getTestimonials = () => getResource("/testimonials");

export async function submitReview(payload) {
  const res = await api.post("/reviews", payload);
  return normalizePayload(res.data);
}

export default api;
