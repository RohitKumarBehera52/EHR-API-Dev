const visitTypes = ['outpatient', 'inpatient', 'emergency', 'telehealth', 'follow_up'];
const diagnosisTypes = ['primary', 'secondary', 'differential'];

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function requiredString(body, field, errors) {
  if (!body[field] || typeof body[field] !== 'string' || body[field].trim().length === 0) {
    errors.push({
      field,
      message: `${field} is required`
    });
  }
}

function validateDiagnoses(diagnoses, errors) {
  if (!Array.isArray(diagnoses) || diagnoses.length === 0) {
    errors.push({
      field: 'diagnoses',
      message: 'At least one diagnosis is required'
    });
    return;
  }

  diagnoses.forEach((diagnosis, index) => {
    if (!diagnosis.description || typeof diagnosis.description !== 'string') {
      errors.push({
        field: `diagnoses[${index}].description`,
        message: 'Diagnosis description is required'
      });
    }

    if (diagnosis.type && !diagnosisTypes.includes(diagnosis.type)) {
      errors.push({
        field: `diagnoses[${index}].type`,
        message: `Diagnosis type must be one of: ${diagnosisTypes.join(', ')}`
      });
    }
  });
}

function validateEncounterCreate(req) {
  const errors = [];
  const body = req.body || {};

  requiredString(body, 'providerId', errors);
  requiredString(body, 'visitDate', errors);
  requiredString(body, 'visitType', errors);
  requiredString(body, 'chiefComplaint', errors);

  if (body.visitDate && !isValidDate(body.visitDate)) {
    errors.push({
      field: 'visitDate',
      message: 'visitDate must use YYYY-MM-DD format'
    });
  }

  if (body.visitType && !visitTypes.includes(body.visitType)) {
    errors.push({
      field: 'visitType',
      message: `visitType must be one of: ${visitTypes.join(', ')}`
    });
  }

  validateDiagnoses(body.diagnoses, errors);

  return errors;
}

module.exports = {
  validateEncounterCreate
};
