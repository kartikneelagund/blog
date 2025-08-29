import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Automatically attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  const res = await api.get("/blogs"); // VITE_API_URL + /blogs
  return res.data;
};

export const createBlog = async (blogData) => {
  const res = await api.post("/blogs", blogData);
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await api.delete(`/blogs/${id}`);
  return res.data;
};

export default api;
