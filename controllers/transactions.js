const User = require("../models/user");
const {
  allTransactions,
  allCardsOfACustomer,
} = require("../controllers/stripeController");
const allTransactionsOfAUser = async (req, res) => {
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
      // let allCardsOfACustomerDetail = await allCardsOfACustomer(
      //   userDetails[0].user_stripe_details.customer_id
      // );
      let allTransactionsDetails = await allTransactions(
        userDetails[0].user_stripe_details.customer_id
      );
      let usersTransaction = [];
      if (
        allTransactionsDetails &&
        allTransactionsDetails.data &&
        allTransactionsDetails.data.length > 0
      ) {
        res
          .status(200)
          .json({ transactions: [...allTransactionsDetails.data] });
      } else {
        res.status(200).json({ transactions: [] });
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

module.exports = {
  allTransactionsOfAUser,
};
