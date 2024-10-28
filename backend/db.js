const mongoose = require('mongoose');

// MongoDB URI (Ensure it's correctly formatted)
const uri = process.env.MONGODB_URI || 'mongodb+srv://Davindicator:090Victoto@webauth.iysmp.mongodb.net/webauth?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000 })
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch(err => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    googleId: String,
    email: String,
    name: String,
    balance: Number
});

const User = require('./models/User')

async function findUserByGoogleId(googleId) {
    try {
        const user = await User.findOne({ googleId });
        if (user) {
            console.log('User balance:', user.balance);
        } else {
            console.log('User not found');
        }
    } catch (err) {
        console.error('Error finding user:', err);
    }
}

module.exports = {
    User,
    findUserByGoogleId
};

