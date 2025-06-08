const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient');
const requireAdminAuth = require('../middlewares/requireAdminAuth');
const requirePatientAuth = require('../middlewares/requireUserAuth');

// GET all centers
router.get('/', patientController.getAll);
router.put('/status/:id',requireAdminAuth(), patientController.updateStatus);

// GET center by ID
router.get('/:id', patientController.getById);

// GET centers by name

// POST create new center
router.post('/', patientController.create);
router.post('/login', patientController.login);
router.post('/signup', patientController.signup);

// PUT update center (full update)
router.put('/edit/:id', patientController.update);
router.put('/password/:id',requirePatientAuth, patientController.pw);

// DELETE center
router.delete('/:id', patientController.delete);

module.exports = router;