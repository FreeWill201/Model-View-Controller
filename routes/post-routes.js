const router = require("express").Router();
const { Post } = require("../models");
const PostController = require("../controllers/post-controller");

// Create a new blog post
router.post("/", async (req, res) => {
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

// Update an existing blog post
router.put("/:id", async (req, res) => {
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

// Create a new blog post
router.post("/", PostController.createPost);

// Update an existing blog post
router.put("/:id", PostController.updatePost);

// Get all blog posts
router.get("/", PostController.getAllPosts);

// Get a single blog post by id
router.get("/:id", PostController.getPostById);

// Delete an existing blog post
router.delete("/:id", PostController.deletePost);

module.exports = router;
