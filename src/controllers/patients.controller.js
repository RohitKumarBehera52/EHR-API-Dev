const patientsService = require('../services/patients.service');
const { success } = require('../utils/api-response');

async function createPatient(req, res, next) {
  try {
    const patient = await patientsService.createPatient(req.body);
    return success(res, 'Patient created successfully', patient, 201);
  } catch (error) {
    return next(error);
  }
}

async function listPatients(req, res, next) {
  try {
    const patients = await patientsService.listPatients(req.query);
    return success(res, 'Patients retrieved successfully', patients);
  } catch (error) {
    return next(error);
  }
}

async function getPatientById(req, res, next) {
  try {
    const patient = await patientsService.getPatientById(req.params.patientId);
    return success(res, 'Patient retrieved successfully', patient);
  } catch (error) {
    return next(error);
  }
}

async function updatePatient(req, res, next) {
  try {
    const patient = await patientsService.updatePatient(req.params.patientId, req.body);
    return success(res, 'Patient updated successfully', patient);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient
};
