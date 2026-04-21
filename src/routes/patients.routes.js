const router = require('express').Router();
const patientsController = require('../controllers/patients.controller');

router.get('/:patientId/summary', patientsController.getPatientSummary);

module.exports = router;

