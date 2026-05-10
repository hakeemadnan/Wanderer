const User = require("../models/user.js");
// const wrapAsync = require("../utils/wrapAsync");
// const passport = require("passport");
// const { saveRedirectUrl } = require("../middleware.js");

module.exports.renderSignup =  (req, res) => {
    res.render("users/signup.ejs");
}
module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "welcome to wanderer");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }
module.exports.renderLogin =(req, res) => {
    res.render("users/login.ejs");
}
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to wanderlust!");
    let redirectUrl =  res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
  } 
module.exports.logout = (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "you have logged out!");
      res.redirect("/listings");
    });
  }