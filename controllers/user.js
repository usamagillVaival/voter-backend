const { user: userService } = require("../service");
const Voter = require('../models/voter')














exports.getVoters  = async (req, res) => {
  try {
    res.header( "Access-Control-Allow-Origin" );

    const userDetails = await Voter.find({
      // account_type: "gallery",
      // invitation_status: payload.invitation_status,
      // gallery_signup_step: payload.gallery_signup_step,
      // pause_status:payload.pause_status
      // approved: true,
    })
      // .populate("artist_artwork")
      .lean();
    if (userDetails) {
      return res.status(200).json({
        data: userDetails,
      });
    } else {
      throw "Voter not found";
    }

    // throw "User not found";
  } catch (ex) {
    throw "Voter not found";
  }
};


exports.createAccount = async (req, res) => {
  const { 
    name,
    password,
    mobile,
    whatsapp,
    same,
    cnic,
    role,
    block_code, 
    gender,
    district,
    tehsil,
    city,
    area,
    block_number,
    street_number,
    street_name,
    near,
    house_number,
    remarks,
    voter_type,
    na,
    pp,
    qualification,
    occupation,
    martial_status,
    relation,
    

   } = req.body;
  const result = await userService.createUser(
   
    name,
    password,
    mobile,
    whatsapp,
    same,
    cnic,
    role,
    block_code, 
    gender,
    district,
    tehsil,
    city,
    area,
    block_number,
    street_number,
    street_name,
    near,
    house_number,
    remarks,
    voter_type,
    na,
    pp,
    qualification,
    occupation,
    martial_status,
    relation,
    res

  );
};


