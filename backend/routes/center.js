const express = require('express');
const router = express.Router();
const centerController = require('../controllers/center');
const upload = require('../multerconfig/uploads');
const requireAdminAuth = require('../middlewares/requireAdminAuth');

// GET all centers
router.get('/', centerController.getAll);

// GET center by ID
router.get('/:id', centerController.getById);

// GET centers by name
router.get('/name/:name', centerController.getByName);

// POST create new center
router.post('/',upload.single('img'), centerController.create);

// PUT update center (full update)
router.put('/:id',requireAdminAuth(), upload.single('img'), centerController.update);

// PATCH modify center (partial update)
router.patch('/:id', centerController.modify);

// DELETE center
router.delete('/:id', centerController.delete);

module.exports = router;