const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    tripId: {
        type: String,
        required: true,
        unique: true,
    },
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true,
    },
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['scheduled', 'cancelled', 'completed'], // Example statuses
        default: 'scheduled',
    },
    date: {
        type: Date,
        required: true,
    },
    totalSeats: {
        type: Number,
        required: true,
    },
    availableSeats: {
        type: Number,
        required: true,
    },
    bookedSeats: {
        type: [Number], // Array of seat numbers
        default: [],
    },
    notProvidedSeats: {
        type: [Number], // Example: seats that are unavailable
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);