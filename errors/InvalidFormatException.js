const HttpError = require('./HttpError');

class InvalidFormatException extends HttpError {
  constructor(msg) {
    super(msg, 400);
  }
}

module.exports = InvalidFormatException;
