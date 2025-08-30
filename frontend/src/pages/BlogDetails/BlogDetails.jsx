import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBlogById, deleteBlog } from "../../utils/api"; // ✅ use api.js functions
import { useAuth } from "../../context/AuthContext";
import "./BlogDetails.css";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch blog by ID
  useEffect(() => {
    setLoading(true);
    getBlogById(id)
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load blog. Please try again.");
        setLoading(false);
      });
  }, [id]);

  // Delete blog
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(id);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to delete blog. Please try again.");
    }
  };

  if (loading) return <div className="blog-details container"><p>Loading...</p></div>;
  if (error) return <div className="blog-details container"><p>{error}</p></div>;
  if (!blog) return <div className="blog-details container"><p>Blog not found.</p></div>;

  const canEdit = user && (user.id === blog.author?._id || user._id === blog.author?._id || user.isAdmin);

  return (
    <div className="blog-details container">
      <h1>{blog.title}</h1>
      <p className="meta">By {blog.author?.username}</p>
      {blog.image && <img src={blog.image} alt={blog.title} />}
      <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }} />
      {canEdit && (
        <div className="actions">
          <Link className="edit-btn" to={`/edit/${blog._id}`}>Edit</Link>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
