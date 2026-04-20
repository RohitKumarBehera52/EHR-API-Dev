module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  tokenExpiresIn: '1h'
};

