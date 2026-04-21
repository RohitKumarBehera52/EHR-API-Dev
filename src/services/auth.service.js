const ApiError = require('../utils/api-error');
const usersRepository = require('../repositories/users.repository');
const { comparePassword } = require('../utils/password.util');
const { signAccessToken } = require('../utils/token.util');

async function login(username, password) {
  const user = await usersRepository.findByUsername(username);

  if (!user) {
    throw new ApiError(401, 'Invalid username or password');
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid username or password');
  }

  const token = signAccessToken({
    sub: user.userId,
    username: user.username,
    role: user.role,
    providerId: user.providerId || null
  });

  return {
    accessToken: token,
    tokenType: 'Bearer',
    expiresIn: '1h',
    user: {
      userId: user.userId,
      username: user.username,
      role: user.role,
      providerId: user.providerId || null
    }
  };
}

module.exports = {
  login
};

