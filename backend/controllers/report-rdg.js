const mongoose = require('mongoose');
const RadiologyReport = require('../models/radiologueReport');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Examen = require('../models/examen');
const Center = require('../models/center');
const  RendezVous = require('../models/rendez-vous');


const radiologyReportController = {
  
  getAll: async (req, res) => {
    try {
      const reports = await RadiologyReport.find()
        .populate('examen')
        .populate('patient')
        .populate('radiologist')
        .populate('referringDoctor')
        .populate('center')
        .populate('signedBy')
        .populate('lastModifiedBy')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
      });
    } catch (error) {
        console.error('Error fetching radiology reports:', error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getExams: async (req, res) => {
    try {
      const reports = await RadiologyReport.find({ radiologist: req.user._id })
  .populate({
    path: 'examen',
    populate: [
      { path: 'doctorId' },
      { path: 'patientId' },
      { path: 'center' },
    ]
  })

        .sort({ createdAt: -1 });

        const exams = reports.map(el => ({
          ...el.examen.toObject?.() || el.examen,
          itemId: el.appointment  // or el.id depending on your schema
        }));

      return res.status(200).json({
        success: true,
        count: exams.length,
        data: exams

      });
    } catch (error) {
        console.error('Error fetching radiology reports:', error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  
  getById: async (req, res) => {
    try {
      const report = await RadiologyReport.findById(req.params.id)
        .populate('examen')
        .populate('patient')
        .populate('radiologist')
        .populate('referringDoctor')
        .populate('center')
        .populate('signedBy')
        .populate('lastModifiedBy');

      if (!report) {
        return res.status(404).json({
          success: false,
          error: 'Radiology report not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: report
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid ID format'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },
  getByApp: async (req, res) => {
    try {
      const report = await RadiologyReport.findOne({examen: req.params.id})
        .populate({
            path: 'examen',
            populate: {
              path: 'doctorId'  // the field inside examen you want to populate
            }
          })
        .populate('patient')
        .populate('radiologist')

      if (!report) {
        return res.status(404).json({
          success: false,
          error: 'Radiology report not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: report
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid ID format'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  
  getByPatient: async (req, res) => {
    try {
      const { patientId } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid patient ID format'
        });
      }

      const reports = await RadiologyReport.find({ patient: patientId })
        .populate('examen')
        .populate('radiologist')
        .populate('appointment')
        .populate('patient')
        .sort({ studyDate: -1 });

      return res.status(200).json({
        success: true,
        count: reports.length,
        data: reports
      });
    } catch (error) {
      console.error('Error fetching radiology reports by patient:', error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  
create: async (req, res) => {
  try {
    const {
      examen,
      patient,
      appointment,
      radiologist,
      notes
    } = req.body;

    

    

    
    let descriptions = req.body.descriptions || [];
    if (!Array.isArray(descriptions)) {
      descriptions = [descriptions]; 
    }

    
    const images = (req.files || []).map((file, index) => {
      const relativePath = file.path.split('uploads')[1]; 
      return {
        url: `uploads${relativePath.replace(/\\/g, '/')}`,
        description: descriptions[index] || ''
      };
    });

    
    const existingReport = await RadiologyReport.findOne({
      examen,
      patient,
      appointment,
      radiologist
    });

    let report;
    if (existingReport) {
      
      existingReport.notes = notes;
      existingReport.images = images;
      report = await existingReport.save();
    } else {
      
      report = await RadiologyReport.create({
        examen,
        patient,
        appointment,
        radiologist,
        images,
        notes
      });
    }

    
    const populated = await RadiologyReport.findById(report._id)
      .populate('examen')
      .populate('patient')
      .populate('appointment')
      .populate('radiologist');

    return res.status(existingReport ? 200 : 201).json({
      success: true,
      data: populated
    });

  } catch (error) {
    console.error('Error creating/updating radiology report:', error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
},



  
  update: async (req, res) => {
    try {
      const reportId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(reportId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid report ID format'
        });
      }

      const report = await RadiologyReport.findById(reportId);
      if (!report) {
        return res.status(404).json({
          success: false,
          error: 'Radiology report not found'
        });
      }

      
      if (req.body.radiologist && req.body.radiologist !== report.radiologist.toString()) {
        const radiologistDoc = await Doctor.findById(req.body.radiologist);
        if (!radiologistDoc) {
          return res.status(404).json({
            success: false,
            error: 'Radiologist not found'
          });
        }

        if (radiologistDoc.specialization !== 'radiologue') {
          return res.status(400).json({
            success: false,
            error: 'The doctor must be a radiologist (radiologue)'
          });
        }
      }

      
      if (req.body.patient && req.body.patient !== report.patient.toString()) {
        const patientExists = await Patient.findById(req.body.patient);
        if (!patientExists) {
          return res.status(404).json({
            success: false,
            error: 'Patient not found'
          });
        }
      }

      if (req.body.examen && req.body.examen !== report.examen.toString()) {
        const examenExists = await Examen.findById(req.body.examen);
        if (!examenExists) {
          return res.status(404).json({
            success: false,
            error: 'Examen not found'
          });
        }
      }

      if (req.body.center && req.body.center !== report.center.toString()) {
        const centerExists = await Center.findById(req.body.center);
        if (!centerExists) {
          return res.status(404).json({
            success: false,
            error: 'Center not found'
          });
        }
      }

      if (req.body.referringDoctor && req.body.referringDoctor !== (report.referringDoctor && report.referringDoctor.toString())) {
        const referringDoctorExists = await Doctor.findById(req.body.referringDoctor);
        if (!referringDoctorExists) {
          return res.status(404).json({
            success: false,
            error: 'Referring doctor not found'
          });
        }
      }

      
      const updatedReport = await RadiologyReport.findByIdAndUpdate(
        reportId,
        { ...req.body },
        { new: true, runValidators: true }
      )
        .populate('examen')
        .populate('patient')
        .populate('radiologist')
        .populate('referringDoctor')
        .populate('center')
        .populate('signedBy')
        .populate('lastModifiedBy');

      return res.status(200).json({
        success: true,
        data: updatedReport
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
          success: false,
          error: messages
        });
      }
      console.error('Error updating radiology report:', error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  
  finalizeReport: async (req, res) => {
    try {
      const { id } = req.params;
      const { radiologistId } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(radiologistId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid ID format'
        });
      }

      const report = await RadiologyReport.findById(id);
      if (!report) {
        return res.status(404).json({
          success: false,
          error: 'Radiology report not found'
        });
      }

      
      const radiologist = await Doctor.findById(radiologistId);
      if (!radiologist) {
        return res.status(404).json({
          success: false,
          error: 'Radiologist not found'
        });
      }

      if (radiologist.specialization !== 'radiologue') {
        return res.status(400).json({
          success: false,
          error: 'Only radiologists can finalize reports'
        });
      }

      
      if (report.radiologist.toString() !== radiologistId) {
        return res.status(403).json({
          success: false,
          error: 'Only the assigned radiologist can finalize this report'
        });
      }

      
      await report.finalizeReport(radiologistId);

      const updatedReport = await RadiologyReport.findById(id)
        .populate('examen')
        .populate('patient')
        .populate('radiologist')
        .populate('referringDoctor')
        .populate('center')
        .populate('signedBy')
        .populate('lastModifiedBy');

      return res.status(200).json({
        success: true,
        data: updatedReport
      });
    } catch (error) {
      console.error('Error finalizing report:', error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  },

  
  delete: async (req, res) => {
    try {
      const report = await RadiologyReport.findById(req.params.id);

      if (!report) {
        return res.status(404).json({
          success: false,
          error: 'Radiology report not found'
        });
      }

      
      if (report.status === 'final') {
        return res.status(400).json({
          success: false,
          error: 'Finalized reports cannot be deleted'
        });
      }

      await report.remove();

      return res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid ID format'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

module.exports = radiologyReportController;