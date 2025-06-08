const express = require('express');
const router = express.Router();
const rdv = require('../controllers/generaliste-rdv');
const requirePatientAuth = require('../middlewares/requireUserAuth');
const requireAdminAuth = require('../middlewares/requireAdminAuth');
const requireDocAuth = require('../middlewares/requireDocAuth');


router.post('/',requirePatientAuth, rdv.createAppointment);
router.post('/admin',requireAdminAuth(), rdv.createAppointmentByAdmin);
router.post('/prescripteur',requireDocAuth(), rdv.createAppointmentByAdmin);
router.get('/',requireAdminAuth(['superAdmin']), rdv.getAllAppointments);
router.get('/superAdmin',requireAdminAuth(['superAdmin']), rdv.getAllAppointments);
router.get('/doc',requireDocAuth(), rdv.getAllAppointmentsByDoc);
router.get('/calendar',requirePatientAuth, rdv.getCalendarAppointments);
router.get('/user',requirePatientAuth, rdv.getPatientAppointment);
router.put('/status/:id',requireDocAuth(["prescripteur"]), rdv.updateAppointmentStatus);
router.put('/cancel/:id',requirePatientAuth, rdv.updateAppointmentStatus);
router.get('/prescripteur',requireDocAuth(["prescripteur"]), rdv.getAllAppointmentsByDoc);
router.put('/change-date/:id',requireDocAuth(["prescripteur"]), rdv.updateAppointmentDate);
router.get('/stats',requireDocAuth(["prescripteur"]), rdv.getAppointmentStats);
router.get('/stats/requested',requireDocAuth(["prescripteur"]), rdv.getWeeklyRequestedAppointments);
router.get('/details/:id', rdv.getAppointmentDetails);


module.exports = router;