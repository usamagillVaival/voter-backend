const User = require("../models/user");
const UserNFT = require("../models/userNFT");

const saveNFTInNFT = async (payload) => {
  try {
    const userNFT = new UserNFT({
      ...payload,
    });
    let userNFTDetails = await userNFT.save();
    return { ...userNFTDetails._doc };
    //  user:user
  } catch (e) {
    throw "Failed to save NFT";
  }
};

const saveNFTInUser = async (query, payload) => {
  try {
    let updatedDetailsWithNFT = await User.findOneAndUpdate(
      { ...query },
      { ...payload },
      { new: true }
    )
      .populate("artist_profile")
      .populate("user_nft")
      .lean();
    return {
      message: "NFT added successfully",
      data: updatedDetailsWithNFT,

      //  user:user
    };
  } catch (e) {
    throw "Failed to update NFT";
  }
};

const updateNFTINNFT = async (query, payload) => {
  try {
    let NFTAddedDetails = await UserNFT.findOneAndUpdate(
      { ...query },
      { ...payload },
      { new: true }
    ).lean();
    return { ...NFTAddedDetails._doc };
    //  user:user
  } catch (e) {
    throw "Failed to update NFT";
  }
};

module.exports = {
  saveNFTInNFT,
  saveNFTInUser,
  updateNFTINNFT,
};
