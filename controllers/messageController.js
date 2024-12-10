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

exports.deleteMessage = async (req, res, next) => {
  const messageId = req.params.messageId;

  try {
    await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);
    res.json({ message: "Message deleted successfully" }); // Send JSON response (adjust based on your needs)
  } catch (err) {
    console.error("Error deleting message ", err);
    res.status(500).send("Server Error");
  }
};
