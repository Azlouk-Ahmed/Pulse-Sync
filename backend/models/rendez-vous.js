const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rendezVousSchema = new Schema({
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
    duration: {
        type: Number,
        required: true,
        default: 30 
    },
    examen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Examen',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed','ongoing','missed'],
        default: 'pending'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('RendezVous', rendezVousSchema);