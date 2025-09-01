import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./BlogCard.css";

export default function BlogCard({ blog }) {
  const [likes, setLikes] = useState(blog.likes?.length || 0);
  const [comments, setComments] = useState(blog.comments?.length || 0);
  const [views, setViews] = useState(blog.views || 0);

  // Increment views on load
  useEffect(() => {
    const incrementViews = async () => {
      try {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/blogs/${blog._id}/views`
        );
        setViews(res.data.views || 0);
      } catch (err) {
        console.error("View error:", err);
      }
    };
    incrementViews();
  }, [blog._id]);

  // Handle Like (anyone can like)
  const handleLike = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/blogs/${blog._id}/like`,
        { userId: "anonymous" } // track as anonymous
      );
      setLikes(res.data.likes?.length || 0);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // Handle Comment (anyone can comment)
  const handleComment = async () => {
    const text = prompt("Enter your comment:");
    if (!text) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/blogs/${blog._id}/comment`,
        { text, userId: "Anonymous" }
      );
      setComments(res.data.comments?.length || 0);
    } catch (err) {
      console.error("Comment error:", err);
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
        <button onClick={handleLike} style={{ cursor: "pointer" }}>
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
