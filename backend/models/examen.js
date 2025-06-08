const mongoose = require('mongoose');

const examenSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    dateExamen: {
        type: Date,
        default: Date.now
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    center: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Center',
        required: true
    },
    symptoms: {
        type: [String],
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    needsRadiology: {
        type: Boolean,
        default: false
    },
    radiologyTypes: {
        type: [String],
        enum: ['X-ray', 'CT scan', 'MRI', 'Ultrasound'],
        default: []
    },
    prescriptions: [{
        medication: String,
        dosage: String,
        duration: String
    }],
    notes: String,
});

module.exports = mongoose.model('Examen', examenSchema);