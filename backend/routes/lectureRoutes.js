const express = require('express');
const lectureController = require('../controller/lectureController.js');
const userAuth = require('../middleware/userAuth.js');

const router = express.Router();

router.post('/profile', userAuth ,lectureController.createLectureProfile)

module.exports = router