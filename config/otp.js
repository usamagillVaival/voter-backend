const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

exports.secret = (username) =>
  speakeasy.generateSecret({
    name: `DadaVault (${username})`,
  });

exports.qrcodeGeneration = async (otpauth_url) => {
  try {
    let qrcodeDetails = await qrcode.toDataURL(otpauth_url);
    return qrcodeDetails;
  } catch (ex) {
    if (ex.message) {
      throw ex.message;
    } else {
      throw "Failed to generate QR";
    }
  }
};

exports.verifyOTP = async (secretId, OTPCode) => {
  const verified = await speakeasy.totp.verify({
    secret: secretId,
    encoding: "ascii",
    token: OTPCode,
  });
  return verified;
};
