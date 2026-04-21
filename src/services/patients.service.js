const ApiError = require('../utils/api-error');
const patientsRepository = require('../repositories/patients.repository');
const encountersRepository = require('../repositories/encounters.repository');
const medicationsRepository = require('../repositories/medications.repository');
const { readJson } = require('../repositories/json.repository');
const path = require('path');

const allergiesFilePath = path.join(__dirname, '../data/allergies.json');
const labResultsFilePath = path.join(__dirname, '../data/lab-results.json');
const imagingFilePath = path.join(__dirname, '../data/imaging.json');

function sortByDateDescending(items, key) {
  return [...items].sort((left, right) => new Date(right[key]) - new Date(left[key]));
}

function getEncounterDiagnoses(encounters) {
  return encounters.flatMap((encounter) => {
    const diagnoses = Array.isArray(encounter.diagnoses) ? encounter.diagnoses : [];

    return diagnoses.map((diagnosis) => ({
      encounterId: encounter.encounterId,
      visitDate: encounter.visitDate,
      code: diagnosis.code || null,
      description: diagnosis.description || diagnosis
    }));
  });
}

async function getPatientSummary(patientId) {
  const patient = await patientsRepository.findById(patientId);

  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  const [encounters, medications, allergies, labResults, imaging] = await Promise.all([
    encountersRepository.findByPatientId(patientId),
    medicationsRepository.findByPatientId(patientId),
    readJson(allergiesFilePath, []).then((items) => items.filter((item) => item.patientId === patientId)),
    readJson(labResultsFilePath, []).then((items) => items.filter((item) => item.patientId === patientId)),
    readJson(imagingFilePath, []).then((items) => items.filter((item) => item.patientId === patientId))
  ]);

  const activeMedications = medications.filter((medication) => medication.status === 'active');
  const recentLabResults = sortByDateDescending(labResults, 'resultDate').slice(0, 10);
  const imagingReferences = sortByDateDescending(imaging, 'studyDate').slice(0, 10);

  return {
    demographics: patient,
    latestEncounters: encounters.slice(0, 5),
    diagnoses: getEncounterDiagnoses(encounters),
    activeMedications,
    allergies,
    recentLabResults,
    imagingReferences
  };
}

module.exports = {
  getPatientSummary
};

