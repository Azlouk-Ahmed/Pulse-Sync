const path = require('path');
const Center = require('../models/center');
const fs = require('fs');

// Controller methods for Center
const centerController = {
  // Get all centers
  getAll: async (req, res) => {
    try {
      const centers = await Center.find();
      return res.status(200).json({
        success: true,
        count: centers.length,
        data: centers
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Get center by ID
  getById: async (req, res) => {
    try {
      const center = await Center.findById(req.params.id);
      
      if (!center) {
        return res.status(404).json({
          success: false,
          error: 'Center not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: center
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid center ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Get center by name (getByCenter equivalent)
  getByName: async (req, res) => {
    try {
      const name = req.params.name;
      const centers = await Center.find({ 
        name: { $regex: new RegExp(name, 'i') } 
      });
      
      return res.status(200).json({
        success: true,
        count: centers.length,
        data: centers
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  create: async (req, res) => {
    try {
      const { name, governorate, address, phone, email, openTime, closingTime } = req.body;
  
      // Validate required fields
      if (!name || !governorate || !address || !phone || !openTime || !closingTime) {
        return res.status(400).json({
          success: false,
          error: 'Please provide all required fields: name, governorate, address, phone, openTime, closingTime'
        });
      }
  
      // Create data object with all fields
      const centerData = {
        name,
        governorate,
        address,
        phone,
        email,
        openTime,
        closingTime
      };
  
      // Add image if uploaded
      if (req.file) {
        centerData.img = `uploads/center/${req.file.filename}`;
      }
  
      const center = await Center.create(centerData);
  
      return res.status(201).json({
        success: true,
        data: center
      });
    } catch (error) {
      if (req.file) {
        const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
  
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




update: async (req, res) => {
  try {
    const { name, governorate, address, phone, email, openTime, closingTime } = req.body;

    // Validate required fields (optional if partial updates are allowed)
    if (!name || !governorate || !address || !phone || !openTime || !closingTime) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: name, governorate, address, phone, openTime, closingTime'
      });
    }

    // Fetch the existing center
    const existingCenter = await Center.findById(req.params.id);
    if (!existingCenter) {
      // Clean up uploaded file if center not found
      if (req.file) {
        const newFilePath = path.resolve('uploads', 'center', req.file.filename);
        if (fs.existsSync(newFilePath)) fs.unlinkSync(newFilePath);
      }
      return res.status(404).json({
        success: false,
        error: 'Center not found'
      });
    }

    // Build update object
    const updateData = {
      name,
      governorate,
      address,
      phone,
      email,
      openTime,
      closingTime,
    };

    // Handle image update
    if (req.file) {
      // Delete the old image if it exists
      if (existingCenter.img) {
        const oldImagePath = path.resolve(existingCenter.img);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      updateData.img = `uploads/center/${req.file.filename}`;
    }

    const updatedCenter = await Center.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      data: updatedCenter
    });

  } catch (error) {
    // Delete uploaded file on failure
    if (req.file) {
      const newFilePath = path.resolve('uploads', 'center', req.file.filename);
      if (fs.existsSync(newFilePath)) fs.unlinkSync(newFilePath);
    }

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
        error: 'Invalid center ID'
      });
    }

    console.error('Update Center Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
},


  // Delete center
  delete: async (req, res) => {
    try {
      const center = await Center.findByIdAndDelete(req.params.id);
      
      if (!center) {
        return res.status(404).json({
          success: false,
          error: 'Center not found'
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
          error: 'Invalid center ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Modify center (alias for partial updates)
  modify: async (req, res) => {
    try {
      const center = await Center.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      
      if (!center) {
        return res.status(404).json({
          success: false,
          error: 'Center not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: center
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
          error: 'Invalid center ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

module.exports = centerController;