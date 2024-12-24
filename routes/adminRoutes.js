const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // Import the admin controller
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');


// --- Bus Management Routes ---

// Add a new bus
router.post('/buses', authMiddleware, adminMiddleware, adminController.addBus);

// Get all buses
router.get('/buses', authMiddleware, adminMiddleware, adminController.getAllBuses);

// Get a specific bus by NTC number
router.get('/buses/:ntcNo', authMiddleware, adminMiddleware, adminController.getBusByNtcNo);

// Update a bus using NTC number
router.put('/buses/:ntcNo', authMiddleware, adminMiddleware, adminController.updateBusByNtcNo);

// Delete a bus using NTC number
router.delete('/buses/:ntcNo', authMiddleware, adminMiddleware, adminController.deleteBusByNtcNo);


// --- Route Management Routes ---


// Search routes (supports filtering by routeId, start, and/or end)
router.get('/routes', authMiddleware, adminMiddleware, adminController.searchRoutes);

// Create a new route
router.post('/routes', authMiddleware, adminMiddleware, adminController.createRoute);

// Update a route by ID
router.put('/routes/:id', authMiddleware, adminMiddleware, adminController.updateRoute);

// Delete a route by ID
router.delete('/routes/:id', authMiddleware, adminMiddleware, adminController.deleteRoute);


// --- Tirp Management Routes ---



// Add a new trip
router.post('/trips', authMiddleware, adminMiddleware, adminController.addTrip);

// Get all trips
router.get('/trips', authMiddleware, adminMiddleware, adminController.getAllTrips);

// Update a trip by tripId
router.put('/trips/:tripId', authMiddleware, adminMiddleware, adminController.updateTrip);

// Cancel a trip by tripId
router.put('/trips/:tripId/cancel', authMiddleware, adminMiddleware, adminController.cancelTrip);
/// trip is not nessasary to delete method considering ntc secanario
/// trip cancellation for better use put method with cancel 
/// that's a soft cancel, not permenant cancel


// --- Operator Management Routes ---


// Add a new operator
router.post('/operators', authMiddleware, adminMiddleware, adminController.addOperator);

// Update operator details
router.put('/operators/:id', authMiddleware, adminMiddleware, adminController.updateOperator);

// Delete an operator
router.delete('/operators/:id', authMiddleware, adminMiddleware, adminController.deleteOperator);

module.exports = router;

/////////////////// Swagger API documentation

/**
 * @swagger
 * tags:
 *   - name: Bus Management
 *     description: Manage buses in the system
 */

/**
 * @swagger
 * /api/admin/buses:
 *   post:
 *     tags:
 *       - Bus Management
 *     summary: Add a new bus
 *     description: Create a new bus for the system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ntcNo:
 *                 type: string
 *               busNo:
 *                 type: string
 *               driverId:
 *                 type: string
 *               conductorId:
 *                 type: string
 *               busType:
 *                 type: string
 *                 enum: [AC, Semi, Non-AC]
 *               busName:
 *                 type: string
 *               routeId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bus added successfully
 *       400:
 *         description: Bus with this NTC number already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/buses:
 *   get:
 *     tags:
 *       - Bus Management
 *     summary: Get all buses
 *     description: Retrieve a list of all buses.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of buses
 *       500:
 *         description: Server error
 */

