import axios from "axios";
import toast from "react-hot-toast";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 15000, // 15 second timeout
});

// ── Request interceptor — attach token ────────────────────────────────────────
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor — handle errors globally ─────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token),
  );
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    // ── Network error (server down, no internet) ────────────────────────────
    if (!error.response) {
      toast.error("Connection error. Please check your internet connection.", {
        id: "network-error", // prevent duplicate toasts
      });
      return Promise.reject(error);
    }

    // ── Token expired — silent refresh ──────────────────────────────────────
    if (error.response.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return axiosClient(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const newToken = data.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        axiosClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ── Rate limit hit ──────────────────────────────────────────────────────
    if (error.response.status === 429) {
      toast.error("Too many requests. Please slow down and try again.", {
        id: "rate-limit",
      });
    }

    // ── Server error ────────────────────────────────────────────────────────
    if (error.response.status >= 500) {
      toast.error("Server error. Please try again later.", {
        id: "server-error",
      });
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
