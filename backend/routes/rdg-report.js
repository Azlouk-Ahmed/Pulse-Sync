const express = require('express');
const router = express.Router();
const radiologyReportController = require('../controllers/report-rdg');
const uploadRadiology = require('../multerconfig/radiologyUploads');
const requireDocAuth = require('../middlewares/requireDocAuth');


router.get('/', radiologyReportController.getAll);
router.get('/exams',requireDocAuth(), radiologyReportController.getExams);


router.get('/abc/:id',requireDocAuth(), radiologyReportController.getByApp);


router.get('/patient/:patientId', radiologyReportController.getByPatient);


router.post('/', 
  uploadRadiology.array('images', 10), 
  radiologyReportController.create
);


router.put('/:id', radiologyReportController.update);


router.put('/:id/finalize', radiologyReportController.finalizeReport);


router.delete('/:id', radiologyReportController.delete);

module.exports = router;