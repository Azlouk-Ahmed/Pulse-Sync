const mongoose = require('mongoose');

const generalisteRdv = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    center: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Center',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    appointmentDuration: {
        type: Number,
        required: true,
        default: 30 
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed','ongoing','missed','requested'],
        default: 'requested'
    },
    reason: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GeneralisteRdv', generalisteRdv);