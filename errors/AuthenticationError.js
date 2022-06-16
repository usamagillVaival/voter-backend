const HttpError = require('./HttpError');

class AuthenticationError extends HttpError {
  constructor(msg) {
    super(msg, 401);
  }
}

module.exports = AuthenticationError;
