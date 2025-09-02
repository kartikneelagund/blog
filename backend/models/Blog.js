import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: { type: [String], default: [] }, // store IPs
  comments: [
    {
      text: String,
      author: String,
      date: { type: Date, default: Date.now },
    },
  ],
  views: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);
