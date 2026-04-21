const router = require('express').Router();
const authRoutes = require('./auth.routes');
const patientsRoutes = require('./patients.routes');
const authenticate = require('../middleware/auth/authenticate.middleware');
const { success } = require('../utils/api-response');

router.get('/health', (req, res) => success(res, 'Service is healthy', { status: 'ok' }));
router.use('/auth', authRoutes);
router.use(authenticate);
router.use('/patients', patientsRoutes);

module.exports = router;

