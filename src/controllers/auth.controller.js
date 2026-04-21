const authService = require('../services/auth.service');
const { success } = require('../utils/api-response');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const authResult = await authService.login(username, password);

    return success(res, 'Login successful', authResult);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login
};

