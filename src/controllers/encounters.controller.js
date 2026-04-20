const encountersService = require('../services/encounters.service');
const { success } = require('../utils/api-response');

async function createEncounter(req, res, next) {
  try {
    const encounter = await encountersService.createEncounter(req.params.patientId, req.body);
    return success(res, 'Encounter created successfully', encounter, 201);
  } catch (error) {
    return next(error);
  }
}

async function listPatientEncounters(req, res, next) {
  try {
    const encounters = await encountersService.listPatientEncounters(req.params.patientId);
    return success(res, 'Encounters retrieved successfully', encounters);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createEncounter,
  listPatientEncounters
};
