const { secret } = require("../config/otp");
const { saveOTP } = require("../service/otpService");
const User = require("../models/user");

const sgMail2 = require("@sendgrid/mail");
const { getUserProfile } = require("../service/artistService");

const updateCreatedCollectorProfile = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);

  const {
    name,
    password,
    email,
    otp,
    signupStep,
    collector_wallet_public_key,
    collector_signUp_step,
  } = req.body;
  console.log("wallet address" + collector_wallet_public_key);

  User.findOne(
    { email: email, account_type: "collector" },
    async (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      if (user) {
        console.log(collector_wallet_public_key);
        user.name = name ? name : user.name;
        user.password = password ? password : user.password;
        user.collector_wallet_public_key = collector_wallet_public_key
          ? collector_wallet_public_key
          : user?.collector_wallet_public_key;
        user.collector_signUp_step = collector_signUp_step
          ? collector_signUp_step
          : user?.collector_signUp_step;
        user.collector_profile_image = req?.file?.filename
          ? req?.file?.filename
          : user?.collector_profile_image;
      }
      user.save((err, updatedUser) => {
        if (err) {
          console.log("USER UPDATE ERROR", err);
          return res.status(400).json({
            error: "User updated failed",
          });
        }
        res.json(updatedUser);
      });
    }
  );
};

const updateCollectorProfileById = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);

  const {
    name,
    password,
    email,
    otp,
    signupStep,
    collector_wallet_public_key,
    collector_signUp_step,
    userId,
  } = req.body;

  User.findOne(
    { _id: userId, account_type: "collector" },
    async (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      if (user) {
        user.name = name ? name : user.name;
        user.email = email ? email : user.email;

        user.password = password ? password : user.password;
        user.collector_wallet_public_key = collector_wallet_public_key
          ? collector_wallet_public_key
          : user?.collector_wallet_public_key;
        user.collector_signUp_step = collector_signUp_step
          ? collector_signUp_step
          : user?.collector_signUp_step;
        user.collector_profile_image = req?.file?.filename
          ? req?.file?.filename
          : user?.collector_profile_image;
      }
      user.save((err, updatedUser) => {
        if (err) {
          console.log("USER UPDATE ERROR", err);
          return res.status(400).json({
            error: "User updated failed",
          });
        }
        res.json(updatedUser);
      });
    }
  );
};

const getCollectorProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    await getUserProfile(req, res, {
      _id: req.query.userId,
      account_type: "collector",
    });
  } catch (ex) {
    return res.status(400).json({
      error: ex,
    });
  }
};

const getAllCollectors = async (req, res) => {
  try {
    const allCollectors = await User.find({ account_type: "collector" });
    return res.status(200).json({
      //   message: "New conversation added successfully",
      data: allCollectors,
    });
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
  updateCreatedCollectorProfile,
  getCollectorProfile,
  updateCollectorProfileById,
  getAllCollectors,
};
