import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "./BlogDetails.css";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/blogs/${id}`)
      .then((res) => setBlog(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/blogs/${id}`);
      navigate("/my-blogs"); // redirect user to their blogs
    } catch (err) {
      console.error(err);
    }
  };

  if (!blog) {
    return (
      <div className="blog-details container">
        <p>Loading...</p>
      </div>
    );
  }

  //Always use `_id` for MongoDB documents
  const canEdit =
    user && (user._id === blog.author?._id || user.isAdmin);

  return (
    <div className="blog-details container">
      <h1>{blog.title}</h1>
      <p className="meta">By {blog.author?.username || "Anonymous"}</p>

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
