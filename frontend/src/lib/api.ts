import axios, { AxiosError } from "axios";

const API_BASE_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || window.location.origin)
  : "http://localhost:5000";

// Create axios instance
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),

  verifyEmail: (data: { email: string; otp: string }) =>
    api.post("/auth/verify-email", data),

  resendOtp: (data: { email: string }) =>
    api.post("/auth/resend-otp", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  me: () => api.get("/auth/me"),
};

// Nutrition API
export const nutritionApi = {
  getTodayMeals: () => api.get("/nutrition/today"),

  addMeal: (meal: {
    food: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    sugar: number;
    ingredients: string[];
    description?: string;
  }) => api.post("/nutrition/add", meal),

  deleteMeal: (id: number) => api.delete(`/nutrition/${id}`),

  updateMeal: (id: number, data: Record<string, unknown>) =>
    api.patch(`/nutrition/${id}`, data),

  saveWeight: (data: { weight: number; date?: string }) =>
    api.post("/nutrition/weight", data),

  getWeightHistory: () => api.get("/nutrition/weight-history"),
};

// Health API
export const healthApi = {
  getProfile: () => api.get("/health"),
  saveProfile: (data: Record<string, unknown>) => api.post("/health", data),
};

// AI API - Direct calls to backend
export const aiApi = {
  detectFood: (imageFile: File) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return axios.post(`${API_BASE_URL}/detect-food`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  manualFood: (food: string) =>
    axios.post(`${API_BASE_URL}/manual-food`, { food }),

  healthCheck: (data: {
    food: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    condition: string;
  }) => axios.post(`${API_BASE_URL}/health-check`, data),
};
