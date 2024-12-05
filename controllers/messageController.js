const { pool } = require("../config/db");

exports.getNewMessage = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("new-message");
  } else {
    res.send(
      `<h1>Not logged in! Log in to post new messages</h1><a href="/log-in">Log In</a>`
    );
  }
};

exports.postNewMessage = async (req, res, next) => {
  const userId = req.user.id;
  const title = req.body.title;
  const messageText = req.body.message;

  console.log("NEW MESSAGE CONTENT", userId, title, messageText);

  try {
    await pool.query(
      "INSERT INTO messages (userid, title, text) VALUES ($1, $2, $3)",
      [userId, title, messageText]
    );
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
