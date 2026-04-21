module.exports = function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || 'Internal server error'
  };

  if (Array.isArray(error.errors) && error.errors.length > 0) {
    response.errors = error.errors;
  }

  res.status(statusCode).json(response);
};

