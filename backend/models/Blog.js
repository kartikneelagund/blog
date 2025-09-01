import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    category: { type: String, default: "General", trim: true },
    tags: { type: [String], default: [] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    likes: { type: [String], default: [] }, // store anonymous IDs or IPs
    comments: [
      {
        name: { type: String, default: "Anonymous" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    views: { type: Number, default: 0 }, // total views
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
