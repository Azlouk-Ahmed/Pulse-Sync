const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const requireAdminAuth = require('../middlewares/requireAdminAuth');

// GET all centers
router.get('/',requireAdminAuth(["superAdmin"]), adminController.getAll);

// GET center by ID
router.get('/admin/:id', adminController.getById);
router.put('/status/:id',requireAdminAuth(["superAdmin"]), adminController.changeStatus);

// GET centers by name
router.get('/name/:name', adminController.getByCenter);

// POST create new center
router.post('/', adminController.create);

// PUT update center (full update)
router.put('/:id', adminController.update);

// PATCH modify center (partial update)
router.patch('/:id', adminController.modify);

// DELETE center
router.delete('/:id', adminController.delete);
router.post('/login', adminController.login);
router.get('/stats',requireAdminAuth(["superAdmin"]), adminController.getTotalStats);
router.get('/age',requireAdminAuth(["superAdmin"]), adminController.getPatientAgeStats);
router.get('/status',requireAdminAuth(["superAdmin"]), adminController.getAppointmentStatusStats);
router.get('/appointment-stats',requireAdminAuth(["superAdmin"]), adminController.appointmentsPerCenter);

module.exports = router;