import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ✅ Debug/test route
router.get("/", (req, res) => res.send("Admin OK"));

// ✅ Protected route - only admins can access stats
router.get("/stats", verifyToken, async (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}, getAdminStats);

export default router;
