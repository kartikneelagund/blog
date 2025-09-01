// src/components/BlogCard/BlogCard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./BlogCard.css";

export default function BlogCard({ blog }) {
  const [likes, setLikes] = useState(blog.likes?.length || 0);
  const [comments, setComments] = useState(blog.comments?.length || 0);
  const [views, setViews] = useState(blog.views || 0);
  const [likedByUser, setLikedByUser] = useState(false);

  const userId = localStorage.getItem("userId"); // optional, only for tracking if user is logged in

  // Check if current user liked the blog (if logged in)
  useEffect(() => {
    if (blog.likes && userId) {
      setLikedByUser(blog.likes.includes(userId));
    }
  }, [blog.likes, userId]);

  // Update counts when blog changes
  useEffect(() => {
    setLikes(blog.likes?.length || 0);
    setComments(blog.comments?.length || 0);
    setViews(blog.views || 0);
  }, [blog]);

  // Handle Like/Unlike (anyone can like)
  const handleLike = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/blogs/${blog._id}/like`
      );

      setLikes(res.data.likes?.length || 0);
    } catch (err) {
      console.error("Like error:", err.response?.data || err.message);
    }
  };

  // Handle adding comment (anyone can comment)
  const handleComment = async () => {
    const text = prompt("Enter your comment:");
    if (!text) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/blogs/${blog._id}/comment`,
        { text }
      );

      setComments(res.data.comments?.length || 0);
    } catch (err) {
      console.error("Comment error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="blog-card">
      <h2 className="blog-title">{blog.title}</h2>
      <p className="blog-author">By {blog.author?.username || "Anonymous"}</p>

      {blog.image && (
        <div className="blog-image">
          <img src={blog.image} alt={blog.title} />
        </div>
      )}

      <div
        className="blog-excerpt"
        dangerouslySetInnerHTML={{
          __html: (blog.content || "").substring(0, 160) + "...",
        }}
      />

      <div className="blog-footer">
        <button
          onClick={handleLike}
          style={{ color: likedByUser ? "red" : "black", cursor: "pointer" }}
        >
          ❤️ {likes}
        </button>

        <button onClick={handleComment} style={{ cursor: "pointer" }}>
          💬 {comments}
        </button>

        <span>👀 {views}</span>
      </div>

      <Link className="read-more" to={`/blogs/${blog._id}`}>
        Read More →
      </Link>
    </div>
  );
}
