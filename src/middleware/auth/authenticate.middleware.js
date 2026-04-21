const ApiError = require('../../utils/api-error');
const { verifyAccessToken } = require('../../utils/token.util');

module.exports = function authenticate(req, res, next) {
  const authorizationHeader = req.headers.authorization || '';
  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

