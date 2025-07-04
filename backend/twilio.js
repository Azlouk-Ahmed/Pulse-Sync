const twilio = require('twilio');
require('dotenv').config();


const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = twilioClient;