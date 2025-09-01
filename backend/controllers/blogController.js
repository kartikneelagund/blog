// controllers/blogController.js
import Blog from "../models/Blog.js";
import cloudinary from "../utils/cloudinary.js";

// ✅ Create Blog
export const createBlog = async (req, res) => {
  try {
    let image = "";

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path);
      image = uploaded.secure_url;
    } else if (req.body.image) {
      const uploaded = await cloudinary.uploader.upload(req.body.image);
      image = uploaded.secure_url;
    }

    const blog = new Blog({
      ...req.body,
      image,
      author: req.user?._id || null, // optional author
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Single Blog & Increment Views
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

// ✅ Update Blog (author only)
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let image = blog.image;
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path);
      image = uploaded.secure_url;
    } else if (req.body.image && req.body.image !== blog.image && !req.body.image.startsWith("http")) {
      const uploaded = await cloudinary.uploader.upload(req.body.image);
      image = uploaded.secure_url;
    }

    const updateFields = {
      title: req.body.title || blog.title,
      content: req.body.content || blog.content,
      category: req.body.category || blog.category,
      image,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await blog.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Like/Unlike Blog (anonymous allowed)
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.body.userId || "anonymous";

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

// ✅ Comment on Blog (anonymous allowed)
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
