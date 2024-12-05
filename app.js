const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { pool } = require("./config/db");
require("dotenv").config(); // Add dotenv support

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const userRoutes = require("./routes/user");

const app = express();
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

// Set view engine
app.set("view engine", "ejs");

// Middleware for parsing form data
app.use(express.urlencoded({ extended: false }));

// Configure and use express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cats", // Replace with a strong secret key
    resave: false, // Don't save session if it wasn't modified
    saveUninitialized: false, // Don't create session until something is stored
  })
);

// Initialize Passport and connect session
app.use(passport.initialize());
app.use(passport.session());

// Middleware to make `currentUser` available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Use your routes
app.use(authRoutes);

// Passport configuration
// function one:setting up localstrategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // find user in db - pool
      const { rows } = await pool.query(
        "SELECT * from users WHERE username = $1",
        [username]
      );
      const user = rows[0];
      // if no user - err: wrong username
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      // Use bcrypt to compare the hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// serialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * from users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Routes
app.use(authRoutes);
// app.use(messageRoutes);
// app.use(userRoutes);

app.listen(3000, () => console.log("express app listening on port 3000"));
