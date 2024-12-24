const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import authController
const { authMiddleware, operatorMiddleware, commuterMiddleware, adminMiddleware } = authController; // Destructure authMiddleware from authController

// Registration Route
router.post('/register', authController.register);

// Login Route
router.post('/login', authController.login);

// Logout route (protected)
router.post('/logout', authMiddleware, authController.logout); // Apply middleware and call logout function

// Test Protected Route
router.get('/protected', authController.authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted to protected route', user: req.user });
});

// Test Commuter-Only Route
router.get('/commuter', authMiddleware, commuterMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted to commuter route', user: req.user });
});

// Test Operator-Only Route
router.get('/operator', authMiddleware, operatorMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted to operator route', user: req.user });
});

// Test Admin-Only Route
router.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted to admin route', user: req.user });
});

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints for user authentication and role-based access control
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a user with a specified role (admin, operator, or commuter).
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [admin, operator, commuter]
 *                 example: admin
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64a1f9b7c8c1431f2e7d2a8c
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     role:
 *                       type: string
 *                       example: admin
 *       400:
 *         description: Invalid data or user already exists
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and return a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout a user by clearing their session and token.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Server error
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * @swagger
 * /api/auth/protected:
 *   get:
 *     summary: Protected route
 *     description: Test access to a protected route. Requires authentication.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted to protected route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access granted to protected route
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64a1f9b7c8c1431f2e7d2a8c
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       example: admin
 *       401:
 *         description: Unauthorized or invalid token
 */
router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted to protected route', user: req.user });
});

/**
 * @swagger
 * /api/auth/commuter:
 *   get:
 *     summary: Commuter-only route
 *     description: Access granted only to users with the commuter role.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted to commuter route
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access granted to commuter route
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: commuter
 *       403:
 *         description: Forbidden - not a commuter
 */
router.get('/commuter', authMiddleware, commuterMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted to commuter route', user: req.user });
});

/**
 * @swagger
 * /api/auth/operator:
 *   get:
 *     summary: Operator-only route
 *     description: Access granted only to users with the operator role.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted to operator route
 *       403:
 *         description: Forbidden - not an operator
 */
router.get('/operator', authMiddleware, operatorMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted to operator route', user: req.user });
});

/**
 * @swagger
 * /api/auth/admin:
 *   get:
 *     summary: Admin-only route
 *     description: Access granted only to users with the admin role.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted to admin route
 *       403:
 *         description: Forbidden - not an admin
 */
router.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted to admin route', user: req.user });
});

module.exports = router;