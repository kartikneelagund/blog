import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  commentBlog,
  incrementViews,
} from "../controllers/blogController.js";

const router = express.Router();

// CRUD
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

// Interactions (no auth needed)
router.put("/:id/like", likeBlog);
router.post("/:id/comment", commentBlog);
router.put("/:id/views", incrementViews);

export default router;
