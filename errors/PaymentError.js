const HttpError = require('./HttpError');

class PaymentError extends HttpError {
  constructor(msg) {
    super(msg, 500);
  }
}

module.exports = PaymentError;
