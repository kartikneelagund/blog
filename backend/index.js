import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// ==================
// Route Imports
// ==================
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blog.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/adminRoutes.js"; // ✅ NEW

dotenv.config(); // ✅ load .env first

const app = express();

// ==================
// Middleware
// ==================
const allowedOrigins = [
  "http://localhost:5173",  // local frontend
  "https://blog-33js.vercel.app" // deployed frontend
];

app.use(
  cors({
    origin: allowedOrigins,
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
app.use("/api/admin", adminRoutes); // ✅ mounted under /api/admin

app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// ==================
// DB + Server Start
// ==================
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));
