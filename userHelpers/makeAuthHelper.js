const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt')

module.exports = () => {
  const authHelper = {};
  const dayInSeconds = 60 * 60 * 24;
  const extraDurationMultiplier = 31;

  authHelper.decodeToken = (token) => jwt.verify(token, jwtSecret);
  authHelper.generateToken = (email, extra) => {
    const duration = extra ? (extraDurationMultiplier * dayInSeconds) : dayInSeconds;
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const payload = {
     email,
      exp: currentTimeInSeconds + duration,
    };
    return jwt.sign(payload, jwtSecret);
  };

  authHelper.encrypt = async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  };

  // eslint-disable-next-line max-len
//   authHelper.checkPassword = async (password, storedPassword) => bcrypt.compare(password, storedPassword);

//   return authHelper;
// };

authHelper.checkPassword = async (password, storedPassword) => password ===storedPassword

  return authHelper;
};