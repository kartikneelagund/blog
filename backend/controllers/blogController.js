// controllers/blogController.js
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "username");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // ✅ Increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
