const { Comment, User } = require("../models");

const CommentController = {
  // Create a new comment on a blog post
  createComment: async (req, res) => {
    try {
      const newComment = await Comment.create({
        content: req.body.content,
        user_id: req.session.user_id,
        post_id: req.params.post_id,
      });
      res.status(200).json(newComment);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Update an existing comment on a blog post
  updateComment: async (req, res) => {
    try {
      const updatedComment = await Comment.update(
        {
          content: req.body.content,
        },
        {
          where: {
            id: req.params.id,
            user_id: req.session.user_id,
          },
        }
      );
      if (!updatedComment[0]) {
        res.status(404).json({ message: "No comment found with this id!" });
        return;
      }
      res.status(200).json({ message: "Comment updated successfully!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a comment on a blog post
  deleteComment: async (req, res) => {
    try {
      const deletedComment = await Comment.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });
      if (!deletedComment) {
        res.status(404).json({ message: "No comment found with this id!" });
        return;
      }
      res.status(200).json({ message: "Comment deleted successfully!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = CommentController;
