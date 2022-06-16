class HttpError extends Error {
  constructor(msg, httpCode) {
    super();
    this.msg = msg;
    this.httpCode = httpCode || 500;
  }
}

module.exports = HttpError;
