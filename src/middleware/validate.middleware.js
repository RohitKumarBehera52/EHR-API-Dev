module.exports = function validate() {
  return function validateRequest(req, res, next) {
    next();
  };
};

