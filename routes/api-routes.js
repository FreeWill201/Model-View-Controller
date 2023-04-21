const router = require("express").Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");

// Handle user login
router.post("/login", async (req, res) => {
  try {
    // Check if user exists in database
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password." });
      return;
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      res.status(400).json({ message: "Invalid email or password." });
      return;
    }

    // Set user session and return success message
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;
      res.json({ user: user, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Handle user logout
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
