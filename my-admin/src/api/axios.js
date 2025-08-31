// src/api/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: "/api", // Vite proxy ile eşleşiyor -> /api/* -> http://localhost:3000
    headers: { "Content-Type": "application/json" },
});

// Basit log/uyarı - dev için faydalı
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const msg = err?.response?.data?.message || err?.response?.data?.error || err.message;
        console.error("[API ERROR]", err?.config?.method?.toUpperCase(), err?.config?.url, msg);
        return Promise.reject(err);
    }
);

export default api;
