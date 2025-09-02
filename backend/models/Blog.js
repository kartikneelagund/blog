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
      default: "",
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

    // keep author reference (for blog owner)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Track views (anyone can view)
    views: {
      type: Number,
      default: 0,
    },

    // ✅ Likes: store unique identifiers (e.g., IP or random string) instead of User
    likes: {
      type: [String],
      default: [],
    },

    // ✅ Comments: allow anonymous
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        author: {
          type: String,
          default: "Anonymous", // no login needed
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Blog", blogSchema);
