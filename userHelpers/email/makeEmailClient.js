const { mockEmailClient } = require('../../config');
const makeMockEmailClient = require('./makeMockEmailClient');
const makeSangrindEmailClient = require('./makeSangrindEmailClient');

module.exports = () => {
  if (mockEmailClient) {
    return makeMockEmailClient();
  }
  return makeSangrindEmailClient();
};
