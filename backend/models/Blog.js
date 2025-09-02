\import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    category: { type: String, default: "General", trim: true },
    tags: { type: [String], default: [] },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ one views field only
    views: { type: Number, default: 0 },

    // ✅ likes as strings (not ObjectId)
    likes: { type: [String], default: [] },

    // ✅ comments without requiring login
    comments: [
      {
        text: { type: String, required: true },
        author: { type: String, default: "Anonymous" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError on Vercel
export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
