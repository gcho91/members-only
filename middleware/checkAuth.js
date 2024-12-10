function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/log-in");
}

function ensureMembership(req, res, next) {
  if (req.isAuthenticated() && req.user.membershipstatus === false)
    return next();
  res.redirect("/log-in");
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.admin === true) {
    return next();
  }
  res.status(403).json({ message: "Unauthorized: Requires admin privileges" }); // Send JSON response with error message
}

module.exports = { ensureAuthenticated, ensureMembership, ensureAdmin };
