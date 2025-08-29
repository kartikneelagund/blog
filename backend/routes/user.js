import express from "express";
import {
  getAllUsers,
  getMe,
  updateUser,
  deleteUser,
} from "../controllers/user.js";
import { verifyToken, verifyTokenAndAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", verifyToken, getMe);
router.get("/all", verifyTokenAndAdmin, getAllUsers);
router.put("/:id", verifyTokenAndAdmin, updateUser);   // Only admins can edit
router.delete("/:id", verifyTokenAndAdmin, deleteUser); // Only admins can delete

export default router;
