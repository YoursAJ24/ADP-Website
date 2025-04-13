const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    cordName: { type: String, required: true },
    clubName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    access: { type: String, enum: ['user', 'bosslevel'], default: 'user' } // Added access field
});

const User = mongoose.model('User', userSchema);

module.exports = User;
