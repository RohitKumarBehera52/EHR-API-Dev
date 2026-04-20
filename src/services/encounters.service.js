const encountersRepository = require('../repositories/encounters.repository');
const patientsService = require('./patients.service');
const { createId } = require('../utils/id.util');
const { nowIso } = require('../utils/date.util');

function normalizeDiagnoses(diagnoses = []) {
  return diagnoses.map((diagnosis) => ({
    code: diagnosis.code || null,
    description: diagnosis.description,
    type: diagnosis.type || 'primary'
  }));
}

async function createEncounter(patientId, payload) {
  await patientsService.getPatientById(patientId);

  const encounter = {
    encounterId: createId('ENC'),
    patientId,
    providerId: payload.providerId,
    visitDate: payload.visitDate,
    visitType: payload.visitType,
    chiefComplaint: payload.chiefComplaint,
    clinicalNotes: payload.clinicalNotes || null,
    diagnoses: normalizeDiagnoses(payload.diagnoses),
    vitals: payload.vitals || null,
    createdAt: nowIso()
  };

  return encountersRepository.save(encounter);
}

async function listPatientEncounters(patientId) {
  await patientsService.getPatientById(patientId);
  return encountersRepository.findByPatientId(patientId);
}

module.exports = {
  createEncounter,
  listPatientEncounters
};
