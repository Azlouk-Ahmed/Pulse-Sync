const mongoose = require('mongoose');
const RendezVous = require('../models/rendez-vous');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Examen = require('../models/examen');
const Admin = require('../models/admin');

const rendezVousController = {
  updateAppointmentStatus : async (req, res) => {
    console.log("updateAppointmentStatus",req.body.status)
    try {

      if (!req.body.status) {
        return res.status(400).json({
          success: false,
          error: 'Please provide status to update'
        });
      }
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'ongoing', 'missed'];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status value'
        });
      }
      
      const appointment = await RendezVous.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );
      
      if (!appointment) {
        return res.status(404).json({
          success: false,
          error: 'Appointment not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      console.error("Error in updateAppointmentStatus:", error);
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid appointment ID'
        });
      }
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  updateAppointmentDate : async (req, res) => {
    try {
      if (!req.body.appointmentDate) {
        return res.status(400).json({
          success: false,
          error: 'Please provide date to update'
        });
      }
  
      
      const appointment = await RendezVous.findByIdAndUpdate(
        req.params.id,
        { appointmentDate: req.body.appointmentDate },
        { new: true, runValidators: true }
      );
      
      if (!appointment) {
        return res.status(404).json({
          success: false,
          error: 'Appointment not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid appointment ID'
        });
      }
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  getWeeklyRequestedAppointments : async (req, res) => {
    try {
      // Define today's date
      const today = new Date();
      const todayDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      
      // French day abbreviations - arranged to start with today's day
      const frenchDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
      
      // Create an ordered array of days, starting with today
      const orderedDays = [];
      for (let i = 0; i < 7; i++) {
        // Calculate which day we're on (wrapping around the week if needed)
        const dayIndex = (todayDayOfWeek - i + 7) % 7;
        orderedDays.unshift(frenchDays[dayIndex]);
      }
      
      // Initialize statistics for each day
      const weeklyStats = orderedDays.map(day => ({
        day,
        pendingAppointment: 0
      }));
      
      // Calculate date range for the past 7 days (including today)
      const endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);
      
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      
      // Create a map to easily associate dates with days of the week
      const dateMap = {};
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        const dayOfWeek = date.getDay();
        const dateStr = date.toISOString().split('T')[0];
        
        dateMap[dateStr] = frenchDays[dayOfWeek];
      }
      
      // Find requested appointments created in the last 7 days
      const appointments = await RendezVous.find({
        status: "pending",
        createdAt: {
          $gte: startDate,
          $lte: endDate
        },
        doctor:req.user._id
      });
      
      // Debug log
      console.log(`Found ${appointments.length} requested appointments in date range`);
      
      // Count appointments by creation date
      appointments.forEach(appointment => {
        const creationDate = new Date(appointment.createdAt);
        const dateStr = creationDate.toISOString().split('T')[0];
        const dayName = dateMap[dateStr];
        
        if (dayName) {
          // Find the day in our ordered array and increment its count
          const dayStats = weeklyStats.find(day => day.day === dayName);
          if (dayStats) {
            dayStats.pendingAppointment++;
          }
        }
      });
      
      return res.status(200).json({
        success: true,
        data: weeklyStats
      });
    } catch (error) {
      console.error("Error in getWeeklyRequestedAppointments:", error);
      return res.status(500).json({
        success: false,
        error: "Server Error"
      });
    }
  },
  getAppointmentStats : async (req, res) => {
    try {
      const YEAR = new Date().getFullYear(); // or customize this
  
      // Get all appointments for the year
      const appointments = await RendezVous.find({
        appointmentDate: {
          $gte: new Date(`${YEAR}-01-01`),
          $lte: new Date(`${YEAR}-12-31`)
        },
        doctor:req.user._id
      });
  
      // Map to hold data
      const monthlyData = Array.from({ length: 12 }, (_, index) => ({
        month: new Date(0, index).toLocaleString('default', { month: 'short' }),
        appointments: 0,
        newPatients: 0
      }));
  
      const firstAppointmentsMap = {};
  
      // Process each appointment
      for (let appt of appointments) {
        const monthIndex = new Date(appt.appointmentDate).getMonth();
  
        // Count total appointments
        monthlyData[monthIndex].appointments += 1;
  
        // Track the first appointment of each patient
        const patientId = appt.patient.toString();
        if (!firstAppointmentsMap[patientId]) {
          firstAppointmentsMap[patientId] = appt.appointmentDate;
        }
      }
  
      // Count new patients by their first appointment's month
      Object.values(firstAppointmentsMap).forEach(date => {
        const monthIndex = new Date(date).getMonth();
        monthlyData[monthIndex].newPatients += 1;
      });
  
      return res.status(200).json({
        success: true,
        data: monthlyData
      });
  
    } catch (error) {
      console.error("Error in getMonthlyAppointmentStats:", error);
      return res.status(500).json({
        success: false,
        error: "Server Error"
      });
    }
  },
  // Get all rendez-vous
  getAll: async (req, res) => {
    try {
      const appointments = await RendezVous.find({doctor: req.user._id})
        .populate('doctor patient center')
        .sort({ dateStart: 1 });

      return res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
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
      const appointments = await RendezVous.find({patient: req.user._id})
        .populate('doctor patient center')
        .sort({ dateStart: 1 });

      return res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getAllAdmin: async (req, res) => {
    try {
      const appointments = await RendezVous.find()
        .populate('doctor patient center')
        .sort({ dateStart: 1 });

      return res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getByAdmin: async (req, res) => {
    try {
      const admin = await Admin.findById(req.user._id)
      if(!admin) {
        return res.status(401).json({
          success: false,
          error: "admin not found",
        });
      }
      const appointments = await RendezVous.find({center: admin.center})
        .populate('doctor patient center')
        .sort({ dateStart: 1 });

      return res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Get rendez-vous by ID
  getById: async (req, res) => {
    try {
      const appointment = await RendezVous.findById(req.params.id)
        .populate('doctor patient center');

      if (!appointment) {
        return res.status(404).json({
          success: false,
          error: 'Appointment not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid appointment ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Create a new rendez-vous
  create: async (req, res) => { 
    try { 
      const { doctor, patient, center, appointmentDate, exam, status, duration } = req.body; 

      console.log("cetner",center)
  
      // Validate ObjectIds 
      const ids = { doctor, patient, center, exam }; 
      for (const [key, id] of Object.entries(ids)) { 
        if (!mongoose.Types.ObjectId.isValid(id)) { 
          return res.status(400).json({ 
            success: false, 
            error: `Invalid ${key} ID` 
          }); 
        } 
      }
  
      const doctorDoc = await Doctor.findById(doctor);
      if (!doctorDoc) {
        return res.status(404).json({
          success: false,
          error: 'Doctor not found'
        });
      }
      
      if (doctorDoc.specialization !== "radiologue") {
        return res.status(400).json({
          success: false,
          error: 'Doctor must be a radiologue specialist'
        });
      }
      
      const pt = await Patient.findById(patient);
      if (!pt) {
        return res.status(404).json({
          success: false,
          error: 'patient not found'
        });
      }
      const examen = await Examen.findById(exam);
      if (!examen) {
        return res.status(404).json({
          success: false,
          error: 'examen not found'
        });
      }
  
      const appointment = await RendezVous.create({ 
        doctor, 
        patient, 
        center,
        appointmentDate,
        examen : exam,
        status: status,
        duration
        
      }); 
  
      const populated = await RendezVous.findById(appointment._id) 
        .populate('doctor patient center'); 
  
      return res.status(201).json({ 
        success: "rendez vous cree avec succes", 
        data: populated 
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

  // Update rendez-vous
  update: async (req, res) => {
    try {
      const { doctor, patient, center } = req.body;

      // Validate provided ObjectIds
      const ids = { doctor, patient, center };
      for (const [key, id] of Object.entries(ids)) {
        if (id && !mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            error: `Invalid ${key} ID`
          });
        }
      }

      const appointment = await RendezVous.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('doctor patient center');

      if (!appointment) {
        return res.status(404).json({
          success: false,
          error: 'Appointment not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: appointment
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
          error: 'Invalid appointment ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  // Delete rendez-vous
  delete: async (req, res) => {
    try {
      const appointment = await RendezVous.findByIdAndDelete(req.params.id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          error: 'Appointment not found'
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
          error: 'Invalid appointment ID'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

module.exports = rendezVousController;
