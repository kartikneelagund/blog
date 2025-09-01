import Blog from "../models/Blog.js";

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single blog by ID and increment views
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

// Like a blog (anyone)
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Use a random anonymous ID for anyone, or IP from req
    const anonId = req.ip; // you can also generate a random string

    if (blog.likes.includes(anonId)) {
      blog.likes = blog.likes.filter((id) => id !== anonId);
    } else {
      blog.likes.push(anonId);
    }

    await blog.save();
    res.json({ likesCount: blog.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Comment on a blog (anyone)
export const commentBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const { text, name } = req.body;

    blog.comments.push({
      text,
      name: name || "Anonymous",
      createdAt: new Date(),
    });

    await blog.save();
    res.json({ comments: blog.comments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
