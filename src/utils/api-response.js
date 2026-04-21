function success(res, message, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function error(res, message, errors = [], statusCode = 400) {
  const payload = {
    success: false,
    message
  };

  if (errors.length > 0) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  success,
  error
};

