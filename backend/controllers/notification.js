const Notification = require('../models/notification');
const mongoose = require('mongoose');

// Controller methods for notification
const notificationController = {
  // Get all notifications

  seen: async (req, res) => {
    try {
      const result = await Notification.updateMany(
        { patient: req.user._id, isSeen: false },
        { $set: { isSeen: true } }
      );

      return res.status(200).json({
        success: true,
        message: `${result.modifiedCount} notifications marked as seen`
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getAll: async (req, res) => {
    try {

      const notifications = await Notification.find({patient:req.user._id})
        .populate('patient')
        .sort({ date: -1 });
        console.log(notifications)
      
      return res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Get notification by ID
  getById: async (req, res) => {
    try {
      const notification = await Notification.findById(req.params.id)
        .populate('patient');
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: notification
      });
    } catch (error) {
      console.error(error);
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid notification ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getPatientNotif: async (req, res) => {
    try {
      const notification = await Notification.find({patient: req.user._id})
        .populate('patient');
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: notification
      });
    } catch (error) {
      console.error(error);
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid notification ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Get notifications by patient
  getByCenter: async (req, res) => {
    try {
      const patientId = req.params.patientId;
      
      if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid patient ID'
        });
      }
      
      const notifications = await Notification.find({ patient: patientId })
        .populate('patient')
        .sort({ date: -1 });
      
      return res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Create new notification
  create: async (req, res) => {
    try {
      const { patient, message } = req.body;

      // Validate patient ObjectId
      if (!mongoose.Types.ObjectId.isValid(patient)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid patient ID'
        });
      }

      const notification = await Notification.create({
        patient,
        message,
        isSeen : false,
      });
      
      const populatedNotification = await Notification.findById(notification._id)
        .populate('patient');
      
      return res.status(201).json({
        success: true,
        data: populatedNotification
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

  // Update notification
  update: async (req, res) => {
    try {
      // Validate patient ObjectId if provided
      if (req.body.patient && !mongoose.Types.ObjectId.isValid(req.body.patient)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid patient ID'
        });
      }
      
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('patient');
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: notification
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
          error: 'Invalid notification ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Delete notification
  delete: async (req, res) => {
    try {
      const notification = await Notification.findByIdAndDelete(req.params.id);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
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
          error: 'Invalid notification ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Modify notification (for partial updates)
  modify: async (req, res) => {
    try {
      // Validate patient ObjectId if provided
      if (req.body.patient && !mongoose.Types.ObjectId.isValid(req.body.patient)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid patient ID'
        });
      }
      
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).populate('patient');
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: notification
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
          error: 'Invalid notification ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

module.exports = notificationController;