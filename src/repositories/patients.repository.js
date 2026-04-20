const path = require('path');
const { readJson, writeJson } = require('./json.repository');

const patientsFilePath = path.join(__dirname, '..', 'data', 'patients.json');

async function findAll() {
  return readJson(patientsFilePath, []);
}

async function findById(patientId) {
  const patients = await findAll();
  return patients.find((patient) => patient.patientId === patientId) || null;
}

async function save(patient) {
  const patients = await findAll();
  patients.push(patient);
  await writeJson(patientsFilePath, patients);
  return patient;
}

async function update(patientId, updates) {
  const patients = await findAll();
  const index = patients.findIndex((patient) => patient.patientId === patientId);

  if (index === -1) {
    return null;
  }

  patients[index] = {
    ...patients[index],
    ...updates
  };

  await writeJson(patientsFilePath, patients);
  return patients[index];
}

module.exports = {
  findAll,
  findById,
  save,
  update
};
