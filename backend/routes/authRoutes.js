const express = require('express')
const authController = require('../controller/authController.js')
const userAuth = require('../middleware/userAuth.js')

const router = express.Router();


router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/send-verify-otp', userAuth, authController.verifyOtp)
router.post('/verify-email', userAuth, authController.verifyEmail)


module.exports = router;