const ApiError = require('../../utils/api-error');

module.exports = function authorize(allowedRoles = []) {
  return function authorizeRequest(req, res, next) {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (allowedRoles.length === 0 || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return next(new ApiError(403, 'Insufficient permissions'));
  };
};

