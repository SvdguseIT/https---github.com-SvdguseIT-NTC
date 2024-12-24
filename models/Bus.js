const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    ntcNo: {
        type: String,
        required: true,
        unique: true,
    },
    busNo: {
        type: String,
        required: true,
    },
    driverId: {
        type: String,
        required: true,
    },
    conductorId: {
        type: String,
        required: true,
    },
    busType: {
        type: String,
        enum: ['AC','Semi', 'Non-AC'], // Example types
        required: true,
    },
    busName: {
        type: String,
        required: true,
    },
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);