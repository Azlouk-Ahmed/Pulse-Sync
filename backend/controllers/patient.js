const mongoose = require('mongoose');
const Patient = require('../models/patient');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcrypt'); 


const patientController = {
  // Get all patients
  getAll: async (req, res) => {
    try {
      const patients = await Patient.find().sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: patients.length,
        data: patients
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Get patient by ID
  getById: async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id).populate('user');

      if (!patient) {
        return res.status(404).json({
          success: false,
          error: 'Patient not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: patient
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid patient ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Create a new patient
  create: async (req, res) => {
    try {
      const { age, medicalHistory, user } = req.body;

      if (!mongoose.Types.ObjectId.isValid(user)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        });
      }

      const patient = await Patient.create({
        age,
        medicalHistory,
        user
      });

      const populatedPatient = await Patient.findById(patient._id).populate('user');

      return res.status(201).json({
        success: true,
        data: populatedPatient
      });
    } catch (error) {
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

  // Update a patient
  pw: async (req, res) => {
     try {
                const foundUser = await Patient.findById(req.user._id);

                if (!foundUser) {
                    return res.status(404).json({ success: false, message: "User not found" });
                }

                const { oldPassword, newPassword } = req.body;

                // Verify old password
                const isMatch = await bcrypt.compare(oldPassword, foundUser.password);
                if (!isMatch) {
                    return res.status(400).json({ success: false, message: "Incorrect old password" });
                }

                // Hash new password
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(newPassword, salt);

                // Update user password
                foundUser.password = hash;

                await foundUser.save();

                res.status(200).json({ success: true, message: "mdp changé" });
            } catch (err) {
                res.status(500).json({ success: false, message: "Server error", error: err.message });
            }

  },
  update: async (req, res) => {
    try {

      const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!patient) {
        return res.status(404).json({
          success: false,
          error: 'Patient not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: patient
      });
    } catch (error) {
      console.log(error)
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
          error: 'Invalid patient ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  updateStatus: async (req, res) => {
    try {
      if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        });
      }

      const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )

      if (!patient) {
        return res.status(404).json({
          success: false,
          error: 'Patient not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: patient
      });
    } catch (error) {
      console.log(error)
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
          error: 'Invalid patient ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Delete a patient
  delete: async (req, res) => {
    try {
      const patient = await Patient.findByIdAndDelete(req.params.id);

      if (!patient) {
        return res.status(404).json({
          success: false,
          error: 'Patient not found'
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
          error: 'Invalid patient ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },


  
  
 
  
  login : async (req, res) => {
      const {email, password} = req.body;
      try {
          const user = await Patient.login(email, password);
          const token = generateToken(user._id)
          res.status(200).json({user, token})
      } catch (error) {
          res.status(400).json({error: error.message});
      }
     
  },
  
  signup : async (req, res) => {
      const {email, password, firstName, lastName, sex, age, phone} = req.body;
      
      try {
          const user = await Patient.signup(email, password, firstName, lastName, sex, age, phone)
          const token = generateToken(user._id)
          res.status(200).json({user,token})
      } catch (error) {
          res.status(400).json({error: error.message})
      }
  }
};

module.exports = patientController;
