module.exports = function authorize() {
  return function authorizeRequest(req, res, next) {
    next();
  };
};

