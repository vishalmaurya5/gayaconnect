import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: { type: String },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;
