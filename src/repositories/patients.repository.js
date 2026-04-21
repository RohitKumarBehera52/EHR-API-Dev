const path = require('path');
const { readJson } = require('./json.repository');

const patientsFilePath = path.join(__dirname, '../data/patients.json');

async function findAll() {
  return readJson(patientsFilePath, []);
}

async function findById(patientId) {
  const patients = await findAll();
  return patients.find((patient) => patient.patientId === patientId) || null;
}

module.exports = {
  findAll,
  findById
};

