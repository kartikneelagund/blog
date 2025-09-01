// backend/controllers/blogController.js
import Blog from "../models/Blog.js";
import cloudinary from "../utils/cloudinary.js";

// Create Blog (optional: still requires author)
export const createBlog = async (req, res) => {
  try {
    let image = "";

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path);
      image = uploaded.secure_url;
    } else if (req.body.image && !req.body.image.startsWith("http")) {
      const uploaded = await cloudinary.uploader.upload(req.body.image);
      image = uploaded.secure_url;
    } else if (req.body.image && req.body.image.startsWith("http")) {
      image = req.body.image;
    }

    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags: req.body.tags || [],
      image,
      author: req.body.author || null, // optional
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single blog + increment views
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "username");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like/Unlike blog (anyone)
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const ip = req.ip; // simple identifier
    if (blog.likes.includes(ip)) {
      blog.likes = blog.likes.filter((id) => id !== ip);
    } else {
      blog.likes.push(ip);
    }

    await blog.save();
    res.json({ likesCount: blog.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Comment blog (anyone)
export const commentBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const name = req.body.name || "Anonymous";
    const text = req.body.text;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    blog.comments.push({ name, text });
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
