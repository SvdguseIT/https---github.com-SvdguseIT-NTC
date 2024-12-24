const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import User model

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token valid for 1 hour
    );
};

// User Registration
exports.register = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            email,
            password: hashedPassword,
            role,
        });

        // Save the user to the database
        await user.save();

        // Generate a JWT token
        const token = generateToken(user);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Save token to user model (optional, if tokens array is used)
        user.tokens = user.tokens.concat({ token });
        await user.save();

        // Set token as a cookie
        res.cookie('token', token, {
            httpOnly: true,  // Makes the cookie inaccessible to JavaScript
            secure: process.env.NODE_ENV === 'production', // Only set the cookie in HTTPS production environment
            expires: new Date(Date.now() + 3600000), // 1 hour expiration
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// User Logout
exports.logout = async (req, res) => {
    try {
        // Clear the cookie that holds the token
        res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Optionally, you could also remove the token from the database if you're storing it there
        const user = await User.findById(req.user._id);
        if (user) {
            // Remove token from user's tokens array
            user.tokens = user.tokens.filter((token) => token.token !== req.token);
            await user.save();
        }

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

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

// Middleware for Role-Based Authorization (e.g., Admin Only)
exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    next();
};

// Middleware for Operator-Only Access
exports.operatorMiddleware = (req, res, next) => {
    if (req.user.role !== 'operator') {
        return res.status(403).json({ error: 'Access denied. Operator privileges required.' });
    }
    next();
};

// Middleware for Commuter-Only Access
exports.commuterMiddleware = (req, res, next) => {
    if (req.user.role !== 'commuter') {
        return res.status(403).json({ error: 'Access denied. Commuter privileges required.' });
    }
    next();
};