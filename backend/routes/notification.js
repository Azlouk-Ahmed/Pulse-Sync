const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification');
const requireAuth = require('../middlewares/requireUserAuth');
const requirePatientAuth = require('../middlewares/requireUserAuth');

// GET all centers
router.get('/',requireAuth, notificationController.getAll);

// GET center by ID
router.get('/get-id/:id', notificationController.getById);
router.get('/patiento',requireAuth, notificationController.getPatientNotif);

// GET centers by name
router.get('/name/:name', notificationController.getByCenter);

// POST create new center
router.post('/', notificationController.create);
router.post('/seen',requirePatientAuth, notificationController.seen);

// PUT update center (full update)
router.put('/:id', notificationController.update);

// PATCH modify center (partial update)
router.patch('/:id', notificationController.modify);

// DELETE center
router.delete('/:id', notificationController.delete);



module.exports = router;