const router = require('express').Router();
const patientsRoutes = require('./patients.routes');

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'EHR API is healthy',
    data: {
      status: 'ok'
    }
  });
});

router.use('/patients', patientsRoutes);

module.exports = router;
