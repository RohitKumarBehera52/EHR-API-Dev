module.exports = function errorHandler(error, req, res, next) {
  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal server error'
  });
};

