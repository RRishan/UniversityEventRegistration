const express = require('express');
const workFlowController = require('../controller/workFlowController.js');
const userAuth = require('../middleware/userAuth.js');

const router = express.Router();

router.get('/get', userAuth ,workFlowController.getWorkFlowByRole)
router.post('/update', userAuth, workFlowController.updateWorkFlowStatus)

module.exports = router