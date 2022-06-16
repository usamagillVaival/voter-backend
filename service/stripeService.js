const User = require("../models/user");
const StripeDetails = require("../models/stripeDetails");

const upsertStripeDetails = async (query, payload) => {
  try {
    let updatedUserDetails = await StripeDetails.findOneAndUpdate(
      { ...query },
      { ...payload },
      { new: true, upsert: true }
    ).lean();
    return { ...updatedUserDetails };
    //  user:user
  } catch (e) {
    throw "Failed to update user information";
  }
};

const getUserWithStripeDetails = async (query) => {
  try {
    let getUserStripeDetails = await User.findOne({ ...query })
      .populate("user_stripe_details")
      .lean();
    return { ...getUserStripeDetails };
    //  user:user
  } catch (e) {
    throw "Failed to update user information";
  }
};

const getStripeDetailsByQuery = async (query) => {
  try {
    let getStripeDetails = await StripeDetails.findOne({ ...query }).lean();
    return { ...getStripeDetails };
    //  user:user
  } catch (e) {
    throw "Failed to fetch stripe details";
  }
};

const updateUser = async (query, payload) => {
  try {
    let updatedUserDetails = await User.findOneAndUpdate(
      { ...query },
      { ...payload },
      { new: true }
    )
      .populate("user_stripe_details")
      .lean();

    return { ...updatedUserDetails };
    //  user:user
  } catch (e) {
    throw "Failed to update artist artwork";
  }
};

module.exports = {
  upsertStripeDetails,
  getUserWithStripeDetails,
  getStripeDetailsByQuery,
  updateUser,
};
