const HttpError = require('./HttpError');

class AccessForbidden extends HttpError {
  constructor(msg) {
    super(msg, 403);
  }
}

module.exports = AccessForbidden;
