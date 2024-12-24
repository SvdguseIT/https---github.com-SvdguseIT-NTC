const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'operator', 'commuter'], // Roles defined
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
}, { timestamps: true });



const User = mongoose.model('User', userSchema);

module.exports = User;