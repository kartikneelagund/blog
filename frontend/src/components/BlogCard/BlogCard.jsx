import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api, { likeBlog, commentBlog, deleteBlog } from "../../utils/api";
import "./BlogCard.css";

export default function BlogCard({ blog, currentUser }) {
  const [likes, setLikes] = useState(blog.likes?.length ?? 0);
  const [comments, setComments] = useState(blog.comments?.length ?? 0);
  const [views, setViews] = useState(blog.views?.length ?? 0);
  const [likedByUser, setLikedByUser] = useState(false);
  const hasViewed = useRef(false); // ✅ prevent duplicate view count

  const userId = currentUser?._id;

  // check if already liked
  useEffect(() => {
    if (blog.likes && userId) {
      setLikedByUser(blog.likes.includes(userId));
    }
  }, [blog.likes, userId]);

  // sync counts when blog changes
  useEffect(() => {
    setLikes(blog.likes?.length ?? 0);
    setComments(blog.comments?.length ?? 0);
    setViews(blog.views?.length ?? 0);
  }, [blog]);

  // increment views only once
  useEffect(() => {
    if (hasViewed.current) return;
    hasViewed.current = true;

    const addView = async () => {
      try {
        await api.post(`/blogs/${blog._id}/view`);
        setViews((prev) => prev + 1);
      } catch (err) {
        console.error("Error incrementing view:", err.response?.data || err.message);
      }
    };
    addView();
  }, [blog._id]);

  const handleLike = async () => {
    try {
      const res = await likeBlog(blog._id);
      setLikes(res.likesCount);
      setLikedByUser(res.likes.includes(userId));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleComment = async () => {
    const text = prompt("Enter your comment:");
    if (!text) return;
    try {
      const res = await commentBlog(blog._id, text);
      setComments(res.commentsCount);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(blog._id);
      window.location.reload();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="blog-card">
      <h2>{blog.title}</h2>
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
        <button style={{ color: likedByUser ? "red" : "black" }} onClick={handleLike}>
          ❤️ {likes}
        </button>
        <button onClick={handleComment}>💬 {comments}</button>
        <span>👀 {views}</span>

        {(currentUser?.isAdmin || currentUser?._id === blog.author?._id) && (
          <div className="blog-actions">
            <Link to={`/edit/${blog._id}`} className="edit-btn">✏️ Edit</Link>
            <button onClick={handleDelete} className="delete-btn">🗑️ Delete</button>
          </div>
        )}
      </div>

      <Link className="read-more" to={`/blogs/${blog._id}`}>
        Read More →
      </Link>
    </div>
  );
}
