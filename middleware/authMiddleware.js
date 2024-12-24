const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import the User model

// Middleware to Protect Routes
exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded._id);
        if (!req.user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        req.token = token;  // Pass the token to the request for logout later
        next();
    } catch (err) {
        console.error('Authentication error:', err.message);
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};