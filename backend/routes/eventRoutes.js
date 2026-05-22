const express = require('express');

const eventController = require('../controller/eventController.js');
const userAuth = require('../middleware/userAuth.js');

const router = express.Router();

router.post('/create', userAuth, eventController.createEvent);
router.post('/resubmit', userAuth, eventController.updateReturnedEvent);
router.get('/mine', userAuth, eventController.getMyEvents);
router.get('/public', eventController.getApprovedEvents);
router.get('/:eventId', eventController.getEvent);

module.exports = router;
