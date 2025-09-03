// backend/api/index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "../routes/auth.js";
import blogRoutes from "../routes/blog.js";
import userRoutes from "../routes/user.js";
import adminRoutes from "../routes/adminRoutes.js";

dotenv.config();

const app = express();

// ==================
// Middleware
// ==================
app.use(
  cors({
    origin: ["http://localhost:5173", "https://blog-33js.vercel.app"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// ==================
// Routes
// ==================
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend running on Vercel!");
});

// ==================
// MongoDB
// ==================
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// ==================
// Export for Vercel
// ==================
import serverless from "serverless-http";
export const handler = serverless(app);
