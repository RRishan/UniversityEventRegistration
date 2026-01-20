const express = require('express');
const studentController = require('../controller/studentController.js');
const userAuth = require('../middleware/userAuth.js');

const router = express.Router();

router.post('/profile', userAuth ,studentController.createStudentProfile)

module.exports = router