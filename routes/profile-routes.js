const router = require("express").Router();
const { User, Post } = require("../models");

// Get user profile by ID
router.get("/profile/:id", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { id: req.params.id },
      include: [{ model: Post }],
    });
    const user = userData.get({ plain: true });
    res.render("profile", {
      user,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
