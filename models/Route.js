const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true,
    },
    start: {
        type: String,
        required: true,
    },
    end: {
        type: String,
        required: true,
    },
    totalDistance: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);