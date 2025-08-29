import axios from "axios";

// ✅ Base URL should point to API root, not a specific endpoint
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================
// Blogs API
// ==========================
export const getAllBlogs = async () => {
  const res = await api.get("/blogs");
  return res.data;
};

export const likeBlog = async (blogId) => {
  const res = await api.post(`/blogs/${blogId}/like`);
  return res.data;
};

export const commentBlog = async (blogId, text) => {
  const res = await api.post(`/blogs/${blogId}/comment`, { text });
  return res.data;
};

// Delete a blog (author/admin only)
export const deleteBlog = async (blogId) => {
  const res = await api.delete(`/blogs/${blogId}`);
  return res.data;
};

// Edit a blog (author/admin only)
export const editBlog = async (blogId, data) => {
  const res = await api.put(`/blogs/${blogId}`, data);
  return res.data;
};

export default api;