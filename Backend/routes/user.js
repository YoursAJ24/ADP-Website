const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const VerificationCode = require('../models/verificationCode');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { sendVerificationEmail } = require('../services/sendGridService');
const loadAllowedEmails = require('../services/loadAllowedEmails');

// Rate limiter for registration and login routes
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100000, // Limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

router.use(authRateLimiter);

// Generate a random 6-digit verification code
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Route to request a verification code for registration
router.post('/request-code', async (req, res) => {
    const { email } = req.body;
    const code = generateVerificationCode();

    try {
        // Load allowed emails from the CSV file
        const allowedEmails = await loadAllowedEmails();

        // Check if the email is in the allowed list
        if (!allowedEmails.includes(email)) {
            return res.status(403).json({ error: 'This email is not allowed to register.' });
        }

        // Upsert the verification code for the email
        await VerificationCode.findOneAndUpdate(
            { email },
            { code, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        await sendVerificationEmail(email, code);
        res.status(200).json({ message: 'Verification email sent.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to register a new user
router.post('/register', async (req, res) => {
    const { cordName, clubName, mobile, email, password, access, verificationCode } = req.body;

    try {
        const storedVerificationCode = await VerificationCode.findOne({ email });

        // Check if the verification code matches
        if (!storedVerificationCode || verificationCode !== storedVerificationCode.code) {
            return res.status(400).json({ error: 'Invalid verification code.' });
        }

        const existingUser = await User.findOne({ clubName: clubName });
        if (existingUser) {
            return res.status(400).json({ error: 'A user with this club name already exists.' });
        }

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the provided access level, default to 'user' if not specified
        const newUser = new User({
            cordName,
            clubName,
            mobile,
            email,
            password: hashedPassword,
            access: access || 'user'
        });

        await newUser.save();

        // Delete the verification code after successful registration
        await VerificationCode.deleteOne({ email });

        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to request a verification code for password reset
router.post('/request-code-pass-reset', async (req, res) => {
    const { email } = req.body;
    const code = generateVerificationCode();

    try {
        // Fetch the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Upsert the verification code for the email
        await VerificationCode.findOneAndUpdate(
            { email },
            { code, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        await sendVerificationEmail(email, code);
        res.status(200).json({ message: 'Otp for password reset sent.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to reset password using the verification code
router.put('/reset-password', async (req, res) => {
    const { email, newPassword, verificationCode } = req.body;

    try {
        const storedVerificationCode = await VerificationCode.findOne({ email });

        // Check if the verification code matches
        if (!storedVerificationCode || verificationCode !== storedVerificationCode.code) {
            return res.status(400).json({ error: 'Invalid verification code.' });
        }

        // Fetch the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Hash the new password before updating
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Delete the verification code after successful password reset
        await VerificationCode.deleteOne({ email });

        res.status(200).json({ message: 'Password reset successful.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login',
    [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 6 characters long')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    cordName: user.cordName,
                    clubName: user.clubName,
                    mobile: user.mobile,
                    email: user.email,
                    access : user.access
                }
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

module.exports = router;
