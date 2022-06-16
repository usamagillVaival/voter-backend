const User = require("../models/user");
const ArtistArtWork = require("../models/artistArtWork");
const sgMail2 = require("@sendgrid/mail");

const getAdminDashboard = async (req, res, payload) => {
  try {
    const userDetails = await User.find({
      account_type: "gallery",
      invitation_status: payload.invitation_status,
      gallery_signup_step: payload.gallery_signup_step,
     
      // approved: true,
    })
      // .populate("artist_artwork")
      .lean();
    if (userDetails) {


      const userContracts = await User.find({
        account_type: "gallery",
        gallery_deploy_status:"deployed"
        // approved: true,
      })

      return res.status(200).json({
        galleryCount: userDetails.length,
        galleryContractCount: userContracts.length
      });
    } else {
      throw "User not found";
    }

    // throw "User not found";
  } catch (ex) {
    throw "User not found";
  }
};




const getGalleries = async (req, res, payload) => {
  try {
    const userDetails = await User.find({
      account_type: "gallery",
      invitation_status: payload.invitation_status,
      gallery_signup_step: payload.gallery_signup_step,
      pause_status:payload.pause_status
      // approved: true,
    })
      // .populate("artist_artwork")
      .lean();
    if (userDetails) {
      return res.status(200).json({
        data: userDetails,
      });
    } else {
      throw "User not found";
    }

    // throw "User not found";
  } catch (ex) {
    throw "User not found";
  }
};

const getArtistByGallery = async (payload) => {
  try {
    const userDetails = await User.find({
      account_type: "artist",
      invited_from: payload.invited_from,
      invitation_status: payload.invitation_status,
      // approved: true,
    })
      .populate("artist_artwork")
      .lean();
    console.log(payload.invited_from);
    //  console.log('lengthhhh',userDetails.length)
    const artistLength = userDetails?.length;

    return artistLength;

    // throw "User not found";
  } catch (ex) {
    throw "User not found";
  }
};

const galleryNfts = async (payload) => {
  try {
    const userDetails = await User.find({
      _id: payload?.userId,
    })
      .populate("artist_artwork")
      .lean();
    console.log("lengthhhh", userDetails);
    let user = userDetails[0];
    let nftsLength = user?.artist_artwork?.length;
    return {
      nftsLength,
      gallery_last_login: user?.gallery_last_login,
      gallery_login_count: user?.gallery_login_count,
    };

    // throw "User not found";
  } catch (ex) {
    throw "User not found";
  }
};

module.exports = {
  getGalleries,
  getArtistByGallery,
  galleryNfts,
  getAdminDashboard
};
