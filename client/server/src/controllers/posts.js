import Post from '../models/Post.js';

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

export const createPost = async (req, res) => {
  try {
    const { author, content } = req.body;
    const post = new Post({ author, content });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    post.likes += 1;
    await post.save();
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post' });
  }
};
