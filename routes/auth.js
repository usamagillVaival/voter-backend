const express = require("express");

const router = express.Router();

const {
  signIn,
  verifyOTPAndLogin,
  sendSMSCodeToNumber,
  verifySMSOTPAndLogin,
} = require("../controllers/auth");
const { userSignupValidator } = require("../validator");
router.post("/signIn", signIn);
router.post("/sendCode", sendSMSCodeToNumber);
router.post("/verifyOTP", verifyOTPAndLogin);
router.post("/verifySMSOTP", verifySMSOTPAndLogin);

module.exports = router;
