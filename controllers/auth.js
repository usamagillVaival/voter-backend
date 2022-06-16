const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");
const { user: userService } = require("../service");
const CryptoJS = require("crypto-js");

exports.signIn = async (req, res) => {
  const { payload } = req.body;
  const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  const { email, password } = decryptedData;
  const result = await userService.signIn(email, password);
  res.status(200).send(result);
};

exports.verifyOTPAndLogin = async (req, res) => {
  const { userId, OTPCode } = req.body;
  const result = await userService.verifyOTPAndLogin(userId, OTPCode);
  res.status(200).send(result);
};

exports.verifySMSOTPAndLogin = async (req, res) => {
  const { userId, OTPCode } = req.body;
  const result = await userService.verifySMSOTPAndLogin(userId, OTPCode);
  res.status(200).send(result);
};

exports.sendSMSCodeToNumber = async (req, res) => {
  const { userId, phoneNumber } = req.body;
  const result = await userService.sendSMSCodeToNumber(userId, phoneNumber);
  res.status(200).send(result);
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resourse! Access denied",
    });
  }
  next();
};
