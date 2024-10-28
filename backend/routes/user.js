const express = require('express');
const passport = require('passport');
const User = require('../models/User');  // Assuming you have a User model
const bcrypt = require('bcrypt');
const router = express.Router();

// Handle local login
// Handle local login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.json({ success: false, message: 'An error occurred during login.' });
        if (!user) return res.json({ success: false, message: 'Invalid credentials.' });
        req.logIn(user, (err) => {
            if (err) return res.json({ success: false, message: 'Login failed.' });
            return res.json({ success: true });
        });
    })(req, res, next);
});

router.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log("Password:", password, "Confirm Password:", confirmPassword); 
    if (password !== confirmPassword) {
        return res.json({ success: false, message: 'Passwords do not match' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword, balance: 100 });
        await user.save();
        res.json({ success: true, message: 'Signup successful' });
    } catch (err) {
        console.error("Signup error:", err);  // Should display in console
        res.json({ success: false, message: 'An error occurred during signup' });
    }
});


// Handle sign-up in your route
// Google OAuth callback route is handled in your oauth.js

module.exports = router;
