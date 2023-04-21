const { Post, User, Comment } = require("../models");

const PostController = {
  // Get all blog posts
  getAllPosts: async (req, res) => {
    try {
      const postData = await Post.findAll({
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: Comment,
            include: { model: User, attributes: ["username"] },
          },
        ],
      });
      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single blog post by ID
  getPostById: async (req, res) => {
    try {
      const postData = await Post.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: Comment,
            include: { model: User, attributes: ["username"] },
          },
        ],
      });

      if (!postData) {
        res.status(404).json({ message: "No post found with this id!" });
        return;
      }

      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new blog post
  createPost: async (req, res) => {
    try {
      const newPost = await Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id,
      });
      res.status(200).json(newPost);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Update an existing blog post
  updatePost: async (req, res) => {
    try {
      const updatedPost = await Post.update(
        {
          title: req.body.title,
          content: req.body.content,
        },
        {
          where: {
            id: req.params.id,
            user_id: req.session.user_id,
          },
        }
      );
      if (!updatedPost[0]) {
        res.status(404).json({ message: "No post found with this id!" });
        return;
      }
      res.status(200).json({ message: "Post updated successfully!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a blog post
  deletePost: async (req, res) => {
    try {
      const deletedPost = await Post.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });
      if (!deletedPost) {
        res.status(404).json({ message: "No post found with this id!" });
        return;
      }
      res.status(200).json({ message: "Post deleted successfully!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = PostController;
