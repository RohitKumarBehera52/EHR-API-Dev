const path = require('path');
const { readJson } = require('./json.repository');

const encountersFilePath = path.join(__dirname, '../data/encounters.json');

async function findByPatientId(patientId) {
  const encounters = await readJson(encountersFilePath, []);

  return encounters
    .filter((encounter) => encounter.patientId === patientId)
    .sort((left, right) => new Date(right.visitDate) - new Date(left.visitDate));
}

module.exports = {
  findByPatientId
};

