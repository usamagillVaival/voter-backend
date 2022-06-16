const HttpError = require('./HttpError');

class ResourceNotFound extends HttpError {
  constructor(msg, resource) {
    super(msg, 404);
    this.resource = resource;
  }
}

module.exports = ResourceNotFound;
