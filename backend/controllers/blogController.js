import Blog from "../models/Blog.js";

// Like/Unlike Blog (anyone can like)
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.body.userId || "anonymous"; // track anonymous likes

    if (blog.likes.includes(userId)) {
      blog.likes = blog.likes.filter((id) => id !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Comment on Blog (anyone can comment)
export const commentBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({
      user: req.body.userId || "Anonymous",
      text: req.body.text,
      createdAt: new Date(),
    });

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Increment views (anyone visiting)
export const incrementViews = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.views = (blog.views || 0) + 1;
    await blog.save();
    res.json({ views: blog.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
