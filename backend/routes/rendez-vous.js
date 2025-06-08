const express = require('express');
const router = express.Router();
const rdv = require('../controllers/rendez-vous');
const requireAdminAuth = require('../middlewares/requireAdminAuth');
const requireDocAuth = require('../middlewares/requireDocAuth');
const requirePatientAuth = require('../middlewares/requireUserAuth');

// GET all centers
router.get('/doc',requireDocAuth(), rdv.getAll);
router.put('/cancel/:id',requirePatientAuth, rdv.updateAppointmentStatus);
router.get('/superAdmin',requireAdminAuth(['superAdmin']), rdv.getAllAdmin);

router.get('/admin',requireAdminAuth(['admin']), rdv.getByAdmin);

// GET center by ID

// POST create new center
router.post('/', rdv.create);
router.post('/createrdv',requireDocAuth(), rdv.create);
router.get('/user',requirePatientAuth, rdv.getAllPatient);

// PUT update center (full update)
router.put('/:id', rdv.update);



// DELETE center
router.delete('/:id', rdv.delete);
router.get('/stats',requireDocAuth(), rdv.getAppointmentStats);
router.get('/stats/pending',requireDocAuth(), rdv.getWeeklyRequestedAppointments);
router.put('/change-date/:id',requireDocAuth(), rdv.updateAppointmentDate);
router.get('/details/:id', rdv.getById);
router.get('/examen/:id', rdv.getById);
router.put('/status/:id',requireDocAuth(),  rdv.updateAppointmentStatus);


module.exports = router;