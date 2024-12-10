// Handles authentication-related tasks like login, logout, and signup.

const bcrypt = require("bcryptjs");
const passport = require("passport");
const { pool } = require("../config/db");

// home routes

exports.getIndex = async (req, res, next) => {
  try {
    console.log("requser", req.user);
    const { rows: messages } = await pool.query("SELECT * from messages");
    let filteredMessages;

    if (!req.user || !req.user.membershipstatus) {
      filteredMessages = messages.map((msg) => ({
        id: msg.id,
        title: msg.title,
        text: msg.text,
      }));
    } else {
      // If user is approved, retrieve detailed user information for each message

      // filteredMessages = messages;
      filteredMessages = await Promise.all(
        messages.map(async (msg) => {
          const authorInfo = await getAuthorInfo(msg.userid);
          if (authorInfo) {
            return {
              id: msg.id,
              title: msg.title,
              text: msg.text,
              timestamp: msg.timestamp,

              author: {
                firstname: authorInfo.firstname,
                lastname: authorInfo.lastname,
                username: authorInfo.username,
                membershipstatus: authorInfo.membershipstatus,
                adminstatus: authorInfo.admin,
              },
            };
          } else {
            return {
              id: msg.id,
              title: msg.title,
              text: msg.text,
            };
          }
        })
      );
    }
    const successMessage = req.session.successMessage; // Get the message
    req.session.successMessage = null; // Clear the message

    console.log("filtered", filteredMessages);
    res.render("index", { successMessage, messages: filteredMessages });
  } catch (err) {
    console.error("Error fetching messages:", err);

    return next(err);
  }
};

exports.getSignUp = (req, res) => {
  // if user is already signed up ( logged in)
  // "you're already signed up! "
  // redirect
  res.render("sign-up", {});
};

// auth routes
exports.getLogin = (req, res) => {
  res.render("log-in", {});
};

exports.login = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })(req, res, next); // Call the middleware
};
exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.signUp = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    console.log("username", req.body.username);
    console.log("pw", hashedPassword);

    await pool.query(
      "INSERT INTO users(firstname, lastname, username, password) VALUES ($1, $2, $3, $4)",
      [req.body.firstname, req.body.lastname, req.body.username, hashedPassword]
    );
    res.redirect("/log-in");
  } catch (err) {
    // if err, do something
    return next(err);
  }
};

const getAuthorInfo = async (authorId) => {
  const query = `SELECT firstname, lastname, username, membershipstatus, admin FROM users WHERE id=$1`;
  const { rows } = await pool.query(query, [authorId]);
  return rows[0];
};
