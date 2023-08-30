//makes information about the user’s authentication status and user information available in the views,
module.exports = (req, res, next) => {
  res.locals.user = req.isAuthenticated();
  res.locals.userInfo = req.user;
  next();
};
