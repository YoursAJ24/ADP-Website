const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = (requiredAccess = 'user') => {
    return async (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            if (user.access !== requiredAccess) {
                return res.status(403).json({ message: 'Access denied.' });
            }

            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired. Please login again.' });
            }

            res.status(401).json({ message: 'Token is not valid.' });
        }
    };
};

module.exports = authMiddleware;
