// Manages user-related functionality like joining a group or updating membership status.
const { pool } = require("../config/db");

exports.getJoin = (req, res) => {
  res.render("join");
};

exports.postJoin = async (req, res, next) => {
  const secretCode = "Howling in the wind!";
  const userInput = req.body.secret;
  console.log(userInput);
  console.log("username", req.user.username);
  console.log("current membership status: ", req.user.membershipstatus);

  if (secretCode === userInput) {
    try {
      // update db user membershipstatus = true
      await pool.query(
        "UPDATE users SET membershipstatus = $1 WHERE username = $2",
        [true, req.user.username]
      );
      req.session.successMessage = "Welcome to the club! you're now a member";
      return res.redirect("/");
      // res.send("congratulations! youre now a member!");
    } catch (err) {
      return next(err);
    }
  } else {
    res.send("error, plz try again");
    // do somethign else
    // redirect/re-render join page
  }
};
