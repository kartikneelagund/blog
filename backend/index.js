import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blog.js';
import userRoutes from './routes/user.js';


dotenv.config(); // 👈 must come before process.env usage

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);

// Debug logs
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server connected on port 5000")))
  .catch(err => console.log(err));



const allowedOrigins = ["http://localhost:5173","https://blog-33js.vercel.app/"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);       // auth routes
app.use("/api/blogs", blogRoutes);     // ✅ add blog routes here
  
    //get route
  app.get("/",(req,res)=>{
    return res.send("backend is running")
  })