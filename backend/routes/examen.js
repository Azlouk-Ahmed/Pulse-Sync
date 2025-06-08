const express = require('express');
const router = express.Router();
const examenController = require('../controllers/examen');
const requireDocAuth = require('../middlewares/requireDocAuth');
const requirePatientAuth = require('../middlewares/requireUserAuth');

// GET all centers
router.get('/', examenController.getAll);
router.get('/patient',requirePatientAuth, examenController.getAllPatient);
router.get('/radiology',requireDocAuth(), examenController.getAllRadio);
router.get('/doc',requireDocAuth(['prescripteur']), examenController.getByDoc);

// GET center by ID
router.get('/details/:id', examenController.getById);
router.get('/radiologue/details/:id', examenController.getByRadiologueAppointment);
router.get('/appointment/:id', examenController.getByAppointment);

// GET centers by name
router.get('/name/:name', examenController.getByCenter);

// POST create new center
router.post('/',requireDocAuth(["prescripteur"]), examenController.create);

// PUT update center (full update)
router.put('/:id', examenController.update);

// PATCH modify center (partial update)
router.patch('/:id', examenController.modify);

// DELETE center
router.delete('/:id', examenController.delete);

module.exports = router;