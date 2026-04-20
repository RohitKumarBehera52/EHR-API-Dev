const router = require('express').Router();
const patientsController = require('../controllers/patients.controller');
const encountersRoutes = require('./encounters.routes');
const validate = require('../middleware/validate.middleware');
const {
  validatePatientCreate,
  validatePatientUpdate
} = require('../validators/patients.validator');

router.post('/', validate(validatePatientCreate), patientsController.createPatient);
router.get('/', patientsController.listPatients);
router.get('/:patientId', patientsController.getPatientById);
router.put('/:patientId', validate(validatePatientUpdate), patientsController.updatePatient);
router.use('/:patientId/encounters', encountersRoutes);

module.exports = router;
