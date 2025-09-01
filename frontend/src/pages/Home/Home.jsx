import { useEffect, useState } from "react";
import BlogCard from "../../components/BlogCard/BlogCard";
import "./Home.css";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch("https://blog-new-bakend.vercel.app/api/blogs") // backend API
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error(err));
  }, []);

  // Filter blogs by search + category
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "All" || b.category?.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Blog Platform</h1>
        <p className="hero-subtitle">
          Discover amazing stories, share your thoughts, and connect with writers
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Education">Education</option>
            <option value="Travel">Travel</option>
          </select>
          <button>Search</button>
        </div>
      </div>

      {/* Blog Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="blog-grid">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <p className="no-blogs">No blogs found.</p>
      )}
    </div>
  );
}
