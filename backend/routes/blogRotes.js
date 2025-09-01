// routes/blogRoutes.js
import express from "express";
import multer from "multer";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  commentBlog,
} from "../controllers/blogController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Public routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogById); // increments views

// ✅ Likes & comments (no login required)
router.put("/:id/like", likeBlog);
router.post("/:id/comment", commentBlog);

// ✅ Protected routes (login required)
router.post("/", verifyToken, upload.single("image"), createBlog);
router.put("/:id", verifyToken, upload.single("image"), updateBlog);
router.delete("/:id", verifyToken, deleteBlog);

export default router;
