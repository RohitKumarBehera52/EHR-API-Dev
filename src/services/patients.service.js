const patientsRepository = require('../repositories/patients.repository');
const ApiError = require('../utils/api-error');
const { createId } = require('../utils/id.util');
const { nowIso } = require('../utils/date.util');

function normalizeSearchValue(value) {
  return String(value || '').trim().toLowerCase();
}

function matchesFilters(patient, filters) {
  const name = normalizeSearchValue(filters.name);
  const phone = normalizeSearchValue(filters.phone);
  const dateOfBirth = normalizeSearchValue(filters.dateOfBirth);

  if (name) {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    if (!fullName.includes(name)) {
      return false;
    }
  }

  if (phone && !String(patient.phone || '').toLowerCase().includes(phone)) {
    return false;
  }

  if (dateOfBirth && patient.dateOfBirth !== dateOfBirth) {
    return false;
  }

  return true;
}

async function createPatient(payload) {
  const timestamp = nowIso();
  const patient = {
    patientId: createId('PAT'),
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    dateOfBirth: payload.dateOfBirth,
    gender: payload.gender,
    phone: payload.phone,
    email: payload.email || null,
    address: payload.address || null,
    bloodGroup: payload.bloodGroup || null,
    emergencyContact: payload.emergencyContact || null,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  return patientsRepository.save(patient);
}

async function listPatients(filters = {}) {
  const patients = await patientsRepository.findAll();
  return patients.filter((patient) => matchesFilters(patient, filters));
}

async function getPatientById(patientId) {
  const patient = await patientsRepository.findById(patientId);

  if (!patient) {
    throw new ApiError(404, 'Patient not found');
  }

  return patient;
}

async function updatePatient(patientId, payload) {
  await getPatientById(patientId);

  const allowedFields = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'gender',
    'phone',
    'email',
    'address',
    'bloodGroup',
    'emergencyContact'
  ];

  const updates = allowedFields.reduce((result, field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      result[field] = typeof payload[field] === 'string' ? payload[field].trim() : payload[field];
    }

    return result;
  }, {});

  updates.updatedAt = nowIso();

  return patientsRepository.update(patientId, updates);
}

module.exports = {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient
};
