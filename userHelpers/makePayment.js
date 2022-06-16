const paypal = require('paypal-rest-sdk');
const PaymentError = require('../errors/PaymentError');
const {
  mode, clientId, clientSecret,
  successURL, errorURL,
} = require('../config').payment;

paypal.configure({
  mode,
  client_id: clientId,
  client_secret: clientSecret,
});

module.exports = () => {
  const paymentService = {};
  const payment = ({ method, amount }) => ({
    intent: 'sale',
    payer: {
      payment_method: method,
    },
    redirect_urls: {
      return_url: successURL,
      cancel_url: errorURL,
    },
    transactions: [{
      amount: {
        total: amount,
        currency: 'USD',
      },
      description: 'Veriarti credit',
    }],
  });

  function createPaymentPromise(paymentObj) {
    const response = {};
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-shadow
      paypal.payment.create(paymentObj, (error, payment) => {
        if (error) {
          reject(error);
          console.error(error);
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === 'approval_url') {
              response.url = payment.links[i].href;
              response.paymentId = payment.id;
              response.amount = payment.transactions[0].amount.total;
            }
          }
          resolve(response);
        }
      });
    });
  }

  paymentService.createPayment = async ({ method, amount }) => {
    const paymentObj = payment({ method, amount });
    return createPaymentPromise(paymentObj);
  };

  function executePaymentPromise({ paymentId, executePaymentJson }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-shadow
      paypal.payment.execute(paymentId, executePaymentJson, (error, payment) => {
        if (error) {
          console.error('error esecuting payments', error.response);
          reject(error);
        }
        resolve(payment);
      });
    });
  }

  paymentService.completePayment = async ({ payerId, paymentId }) => {
    const executePaymentJson = {
      payer_id: payerId,
    };
    const result = await executePaymentPromise({ paymentId, executePaymentJson });
    if (result.state !== 'approved') {
      throw new PaymentError('Your payment was not approved by paypal, try again');
    }
  };

  return paymentService;
};
