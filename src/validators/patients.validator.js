const genders = ['male', 'female', 'other', 'unknown'];

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requiredString(body, field, errors) {
  if (!body[field] || typeof body[field] !== 'string' || body[field].trim().length === 0) {
    errors.push({
      field,
      message: `${field} is required`
    });
  }
}

function validatePatientCreate(req) {
  const errors = [];
  const body = req.body || {};

  requiredString(body, 'firstName', errors);
  requiredString(body, 'lastName', errors);
  requiredString(body, 'dateOfBirth', errors);
  requiredString(body, 'gender', errors);
  requiredString(body, 'phone', errors);

  if (body.dateOfBirth && !isValidDate(body.dateOfBirth)) {
    errors.push({
      field: 'dateOfBirth',
      message: 'dateOfBirth must use YYYY-MM-DD format'
    });
  }

  if (body.gender && !genders.includes(String(body.gender).toLowerCase())) {
    errors.push({
      field: 'gender',
      message: `gender must be one of: ${genders.join(', ')}`
    });
  }

  if (body.email && !isValidEmail(body.email)) {
    errors.push({
      field: 'email',
      message: 'email must be a valid email address'
    });
  }

  return errors;
}

function validatePatientUpdate(req) {
  const errors = [];
  const body = req.body || {};

  if (Object.keys(body).length === 0) {
    errors.push({
      field: 'body',
      message: 'At least one patient field is required'
    });
  }

  if (body.dateOfBirth && !isValidDate(body.dateOfBirth)) {
    errors.push({
      field: 'dateOfBirth',
      message: 'dateOfBirth must use YYYY-MM-DD format'
    });
  }

  if (body.gender && !genders.includes(String(body.gender).toLowerCase())) {
    errors.push({
      field: 'gender',
      message: `gender must be one of: ${genders.join(', ')}`
    });
  }

  if (body.email && !isValidEmail(body.email)) {
    errors.push({
      field: 'email',
      message: 'email must be a valid email address'
    });
  }

  return errors;
}

module.exports = {
  validatePatientCreate,
  validatePatientUpdate
};
