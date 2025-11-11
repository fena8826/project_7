const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/UserModel");
const bcrypt = require('bcrypt');


passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  async function (email, password, done) {
    try {
 
      const user = await User.findOne({ email: email });
      if (!user) {
        console.log("User not found");
        return done(null, false);
      }


      const matchpass = await bcrypt.compare(password, user.password);
      if (!matchpass) {
        console.log("Password is incorrect");
        return done(null, false);
      }


      return done(null, user);

    } catch (error) {
      console.error("Error in LocalStrategy:", error);
      return done(error);
    }
  }
));


passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, null);
  }
});

passport.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/");
};


passport.setAuthenticatedUser = (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
