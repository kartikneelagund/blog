import { useEffect, useState } from "react";
import { getAllBlogs } from "../../utils/api";
import BlogCard from "../../components/BlogCard/BlogCard";
import "./Blogs.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getAllBlogs().then((data) => setBlogs(data));

    // load current user info if logged in
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); // store user at login
    if (token && user) setCurrentUser(user);
  }, []);

  return (
    <div className="blogs-container">
      {blogs.length === 0 && <p>No blogs found.</p>}
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} currentUser={currentUser} />
      ))}
    </div>
  );
}
