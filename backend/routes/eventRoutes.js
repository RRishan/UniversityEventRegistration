const express = require('express');
const eventController = require('../controller/eventController.js');
const userAuth = require('../middleware/userAuth.js');

const router = express.Router();

router.post('/register', userAuth ,eventController.addEvent)
router.get('/event', eventController.getEvent)
router.get('/events', eventController.getAllEvent)
router.get('/events', eventController.getAllEvent)
router.put('/update', eventController.updateEvent)
router.delete('/delete', eventController.deleteEvent)
router.get('/organization-events', userAuth, eventController.getEventsByOrganization)

module.exports = router