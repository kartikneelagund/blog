// controllers/adminController.js
import User from "../models/User.js";
import Blog from "../models/Blog.js";

export const getAdminStats = async (req, res) => {
  try {
    // Count users
    const totalUsers = await User.countDocuments();

    // Get all blogs
    const blogs = await Blog.find();

    const totalBlogs = blogs.length;

    // If Blog schema has `views` and `likes` (array of user IDs)
    const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
    const totalLikes = blogs.reduce((sum, b) => sum + (b.likes?.length || 0), 0);

    res.json({
      totalUsers,
      totalBlogs,
      totalViews,
      totalLikes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
