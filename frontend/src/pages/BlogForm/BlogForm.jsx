// src/pages/BlogForm/BlogForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Editor from "../../components/Editor/Editor";
import "./BlogForm.css";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_preset";

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", category: "", tags: "" });
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        const b = res.data;
        setForm({
          title: b.title || "",
          content: b.content || "",
          category: b.category || "",
          tags: (b.tags || []).join(", "),
        });
        setImage(b.image || "");
      } catch (err) {
        console.error("Error fetching blog:", err.response?.data || err.message);
      }
    };
    fetchBlog();
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
      const res = await fetch(url, { method: "POST", body: fd });
      const data = await res.json();
      setImage(data.secure_url);
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("You must be logged in to create/update a blog.");
      return;
    }

    const payload = {
      title: form.title,
      content: form.content,
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      image,
    };

    setLoading(true);
    setError("");

    try {
      if (id) {
        // PUT request with token
        await api.put(`/blogs/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // POST request with token
        await api.post("/blogs", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate("/"); // Redirect to home after success
    } catch (err) {
      console.error("Blog submit error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to submit blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="blog-form" onSubmit={handleSubmit}>
      <h2>{id ? "Edit Blog" : "Create Blog"}</h2>

      {error && <p className="error">{error}</p>}

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={onChange}
        required
      />

      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={onChange}
      />

      <input
        name="tags"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={onChange}
      />

      <Editor
        value={form.content}
        onChange={(value) => setForm({ ...form, content: value })}
      />

      <label className="file-label">
        <span>{loading ? "Uploading..." : "Upload Image"}</span>
        <input type="file" accept="image/*" onChange={uploadImage} />
      </label>

      {image && <img className="preview" src={image} alt="preview" />}

      <button type="submit" disabled={loading}>
        {id ? "Update" : "Post"}
      </button>
    </form>
  );
}
