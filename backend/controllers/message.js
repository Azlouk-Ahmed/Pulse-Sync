const twilioClient = require('../twilio'); 
const Patient = require("../models/patient");
const Notification = require("../models/notification");

exports.sendMessage = async (req, res) => {
  try {
    const { patientId, body } = req.body;
    
    const patient = await Patient.findById(patientId);
    if(!patient) {
      return res.status(400).json({ message: 'Patient is not found' });
    }

    
    const from = process.env.TWILIO_PHONE_NUMBER;
    
    if (!body) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    await Notification.create({
      patient: patientId,
      message: body
    });
    const message = await twilioClient.messages.create({
      body,
      from,
      to: "+21654726845"
    });
    
    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      message: 'Failed to send message',
      error: error.message
    });
  }
};