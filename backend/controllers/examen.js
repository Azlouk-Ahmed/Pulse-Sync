const Examen = require('../models/examen');
const GeneralisteRdv = require('../models/generaliste-rdv');
const mongoose = require('mongoose');
const RendezVous = require('../models/rendez-vous');

// Controller methods for examen
const examenController = {
  // Get all examens
  getAll: async (req, res) => {
    try {
      const examens = await Examen.find()
        .populate('patientId')
        .populate('doctorId')
        .populate('center');
      
      return res.status(200).json({
        success: true,
        count: examens.length,
        data: examens
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getAllPatient: async (req, res) => {
    try {
      const examens = await Examen.find({patientId: req.user._id})
        .populate('patientId')
        .populate('doctorId')
        .populate('center');
      
      return res.status(200).json({
        success: true,
        count: examens.length,
        data: examens
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getAllRadio: async (req, res) => {
    try {
      const examens = await Examen.find({needsRadiology:true})
        .populate('patientId')
        .populate('doctorId')
        .populate('center');
      
      return res.status(200).json({
        success: true,
        count: examens.length,
        data: examens
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getByDoc: async (req, res) => {
    try {
      const examens = await Examen.find({doctorId: req.user._id})
        .populate('patientId')
        .populate('doctorId')
        .populate('center');
      
      return res.status(200).json({
        success: true,
        count: examens.length,
        data: examens
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Get examen by ID
  getById: async (req, res) => {
    try {
      const examen = await Examen.findById(req.params.id)
        .populate('patientId')
        .populate('doctorId')
        .populate('center');
      
      if (!examen) {
        return res.status(404).json({
          success: false,
          error: 'Examen not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: examen
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid examen ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getByRadiologueAppointment: async (req, res) => {
    try {
      const appointment = await RendezVous.findById(req.params.id)
      
      if (!appointment) {
        return res.status(404).json({
          success: false,
          error: 'appointment not found'
        });
      }
      const examen = await Examen.findById(appointment.examen)
        .populate('patientId')
        .populate('doctorId')
        .populate('center');
      
      return res.status(200).json({
        success: true,
        data: examen
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid examen ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getByAppointment: async (req, res) => {
    try {
      const examen = await Examen.findOne({appointment: req.params.id})
        .populate('patientId')
        .populate('doctorId')
        .populate('center');
      
      if (!examen) {
        return res.status(200).json({
          success: false,
          data: 'still waiting for an exam'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: examen
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid examen ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Get examens by center
  getByCenter: async (req, res) => {
    try {
      const centerId = req.params.centerId;
      
      if (!mongoose.Types.ObjectId.isValid(centerId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid center ID'
        });
      }
      
      const examens = await Examen.find({ center: centerId })
        .populate('patientId')
        .populate('doctorId')
        .populate('center');
      
      return res.status(200).json({
        success: true,
        count: examens.length,
        data: examens
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Create new examen
  create: async (req, res) => {
    try {
      const {
        patientId,
        appointment,

        center,
        symptoms,
        diagnosis,
        needsRadiology,
        radiologyTypes,
        prescriptions,
        notes
      } = req.body;

      // Validate ObjectIds
      if (!mongoose.Types.ObjectId.isValid(patientId) || 
          !mongoose.Types.ObjectId.isValid(center)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid patientId, or center ID'
        });
      }

      const app = await GeneralisteRdv.findById(appointment);
      if (!app) {
        return res.status(404).json({
          success: false,
          error: 'Appointment not found'
        });
      }

      await app.updateOne({ status: 'completed' });
      await app.save();



      const examen = await Examen.create({
        patientId,
        appointment,
        doctorId: req.user._id,
        center,
        symptoms,
        diagnosis,
        needsRadiology,
        radiologyTypes,
        prescriptions,
        notes
      });
      
      const populatedExamen = await Examen.findById(examen._id)
        .populate('patientId')
        .populate('doctorId')
        .populate('center');
      
      return res.status(201).json({
        success: true,
        data: populatedExamen
      });
    } catch (error) {
      console.error(error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
          success: false,
          error: messages
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Update examen
  update: async (req, res) => {
    try {
      // Validate ObjectIds if provided
      if (req.body.patientId && !mongoose.Types.ObjectId.isValid(req.body.patientId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid patientId'
        });
      }
      
      if (req.body.doctorId && !mongoose.Types.ObjectId.isValid(req.body.doctorId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid doctorId'
        });
      }
      
      if (req.body.center && !mongoose.Types.ObjectId.isValid(req.body.center)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid center ID'
        });
      }
      
      const examen = await Examen.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate('patientId')
        .populate('doctorId')
        .populate('center');
      
      if (!examen) {
        return res.status(404).json({
          success: false,
          error: 'Examen not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: examen
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
          success: false,
          error: messages
        });
      }
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid examen ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Delete examen
  delete: async (req, res) => {
    try {
      const examen = await Examen.findByIdAndDelete(req.params.id);
      
      if (!examen) {
        return res.status(404).json({
          success: false,
          error: 'Examen not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid examen ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Modify examen (for partial updates)
  modify: async (req, res) => {
    try {
      // Validate ObjectIds if provided
      if (req.body.patientId && !mongoose.Types.ObjectId.isValid(req.body.patientId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid patientId'
        });
      }
      
      if (req.body.doctorId && !mongoose.Types.ObjectId.isValid(req.body.doctorId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid doctorId'
        });
      }
      
      if (req.body.center && !mongoose.Types.ObjectId.isValid(req.body.center)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid center ID'
        });
      }
      
      const examen = await Examen.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      )
        .populate('patientId')
        .populate('doctorId')
        .populate('center');
      
      if (!examen) {
        return res.status(404).json({
          success: false,
          error: 'Examen not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: examen
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
          success: false,
          error: messages
        });
      }
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid examen ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

module.exports = examenController;