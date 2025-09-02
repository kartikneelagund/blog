import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api"; // axios instance
import axios from "axios"; // ✅ add this import for direct call
import { useAuth } from "../../context/AuthContext";
import "./BlogDetails.css";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Fetch blog details
  useEffect(() => {
    api
      .get(`/blogs/${id}`)
      .then((res) => setBlog(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // ✅ Increment views when blog is opened
  useEffect(() => {
    const incrementViews = async () => {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/blogs/${id}/view`);
      } catch (err) {
        console.error("View error:", err);
      }
    };
    incrementViews();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/blogs/${id}`);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (!blog)
    return (
      <div className="blog-details container">
        <p>Loading...</p>
      </div>
    );

  const canEdit =
    user &&
    (user.id === blog.author?._id ||
      user._id === blog.author?._id ||
      user.isAdmin);

  return (
    <div className="blog-details container">
      <h1>{blog.title}</h1>
      <p className="meta">
        By {blog.author?.username} • 👀 {blog.views || 0} views
      </p>

      {blog.image && <img src={blog.image} alt={blog.title} />}
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {canEdit && (
        <div className="actions">
          <Link className="edit-btn" to={`/edit/${blog._id}`}>
            Edit
          </Link>
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
