const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  googleId: String,  // For Google OAuth users
  email: String,
  name: String,
  password: String,  // Required for email/password login
  balance: Number
});


const User = mongoose.model('User', userSchema);
module.exports = User;
