import express from "express";
import {
  getBlogById,
  likeBlog,
  commentBlog,
} from "../controllers/blogController.js";

const router = express.Router();

// Get single blog
router.get("/:id", getBlogById);

// Like blog (anyone)
router.put("/:id/like", likeBlog);

// Comment blog (anyone)
router.post("/:id/comment", commentBlog);

export default router;
