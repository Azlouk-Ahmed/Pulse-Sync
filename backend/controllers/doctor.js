const Doctor = require('../models/doctor');
const mongoose = require('mongoose');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');


// Controller methods for Doctor
const doctorController = {
  changeStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value. Allowed values are "active" or "inactive".'
      });
    }
  
    try {
      const doctor = await Doctor.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      ).populate('center');
  
      if (!doctor) {
        return res.status(404).json({
          success: false,
          error: 'Doctor not found'
        });
      }
  
      return res.status(200).json({
        success: true,
        message: `Doctor status updated to "${status}"`,
        data: doctor
      });
  
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid doctor ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const doctors = await Doctor.find()
        .populate('center');
      
      return res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getDocs: async (req, res) => {
    try {
      const doctors = await Doctor.find({center :req.user.center})
        .populate('center');
      
      return res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getAllStaff: async (req, res) => {
    try {
      const admin = await Admin.findById(req.user._id)
          if(!admin) {
            return res.status(401).json({
              success: false,
              error: "admin not found",
            });
          }
      const doctors = await Doctor.find({center: admin.center})
        .populate('center');
      
      return res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Get doctor by ID
  getById: async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.id)
        .populate('center');
      
      if (!doctor) {
        return res.status(404).json({
          success: false,
          error: 'Doctor not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: doctor
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid doctor ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Get doctors by center
  getByCenter: async (req, res) => {
    try {
      const centerId = req.params.centerId;
      
      if (!mongoose.Types.ObjectId.isValid(centerId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid center ID'
        });
      }
      
      const doctors = await Doctor.find({ center: centerId })
        .populate('center');
      
      return res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },


    login : async (req, res) => {
        const {email, password} = req.body;
        console.log(email, password);
        try {
            const user = await Doctor.login(email, password);
            const token = generateToken(user._id)
            res.status(200).json({user, token})
        } catch (error) {
            res.status(400).json({error: error.message});
        }
       
    },

  // Create new doctor
  create: async (req, res) => {
    try {
      const { specialization, experience, contactNumber, center, email, password, firstName, lastName, desc} = req.body;
      if (!mongoose.Types.ObjectId.isValid(center)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid center ID'
        });
      }
  
      // Validate required fields manually
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          error: 'Email, password, first name, and last name are required'
        });
      }
  
      // Check if email already exists
      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use'
        });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create the doctor
      const doctor = await Doctor.create({
        specialization,
        experience,
        contactNumber,
        center,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        desc: desc || "No description provided"
      });
  
      // Populate center field
      const populatedDoctor = await Doctor.findById(doctor._id).populate('center');
  
      return res.status(201).json({
        success: true,
        data: populatedDoctor
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
  // Update doctor
  update: async (req, res) => {
    try {
      // Validate ObjectIds if provided
      if (req.body.user && !mongoose.Types.ObjectId.isValid(req.body.user)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        });
      }
      
      if (req.body.center && !mongoose.Types.ObjectId.isValid(req.body.center)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid center ID'
        });
      }
      
      const doctor = await Doctor.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
        .populate('user')
        .populate('center');
      
      if (!doctor) {
        return res.status(404).json({
          success: false,
          error: 'Doctor not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: doctor
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
          error: 'Invalid doctor ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Delete doctor
  delete: async (req, res) => {
    try {
      const doctor = await Doctor.findByIdAndDelete(req.params.id);
      
      if (!doctor) {
        return res.status(404).json({
          success: false,
          error: 'Doctor not found'
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
          error: 'Invalid doctor ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Modify doctor (for partial updates)
  modify: async (req, res) => {
    try {
      
      

      const updateData = { ...req.body };
      
      if (req.file) {
        updateData.img = `uploads/doctors/${req.file.filename}`;
      }
      
      const doctor = await Doctor.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      
      if (!doctor) {
        return res.status(404).json({
          success: false,
          error: 'Doctor not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: doctor
      });
    } catch (error) {
      console.log(error);
      
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
          error: 'Invalid doctor ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

module.exports = doctorController;