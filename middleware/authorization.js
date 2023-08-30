exports.memberAuthorization = (req, res, next) => {
  const userInfo = req.user;
  console.log(userInfo);
  const isAuthenticated = req.isAuthenticated();
  const isMember = userInfo && userInfo.membership_status;

  if (isAuthenticated && isMember) {
    return next();
  } else {
    req.flash("messageFailure", "Membership required");
    res.redirect("/");
  }
};
