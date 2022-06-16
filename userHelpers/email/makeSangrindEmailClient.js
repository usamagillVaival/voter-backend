const sgMail = require('@sendgrid/mail');
const { sendgridKey } = require('../../config');

sgMail.setApiKey(sendgridKey);
module.exports = () => ({
  send: async (options) => sgMail.send(options),
});
