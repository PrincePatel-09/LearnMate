/**
 * Axios API service — all HTTP calls go through here.
 * Base URL is read from the React .env file.
 */
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("lm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("lm_token");
      localStorage.removeItem("lm_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────
export const register  = (data) => API.post("/register", data);
export const login     = (data) => API.post("/login", data);
export const logout    = ()     => API.post("/logout");
export const getMe     = ()     => API.get("/me");

// ── Chat ─────────────────────────────────────────────────
export const sendMessage    = (message) => API.post("/chat", { message });
export const getChatHistory = ()        => API.get("/chat/history");
export const clearChat      = ()        => API.delete("/chat/clear");
export const getSuggestions = ()        => API.get("/chat/suggested");

// ── Dashboard ─────────────────────────────────────────────
export const getDashboard = () => API.get("/dashboard");

// ── Roadmap ───────────────────────────────────────────────
export const generateRoadmap  = (data) => API.post("/generate-roadmap", data);
export const getActiveRoadmap = ()     => API.get("/roadmap");
export const getAllRoadmaps   = ()     => API.get("/roadmap/all");
export const updateRoadmapProgress = (id, data) => API.put(`/roadmap/${id}/progress`, data);

// ── Courses ───────────────────────────────────────────────
export const getCourses      = (params = {}) => API.get("/courses", { params });
export const toggleBookmark  = (data)        => API.post("/courses/bookmark", data);
export const getBookmarks    = ()            => API.get("/courses/bookmarks");

// ── Profile ───────────────────────────────────────────────
export const getProfile       = ()     => API.get("/profile");
export const updateProfile    = (data) => API.put("/profile", data);
export const skillAssessment  = (data) => API.post("/skill-assessment", data);

// ── Progress ──────────────────────────────────────────────
export const updateProgress = (data) => API.post("/update-progress", data);
export const getProgress    = ()     => API.get("/progress");
export const getAnalytics   = ()     => API.get("/analytics");

export default API;
