const path = require('path');
const { readJson } = require('./json.repository');

const medicationsFilePath = path.join(__dirname, '../data/medications.json');

async function findByPatientId(patientId) {
  const medications = await readJson(medicationsFilePath, []);
  return medications.filter((medication) => medication.patientId === patientId);
}

module.exports = {
  findByPatientId
};

