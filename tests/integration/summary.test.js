const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../../src/app');

async function loginAndGetToken() {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      username: 'doctor.demo',
      password: 'doctor123'
    });

  assert.equal(response.statusCode, 200);
  return response.body.data.accessToken;
}

test('POST /api/auth/login returns a bearer token for a valid user', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      username: 'doctor.demo',
      password: 'doctor123'
    });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.role, 'doctor');
  assert.match(response.body.data.accessToken, /^[A-Za-z0-9-_]+\./);
});

test('GET /api/patients/:patientId/summary requires authentication', async () => {
  const response = await request(app).get('/api/patients/PAT-1001/summary');

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.success, false);
});

test('GET /api/patients/:patientId/summary returns a consolidated patient summary', async () => {
  const token = await loginAndGetToken();

  const response = await request(app)
    .get('/api/patients/PAT-1001/summary')
    .set('Authorization', `Bearer ${token}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.demographics.patientId, 'PAT-1001');
  assert.equal(response.body.data.activeMedications.length, 1);
  assert.equal(response.body.data.allergies.length, 1);
  assert.equal(response.body.data.recentLabResults.length, 1);
  assert.equal(response.body.data.imagingReferences.length, 1);
  assert.equal(response.body.data.latestEncounters[0].encounterId, 'ENC-1002');
});
