// Require necessary modules and set up express, session, and passport
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
require('./auth/oauth');
require('./auth/auth-local');
const { User } = require('./db');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use(session({
    secret: 'banking-app-secret',
    resave: false,
    saveUninitialized: true
}));
app.use('/auth', require('./routes/user'));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Set flash message middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');  // Redirect to login if not authenticated
}

// Authentication routes for Google OAuth
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', { 
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/dashboard');
});

// Dashboard route (protected by ensureAuthenticated)
app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

// Login page route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

// /api/user route to return user data (protected by ensureAuthenticated)
app.get('/api/user', ensureAuthenticated, (req, res) => {
    if (req.user) {
        res.json({
            name: req.user.name,
            balance: req.user.balance || 0  // Default to 0 if balance is not set
        });
    } else {
        res.status(401).json({ success: false, message: 'User not authenticated' });
    }
});

// Test DB route to check user data in MongoDB
app.get('/test-db', async (req, res) => {
    try {
        const users = await User.find({});
        res.json({ success: true, users });
    } catch (error) {
        console.error('Database error:', error);
        res.json({ success: false, message: 'Database error', error: error.message });
    }
});

// Home route to serve the index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Server listening on specified PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
