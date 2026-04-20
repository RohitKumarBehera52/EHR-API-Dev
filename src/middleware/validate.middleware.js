const ApiError = require('../utils/api-error');

module.exports = function validate(schema) {
  return function validateRequest(req, res, next) {
    if (!schema) {
      return next();
    }

    const errors = schema(req);

    if (errors.length > 0) {
      return next(new ApiError(400, 'Validation failed', errors));
    }

    next();
  };
};
