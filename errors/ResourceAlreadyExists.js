const HttpError = require('./HttpError');

class ResourceAlreadyExists extends HttpError {
  constructor(msg, resource) {
    super(msg, 409);
    this.resource = resource;
  }
}

module.exports = ResourceAlreadyExists;
