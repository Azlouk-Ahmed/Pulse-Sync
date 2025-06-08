const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
    img: {
        type: String,
        default: "uploads/center/default.png"
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    governorate: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    openTime: {
        type: String, 
        required: true,
        validate: {
            validator: function (v) {
                return /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(v); 
            },
            message: 'Invalid opening time format (expected HH:mm)'
        }
    },
    closingTime: {
        type: String, 
        required: true,
        validate: {
            validator: function (v) {
                return /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(v); 
            },
            message: 'Invalid closing time format (expected HH:mm)'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Center = mongoose.model('Center', centerSchema);

module.exports = Center;
