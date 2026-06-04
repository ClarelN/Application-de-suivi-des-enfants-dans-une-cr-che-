import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Laisser le navigateur définir Content-Type + boundary pour FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// URL publique pour accéder aux fichiers stockés (images, vidéos, PDF…)
export const storageUrl = (chemin) =>
  chemin
    ? `${import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage"}/${chemin}`
    : null;

export default api;
