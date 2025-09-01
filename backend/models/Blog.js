// backend/models/Blog.js
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "", // optional
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // keep author if you want admin features
    },

    // ✅ Likes without login: store IP addresses or any string
    likes: {
      type: [String], 
      default: [],
    },

    // ✅ Comments without login
    comments: [
      {
        name: { type: String, default: "Anonymous" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

export default mongoose.model("Blog", blogSchema);
