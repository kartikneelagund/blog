// routes/adminRoutes.js
import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Only admins can see stats
router.get("/stats", verifyToken, async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}, getAdminStats);

export default router;
