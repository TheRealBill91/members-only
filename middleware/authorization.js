exports.memberAuthorization = (req, res, next) => {
  const userInfo = req.user;
  const isAuthenticated = req.isAuthenticated();
  const isMember = userInfo && userInfo.membership_status;

  if (isAuthenticated && isMember) {
    return next();
  } else {
    req.flash("messageFailure", "Membership required");
    res.redirect("/");
  }
};

exports.userAuthentication = (req, res, next) => {
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) {
    return next();
  } else {
    req.flash("messageFailure", "Account required");
    res.redirect("/");
  }
};

exports.adminAuthorization = (req, res, next) => {
  const isAuthenticated = req.user && req.isAuthenticated();
  const isAdmin = isAuthenticated && req.user.admin === true;
  if (isAuthenticated && isAdmin) {
    return next();
  } else {
    req.flash("messageFailure", "Admin access required");
    res.redirect("/");
  }
};
