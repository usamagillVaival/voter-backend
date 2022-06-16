// const User = require("../models/user");
const OTPSecret = require("../models/otpSecrets");
const saveOTP = async (payload) => {
  try {
    const otpSecret = new OTPSecret({
      ...payload,
    });
    try {
      let otpSecretDetails = await otpSecret.save();
      return {
        ...otpSecretDetails._doc,
        //  user:user
      };
    } catch (e) {
      throw "Failed to add artist information";
    }
  } catch (ex) {
    throw ex;
  }
};

const updateOTP = async (query, payload) => {
  try {
    try {
      let updatedOTPDetails = await OTPSecret.findOneAndUpdate(
        { ...query },
        { ...payload },
        { new: true }
      ).lean();
      if (updatedOTPDetails) {
        return {
          ...updatedOTPDetails,
          //  user:user
        };
      }
      throw "No such OTP found";
    } catch (e) {
      throw "Failed to update OTP details";
    }
  } catch (ex) {
    throw ex;
  }
};

const getOTP = async (query) => {
  try {
    let otpDetails = await OTPSecret.find({
      // approved: true,
      ...query,
    }).lean();
    if (otpDetails) {
      return {
        ...otpDetails[0],
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
  saveOTP,
  updateOTP,
  getOTP,
};
