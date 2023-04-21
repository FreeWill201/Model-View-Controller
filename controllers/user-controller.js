const { User } = require("../models");
const bcrypt = require("bcrypt");

const UserController = {
  // Handle user login
  login: async (req, res) => {
    try {
      const user = await User.findOne({
        where: { email: req.body.email },
      });

      if (!user) {
        res
          .status(400)
          .json({ message: "Incorrect email or password, please try again" });
        return;
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        res
          .status(400)
          .json({ message: "Incorrect email or password, please try again" });
        return;
      }

      req.session.save(() => {
        req.session.user_id = user.id;
        req.session.logged_in = true;
        res.status(200).json({ user, message: "You are now logged in!" });
      });
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Handle user logout
  logout: async (req, res) => {
    try {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Handle user registration
  register: async (req, res) => {
    try {
      const newUser = await User.create({
        email: req.body.email,
        password: req.body.password,
      });

      req.session.save(() => {
        req.session.user_id = newUser.id;
        req.session.logged_in = true;
        res
          .status(201)
          .json({
            user: newUser,
            message: "You are now registered and logged in!",
          });
      });
    } catch (err) {
      res.status(400).json(err);
    }
  },
};

module.exports = UserController;
