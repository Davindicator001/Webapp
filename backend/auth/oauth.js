const passport = require('passport');
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth profile:', profile);  // Log profile data for debugging
      let user = await User.findOne({ googleId: profile.id });
  
      if (user) {
        return done(null, user);  // Existing user
      } else {
        // Create new user
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePhoto: profile.photos[0].value,
          balance: 100  // Set balance to 0 for new users
        });
        await user.save();
        return done(null, user);
      }
    } catch (err) {
      console.error('Error in Google OAuth:', err);  // Log error
      return done(err, false);
    }
  }));
  

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);  // Save user ID to the session
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);  // Fetch user from the database
    done(null, user);  // Attach user object to `req.user`
  } catch (err) {
    done(err, false);
  }
});
