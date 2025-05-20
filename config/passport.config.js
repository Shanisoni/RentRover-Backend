/**
 * @description Passport JWT strategy configuration for API authentication
 * @module config/passport
 */

// Import required dependencies
const passport = require('passport');
const { Strategy, ExtractJwt } = require("passport-jwt");
const User = require('../models/user.model');


const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
  ignoreExpiration: false
};

/**
 * @description Sets up JWT authentication verification process
 */
passport.use(
  new Strategy(options, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (user) return done(null, user);
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);


module.exports = passport;
