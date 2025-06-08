const mongoose = require('mongoose');

const radiologyReportSchema = new mongoose.Schema({
    examen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Examen',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RendezVous',
        required: true
    },
    radiologist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
        validate: {
            validator: async function(doctorId) {
                const doctor = await mongoose.model('Doctor').findById(doctorId);
                return doctor && doctor.specialization === 'radiologue';
            },
            message: 'The doctor must be a radiologist (radiologue)'
        }
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        }
    }],
    notes: {
        type: String,
        default: ''
    }

}, { 
    timestamps: true,
});

const RadiologyReport = mongoose.model('RadiologyReport', radiologyReportSchema);

module.exports = RadiologyReport;
