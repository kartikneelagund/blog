import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    category: { type: String, default: "General", trim: true },
    tags: { type: [String], default: [] },

    // 👇 Author can still be required
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Likes stored as IPs (strings)
    likes: [{ type: String }],

    // Anonymous comments
    comments: [
      {
        name: { type: String, default: "Anonymous" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Views counter
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
