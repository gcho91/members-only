function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/log-in");
}

function ensureMembership(req, res, next) {
  if (req.isAuthenticated() && req.user.membershipstatus === false)
    return next();
  res.redirect("/log-in");
}

module.exports = { ensureAuthenticated, ensureMembership };
