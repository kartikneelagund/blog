// Like blog
router.put("/:id/like", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;

    if (blog.likes.includes(ip)) {
      blog.likes = blog.likes.filter((l) => l !== ip);
    } else {
      blog.likes.push(ip);
    }

    await blog.save();
    res.json({ totalLikes: blog.likes.length }); // 👈 return count
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add comment
router.post("/:id/comment", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({
      name: req.body.name || "Anonymous",
      text: req.body.text,
    });

    await blog.save();
    res.json({ totalComments: blog.comments.length, comments: blog.comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Increment views
router.put("/:id/view", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json({ totalViews: blog.views });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
