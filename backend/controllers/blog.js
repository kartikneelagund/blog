import Blog from "../models/Blog.js";
import cloudinary from "../utils/cloudinary.js";

// ✅ Create Blog
export const createBlog = async (req, res) => {
  try {
    let image = "";

    // If uploaded via multer
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path);
      image = uploaded.secure_url;
    }
    // If raw image string passed (base64 or file path)
    else if (req.body.image && !req.body.image.startsWith("http")) {
      const uploaded = await cloudinary.uploader.upload(req.body.image);
      image = uploaded.secure_url;
    }
    // If frontend already sent a Cloudinary URL
    else if (req.body.image && req.body.image.startsWith("http")) {
      image = req.body.image;
    }

    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags: req.body.tags || [],
      image,
      author: req.user._id, // from JWT middleware
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

// ✅ Get Single Blog
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "username");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Blog (only author)
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let image = blog.image;

    // If new file uploaded
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path);
      image = uploaded.secure_url;
    }
    // If base64 string provided
    else if (req.body.image && !req.body.image.startsWith("http")) {
      const uploaded = await cloudinary.uploader.upload(req.body.image);
      image = uploaded.secure_url;
    }
    // If Cloudinary URL provided (replace existing)
    else if (req.body.image && req.body.image.startsWith("http")) {
      image = req.body.image;
    }
    // If no image field sent, keep old image

    const updateFields = {
      title: req.body.title ?? blog.title,
      content: req.body.content ?? blog.content,
      category: req.body.category ?? blog.category,
      tags: req.body.tags ?? blog.tags,
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

// ✅ Delete Blog (author or admin)
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


// ✅ Like / Unlike Blog (no login required)
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Use IP as a simple identifier (prevents unlimited likes from same user)
    const userIp = req.ip;

    if (blog.likes.includes(userIp)) {
      blog.likes = blog.likes.filter((ip) => ip !== userIp);
    } else {
      blog.likes.push(userIp);
    }

    await blog.save();
    res.json({ likesCount: blog.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Comment on Blog (no login required)
export const commentBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({
      name: req.body.name || "Anonymous",
      text: req.body.text,
      createdAt: new Date(),
    });

    await blog.save();
    res.json(blog.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

