import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: () => `/avatars/${Math.floor(Math.random() * 5) + 1}.jpg`,
  },
  likes: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Post', postSchema);
