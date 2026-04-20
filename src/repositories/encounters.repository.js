const path = require('path');
const { readJson, writeJson } = require('./json.repository');

const encountersFilePath = path.join(__dirname, '..', 'data', 'encounters.json');

async function findAll() {
  return readJson(encountersFilePath, []);
}

async function findByPatientId(patientId) {
  const encounters = await findAll();
  return encounters
    .filter((encounter) => encounter.patientId === patientId)
    .sort((left, right) => new Date(right.visitDate) - new Date(left.visitDate));
}

async function save(encounter) {
  const encounters = await findAll();
  encounters.push(encounter);
  await writeJson(encountersFilePath, encounters);
  return encounter;
}

module.exports = {
  findAll,
  findByPatientId,
  save
};
