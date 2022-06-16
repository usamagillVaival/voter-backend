const User = require("../models/user");
const ArtistArtWork = require("../models/voter");
const sgMail2 = require("@sendgrid/mail");
const CryptoJS = require("crypto-js");
const addArtistProfile = async (req, res, payload, filename) => {
  try {
    const user = new User({
      name: payload.username,
      artist_year_of_birth: payload.yearOfBirth,
      artist_nationality: payload.nationality,
      artist_cover_art_filename: filename,
      artist_biography: payload.biography,
      artist_network_category: payload.networkCategory,
      artist_links: payload.links,
      account_type: "artist",
    });
    try {
      let userAddedDetails = await user.save();
      return res.status(200).json({
        message: "Artist profile information added successfully",
        data: { ...userAddedDetails._doc },
        //  user:user
      });
    } catch (e) {
      throw "Failed to add artist information";
    }
  } catch (ex) {
    throw ex;
  }
};

const addArtistArtWorkFile = async (req, res, payload, filename) => {
  try {
    const artistUpdatedData = {
      artist_artwork_file: filename,
    };
    try {
      let artistArtworkFileDetails = await User.findOneAndUpdate(
        { name: payload.username },
        { ...artistUpdatedData },
        { new: true }
      ).lean();
      return res.status(200).json({
        message: "Artist artwork uploaded successfully",
        data: artistArtworkFileDetails,
        //  user:user
      });
    } catch (e) {
      throw "Failed to upload artist artwork";
    }
  } catch (ex) {
    throw ex;
  }
};

const updateArtistProfile = async (req, res, payload, filename) => {
  try {
    const userUpdatedData = {
      artist_year_of_birth: payload.yearOfBirth,
      artist_nationality: payload.nationality,
      artist_cover_art_filename: filename,
      artist_biography: payload.biography,
      artist_network_category: payload.networkCategory,
      artist_links: payload.links,
      account_type: "artist",
    };
    try {
      let updatedUserDetails = await User.findOneAndUpdate(
        { _id: payload.userId },
        { ...userUpdatedData },
        { new: true }
      )
        .populate("artist_artwork")
        .lean();
      if (updatedUserDetails) {
        return res.status(200).json({
          message: "Artist profile information updated successfully",
          data: updatedUserDetails,
          //  user:user
        });
      }
      throw "User not found";
    } catch (e) {
      throw "Failed to update artist profile information";
    }
  } catch (ex) {
    throw ex;
  }
};

const getArtistProfile = async (req, res, query) => {
  try {
    let userDetails = await User.find({
      // approved: true,
      ...query,
    })
      .populate("artist_artwork")
      .lean();
    if (userDetails) {
      return res.status(200).json({
        data: userDetails[0],
      });
    }
    throw "User not found";
  } catch (ex) {
    throw "User not found";
  }
};

const getUserProfile = async (req, res, query) => {
  try {
    let userDetails = await User.find({
      // approved: true,
      ...query,
    }).lean();
    if (userDetails) {
      return res.status(200).json({
        data: userDetails[0],
      });
    }
    throw "User not found";
  } catch (ex) {
    throw "User not found";
  }
};

const getRecipientProfile = async (req, res, query) => {
  try {
    let userDetails = await User.find({
      // approved: true,
      ...query,
    }).lean();
    if (userDetails) {
      return res.status(200).json({
        data: {
          _id: userDetails[0]._id,
          email: userDetails[0].email,
          name: userDetails[0].name,
          gallery_logo: userDetails[0].gallery_logo,
          collector_profile_image:userDetails[0].collector_profile_image,
          account_type : userDetails[0]?.account_type,
          date: userDetails[0].createdAt,
        },
      });
    }
    throw "User not found";
  } catch (ex) {
    throw "User not found";
  }
};

const getArtistByGallery = async (req, res, payload) => {
  try {
    console.log(payload.invited_from);
    const userDetails = await User.find({
      account_type: "artist",
      invited_from: payload.invited_from,
      invitation_status: payload.invitation_status,
      // approved: true,
    })
      .populate("artist_artwork")
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

const getArtwork = async (req, res, payload) => {
  try {
    const userDetails = await User.find({
      _id: payload.userId,
    })
      .populate("artist_artwork")
      .lean();
    console.log(userDetails);
    return res.status(200).json({
      data: userDetails,
    });

    // throw "User not found";
  } catch (ex) {
    throw "User not found";
  }
};

const getArtworkByGalleryProfile = async (req, res, payload) => {
  try {
    const userDetails = await User.find({
      gallery_profile: payload.gallery_profile,
    })
      .populate("artist_artwork")
      .lean();

    let userData = userDetails[0];
    const artWork = userData?.artist_artwork;
    const publishedArtWork = artWork.filter((x) => x?.status === 5);
    let ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(publishedArtWork),
      "dvault@123"
    ).toString();

    return res.status(200).json({
      NFTs: ciphertext,
      PublishStatus: userData?.gallery_published,
      GalleryName:userData?.name,
      GalleryLogo:userData?.gallery_logo
    });

    // throw "User not found";
  } catch (ex) {
    return res.status(200).json({
      error: "No Gallery Account found",
    });
  }
};

const fetchUserByProvidedDetails = async (
  providedUserDetails,
  populatedConditions = false
) => {
  let userDetail = null;
  try {
    if (typeof populatedConditions !== "object") {
      userDetails = await User.findOne({ ...providedUserDetails })
        .populate("artist_artwork")
        .populate("user_nft")
        .lean();
    } else {
      userDetails = await User.findOne({ ...providedUserDetails })
        .populate({ ...populatedConditions })
        .lean();
    }

    if (userDetails) {
      return userDetails;
    } else {
      throw "User not found";
    }
  } catch (ex) {
    throw "User not found";
  }
};

const saveArtistArtworkInUser = async (query, payload) => {
  try {
    console.log(query);

    let updatedDetailsWithArtwork = await User.findOneAndUpdate(
      { ...query },
      { ...payload },
      { new: true }
    )
      .populate("artist_artwork")
      .lean();
    return {
      message: "Artist artwork added successfully",
      data: updatedDetailsWithArtwork,

      //  user:user
    };
  } catch (e) {
    throw "Failed to update artist artwork";
  }
};

const saveArtistWorkInArtWorks = async (payload) => {
  try {
    const artistArtWork = new ArtistArtWork({
      ...payload,
    });
    let artistArtWorkAddedDetails = await artistArtWork.save();
    return { ...artistArtWorkAddedDetails._doc };
    //  user:user
  } catch (e) {
    throw "Failed to update artist artwork";
  }
};

const updateArtistWorkInArtWorks = async (query, payload) => {
  try {
    let artistArtWorkAddedDetails = await ArtistArtWork.findOneAndUpdate(
      { ...query },
      { ...payload },
      { new: true }
    ).lean();

    return { ...artistArtWorkAddedDetails._doc };
    //  user:user
  } catch (e) {
    throw "Failed to update artist artwork";
  }
};

module.exports = {
  addArtistProfile,
  getArtistProfile,
  updateArtistProfile,
  getArtistByGallery,
  fetchUserByProvidedDetails,
  saveArtistArtworkInUser,
  saveArtistWorkInArtWorks,
  updateArtistWorkInArtWorks,
  getArtwork,
  getUserProfile,
  getArtworkByGalleryProfile,
  getRecipientProfile,
};
