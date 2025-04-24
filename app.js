// app.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const pool = require("./db/pool");
const queries = require("./db/queries/user");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const app = express();

// ========== View Engine Setup ==========
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ========== Middleware ==========
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// ========== auth Setup ==========
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//setting up localStrategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // this tells Passport to look for 'email' instead of 'username'
    async (email, password, done) => {
      try {
        const rows = await queries.searchUser(email);
        const user = rows[0];
        console.log(rows);

        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        console.log(err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

//middleware for the current user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;

  next();
});
// ========== Routes ==========
const indexRouter = require("./routers/indexRouter");
const userRouter = require("./routers/userRouter");
const messageRouter = require("./routers/messageRouter");

app.use("/", indexRouter);
app.use("/users", userRouter);
app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login-error",
  })
);
app.get("/users/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
app.use("/messages", messageRouter);

// ========== Server ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Clubhouse app running at http://localhost:${PORT}`);
});
