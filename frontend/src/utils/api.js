import axios from "axios";

// ==========================
// Axios Instance
// ==========================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://blog-delta-hazel-70.vercel.app/api", 
  withCredentials: true, // if you are using cookies (optional)
});

// ==========================
// Request Interceptor
// Automatically attach token
// ==========================
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

// ==========================
// Response Interceptor
// Centralized error handling
// ==========================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    // Optionally handle token expiry → logout user
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

// ==========================
// Auth API
// ==========================
export const login = async (userData) => {
  const res = await api.post("/auth/login", userData);
  return res.data;
};

export const signup = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

export const getUserProfile = async () => {
  const res = await api.get("/user/profile");
  return res.data;
};

// ==========================
// Blogs API
// ==========================
export const getAllBlogs = async () => {
  const res = await api.get("/blogs");
  return res.data;
};

export const getBlogById = async (id) => {
  const res = await api.get(`/blogs/${id}`);
  return res.data;
};

export const createBlog = async (blogData) => {
  const res = await api.post("/blogs", blogData);
  return res.data;
};

export const updateBlog = async (id, blogData) => {
  const res = await api.put(`/blogs/${id}`, blogData);
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await api.delete(`/blogs/${id}`);
  return res.data;
};

export default api;
