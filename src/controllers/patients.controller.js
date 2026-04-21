const patientsService = require('../services/patients.service');
const { success } = require('../utils/api-response');

async function getPatientSummary(req, res, next) {
  try {
    const summary = await patientsService.getPatientSummary(req.params.patientId);
    return success(res, 'Patient summary retrieved successfully', summary);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getPatientSummary
};

