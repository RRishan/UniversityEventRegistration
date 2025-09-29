const express = require('express');
const eventController = require('../controller/eventController.js');
const userAuth = require('../middleware/userAuth.js');

const router = express.Router();

router.post('/register', userAuth ,eventController.addEvent)

module.exports = router