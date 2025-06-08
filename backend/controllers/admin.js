const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const generateToken = require('../utils/generateToken');

const Patient = require('../models/patient');

const Medecin = require('../models/doctor');
const RendezVous = require('../models/rendez-vous');
const Examen = require('../models/examen');
const GeneralisteRdv = require('../models/generaliste-rdv');
const Center = require('../models/center');
const RadiologyReport = require('../models/radiologueReport');


const adminController = {
  appointmentsPerCenter : async (req, res) => {
    try {
      // Step 1: Aggregate counts per center and status
      const rawStats = await GeneralisteRdv.aggregate([
        {
          $group: {
            _id: {
              center: '$center',
              status: '$status'
            },
            count: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'centers',
            localField: '_id.center',
            foreignField: '_id',
            as: 'center'
          }
        },
        {
          $unwind: '$center'
        },
        {
          $project: {
            centerName: '$center.name',
            status: '$_id.status',
            count: 1
          }
        }
      ]);
  
      // Step 2: Structure the data
      const centerMap = new Map();
      const allStatuses = new Set();
  
      rawStats.forEach(stat => {
        const { centerName, status, count } = stat;
        allStatuses.add(status);
  
        if (!centerMap.has(centerName)) {
          centerMap.set(centerName, {});
        }
        centerMap.get(centerName)[status] = count;
      });
  
      const labels = Array.from(centerMap.keys());
      const statusList = Array.from(allStatuses);
      const datasets = statusList.map(status => ({
        label: status,
        data: labels.map(center => centerMap.get(center)[status] || 0)
      }));
  
      return res.json({ labels, datasets });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  },
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
        const ad = await Admin.findByIdAndUpdate(
          id,
          { status },
          { new: true, runValidators: true }
        ).populate('center');
    
        if (!ad) {
          return res.status(404).json({
            success: false,
            error: 'admin not found'
          });
        }
    
        return res.status(200).json({
          success: true,
          message: `admin status updated to "${status}"`,
          data: ad
        });
    
      } catch (error) {
        console.log(error)
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
  getAppointmentStatusStats: async (req, res) => {
    try {
      const allStatuses = [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "ongoing",
        "missed",
        "requested",
      ];
  
      const aggregation = await GeneralisteRdv.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);
  
      const countMap = aggregation.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {});
  
      const labels = allStatuses;
      const data = allStatuses.map((status) => countMap[status] || 0);
  
      res.json({ labels, data });
    } catch (error) {
      console.error("Error in getAppointmentStatusStats:", error);
      res.status(500).json({ error: "Failed to fetch appointment status statistics" });
    }
  },
  
  getPatientAgeStats : async (req, res) => {
    try {
      const patients = await Patient.find().select('age');
  
      const ageBuckets = {
        "0-18": 0,
        "19-35": 0,
        "36-50": 0,
        "51-65": 0,
        "66+": 0,
      };
  
     
  
      patients.forEach(({ age }) => {
        if (age <= 18) ageBuckets['0-18']++;
        else if (age <= 35) ageBuckets['19-35']++;
        else if (age <= 50) ageBuckets['36-50']++;
        else if (age <= 65) ageBuckets['51-65']++;
        else ageBuckets['66+']++;
      });
  
      res.json({
        labels: Object.keys(ageBuckets),
        data: Object.values(ageBuckets),
      });
    } catch (err) {
      console.error("Error in getPatientAgeStats:", err);
      res.status(500).json({ error: "Failed to calculate age statistics" });
    }
  },

  getTotalStats : async (req, res) => {
    try {
      const [patientCount, medecinCount, rendezvousCount, examenCount, generalisteRdvCount, radiologueReport] = await Promise.all([
        Patient.countDocuments(),
        Medecin.countDocuments(),
        RendezVous.countDocuments(),
        Examen.countDocuments(),
        GeneralisteRdv.countDocuments(),
        RadiologyReport.countDocuments()
      ]);
  
      res.json({
        totalPatients: patientCount,
        totalMedecins: medecinCount,
        totalRendezVous: rendezvousCount + generalisteRdvCount,
        totalExamens: examenCount + radiologueReport
      });
    } catch (error) {
      console.error('Error getting statistics:', error);
      res.status(500).json({ error: 'Failed to retrieve statistics' });
    }
  },
  getTotalStaffStats : async (req, res) => {
    try {
      const [patientCount, medecinCount, rendezvousCount, examenCount, generalisteRdvCount] = await Promise.all([
        Patient.countDocuments(),
        Medecin.countDocuments(),
        RendezVous.countDocuments(),
        Examen.countDocuments(),
        GeneralisteRdv.countDocuments()
      ]);
  
      res.json({
        totalPatients: patientCount,
        totalMedecins: medecinCount,
        totalRendezVous: rendezvousCount,
        totalExamens: examenCount + generalisteRdvCount
      });
    } catch (error) {
      console.error('Error getting statistics:', error);
      res.status(500).json({ error: 'Failed to retrieve statistics' });
    }
  },
  
  getAll: async (req, res) => {
    try {
      const admins = await Admin.find({role: "admin"}).populate('center');
      return res.status(200).json({
        success: true,
        count: admins.length,
        data: admins
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  
  getById: async (req, res) => {
    try {
      const admin = await Admin.findById(req.params.id).populate('center');
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          error: 'Admin not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: admin
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid admin ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  
  getByCenter: async (req, res) => {
    try {
      const centerId = req.params.centerId;
      
      if (!mongoose.Types.ObjectId.isValid(centerId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid center ID'
        });
      }
      
      const admins = await Admin.find({ center: centerId }).populate('center');
      
      return res.status(200).json({
        success: true,
        count: admins.length,
        data: admins
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
      const { center,firstName,lastName,email,sex,age,phone,password } = req.body;

 
      if (!center || !mongoose.Types.ObjectId.isValid(center)) {
        return res.status(400).json({
          success: false,
          error: 'Please provide valid center ID and user ID'
        });
      }
       const ad = await Admin.findOne({ email });
        if (ad) {
          return res.status(400).json({
            success: false,
            error: 'Email already in use'
          });
        }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create the admin
      const admin = await Admin.create({
        center,
        firstName,
        lastName,
        email,
        sex,
        age,
        phone,
        password: hashedPassword
      });
  
      // Populate the center and user fields for the returned admin object
      await admin.populate('center');
      return res.status(201).json({
        success: true,
        data: admin
      });
    } catch (error) {
      console.log(error)
      // Handle validation errors and server errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
          success: false,
          error: messages
        });
      }
      
      // Handle other possible errors (e.g., cast error or server issues)
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid ObjectId format'
        });
      }
  
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  ,

  
  update: async (req, res) => {
    try {
      const { center } = req.body;
      
      if (!center || !mongoose.Types.ObjectId.isValid(center)) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a valid center ID'
        });
      }
      
      const admin = await Admin.findByIdAndUpdate(
        req.params.id,
        { center },
        { new: true, runValidators: true }
      ).populate('center');
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          error: 'Admin not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: admin
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
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  
  delete: async (req, res) => {
    try {
      const admin = await Admin.findByIdAndDelete(req.params.id);
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          error: 'Admin not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: {}
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
            const user = await Admin.login(email, password);
            const token = generateToken(user._id)
            res.status(200).json({user, token})
        } catch (error) {
            res.status(400).json({error: error.message});
        }
       
    },
    

  
  modify: async (req, res) => {
    try {
      if (!req.body.center || !mongoose.Types.ObjectId.isValid(req.body.center)) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a valid center ID'
        });
      }
      
      const admin = await Admin.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).populate('center');
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          error: 'Admin not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: admin
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


  
  
    
    
   
    
};

module.exports = adminController;