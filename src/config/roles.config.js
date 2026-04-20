module.exports = {
  admin: ['*'],
  provider: ['patients:read', 'patients:write', 'appointments:read', 'appointments:write'],
  auditor: ['audit:read'],
  patient: ['patients:read-own']
};

