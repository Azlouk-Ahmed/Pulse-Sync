const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors");
const adminRouter = require('./routes/admin');
const centerRouter = require('./routes/center');
const doctorRouter = require('./routes/doctor');
const examenRouter = require('./routes/examen');
const notificationRouter = require('./routes/notification');
const patientRouter = require('./routes/patient');
const rdvRouter = require('./routes/rendez-vous');
const rdgRouter = require('./routes/rdg-report');
const smsRouter = require('./routes/message');
const generalistAppointment = require('./routes/generaliste-rdv');
require('dotenv').config();



const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const allowedOrigins = [
  'http://localhost:5177',
  'http://127.0.0.1:5173',
  'http://localhost:5173',
'http://localhost:7000',
'http://127.0.0.1:7000',
'http://localhost:4000',
'http://127.0.0.1:4000',
'http://localhost:8000',
'http://127.0.0.1:8000',
  'http://localhost:5178'];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};

app.use(express.json())
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/examen', examenRouter)
app.use('/api/center', centerRouter)
app.use('/api/notification', notificationRouter)
app.use('/api/patient', patientRouter)
app.use('/api/rdg', rdgRouter)
app.use('/api/rdv', rdvRouter)
app.use('/api/sms', smsRouter)
app.use('/api/appointment', generalistAppointment)


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 

  app.use((err, req, res, next) => {
    console.error(`Error occurred: ${err.message}`);
    console.error(err.stack);  
    res.status(500).json({ message: "Something went wrong!" }); 
  });