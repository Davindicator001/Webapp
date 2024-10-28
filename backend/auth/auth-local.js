const passport = require('passport');  // Add this line to import passport
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');  // Ensure the User model is correctly imported

// Local strategy for email/password login
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'No user with that email' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Password incorrect' });
    }

    // If passwords match, return the user
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));
