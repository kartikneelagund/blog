const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  tags: [String],
  image: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  views: { type: Number, default: 0 },   // 👈 for tracking views
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 👈 array
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });
