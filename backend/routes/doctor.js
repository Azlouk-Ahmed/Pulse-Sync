const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor');
const requireAdminAuth = require('../middlewares/requireAdminAuth');
const uploadDoc = require('../multerconfig/uploadsDoc');
const requireDocAuth = require('../middlewares/requireDocAuth');

// GET all centers
router.get('/', doctorController.getAll);
router.get('/staff',requireAdminAuth(), doctorController.getAllStaff);

// GET center by ID
router.put('/edit/:id',requireDocAuth(),uploadDoc.single('img'), doctorController.modify);

// GET centers by name
router.get('/centers/:centerId', doctorController.getByCenter);

// POST create new center
router.post('/',requireAdminAuth(), doctorController.create);
router.post('/login', doctorController.login);

// PUT update center (full update)
router.get('/doctor/:id', doctorController.getById);
router.get('/docs',requireDocAuth(), doctorController.getDocs);
router.put('/status/:id',requireAdminAuth(), doctorController.changeStatus);


// DELETE center
router.delete('/:id', doctorController.delete);

module.exports = router;