import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  commentBlog
} from "../controllers/blog.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", verifyToken, createBlog);
router.put("/:id", verifyToken, updateBlog); // update by author only
router.delete("/:id", verifyToken, deleteBlog); // delete by author or admin
router.put("/:id/like", verifyToken, likeBlog);
router.post("/:id/comment", verifyToken,  commentBlog);

export default router;
