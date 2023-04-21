const express = require("express");
const session = require("express-session");
const routes = require("./routes");
const homeRoutes = require("./routes/home-routes");
const postRoutes = require("./routes/post-routes");
const dashboardRoutes = require("./routes/dashboard-routes");
const profileRoutes = require("./routes/profile-routes");
const exphbs = require("express-handlebars");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set up Handlebars.js as the templating engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up sessions and store them in the database
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Define routes
app.use("/", homeRoutes);
app.use("/api/posts", postRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/", profileRoutes);
app.use("/", routes);

// Sync Sequelize models and start server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
