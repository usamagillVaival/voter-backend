const {
  fetchUserByProvidedDetails,
  updateArtistWorkInArtWorks,
  saveArtistArtworkInUser,
} = require("../service/artistService");

const {
  saveNFTInNFT,
  saveNFTInUser,
  updateNFTINNFT,
} = require("../service/nftService");

const addNFTImage = async (req, res) => {
  try {
    if (!req.file) {
      throw "Failed to upload file";
    }
    if (!req.body.userId) {
      throw "User not found";
    }
    // res.status(200).json({
    //   message: "Artist artwork added successfully",
    //   data: { file: req.file.filename },
    // });
    let fetchUser = await fetchUserByProvidedDetails({
      _id: req.body.userId,
      // account_type: "artist",
      // invited_from: req.query.invited_from,
      // approved: true,
    });
    if (fetchUser) {
      let addNFT = await saveNFTInNFT({
        file: req.file.filename,
        artDraftingStatus: req.body.artDraftingStatus,
      });
      let saveNFTInUserDetails = await saveNFTInUser(
        {
          _id: req.body.userId,
          // account_type: "artist",
          // invited_from: req.query.invited_from,
          // approved: true,
        },
        {
          $push: { user_nft: addNFT._id },
        }
      );
      return res.status(200).json({
        ...saveNFTInUserDetails,
        nftDetail: addNFT,

        // data: { file: req.file.filename },
      });
    } else {
      throw "User not found";
    }
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

const updateNFTDetails = async (req, res) => {
  //   res.json({ file: req.file });
  const { title, description, artistId, revenueSplit } = req.body;

  try {
    if (!req.params.userId) {
      throw "User not found";
    }
    if (!req.params.nftId) {
      throw "NFT not found";
    }
    if (
      !title
      //   !networkCategory ||
      //   !links ||
      // !req.file
    ) {
      throw "Title is required";
    }
    if (
      !revenueSplit ||
      revenueSplit < 1 ||
      revenueSplit > 100
      //   !networkCategory ||
      //   !links ||
      // !req.file
    ) {
      throw "Revenue split is a required field and it should be in between 1 and 100";
    }
    if (artistId) {
      // throw "Artist not found";
      let saveNFTInArtist = await saveArtistArtworkInUser(
        {
          _id: artistId,
          account_type: "artist",
          // invited_from: req.query.invited_from,
          approved: true,
        },
        {
          $push: { user_nft: req.params.nftId },
        }
      );
      if (!saveNFTInArtist.data) {
        throw "Not saved because no such artist found";
      }
    }
    let updatedUserNFT = await checkAndUpdateNFT(
      req.params.userId,
      req.params.nftId,
      {
        title,
        description,
        revenueSplit,
      }
    );
    return res.status(200).json({
      message: "NFT updated successfully",
      data: { ...updatedUserNFT },
    });

    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const approveNFTDetails = async (req, res) => {
  //   res.json({ file: req.file });
  try {
    if (!req.params.userId) {
      throw "User not found";
    }
    if (!req.params.nftId) {
      throw "NFT not found";
    }
    let updatedUserNFT = await checkAndUpdateNFT(
      req.params.userId,
      req.params.nftId,
      {
        status: 2,
      }
    );
    return res.status(200).json({
      message: "NFT approved successfully",
      data: { ...updatedUserNFT },
    });

    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const mintNFTDetails = async (req, res) => {
  try {
    if (!req.params.userId) {
      throw "User not found";
    }
    if (!req.params.nftId) {
      throw "NFT not found";
    }
    let updatedUserNFT = await checkAndUpdateNFT(
      req.params.userId,
      req.params.nftId,
      {
        status: 3,
      }
    );
    return res.status(200).json({
      message: "NFT minted successfully",
      data: { ...updatedUserNFT },
    });

    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const salesNFTDetails = async (req, res) => {
  try {
    if (!req.params.userId) {
      throw "User not found";
    }
    if (!req.params.nftId) {
      throw "NFT not found";
    }
    let updatedUserNFT = await checkAndUpdateNFT(
      req.params.userId,
      req.params.nftId,
      {
        status: 4,
      }
    );
    return res.status(200).json({
      message: "NFT listed for sale",
      data: { ...updatedUserNFT },
    });

    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const listNFTs = async (req, res) => {
  try {
    if (!req.params.userId) {
      throw "User not found";
    }
    let fetchUser = await fetchUserByProvidedDetails({
      _id: req.params.userId,
      // account_type: "artist",
      // invited_from: req.query.invited_from,
      // approved: true,
    });
    let allNFTs = [];
    if (fetchUser && fetchUser.user_nft) {
      allNFTs = [...fetchUser.user_nft];
    }
    return res.status(200).json({
      message: "NFTs listed successfully",
      data: { nfts: allNFTs },
    });

    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const listSalesNFTs = async (req, res) => {
  try {
    if (!req.params.userId) {
      throw "User not found";
    }
    let fetchUser = await fetchUserByProvidedDetails({
      _id: req.params.userId,
      // account_type: "artist",
      // invited_from: req.query.invited_from,
      // approved: true,
    });
    let allNFTs = [];
    if (fetchUser && fetchUser.user_nft) {
      allNFTs = fetchUser.user_nft.filter((item) => item.status === 4);
    }
    return res.status(200).json({
      message: "NFTs listed successfully",
      data: { nfts: allNFTs },
    });

    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const listMintNFTs = async (req, res) => {
  try {
    if (!req.params.userId) {
      throw "User not found";
    }
    let fetchUser = await fetchUserByProvidedDetails({
      _id: req.params.userId,
      // account_type: "artist",
      // invited_from: req.query.invited_from,
      // approved: true,
    });
    let allNFTs = [];
    if (fetchUser && fetchUser.user_nft) {
      allNFTs = fetchUser.user_nft.filter((item) => item.status === 3);
    }
    return res.status(200).json({
      message: "NFTs listed successfully",
      data: { nfts: allNFTs },
    });

    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const listApprovedNFTs = async (req, res) => {
  try {
    if (!req.params.userId) {
      throw "User not found";
    }
    let fetchUser = await fetchUserByProvidedDetails({
      _id: req.params.userId,
      // account_type: "artist",
      // invited_from: req.query.invited_from,
      // approved: true,
    });
    let allNFTs = [];
    if (fetchUser && fetchUser.user_nft) {
      allNFTs = fetchUser.user_nft.filter((item) => item.status === 2);
    }
    return res.status(200).json({
      message: "NFTs listed successfully",
      data: { nfts: allNFTs },
    });

    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const listDraftNFTs = async (req, res) => {
  try {
    if (!req.params.userId) {
      throw "User not found";
    }
    let fetchUser = await fetchUserByProvidedDetails({
      _id: req.params.userId,
      // account_type: "artist",
      // invited_from: req.query.invited_from,
      // approved: true,
    });
    let allNFTs = [];
    if (fetchUser && fetchUser.user_nft) {
      allNFTs = fetchUser.user_nft.filter((item) => item.status === 1);
    }
    return res.status(200).json({
      message: "NFTs listed successfully",
      data: { nfts: allNFTs },
    });

    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const viewNFTImage = async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    await req.gfs.files.findOne(
      { filename: req.params.filename },
      async (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
          return res.status(404).json({
            error: "No such file exists",
          });
        }
        let fetchUser = await fetchUserByProvidedDetails({
          _id: req.params.userId,
          // account_type: "artist",
          // invited_from: req.query.invited_from,
          // approved: true,
        });

        let allNFTs = [];
        if (fetchUser && fetchUser.user_nft) {
          allNFTs = fetchUser.user_nft.filter(
            (item) => item.file === req.params.filename
          );
          if (allNFTs.length > 0) {
            const readstream = req.gfs.createReadStream(file.filename);
            readstream.pipe(res);
          } else {
            return res.status(400).json({ error: "No such file exists" });
          }
        } else {
          return res.status(400).json({ error: "No such file exists" });
        }
        // Check if image
        // Read output to browser
        //   res.json({ readstream });
      }
    );
  } catch (ex) {
    return res.status(400).json({ error: "No file exists" });
  }
  //   const { payload } = req.body;
  //   const {
  //     name,
  //     yearOfBirth,
  //     nationality,
  //     coverArt,
  //     biography,
  //     networkCategory,
  //     links,
  //   } = payload;
};

const checkAndUpdateNFT = async (userId, nftId, payload) => {
  let fetchUser = await fetchUserByProvidedDetails({
    _id: userId,
    // account_type: "artist",
    // invited_from: req.query.invited_from,
    // approved: true,
  });
  if (fetchUser) {
    let checkUserId =
      fetchUser.user_nft &&
      fetchUser.user_nft.find((item) => item._id.toString() === nftId);
    if (checkUserId) {
      let addUserNFT = await updateNFTINNFT(
        { _id: nftId },
        {
          // _id: nftId,
          ...payload,
          // file,

          // $set: {
          //   "artist_artwork.title": title,
          //   "artist_artwork.year": year,
          //   "artist_artwork.description": description,
          //   "artist_artwork.edition": edition,
          //   "artist_artwork.price": price,
          //   "artist_artwork.tags": tags,
          // },
        }
      );
      let updatedFetchUser = await fetchUserByProvidedDetails({
        _id: userId,
        // account_type: "artist",
        // invited_from: req.query.invited_from,
        // approved: true,
      });
      return { ...updatedFetchUser };
    } else {
      throw "NFT not found";
    }
  } else {
    throw "User not found";
  }
};

module.exports = {
  addNFTImage,
  updateNFTDetails,
  approveNFTDetails,
  mintNFTDetails,
  salesNFTDetails,
  listNFTs,
  listSalesNFTs,
  listMintNFTs,
  listApprovedNFTs,
  listDraftNFTs,
  viewNFTImage,
};
