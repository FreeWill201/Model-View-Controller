const router = require("express").Router();
const { Post } = require("../models");

// Get user dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
      order: [["created_at", "DESC"]],
    });
    const posts = postData.map((post) => post.get({ plain: true }));
    res.render("dashboard", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add new blog post
router.post("/dashboard", async (req, res) => {
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
});

// Update existing blog post
router.put("/dashboard/:id", async (req, res) => {
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
    res.status(200).json({ message: "Post updated!" });
  } catch (err) {
    res.status(400).json(err);
  }
});
