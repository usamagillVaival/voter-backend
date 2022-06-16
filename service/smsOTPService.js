// const User = require("../models/user");
const SMSOTP = require("../models/smsOTP");
const saveSMSOTP = async (payload) => {
  try {
    const savedSMSOTP = new SMSOTP({
      ...payload,
    });
    try {
      let smsOTPDetails = await savedSMSOTP.save();
      return {
        ...smsOTPDetails._doc,
        //  user:user
      };
    } catch (e) {
      throw "Failed to add artist information";
    }
  } catch (ex) {
    throw ex;
  }
};

const updateOrInsertSMSOTP = async (query, payload) => {
  try {
    let updatedSMSOTPDetails = await SMSOTP.findOneAndUpdate(
      { ...query },
      { ...payload },
      { new: true, upsert: true }
    ).lean();
    if (updatedSMSOTPDetails) {
      return {
        ...updatedSMSOTPDetails,
        //  user:user
      };
    }
    throw "No such OTP found";
  } catch (e) {
    throw "Failed to update OTP details";
  }
};

const getSMSOTP = async (query) => {
  try {
    let smsOTPDetails = await SMSOTP.find({
      // approved: true,
      ...query,
    }).lean();
    if (smsOTPDetails) {
      return {
        ...smsOTPDetails[0],
      };
    }
    throw "OTP not found";
  } catch (ex) {
    if (ex.message) {
      throw ex.message;
    } else {
      throw "OTP not found";
    }
  }
};

module.exports = {
  saveSMSOTP,
  updateOrInsertSMSOTP,
  getSMSOTP,
};
