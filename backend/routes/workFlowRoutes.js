const express = require('express');

const workFlowController = require('../controller/workFlowController.js');
const userAuth = require('../middleware/userAuth.js');

const router = express.Router();

router.get('/queue', userAuth, workFlowController.getWorkflowQueue);
router.post('/decision', userAuth, workFlowController.updateWorkflowStatus);
router.post('/security-upload', userAuth, workFlowController.submitSecurityProof);
router.post('/event', userAuth, workFlowController.getWorkflowByOrganizer);

module.exports = router;
