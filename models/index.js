const User = require("./user");
const Post = require("./post");
const Comment = require("./comments");

// Add associations between models here

User.hasMany(Post, {
  foreignKey: "user_id",
});

Post.belongsTo(User, {
  foreignKey: "user_id",
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
});

Comment.belongsTo(User, {
  foreignKey: "user_id",
});

//

module.exports = { User, Post, Comment };
