const { body, validationResult, file } = require("express-validator");

const artistProfileValidation = (req, res) => {
  //   yearOfBirth, nationality, biography, networkCategory, links;
  //   body("yearOfBirth").not().isEmpty();
  //   body("nationality").not().isEmpty();
  //   body("biography").not().isEmpty();
  //   body("networkCategory").not().isEmpty();
  //   body("links").not().isEmpty();
  console.log("In");
};

module.exports = { artistProfileValidation };
