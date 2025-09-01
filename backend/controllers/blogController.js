import Blog from "../models/Blog.js";

// Like / Unlike (anonymous users can like)
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.user?._id || "anonymous";

    // For anonymous likes, use a separate field or just allow multiple counts
    if (userId !== "anonymous") {
      if (blog.likes.includes(userId)) {
        blog.likes = blog.likes.filter(id => id.toString() !== userId);
      } else {
        blog.likes.push(userId);
      }
    } else {
      // Anonymous like just increments a counter
      blog.likesCount = (blog.likesCount || 0) + 1;
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Comment (anonymous users can comment)
export const commentBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.user?._id || null;
    const username = req.user?.username || "Anonymous";

    blog.comments.push({
      user: userId,
      text: req.body.text,
      createdAt: new Date(),
      username, // store name for anonymous
    });

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
