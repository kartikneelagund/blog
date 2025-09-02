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
      required: true,
    },

    // 👇 New field for tracking views
    views: {
      type: Number,
      default: 0,
    },

    // Likes as an array of user references
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Comments embedded
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    views: { type: Number, default: 0 }, // ✅ total views
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

export default mongoose.model("Blog", blogSchema);
