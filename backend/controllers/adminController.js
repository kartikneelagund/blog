// controllers/adminController.js
import User from "../models/User.js";
import Blog from "../models/Blog.js";

export const getAdminStats = async (req, res) => {
  try {
    // Count only non-admin users
    const totalUsers = await User.countDocuments({ isAdmin: false });

    // Get all blogs
    const blogs = await Blog.find();

    const totalBlogs = blogs.length;
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
