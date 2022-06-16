const User = require("../models/user");
const mongoose = require("mongoose");
const stripe = require("stripe")(
  "sk_test_51KPWoHAEBB4Crclo0jTRGnxfowDgmMzicKDZOOx1z89q7H8v2ordRY3JytW43br8gE4aFHCuyPPrnszLsEG5fCJP00RcorePGj"
);
const {
  getUserWithStripeDetails,
  upsertStripeDetails,
  updateUser,
  getStripeDetailsByQuery,
} = require("../service/stripeService");

const createCustomer = async (req, res) => {
  try {
    let { userId } = req.query;
    let { stripeToken } = req.body;
    let fetchUser = await getUserWithStripeDetails({ _id: userId });
    if (!fetchUser || !fetchUser.user_stripe_details) {
      const stripeCustomer = await stripe.customers.create({
        email: fetchUser.email,
        source: stripeToken,
      });
      let createCustomerInStripeTable = await upsertStripeDetails(
        { _id: fetchUser.user_stripe_details._id },
        {
          customer_id: stripeCustomer.id,
        }
      );
      return {
        message: "Customer created successfully",
        data: {
          ...fetchUser,
          user_stripe_details: { ...createCustomerInStripeTable },
        },
      };
    } else {
      throw "Customer with this email already exists";
    }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    } else {
      return res.status(400).json({
        error: ex,
      });
    }
  }
};

const addCard = async (req, res) => {
  try {
    let { userId } = req.query;
    let { sessionId } = req.query;
    let fetchUser = await getUserWithStripeDetails({ _id: userId });
    if (
      !fetchUser ||
      (typeof fetchUser === "object" && Object.keys(fetchUser).length === 0)
    ) {
      throw "No such user found";
    } else if (fetchUser && fetchUser.user_stripe_details) {
      throw "You have already one card created";
    } else {
      const sessionDetails = await stripe.checkout.sessions.retrieve(sessionId);
      let updateCustomerInStripeTable = await upsertStripeDetails(
        { _id: new mongoose.mongo.ObjectID() },
        {
          customer_id: sessionDetails.customer,
          session_id: sessionDetails.id,
          is_active: true,
          // card_id: stripeData.card.id,
          subscription_id: sessionDetails.subscription,
        }
      );
      let updateUserSignUpStep = await updateUser(
        { _id: userId },
        {
          user_stripe_details: updateCustomerInStripeTable._id,
          gallery_signup_step: 2,
        }
      );
      return res.status(200).json({
        message: "card added successfully",
        data: {
          ...updateUserSignUpStep,
        },
      });
    }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    } else {
      return res.status(400).json({
        error: ex,
      });
    }
  }
};

const createPaymentWebhook = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event = request.body;
  let invoice = event.data.object;
  try {
    // event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    switch (event.type) {
      case "invoice.created":
        // Then define and call a function to handle the event invoice.created
        break;
      case "invoice.deleted":
        // Then define and call a function to handle the event invoice.deleted
        break;
      case "invoice.finalization_failed":
        // Then define and call a function to handle the event invoice.finalization_failed
        break;
      case "invoice.finalized":
        // Then define and call a function to handle the event invoice.finalized
        break;
      case "invoice.marked_uncollectible":
        // Then define and call a function to handle the event invoice.marked_uncollectible
        break;
      case "invoice.paid":
        // Then define and call a function to handle the event invoice.paid
        break;
      case "invoice.payment_action_required":
        // Then define and call a function to handle the event invoice.payment_action_required
        break;
      case "invoice.payment_failed":
        // Then define and call a function to handle the event invoice.payment_failed
        break;
      case "invoice.payment_succeeded":
        if (invoice && invoice.customer) {
          const stripeDetails = await getStripeDetailsByQuery({
            customer_id: invoice.customer,
          });
          if (stripeDetails && stripeDetails.subscription_expired_at) {
            let expiryDate = new Date(
              stripeDetails.subscription_expired_at.setMonth(
                stripeDetails.subscription_expired_at.getMonth() + 1
              )
            );
            let updateCustomerInStripeTable = await upsertStripeDetails(
              { _id: stripeDetails.customer_id },
              {
                subscription_expired_at: expiryDate,
              }
            );
          }
        }
        // let fetchCustomerStripeDetails = fetchCustomerStripeDetails({
        //   customer_id: invoice.customer,
        // }, {subscription_expired_at: });
        // Then define and call a function to handle the event invoice.payment_succeeded
        break;
      case "invoice.sent":
        // Then define and call a function to handle the event invoice.sent
        break;
      case "invoice.upcoming":
        // Then define and call a function to handle the event invoice.upcoming
        break;
      case "invoice.updated":
        // Then define and call a function to handle the event invoice.updated
        break;
      case "invoice.voided":
        // Then define and call a function to handle the event invoice.voided
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
};





const createCheckoutSession = async (req, res) => {
  try {
    let { userId } = req.query;
    console.log(userId);
    let fetchUser = await getUserWithStripeDetails({ _id: userId });
    if (
      !fetchUser ||
      (typeof fetchUser === "object" && Object.keys(fetchUser).length === 0)
    ) {
      throw "No such user found";
    } else if (fetchUser && fetchUser.user_stripe_details) {
      throw "You have already one card created";
    } else {
      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: "price_1KRw5VAEBB4CrcloK3SE6vCb", quantity: 1 }],
        mode: "subscription",
        success_url: `http://51.222.241.160:3000/PaymentVerify/${userId}`,
        cancel_url: "http://51.222.241.160:3000/2fa",
        // success_url: "http://localhost:3000?session_id={CHECKOUT_SESSION_ID}",
        // cancel_url: "https://localhost:3000",
      });
      res.json({ id: session.id });
    }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    } else {
      return res.status(400).json({
        error: ex,
      });
    }
  }
  // res.redirect(303, session.url);
};

const chargePayment = async (req, res) => {
  try {
    let { userId } = req.query;
    let { amount } = req.body;
    let fetchUser = await getUserWithStripeDetails({ _id: userId });
    if (!amount) {
      throw "Amount is required";
    }
    if (!fetchUser || !fetchUser.user_stripe_details) {
      throw "No such user found";
    } else {
      const charged = await stripe.charges.create({
        amount: amount,
        currency: "usd",
        source: fetchUser.user_stripe_details.card_id,
        customer: fetchUser.user_stripe_details.customer_id,
        description: "Charge for Meal Booking ",
      });
      let charged_ids = fetchUser.user_stripe_details.charge_ids
        ? [...fetchUser.user_stripe_details.charge_ids, charged.id]
        : [charged.id];
      let updateCustomerInStripeTable = await upsertStripeDetails(
        { _id: fetchUser.user_stripe_details._id },
        {
          charge_ids: charged_ids,
        }
      );
      return {
        message: "Payment charged successfully",
        data: {
          ...fetchUser,
          user_stripe_details: { ...updateCustomerInStripeTable },
        },
      };
    }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    } else {
      return res.status(400).json({
        error: ex,
      });
    }
  }
};

const allTransactions = async (customerId) => {
  const transactions = await stripe.paymentIntents.list(
    { customer: customerId }
    // { limit: 3 }
  );
  return transactions;
};

const transactionsRedirect = async (req, res) => {
  try {
    const userDetails = await User.find({
      _id: req.params.userId,
    })
      .populate("user_stripe_details")
      .lean();
    if (userDetails && userDetails.length === 0) {
      throw "User not found";
    } else {
      if (
        !userDetails[0].user_stripe_details ||
        userDetails[0].user_stripe_details === null
      ) {
        throw "No transaction found";
      }
      // Authenticate your user.
      const session = await stripe.billingPortal.sessions.create({
        customer: userDetails[0].user_stripe_details.customer_id,
        return_url: "http://localhost:3006/redirect-to-any-page",
      });
      // res.redirect(session.url);
      return res.status(200).json({
        data: {
          url: session.url,
        },
      });
    }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    } else {
      return res.status(400).json({
        error: ex,
      });
    }
  }
};

const allCardsOfACustomer = async (customerId) => {
  const cards = await stripe.customers.listSources(customerId, {
    // object: "card",
  });
  return cards;
};

const createAccount = async (req, res) => {
  try {
    let { userId } = req.query;
    let { files } = req;
    const data = req.body;
    let fetchUser = await getUserWithStripeDetails({ _id: userId });
    if (!fetchUser || !fetchUser.user_stripe_details) {
      throw "No such user found";
    } else {
      let documentDetails = {
        document_front: null,
        document_back: null,
        additional_document_front: null,
        additional_document_back: null,
      };
      let newAccountFiles = {
        document_front_file_id: null,
        document_back_file_id: null,
        additional_document_front_file_id: null,
        additional_document_back_file_id: null,
      };
      if (!fetchUser.user_stripe_details.account_id) {
        if (files) {
          noOfFiles = Object.keys(files);
          if (
            noOfFiles.length > 1 &&
            noOfFiles.includes("document_front") &&
            noOfFiles.includes("document_back")
          ) {
            for (let documentFile in noOfFiles) {
              let documentName = noOfFiles[documentFile];
              let fp = fs.readFileSync(
                `${files[documentName][0]["destination"]}${files[documentName][0]["filename"]}`
              );
              documentDetails[documentName] = await stripe.files.create({
                file: {
                  data: fp,
                  name: files[documentName][0]["filename"],
                  type: "application/octet-stream",
                },
                purpose: "identity_document",
              });
              if (documentDetails[documentName]) {
                newAccountFiles[`${documentName}_stripe_file_id`] =
                  documentDetails[documentName]["id"];
              }
            }
            const createdAccount = await exports.stripe.accounts.create({
              email: data["email"],
              // phone_number: user_data.mobile,
              type: "custom",
              country: "GB",
              business_type: "individual",
              //requested_capabilities: ['card_payments', 'transfers'],
              capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
              },
              external_account: {
                object: "bank_account",
                account_number: data["accountNumber"],
                country: "GB",
                currency: "gbp",
                bank_name: data["bankName"],
                routing_number: data["bankId"],
                //  routing_number: data['routing_nu,ber'],
                account_holder_type: "individual",
                account_holder_name: data["fname"] + " " + data["lname"],
              },
              business_profile: {
                product_description: "this is chef and guest app",
                mcc: 5499,
                url: "https://dadavault.com",
              },
              individual: {
                first_name: data["fname"],
                email: data["email"],
                phone: data["mobile"],
                last_name: data["lname"],
                address: {
                  city: data["city"],
                  country: "GB",
                  line1: data["address"],
                  postal_code: data["postalCode"],
                },
                dob: {
                  day: dob[0],
                  month: dob[1],
                  year: dob[2],
                },
                verification: {
                  document: {
                    back: documentDetails["document_back"]
                      ? documentDetails["document_back"]["id"]
                      : null,
                    front: documentDetails["document_front"]
                      ? documentDetails["document_front"]["id"]
                      : null,
                  },
                  additional_document: {
                    back: documentDetails["additional_document_back"]
                      ? documentDetails["additional_document_back"]["id"]
                      : null,
                    front: documentDetails["additional_document_front"]
                      ? documentDetails["additional_document_front"]["id"]
                      : null,
                  },
                },
              },
              settings: {
                payouts: {
                  schedule: {
                    delay_days: 7,
                    interval: "daily",
                  },
                },
              },
              tos_acceptance: {
                date: new Date(),
                ip: data["ipAddress"],
              },
            });
            let updateCustomerInStripeTable = await upsertStripeDetails(
              { _id: fetchUser.user_stripe_details._id },
              {
                account_id: createdAccount.id,
                ...newAccountFiles,
              }
            );
            return {
              message: "Payment transferred successfully",
              data: {
                ...fetchUser,
                user_stripe_details: { ...updateCustomerInStripeTable },
              },
            };
          } else {
            throw "Identity documents are required";
          }
        } else {
          throw "Identity documents are required";
        }
      } else {
        throw "You have already one bank account created";
      }
    }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    } else {
      return res.status(400).json({
        error: ex,
      });
    }
  }
};

const transferPayment = async (req, res) => {
  try {
    let { userId } = req.query;
    let { amount } = req.body;
    let fetchUser = await getUserWithStripeDetails({ _id: userId });
    if (!amount) {
      throw "Amount is required";
    }
    if (!fetchUser || !fetchUser.user_stripe_details) {
      throw "No such user found";
    } else {
      const transferred = await stripe.transfers.create({
        amount: amount,
        currency: "usd",
        destination: fetchUser.user_stripe_details.account_id, // 'acct_1FsklpK2ORBb03VH'
      });
      let transferred_ids = fetchUser.user_stripe_details.transfer_ids
        ? [...fetchUser.user_stripe_details.transfer_ids, transferred.id]
        : [transferred.id];
      let updateCustomerInStripeTable = await upsertStripeDetails(
        { _id: fetchUser.user_stripe_details._id },
        {
          transfer_ids: transferred_ids,
        }
      );
      return {
        message: "Payment transferred successfully",
        data: {
          ...fetchUser,
          user_stripe_details: { ...updateCustomerInStripeTable },
        },
      };
    }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    } else {
      return res.status(400).json({
        error: ex,
      });
    }
  }
};

const listAllPriceItems = async () => {
  let listPrices = await stripe.prices.list({
    active: true,
  });
  return listPrices;
};

const listAllProducts = async () => {
  let listProducts = await stripe.products.list({
    active: true,
  });
  return listProducts;
};

const subscribeAProduct = async (customerId, itemsToBeSubscribed) => {
  let subscribedProduct = await stripe.subscriptions.create({
    customer: customerId,
    items: [...itemsToBeSubscribed],
    // items: [{ price: "price_1KRw5VAEBB4CrcloK3SE6vCb" }],
  });
  return subscribedProduct;
};

module.exports = {
  createCustomer,
  addCard,
  chargePayment,
  createAccount,
  transferPayment,
  createCheckoutSession,
  createPaymentWebhook,
  allTransactions,
  allCardsOfACustomer,
  transactionsRedirect,
};
