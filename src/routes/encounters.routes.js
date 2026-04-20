const router = require('express').Router({ mergeParams: true });
const encountersController = require('../controllers/encounters.controller');
const validate = require('../middleware/validate.middleware');
const { validateEncounterCreate } = require('../validators/encounters.validator');

router.post('/', validate(validateEncounterCreate), encountersController.createEncounter);
router.get('/', encountersController.listPatientEncounters);

module.exports = router;
